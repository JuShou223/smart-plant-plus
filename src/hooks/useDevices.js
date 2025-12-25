import { ref, reactive, computed } from "vue";
import { getUserDevices, bindPlant } from "@/apis/modules/sensors";
// 引入获取单设备的API
import {
  getRunningStatus,
  cacheJsonThingsModel,
  getDevice,
} from "@/apis/modules/device";

// ==================== 核心 Hook:用于列表页 ====================
export function useDevices() {
  const devices = ref([]);
  const deviceTotal = ref(0);
  const deviceQueryParams = reactive({
    pageNum: 1,
    pageSize: 4,
  });
  const deviceLoadStatus = ref("loadmore");
  const deviceLoading = ref(true);

  // Map 优化 MQTT 查找
  const deviceMap = computed(() => {
    const map = new Map();
    devices.value.forEach((dev) => {
      if (dev.serialNumber) {
        map.set(dev.serialNumber, dev);
      }
    });
    return map;
  });

  // 并行加载所有设备状态
  const loadDevicesRunningStatus = async () => {
    if (devices.value.length === 0) return;
    const productModelCache = new Map();
    const tasks = devices.value.map(async (device) => {
      await loadSingleDeviceStatus(device, productModelCache);
    });
    await Promise.all(tasks);
  };

  const getDevices = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) deviceLoading.value = true;
      const response = await getUserDevices(deviceQueryParams);

      if (response.code === 200) {
        const devicesData = response.rows || [];
        const filteredDevices = devicesData.filter(
          (device) => device.deviceId !== 118
        );

        if (deviceQueryParams.pageNum === 1) {
          devices.value = filteredDevices;
        } else {
          devices.value = [...devices.value, ...filteredDevices];
        }

        deviceTotal.value = response.total || 0;
        deviceLoadStatus.value =
          devices.value.length < deviceTotal.value ? "loadmore" : "nomore";

        await loadDevicesRunningStatus();
      } else {
        uni.showToast({ title: response.msg || "加载失败", icon: "none" });
        if (isLoadMore) deviceQueryParams.pageNum--;
      }
    } catch (error) {
      console.error("加载设备列表失败:", error);
      if (isLoadMore) deviceQueryParams.pageNum--;
    } finally {
      deviceLoading.value = false;
      uni.stopPullDownRefresh();
    }
  };

  const refreshDevices = () => {
    // console.log("refreshDeviceList");
    deviceQueryParams.pageNum = 1;
    deviceLoadStatus.value = "loadmore";
    getDevices(false);
  };

  const onDeviceScrollToLower = () => {
    if (deviceLoadStatus.value === "loadmore") {
      deviceQueryParams.pageNum++;
      getDevices(true);
    }
  };

  return {
    devices,
    deviceTotal,
    deviceQueryParams,
    deviceLoadStatus,
    deviceLoading,
    deviceMap,
    getDevices,
    refreshDevices,
    loadDevicesRunningStatus,
    onDeviceScrollToLower,
  };
}

// ==================== 独立工具函数：加载单个设备状态 ====================
/**
 * 加载单个设备的运行状态 (物模型 + 实时数据)
 */
export const loadSingleDeviceStatus = async (
  device,
  productCacheMap = null
) => {
  if (!device || !device.deviceId) return;

  try {
    let cacheThingsModelAll = [];
    if (productCacheMap && productCacheMap.has(device.productId)) {
      cacheThingsModelAll = productCacheMap.get(device.productId);
    } else {
      const cacheResponse = await cacheJsonThingsModel(device.productId);
      if (cacheResponse.code === 200 && cacheResponse.data) {
        const cacheData = JSON.parse(cacheResponse.data);
        cacheThingsModelAll = Object.values(cacheData).flat();
        if (productCacheMap) {
          productCacheMap.set(device.productId, cacheThingsModelAll);
        }
      }
    }

    const statusResponse = await getRunningStatus(
      device.deviceId,
      device.slaveId || 1
    );

    if (statusResponse.code === 200 && statusResponse.data) {
      let allThingsModels = statusResponse.data.thingsModels || [];

      allThingsModels = allThingsModels.map((item) => {
        if (cacheThingsModelAll.length > 0) {
          const cacheModel = cacheThingsModelAll.find(
            (model) => model.id === item.id
          );
          if (cacheModel) {
            item.name = cacheModel.name || cacheModel.name_zh_CN || item.id;
          }
        }
        return item;
      });

      device.thingsModels = allThingsModels.filter(
        (item) => item.isChart === 1
      );
      device.allThingsModels = allThingsModels;
    }
  } catch (error) {
    console.error(`加载设备 ${device.deviceId} 状态失败:`, error);
  }
};

/**
 * 获取单个设备详情（包含自动加载运行状态）
 * @param {Number|String} deviceId 设备ID
 * @returns {Promise<Object>} 设备对象
 */
export const getDeviceDetail = async (deviceId) => {
  try {
    const response = await getDevice(deviceId);
    if (response.code === 200) {
      const deviceData = response.data;
      // 获取详情后，直接加载运行状态，一步到位
      await loadSingleDeviceStatus(deviceData);
      return deviceData;
    } else {
      throw new Error(response.msg || "获取设备详情失败");
    }
  } catch (error) {
    console.error("获取设备详情异常:", error);
    throw error;
  }
};

/**
 * 获取最新时间
 */
export const getLatestTime = (device) => {
  if (!device.thingsModels || device.thingsModels.length === 0) {
    return "暂无数据";
  }

  let latestTime = null;

  device.thingsModels.forEach((model) => {
    if (model.ts) {
      const modelTime = new Date(model.ts).getTime();
      if (!latestTime || modelTime > latestTime) {
        latestTime = modelTime;
      }
    }
  });

  if (!latestTime) {
    return "暂无数据";
  }

  return formatRelativeTime(latestTime);
};

/**
 * 格式化相对时间
 */
const formatRelativeTime = (timestamp) => {
  const now = new Date().getTime();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);

  if (seconds < 10) {
    return "刚刚";
  } else if (seconds < 60) {
    return `${seconds}秒前更新`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分钟前更新`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}小时前更新`;
  } else if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return `${days}天前更新`;
  } else {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}更新`;
  }
};
