/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:09:34
 * @Description:
 */
//播放器
export function startPlay(deviceId, channelId) {
  return uni.$u.http.get("/sip/player/play/" + deviceId + "/" + channelId);
}

export function closeStream(deviceId, channelId, streamId) {
  return uni.$u.http.get(
    "/sip/player/closeStream/" + deviceId + "/" + channelId + "/" + streamId
  );
}
