// 发送设备实时数据
export function serviceInvoke(data) {
  return uni.$u.http.post("/iot/runtime/service/invoke", data);
}
