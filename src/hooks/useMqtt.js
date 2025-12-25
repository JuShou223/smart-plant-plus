import { getCurrentInstance } from "vue";
import { serviceInvoke } from "@/apis/modules/runtime.js";

/**
 * @param {Ref} deviceMap - 设备的 Map 映射 (computed)
 * @param {Ref} token - Vuex/Pinia Token
 */
export function useMqtt(deviceMap, token) {
  const instance = getCurrentInstance();
  const mqttTool = instance.appContext.config.globalProperties.$mqttTool;

  const getMqttTopics = (list) => {
    let topics = [];
    list.forEach((item) => {
      const prefix = `/${item.productId}/${item.serialNumber}`;
      topics.push(
        `${prefix}/status/post`,
        `${prefix}/property/post`,
        `${prefix}/function/post`,
        `${prefix}/ws/service`
      );
    });
    return topics;
  };

  const mqttSubscribe = (list) => {
    if (!mqttTool) return;
    const topics = getMqttTopics(list);
    if (topics.length > 0) mqttTool.subscribe(topics);
  };

  const mqttUnSubscribe = (list) => {
    if (!mqttTool) return;
    const topics = getMqttTopics(list);
    if (topics.length > 0) {
      mqttTool.unsubscribe(topics);
      console.log("取消订阅成功");
    }
  };

  const mqttPublish = async (device, model) => {
    const data = {
      serialNumber: device.serialNumber,
      productId: device.productId,
      remoteCommand: { [model.id]: model.shadow },
      identifier: model.id,
      modelName: model.name,
      isShadow: device.status != 3,
      type: model.type,
    };
    return await serviceInvoke(data);
  };

  const mqttCallback = () => {
    if (!mqttTool || !mqttTool.client) return;

    mqttTool.client.on("message", (topic, message, buffer) => {
      let msgObj;
      try {
        msgObj = JSON.parse(message.toString());
      } catch (error) {
        return;
      }
      if (!msgObj) return;

      const topics = topic.split("/");
      const deviceNum = topics[2];
      const msgType = topics[3];

      // 使用 Map O(1) 查找
      const targetDevice = deviceMap.value.get(deviceNum);
      if (!targetDevice) return;

      // 1. 设备状态更新
      if (msgType === "status") {
        targetDevice.status = msgObj.status;
        targetDevice.isShadow = msgObj.isShadow;
        targetDevice.rssi = msgObj.rssi;
      }
      // 2. 物模型数据更新
      else if (topic.endsWith("ws/service") && targetDevice.thingsModels) {
        const newMessage = msgObj.message;
        const currentTime = new Date().toISOString();

        targetDevice.thingsModels.forEach((model) => {
          const updateData = newMessage.find((item) => item.id == model.id);
          if (updateData) {
            model.shadow = updateData.value;
            model.ts = currentTime || updateData.ts;
          }
        });
      }
    });
  };

  const connectMqtt = async (afterConnectCallback) => {
    if (!mqttTool) return;
    if (mqttTool.client == null) {
      await mqttTool.connect(token.value);
    }
    // 注册回调
    mqttCallback();
    // 执行后续逻辑（如获取列表）
    if (afterConnectCallback) afterConnectCallback();
  };

  return {
    connectMqtt,
    mqttSubscribe,
    mqttUnSubscribe,
    mqttPublish,
  };
}
