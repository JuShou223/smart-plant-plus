/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:09:46
 * @Description:
 */
// 查询产品列表
export function getProductList(query) {
  return uni.$u.http.get("/iot/product/list", {
    params: query,
  });
}
