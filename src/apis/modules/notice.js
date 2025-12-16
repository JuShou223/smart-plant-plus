/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:09:11
 * @Description:
 */
// 查询公告列表
export function listNotice(params) {
  return uni.$u.http.get("/system/notice/list", { params });
}

// 查询公告详情
export function getNotice(noticeId) {
  return uni.$u.http.get("/system/notice/" + noticeId);
}
