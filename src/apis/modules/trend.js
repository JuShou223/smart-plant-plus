/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:10:44
 * @Description:
 */
// 查询动态
export function topListTrend() {
  return uni.$u.http.get("/iot/news/topList");
}

// 查询轮播广告图
export function bannerListTrend() {
  return uni.$u.http.get("/iot/news/bannerList");
}

// 查询分类下动态
export function listTrend(params) {
  return uni.$u.http.get("/iot/news/list", { params });
}

// 查询动态详情
export function getTrend(newsId) {
  console.log("newsId");
  console.log(newsId);
  return uni.$u.http.get("/iot/news/" + newsId);
}
