// 查询设备告警数据
export function getAlertList(query) {
  return uni.$u.http.request({
    url: "/iot/alertLog/list",
    method: "get",
    params: query,
  });
}

// 查询单个设备告警详情
export function getAlertLog(id) {
  return uni.$u.http.get("/iot/alertLog/" + id);
}

// 修改单个设备告警详情
export function editAlertLog(data) {
  return uni.$u.http.request({
    url: "/iot/alertLog",
    method: "put",
    data: data,
  });
}

// 查询微信小程序告警通知模板id
export function getAlertTemplateId() {
  return uni.$u.http.request({
    url: "/notify/template/getAlertWechatMini",
    method: "get",
  });
}
