/*
 * @Date: 2025-12-17 15:03:50
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-25 13:18:49
 * @Description:
 */
import { ref, reactive } from "vue";
import { getUserPlants, getPlantDetail } from "@/apis/modules/plants";
// 20组 Mock 数据
const MOCK_PLANT_PRESETS = [
  {
    requirements: {
      temperature: { min: 18, max: 28 },
      humidity: { min: 50, max: 70 },
      soil_moisture: { min: 30, max: 60 },
      light: { min: 1000, max: 2500 },
    },
    careTips: {
      water: "土干浇透，避免积水。",
      light: "喜光，夏季需遮阴。",
      temperature: "喜温暖，冬季防寒。",
      soil: "疏松透气沙壤土。",
    },
  },
  {
    requirements: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 60, max: 80 },
      soil_moisture: { min: 40, max: 70 },
      light: { min: 800, max: 2000 },
    },
    careTips: {
      water: "保持盆土湿润。",
      light: "散射光充足。",
      temperature: "忌寒冷。",
      soil: "富含腐殖质土壤。",
    },
  },
  {
    requirements: {
      temperature: { min: 15, max: 25 },
      humidity: { min: 40, max: 60 },
      soil_moisture: { min: 20, max: 50 },
      light: { min: 1500, max: 3000 },
    },
    careTips: {
      water: "宁干勿湿。",
      light: "全日照。",
      temperature: "耐寒性强。",
      soil: "沙质排水良好。",
    },
  },
  {
    requirements: {
      temperature: { min: 18, max: 26 },
      humidity: { min: 55, max: 75 },
      soil_moisture: { min: 35, max: 65 },
      light: { min: 500, max: 1500 },
    },
    careTips: {
      water: "见干见湿。",
      light: "耐阴，避强光。",
      temperature: "温和环境。",
      soil: "微酸性土壤。",
    },
  },
  {
    requirements: {
      temperature: { min: 22, max: 32 },
      humidity: { min: 70, max: 90 },
      soil_moisture: { min: 50, max: 80 },
      light: { min: 600, max: 1800 },
    },
    careTips: {
      water: "需水量大。",
      light: "半阴环境。",
      temperature: "喜热。",
      soil: "保水性好。",
    },
  },
  {
    requirements: {
      temperature: { min: 10, max: 20 },
      humidity: { min: 30, max: 50 },
      soil_moisture: { min: 20, max: 40 },
      light: { min: 2000, max: 4000 },
    },
    careTips: {
      water: "少浇水。",
      light: "强光照。",
      temperature: "耐低温。",
      soil: "贫瘠沙土。",
    },
  },
  {
    requirements: {
      temperature: { min: 16, max: 28 },
      humidity: { min: 45, max: 65 },
      soil_moisture: { min: 30, max: 60 },
      light: { min: 1200, max: 2800 },
    },
    careTips: {
      water: "适度浇水。",
      light: "充足散射光。",
      temperature: "适中。",
      soil: "通用营养土。",
    },
  },
  {
    requirements: {
      temperature: { min: 19, max: 29 },
      humidity: { min: 50, max: 70 },
      soil_moisture: { min: 40, max: 70 },
      light: { min: 900, max: 2200 },
    },
    careTips: {
      water: "保持湿润。",
      light: "明亮处。",
      temperature: "防冻。",
      soil: "透气性好。",
    },
  },
  {
    requirements: {
      temperature: { min: 12, max: 22 },
      humidity: { min: 35, max: 55 },
      soil_moisture: { min: 25, max: 45 },
      light: { min: 1000, max: 2000 },
    },
    careTips: {
      water: "干透浇透。",
      light: "柔和光照。",
      temperature: "凉爽。",
      soil: "排水性强。",
    },
  },
  {
    requirements: {
      temperature: { min: 21, max: 31 },
      humidity: { min: 65, max: 85 },
      soil_moisture: { min: 45, max: 75 },
      light: { min: 700, max: 1600 },
    },
    careTips: {
      water: "勤浇水。",
      light: "耐阴。",
      temperature: "喜暖。",
      soil: "腐叶土。",
    },
  },
  {
    requirements: {
      temperature: { min: 17, max: 27 },
      humidity: { min: 40, max: 60 },
      soil_moisture: { min: 30, max: 50 },
      light: { min: 1400, max: 2600 },
    },
    careTips: {
      water: "控制水分。",
      light: "光照充足。",
      temperature: "适应性强。",
      soil: "混合介质。",
    },
  },
  {
    requirements: {
      temperature: { min: 23, max: 33 },
      humidity: { min: 55, max: 75 },
      soil_moisture: { min: 40, max: 70 },
      light: { min: 1100, max: 2400 },
    },
    careTips: {
      water: "定期浇水。",
      light: "散射光。",
      temperature: "喜高温。",
      soil: "疏松肥沃。",
    },
  },
  {
    requirements: {
      temperature: { min: 14, max: 24 },
      humidity: { min: 30, max: 50 },
      soil_moisture: { min: 20, max: 40 },
      light: { min: 1600, max: 3200 },
    },
    careTips: {
      water: "少水。",
      light: "直射光。",
      temperature: "耐寒。",
      soil: "颗粒土。",
    },
  },
  {
    requirements: {
      temperature: { min: 18, max: 25 },
      humidity: { min: 60, max: 80 },
      soil_moisture: { min: 50, max: 80 },
      light: { min: 600, max: 1400 },
    },
    careTips: {
      water: "喜湿润。",
      light: "阴凉处。",
      temperature: "恒温。",
      soil: "泥炭土。",
    },
  },
  {
    requirements: {
      temperature: { min: 20, max: 28 },
      humidity: { min: 45, max: 65 },
      soil_moisture: { min: 35, max: 60 },
      light: { min: 1300, max: 2700 },
    },
    careTips: {
      water: "适中。",
      light: "充足。",
      temperature: "温暖。",
      soil: "园土。",
    },
  },
  {
    requirements: {
      temperature: { min: 15, max: 20 },
      humidity: { min: 40, max: 60 },
      soil_moisture: { min: 25, max: 50 },
      light: { min: 1000, max: 2000 },
    },
    careTips: {
      water: "见干见湿。",
      light: "明亮。",
      temperature: "凉爽。",
      soil: "透气。",
    },
  },
  {
    requirements: {
      temperature: { min: 24, max: 30 },
      humidity: { min: 70, max: 90 },
      soil_moisture: { min: 55, max: 85 },
      light: { min: 500, max: 1200 },
    },
    careTips: {
      water: "多水。",
      light: "荫蔽。",
      temperature: "热带环境。",
      soil: "保湿。",
    },
  },
  {
    requirements: {
      temperature: { min: 16, max: 26 },
      humidity: { min: 50, max: 70 },
      soil_moisture: { min: 30, max: 60 },
      light: { min: 1200, max: 2500 },
    },
    careTips: {
      water: "常规管理。",
      light: "半日照。",
      temperature: "适宜。",
      soil: "通用土。",
    },
  },
  {
    requirements: {
      temperature: { min: 19, max: 29 },
      humidity: { min: 45, max: 65 },
      soil_moisture: { min: 35, max: 65 },
      light: { min: 900, max: 2100 },
    },
    careTips: {
      water: "不干不浇。",
      light: "散射。",
      temperature: "防冻。",
      soil: "沙壤。",
    },
  },
  {
    requirements: {
      temperature: { min: 18, max: 30 },
      humidity: { min: 60, max: 80 },
      soil_moisture: { min: 40, max: 70 },
      light: { min: 800, max: 2000 },
    },
    careTips: {
      water: "见干见湿，保持盆土微湿。",
      light: "喜明亮散射光，也能耐阴。",
      temperature: "较耐寒，0℃以上可安全过冬。",
      soil: "对土壤要求不严。",
    },
  },
];

