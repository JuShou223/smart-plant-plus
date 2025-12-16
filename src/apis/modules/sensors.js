/*
 * @Date: 2025-11-12 16:21:51
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:10:12
 * @Description:
 */
// ==================== 传感器相关 ====================

/**
 * 获取传感器设备列表
 */
export function getUserDevices(params) {
  return uni.$u.http.get("/hws/sensors/page", { params });
}

/**
 * 添加传感器
 */
export function bindDevice(data) {
  return uni.$u.http.post("/hws/sensors/bind", data);
}

/**
 * 获取传感器读数
 * @param {String} deviceId - 设备ID
 * @param {Object} params - 查询参数
 */
export function getSensorReadings(deviceId, params) {
  return uni.$u.http.get("/iot/sensors/readings/" + deviceId, { params });
}

/**
 * 绑定传感器到植物
 * @param {Object} data - 绑定数据
 */
export function bindSensorToPlant(data) {
  return uni.$u.http.post("/iot/sensors/bind", data);
}

/**
 * 获取传感器警报
 * @param {Object} params - 查询参数
 */
export function getSensorAlerts(params) {
  return uni.$u.http.get("/iot/sensors/alerts", { params });
}

/** 获取用户植物的所有绑定传感器
 * @param {Object} params - 查询参数
 */
export function getPlantAllBindings(params) {
  return uni.$u.http.get("/iot/sensors/allBindings", { params });
}

/** 获取传感器最新读数
 * @param {Object} params - 查询参数
 */
export function getLatestReading(params) {
  return uni.$u.http.get("/iot/sensors/latestReading", { params });
}

/** 获取传感器阈值
 * @param {Object} params - 查询参数
 */
export function getThreshold(params) {
  return uni.$u.http.get("/iot/sensors/threshold", { params });
}

/** 获取设备绑定信息
 * @param {Object} params - 查询参数
 */
export function getDeviceBinding(params) {
  return uni.$u.http.get("/iot/sensors/deviceBinding", { params });
}

/** 获取设备详情
 * @param {Object} params - 查询参数
 */
export function getDeviceById(params) {
  return uni.$u.http.get("/iot/sensors/deviceDetail", { params });
}

export function getReadingsStats(params) {
  return uni.$u.http.get("/iot/sensors/readingsStats", {
    params,
  });
}

// 绑定植物
export function bindPlant(data) {
  return uni.$u.http.post("/hws/sensors/bindPlant", data);
}

// 删除设备
export function deleteDevice(id) {
  return uni.$u.http.delete("/hws/sensors/" + id);
}

// 解绑植物
export function unbindPlant(data) {
  return uni.$u.http.post("/hws/sensors/unbindPlant", data);
}
