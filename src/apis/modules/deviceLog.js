// 查询设备日志列表
export function listDeviceLog(query) {
  return uni.$u.http.request({
    url: "/iot/deviceLog/list",
    method: "get",
    params: query,
  });
}

// 查询事件日志列表
export function getEventLogList(query) {
  return uni.$u.http.request({
    url: "/iot/event/list",
    method: "get",
    params: query,
  });
}

// 查询设备监测数据
export function listMonitor(query) {
  return uni.$u.http.request({
    url: "/iot/deviceLog/monitor",
    method: "get",
    params: query,
  });
}

// 查询设备历史监测数据
export function getDeviceHistory(params) {
  return uni.$u.http.get("/iot/deviceLog/history", { params: params });
}

// 查询设备日志详细
export function getDeviceLog(logId) {
  return uni.$u.http.request({
    url: "/iot/deviceLog/" + logId,
    method: "get",
  });
}

// 新增设备日志
export function addDeviceLog(data) {
  return uni.$u.http.request({
    url: "/iot/deviceLog",
    method: "post",
    data: data,
  });
}

// 修改设备日志
export function updateDeviceLog(data) {
  return uni.$u.http.request({
    url: "/iot/deviceLog",
    method: "put",
    data: data,
  });
}

// 删除设备日志
export function delDeviceLog(logId) {
  return uni.$u.http.request({
    url: "/iot/deviceLog/" + logId,
    method: "delete",
  });
}