// 辅助：添加模拟植物需求和养护建议
const addMockPresets = (p) => {
  // const preset =
  // 否则根据 ID（或名称）计算哈希索引，确保同一植物每次显示相同的模拟数据
  let mock = {};
  if (p.remark) {
    mock = JSON.parse(p.remark);
    console.log("mock", mock);
  } else {
    const seedStr = (p.id || p.plantName || "default").toString();
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % MOCK_PLANT_PRESETS.length;
    mock = MOCK_PLANT_PRESETS[index];
  }

  return {
    requirements: {
      soil_moisture:
        mock.requirements.soil_moisture || mock.requirements.soilMoisture,
      ...mock.requirements,
    },
    careTips: mock.careTips,
  };
};

// 辅助：根据状态标签判断健康状况
const getHealthConditionFromStatus = (statuses) => {
  if (statuses.includes("缺水") || statuses.includes("湿度低"))
    return "water-low";
  // if (statuses.includes("病虫害") || statuses.includes("虫害")) return "pest";
  // if (statuses.find((item) => item.search("病"))) return "pest";
  if (statuses.includes("光照不足") || statuses.includes("补光"))
    return "light-low";
  if (statuses.includes("温度异常")) return "temp-issue";
  return "needs-attention";
};

const processSinglePlantData = (item) => {
  const plantStatusesAll = item.plantStatus ? item.plantStatus.split(",") : [];
  const plantStatuses = plantStatusesAll.filter((item) => !item.search("病"));
  console.log("plantStatuses", plantStatuses);
  const hasIssues = !plantStatuses.includes("健康") && plantStatuses.length > 0;
  const mockPresets = addMockPresets(item);
  return {
    ...item,
    ...mockPresets,
    hasIssues,
    issueCount: plantStatuses.length,
    healthConditions: hasIssues
      ? Array.from(
          new Set(
            plantStatuses.map((item) => getHealthConditionFromStatus([item]))
          )
        )
      : ["healthy"],
    healthCondition:
      item.healthCondition ||
      (hasIssues ? getHealthConditionFromStatus(plantStatuses) : "healthy"),
  };
};

