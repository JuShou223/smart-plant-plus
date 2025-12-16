/*
 * @Date: 2025-11-13 15:14:59
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:10:23
 * @Description:
 */
/**
 * 获取推荐植物列表
 */
export function getRecommendedPlants(params) {
  return uni.$u.http.get("/iot/shop/recommendedPlants", { params });
}

/**
 * 获取商品分类
 * @param {} params
 * @returns
 */
export function getProductCategories(params) {
  return uni.$u.http.get("/iot/shop/getProductCategories", { params });
}

/**
 * 获取养护商品
 * @param {} params
 * @returns
 */
export function getAccessoryProducts(params) {
  return uni.$u.http.get("/iot/shop/getAccessoryProducts", { params });
}

/** * 获取购物车商品数量
 * @param {} params
 * @returns
 */
export function getCartCount(params) {
  return uni.$u.http.get("/iot/shop/cartCount", { params });
}

/**
 * 根据植物获取推荐商品
 * @param {} params
 * @returns
 */
export function getProductsByPlant(params) {
  return uni.$u.http.get("/iot/shop/productsByPlant", { params });
}

/** 获取养护商品详情
 * @param {} params
 * @returns
 */
export function getAccessoryDetail(params) {
  return uni.$u.http.get("/iot/shop/accessoryDetail", { params });
}

/** 获取养护商品规格列表
 * @param {} params
 * @returns
 */
export function getAccessorySpecifications(params) {
  return uni.$u.http.get("/iot/shop/accessorySpecifications", { params });
}

/** 获取养护商品服务包列表
 * @param {} params
 * @returns
 */
export function getAccessoryServicePackages(params) {
  return uni.$u.http.get("/iot/shop/accessoryServicePackages", { params });
}

/** 获取植物相关的养护用品
 * @param {} params
 * @returns
 */
export function getPlantRelatedProducts(params) {
  return uni.$u.http.get("/iot/shop/plantRelatedProducts", { params });
}

/** 获取购物车
 * @param {} params
 * @returns
 */
export function getCart() {
  return uni.$u.http.get("/iot/shop/cart");
}

/** 获取订单列表
 * @param {} params
 * @returns
 */
export function getOrders(params) {
  return uni.$u.http.get("/iot/shop/orders", { params });
}

/** 获取订单详情
 * @param {String} orderId - 订单ID
 * @returns
 */
export function getOrder(params) {
  return uni.$u.http.get("/iot/shop/getOrder", { params });
}

export function getAddresses(params) {
  return uni.$u.http.get("/iot/shop/addresses", { params });
}
