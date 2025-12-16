/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:10:34
 * @Description:
 */
// sipchannel
// 查询监控设备通道信息列表
export function listChannel(query) {
  return uni.$u.http.request({
    url: "/sip/channel/list",
    method: "get",
    params: query,
  });
}

// 查询监控设备通道信息详细
export function getChannel(channelId) {
  return uni.$u.http.get("/sip/channel/" + channelId);
}

// 新增监控设备通道信息
export function addChannel(createNum, data) {
  return uni.$u.http.post("/sip/channel/" + createNum, data);
}

// 修改监控设备通道信息
export function updateChannel(data) {
  return uni.$u.http.put("/sip/channel", data);
}

// 删除监控设备通道信息
export function delChannel(channelId) {
  return uni.$u.http.delete("/sip/channel/" + channelId);
}

// ptz控制
export function ptzdirection(deviceId, channelId, data) {
  return uni.$u.http.post(
    "/sip/ptz/direction/" + deviceId + "/" + channelId,
    data
  );
}

export function ptzscale(deviceId, channelId, data) {
  return uni.$u.http.post("/sip/ptz/scale/" + deviceId + "/" + channelId, data);
}
