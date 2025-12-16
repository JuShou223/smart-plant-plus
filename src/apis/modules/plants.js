// apis/modules/plants.js
// 植物管理相关接口

// ==================== 用户植物管理 ====================

/**
 * 获取用户植物列表
 * @param {Object} params - 查询参数
 * @param {Number} params.pageNum - 页码
 * @param {Number} params.pageSize - 每页数量
 * @param {String} params.healthStatus - 健康状态筛选
 */
export function getUserPlants(params) {
  return uni.$u.http.get("/hws/myPlants/myPlant", {
    params,
    // custom: {
    //   ShowLoading: true,
    // },
  });
}

/**
 * 获取植物详情
 * @param {String} plantId - 植物ID
 */
export function getPlantDetail(plantId) {
  return uni.$u.http.get("/hws/myPlants/detail/" + plantId);
}

/**
 * 添加植物
 * @param {Object} data - 植物数据
 * @param {String} data.plantId - 植物库ID
 * @param {String} data.nickname - 昵称
 * @param {String} data.location - 位置
 * @param {String} data.purchaseDate - 购买日期
 */
export function addPlant(data) {
  return uni.$u.http.post("/hws/myPlants/save", data);
}

/**
 * 更新植物信息
 * @param {Object} data - 更新数据
 * @param {String} data.id - 植物ID
 */
export function updatePlant(id, data) {
  return uni.$u.http.post("/hws/myPlants/" + id, data);
}

/**
 * 删除植物
 * @param {String} plantId - 植物ID
 */
export function deletePlant(plantId) {
  return uni.$u.http.delete("/hws/myPlants/delete/" + plantId);
}

// ==================== 植物状态管理 ====================

/**
 * 获取植物状态列表
 * @param {String} plantId - 植物ID
 * @param {Boolean} includeResolved - 是否包含已解决的状态
 */
export function getPlantStatus(plantId, includeResolved = false) {
  return uni.$u.http.get("/iot/plants/status/" + plantId, {
    params: { includeResolved },
  });
}

/**
 * 添加植物状态
 * @param {Object} data - 状态数据
 */
export function addPlantStatus(data) {
  return uni.$u.http.post("/iot/plants/status", data);
}

/**
 * 解决植物状态问题
 * @param {String} statusId - 状态ID
 */
export function resolvePlantStatus(statusId) {
  return uni.$u.http.put("/iot/plants/status/" + statusId + "/resolve");
}

// ==================== 植物数据库 ====================

/**
 * 获取植物数据库列表
 * @param {Object} options - 查询选项
 * @param {String} options.category - 分类
 * @param {String} options.orderBy - 排序方式 (popularity/beauty/easy)
 * @param {Number} options.limit - 限制数量
 */
export function getPlantDatabase(options = {}) {
  return uni.$u.http.get("/hws/plants/list", {
    params: options,
    // custom: {
    //   ShowLoading: false,
    // },
  });
}

/**
 * 搜索植物
 * @param {String} keyword - 关键词
 */
export function searchPlants(keyword) {
  return uni.$u.http.get("/hws/plants/list", {
    params: { name: keyword },
    // custom: {
    //   ShowLoading: false,
    // },
  });
}

/**
 * 获取植物库详情
 * @param {String} plantId - 植物库ID
 */
export function getPlantDatabaseById(plantId) {
  return uni.$u.http.get("/hws/plants/" + plantId, {});
}

// ==================== 养护记录 ====================

/**
 * 获取养护记录
 * @param {String} plantId - 植物ID
 * @param {Object} params - 查询参数
 */

export function getCareRecords(id, params) {
  console.log(id, params);
  return uni.$u.http.get("/hws/maintenance/plant/" + id, { params });
}

/**
 * 添加养护记录
 * @param {Object} data - 养护记录数据
 */
export function addCareRecord(data) {
  return uni.$u.http.post("/hws/maintenance", data);
}

// ==================== 病害诊断 ====================

/**
 * 上传病害诊断图片
 * @param {String} imageUrl - 图片URL
 * @param {String} plantId - 植物ID (可选)
 */
export function diagnosePlantDisease(imageUrl, plantId = null) {
  return uni.$u.http.post("/iot/plants/diagnose", {
    imageUrl,
    plantId,
  });
}

/**
 * 获取推荐商品
 * @param {String} plantId - 植物ID
 * @param {Number} limit - 限制数量
 */
export function getRecommendedProducts(plantId, limit = 6) {
  return uni.$u.http.get("/iot/plants/recommended-products", {
    params: { plantId, limit },
    // custom: {
    //   ShowLoading: false,
    // },
  });
}

/**
 * 获取服务套餐
 * @param {String} productType - 商品类型 (plant/accessory)
 */
export function getServicePackages(productType = "plant") {
  return uni.$u.http.get("/iot/plants/service-packages", {
    params: { productType },
    // custom: {
    //   ShowLoading: false,
    // },
  });
}