export function usePlants() {
  const plants = ref([]);
  const total = ref(0);
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 3,
  });
  const loadStatus = ref("loadmore");
  const loading = ref(true);

  // 数据处理
  const processPlantData = (list) => {
    return list.map((item) => {
      return processSinglePlantData(item);
      // const plantStatuses = item.plantStatus ? item.plantStatus.split(",") : [];
      // const hasIssues = !plantStatuses.includes("健康");
      // const mockPresets = addMockPresets(item);
      // return {
      //   ...item,
      //   ...mockPresets,
      //   hasIssues,
      //   issueCount: plantStatuses.length,
      //   healthCondition:
      //     item.healthCondition ||
      //     (hasIssues ? getHealthConditionFromStatus(plantStatuses) : "healthy"),
      // };
    });
  };

  // 加载列表
  const loadPlants = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) loading.value = true;
      const response = await getUserPlants(queryParams);

      if (response.code === 200) {
        const rawData = response.rows || response.data || [];
        const processedData = processPlantData(rawData);

        if (queryParams.pageNum === 1) {
          plants.value = processedData;
        } else {
          plants.value = [...plants.value, ...processedData];
        }

        total.value = response.total || 0;
        loadStatus.value =
          plants.value.length < total.value ? "loadmore" : "nomore";
      } else {
        uni.showToast({ title: response.msg || "加载失败", icon: "none" });
        if (isLoadMore) queryParams.pageNum--;
      }
    } catch (error) {
      console.error("加载植物列表失败:", error);
      if (isLoadMore) queryParams.pageNum--;
    } finally {
      loading.value = false;
      uni.stopPullDownRefresh();
    }
  };

  const refreshPlants = () => {
    queryParams.pageNum = 1;
    loadStatus.value = "loadmore";
    loadPlants(false);
  };

  // 横向滚动加载更多：植物
  const onPlantScrollToLower = () => {
    if (loadStatus.value === "loadmore") {
      queryParams.pageNum++;
      loadPlants(true);
    }
  };

  return {
    plants,
    total,
    queryParams,
    loadStatus,
    loading,
    loadPlants,
    refreshPlants,
    onPlantScrollToLower,
    getHealthConditionFromStatus,
  };
}

export const loadSinglePlant = async (plantId) => {
  try {
    const response = await getPlantDetail(plantId, false);
    if (response.code === 200) {
      const plant = processSinglePlantData(response.data);
      // const plantDataBase = await getPlantDatabaseById(this.plant.plantType);
      // if (plantDataBase.code === 200) {
      //   this.plant.plant_database = plantDataBase.data
      // }
      // this.loadPlantStatuses()
      // const plantStatuses = plant.plantStatus
      //   ? plant.plantStatus.split(",")
      //   : [];
      // const hasIssues = !plantStatuses.includes("健康");
      // const mockPresets = addMockPresets(plant);
      // Object.assign(plant, mockPresets);
      // plant.hasIssues = hasIssues;
      // plant.issueCount = plantStatuses.length;
      // plant.healthCondition =
      //   plant.healthCondition ||
      //   (hasIssues ? getHealthConditionFromStatus(plantStatuses) : "healthy");
      return plant;
      // console.log('plantDataBase', plantDataBase)
    }
  } catch (error) {
    console.error("加载植物详情失败:", error);
  }
};
