/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:08:12
 * @Description:
 */

// 查询设备用户详细
export function getDeviceUser(deviceId) {
  return uni.$u.http.get("/iot/deviceUser/" + deviceId);
}

// 新增设备用户
export function addDeviceUser(data) {
  return uni.$u.http.post("/iot/share", data);
}

// 修改设备用户
export function updateDeviceUser(data) {
  return uni.$u.http.put("/iot/share", data);
}

// 删除设备用户
export function delDeviceUser(device) {
  return uni.$u.http.delete("/iot/share", device);
}

// 查询可分享用户列表
export function getShareUser(data) {
  return uni.$u.http.get("/iot/share/shareUser", { params: data });
}

// 查询已经分享用户列表
export function getUserList(params) {
  return uni.$u.http.get("/iot/share/list", { params: params });
}
