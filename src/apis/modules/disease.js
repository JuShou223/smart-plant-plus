/*
 * @Date: 2025-11-12 16:25:46
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-24 16:37:00
 * @Description:
 */
// ==================== 植物疾病诊断相关接口 ====================

/**
 * 使用AI分析植物疾病
 * @param {Object} data - 分析数据
 * @param {String} data.image - 植物图片Base64编码
 * @param {String} data.plantType - 植物类型
 */
export function analyzeDiseaseWithAI(data) {
  return uni.$u.http.post("/hws/plant-diagnosis/plantAiDiagnosis", data);
}

/** 获取与疾病相关的推荐产品
 * @param {Object} data - 请求数据
 * @param {String} data.disease_type - 疾病类型
 * @param {number} data.limit - 限制数量
 */
export function getDiseaseRelatedProducts(data) {
  return uni.$u.http.post("/iot/disease/relatedProducts", data);
}

/**
 * 获取病害诊断记录
 * @param {Object} params - 查询参数
 */
export function getDiseaseRecords(params) {
  return uni.$u.http.get("/hws/plant-diagnosis/queryPlantDiagnosisbyUserId", {
    params,
  });
}

// 获取单个病害诊断记录详情
export function getDiseaseRecord(id) {
  return uni.$u.http.get("/hws/plant-diagnosis/" + id, {
    params: {
      id,
    },
  });
}

// 获取植物的诊断记录
export function getPlantDiseaseRecord(plantId) {
  return uni.$u.http.get("/hws/plant-diagnosis/plant/" + plantId);
}

// 更新诊断状态
export function updateDiagnosisStatus(id, data) {
  return uni.$u.http.request({
    url: "/hws/plant-diagnosis/" + id + "/status",
    method: "PATCH",
    params: data,
  });
}

// 查询疾病库
export function getDiseaseList(params) {
  return uni.$u.http.get("/iot/disease/getDiseaseList", { params });
}

// 查询疾病详情
export function getDiseaseDetail(params) {
  return uni.$u.http.get("/iot/disease/getDiseaseDetail", { params });
}

// 获取疾病包
export function getPackagesByDisease(params) {
  return uni.$u.http.get("/iot/disease/getPackagesByDisease", { params });
}

// 获取疾病包详情
export function getPackageDetail(params) {
  return uni.$u.http.get("/iot/disease/getPackageDetail", { params });
}

// 获取治疗包步骤
export function getPackageSteps(params) {
  return uni.$u.http.get("/iot/disease/getPackageSteps", { params });
}

// 获取治疗包产品
export function getPackageProducts(params) {
  return uni.$u.http.get("/iot/disease/getPackageProducts", { params });
}

// 保存诊断记录
export function createDiagnosis(data) {
  return uni.$u.http.post("/hws/plant-diagnosis/create", data);
}
