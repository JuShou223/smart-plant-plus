/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:08:53
 * @Description:
 */

// 查询指令日志列表
export function getOrderLogList(query) {
  return uni.$u.http.request({
    url: "/iot/log/list",
    method: "get",
    params: query,
  });
}
