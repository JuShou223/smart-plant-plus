// common/mock/plantsMock.js
// Mock数据服务 - 用于后端接口未实现时的开发

// ==================== Mock数据 ====================
import {
  PLANT_DATABASE,
  USER_PLANTS,
  PLANT_STATUS,
  PLANT_PRODUCTS,
  ACCESSORY_PRODUCTS,
  PRODUCT_ASSOCIATIONS,
  SERVICE_PACKAGES,
  CARE_RECORDS,
  DISEASE_RECORDS,
  DEVICE_PLANT_BINDINGS,
  SENSOR_READINGS,
  SENSOR_DEVICES,
  SENSOR_THRESHOLDS,
  DISEASE_PRODUCT_MAPPING,
  PRODUCT_CATEGORIES,
  SHOPPING_CART,
  ACCESSORY_SPECIFICATIONS,
  ORDERS,
  ORDER_ITEMS,
  USER_ADDRESSES,
  DISEASE_LIBRARY,
  TREATMENT_PACKAGES,
  TREATMENT_STEPS,
  TREATMENT_PACKAGE_PRODUCTS,
  PRODUCTS,
} from "./mock/index";
const MOCK_ENABLED = true; // 开发阶段启用Mock,上线前改为false

// Mock延迟时间(模拟网络请求)
const MOCK_DELAY = 500;

// ==================== Mock方法 ====================

/**
 * Mock延迟函数
 */
const mockDelay = () => {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
};

/**
 * Mock成功响应
 */
const mockSuccess = (data, total = null) => {
  const response = {
    code: 200,
    msg: "操作成功",
    data: data,
  };
  if (total !== null) {
    response.rows = data;
    response.total = total;
  }
  return response;
};

/**
 * Mock错误响应
 */
const mockError = (msg = "操作失败") => {
  return {
    code: 500,
    msg: msg,
  };
};

// ==================== Mock接口实现 ====================

export const plantsMock = {
  /**
   * 获取用户植物列表
   */
  async getUserPlants(params = {}) {
    await mockDelay();

    const { pageNum = 1, pageSize = 10, healthStatus } = params;

    // 过滤
    let filteredPlants = [...USER_PLANTS];
    if (healthStatus) {
      filteredPlants = filteredPlants.filter(
        (p) => p.health_status === healthStatus
      );
    }

    // 分页
    const total = filteredPlants.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const plants = filteredPlants.slice(start, end);

    // 为每个植物添加状态信息
    const plantsWithStatus = plants.map((plant) => {
      const statuses = PLANT_STATUS.filter(
        (s) =>
          s.user_plant_id === plant.id &&
          !s.is_resolved &&
          s.status_type !== "健康"
      );
      const hasIssues = statuses.length > 0;

      return {
        ...plant,
        hasIssues,
        issueCount: statuses.length,
        severity: hasIssues ? statuses[0].severity : "健康",
      };
    });

    return mockSuccess(plantsWithStatus, total);
  },

  /**
   * 获取植物详情
   */
  async getPlantDetail(plantId) {
    await mockDelay();

    const plant = USER_PLANTS.find((p) => p.id === plantId);
    if (!plant) {
      return mockError("植物不存在");
    }

    // 获取该植物的状态
    const statuses = PLANT_STATUS.filter((s) => s.user_plant_id === plantId);

    return mockSuccess({
      ...plant,
      statuses,
    });
  },

  /**
   * 添加植物
   */
  async addPlant(data) {
    await mockDelay();

    const newPlant = {
      id: "user_plant_" + Date.now(),
      user_id: "mock_user_001",
      ...data,
      health_status: "健康",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 获取植物库信息
    const plantDb = PLANT_DATABASE.find((p) => p.id === data.plant_id);
    if (plantDb) {
      newPlant.plant_database = plantDb;
      newPlant.image_url = newPlant.image_url || plantDb.image_url;
    }

    USER_PLANTS.unshift(newPlant);
    return mockSuccess(newPlant);
  },

  /**
   * 更新植物
   */
  async updatePlant(data) {
    await mockDelay();

    const index = USER_PLANTS.findIndex((p) => p.id === data.id);
    if (index === -1) {
      return mockError("植物不存在");
    }

    USER_PLANTS[index] = {
      ...USER_PLANTS[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return mockSuccess(USER_PLANTS[index]);
  },

  /**
   * 删除植物
   */
  async deletePlant(plantId) {
    await mockDelay();

    const index = USER_PLANTS.findIndex((p) => p.id === plantId);
    if (index === -1) {
      return mockError("植物不存在");
    }

    USER_PLANTS.splice(index, 1);
    // 同时删除相关状态
    // PLANT_STATUS = PLANT_STATUS.filter((s) => s.user_plant_id !== plantId);

    return mockSuccess(null);
  },

  /**
   * 获取植物状态
   */
  async getPlantStatus(plantId, includeResolved = false) {
    await mockDelay();

    let statuses = PLANT_STATUS.filter((s) => s.user_plant_id === plantId);
    if (!includeResolved) {
      statuses = statuses.filter((s) => !s.is_resolved);
    }

    // 按严重程度排序
    const severityOrder = { 危急: 4, 严重: 3, 中等: 2, 轻微: 1 };
    statuses.sort(
      (a, b) =>
        (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0)
    );

    return mockSuccess(statuses);
  },

  /**
   * 添加植物状态
   */
  async addPlantStatus(data) {
    await mockDelay();

    const newStatus = {
      id: "status_" + Date.now(),
      user_id: "mock_user_001",
      ...data,
      is_resolved: false,
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    PLANT_STATUS.unshift(newStatus);

    // 更新植物健康状态
    const plant = USER_PLANTS.find((p) => p.id === data.user_plant_id);
    if (plant) {
      plant.health_status = "需要关注";
    }

    return mockSuccess(newStatus);
  },

  /**
   * 解决植物状态
   */
  async resolvePlantStatus(statusId) {
    await mockDelay();

    const status = PLANT_STATUS.find((s) => s.id === statusId);
    if (!status) {
      return mockError("状态不存在");
    }

    status.is_resolved = true;
    status.resolved_at = new Date().toISOString();

    // 检查植物是否还有其他未解决问题
    const plant = USER_PLANTS.find((p) => p.id === status.user_plant_id);
    if (plant) {
      const hasOtherIssues = PLANT_STATUS.some(
        (s) =>
          s.user_plant_id === plant.id && !s.is_resolved && s.id !== statusId
      );
      if (!hasOtherIssues) {
        plant.health_status = "健康";
      }
    }

    return mockSuccess(status);
  },

  /**
   * 获取植物数据库
   */
  async getPlantDatabase(options = {}) {
    await mockDelay();

    let plants = [...PLANT_DATABASE];

    // 分类过滤
    if (options.category) {
      plants = plants.filter((p) => p.category === options.category);
    }

    if (options.plantId) {
      plants = plants.filter((p) => p.id === options.plantId);
    }

    // 排序
    if (options.orderBy === "popularity") {
      plants.sort((a, b) => b.popularity_score - a.popularity_score);
    } else if (options.orderBy === "beauty") {
      plants.sort((a, b) => b.beauty_score - a.beauty_score);
    } else if (options.orderBy === "easy") {
      plants.sort((a, b) => a.care_difficulty - b.care_difficulty);
    }

    // 限制数量
    if (options.limit) {
      plants = plants.slice(0, options.limit);
    }

    return mockSuccess(plants);
  },

  /**
   * 搜索植物
   */
  async searchPlants(keyword) {
    await mockDelay();

    const results = PLANT_DATABASE.filter(
      (p) =>
        p.name.includes(keyword) ||
        (p.scientific_name &&
          p.scientific_name.toLowerCase().includes(keyword.toLowerCase()))
    );
    console.log("搜索关键词:", keyword, "结果数量:", results);
    return mockSuccess(results);
  },

  /**
   * 获取植物库详情
   */
  async getPlantDatabaseById(plantId) {
    await mockDelay();

    const plant = PLANT_DATABASE.find((p) => p.id === plantId);
    if (!plant) {
      return mockError("植物不存在");
    }

    return mockSuccess(plant);
  },
  // 在 plantsMock 对象中添加：

  /**
   * 获取推荐商品
   */
  async getRecommendedProducts(params = {}) {
    await mockDelay();

    const { plantId, limit = 6 } = params;

    if (!plantId) {
      return mockError("植物ID不能为空");
    }

    // 1. 获取该植物的商品
    const plantProducts = PLANT_PRODUCTS.filter(
      (p) => p.plant_id === plantId && p.is_active
    ).slice(0, 2); // 最多显示2个该植物的商品

    // 2. 获取关联的养护用品
    const associations = PRODUCT_ASSOCIATIONS.filter(
      (a) => a.plant_id === plantId
    ).sort((a, b) => b.priority - a.priority);

    const accessoryProducts = [];
    for (const assoc of associations.slice(0, 4)) {
      // 最多4个关联商品
      const product = ACCESSORY_PRODUCTS.find((p) => p.id === assoc.product_id);
      if (product && product.is_active) {
        accessoryProducts.push({
          ...product,
          recommendation_reason: assoc.recommendation_reason,
        });
      }
    }

    // 3. 如果关联商品不足，补充通用商品
    if (accessoryProducts.length < 4) {
      const generalProducts = ACCESSORY_PRODUCTS.filter(
        (p) => p.is_active && !accessoryProducts.some((ap) => ap.id === p.id)
      ).slice(0, 4 - accessoryProducts.length);

      accessoryProducts.push(...generalProducts);
    }

    const recommendedProducts = [...plantProducts, ...accessoryProducts].slice(
      0,
      limit
    );

    return mockSuccess(recommendedProducts);
  },

  /**
   * 获取服务套餐
   */
  async getServicePackages(params = {}) {
    await mockDelay();
    const { productType = "plant" } = params;

    const packages = SERVICE_PACKAGES.filter(
      (p) => p.product_type === productType && p.is_active
    ).sort((a, b) => a.sort_order - b.sort_order);

    return mockSuccess(packages);
  },

  /**
   * 获取养护记录
   */
  async getCareRecords(params) {
    await mockDelay();
    let data = CARE_RECORDS.filter(
      (r) => r.user_plant_id === params.user_plant_id
    ).sort((a, b) => new Date(b.care_date) - new Date(a.care_date));

    if (params.careType) {
      data = data.filter((r) => r.care_type === params.careType);
    }

    if (params.limit) {
      data = data.slice(0, params.limit);
    }

    return mockSuccess(data);
  },

  /**
   * 获取诊断记录
   */
  async getDiseaseRecords(params) {
    await mockDelay();
    let result = DISEASE_RECORDS.filter((r) => r.user_id === "mock_user_001");
    if (params.user_plant_id) {
      result = result.filter((r) => r.user_plant_id === params.user_plant_id);
    }
    return mockSuccess(result);
  },

  /**
   * 获取植物绑定的传感器列表
   */
  async getPlantAllBindings(params) {
    await mockDelay();

    const bindings = DEVICE_PLANT_BINDINGS.filter(
      (b) => b.user_plant_id === params.user_plant_id && b.is_active
    )
      .map((binding) => {
        // 查找关联的传感器设备
        const sensorDevice = SENSOR_DEVICES.find(
          (device) => device.id === binding.device_id
        );

        return {
          ...binding,
          sensor_devices: sensorDevice || null,
        };
      })
      .sort((a, b) => new Date(b.bound_at) - new Date(a.bound_at)); // 按绑定时间降序排序

    console.log("返回绑定数据:", bindings);

    return mockSuccess(bindings);
  },

  /**
   * 获取传感器最新读数
   */
  async getLatestReading(params) {
    await mockDelay();
    console.log("传感器读数数据:", readings);
    const readings = SENSOR_READINGS.filter(
      (r) => r.device_id === params.device_id
    ).sort((a, b) => new Date(b.reading_time) - new Date(a.reading_time));

    if (readings.length === 0) {
      return mockError("无传感器读数");
    }

    return mockSuccess(readings[0]);
  },

  /**
   * 获取传感器阈值设置
   */
  async getThreshold(params) {
    await mockDelay();

    const threshold =
      SENSOR_THRESHOLDS.find((t) => t.user_plant_id === params.user_plant_id) ||
      null; // 使用 find 而不是 filter，配合 || null 来模仿 maybeSingle() 行为

    return mockSuccess(threshold);
  },

  /**
   * 获取用户传感器设备列表
   */
  async getUserDevices(params) {
    await mockDelay();
    const devices = SENSOR_DEVICES.filter(
      (d) => d.user_id === params.user_id
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return mockSuccess(devices);
  },

  async getDeviceBinding(params) {
    await mockDelay();
    // 从绑定表查找该设备的绑定记录
    const binding = DEVICE_PLANT_BINDINGS.find(
      (b) => b.device_id === params.device_id && b.is_active
    );
    if (!binding) {
      return mockError("该设备未绑定植物");
    }
    // 查找绑定的植物
    const userPlant = USER_PLANTS.find((p) => p.id === binding.user_plant_id);
    const plantInfo = userPlant
      ? PLANT_DATABASE.find((db) => db.id === userPlant.plant_id)
      : null;
    const result = {
      ...binding,
      user_plants: userPlant
        ? {
            id: userPlant.id,
            nickname: userPlant.nickname,
            plant_id: userPlant.plant_id,
            plant_database: plantInfo
              ? {
                  name: plantInfo.name,
                  image_url: plantInfo.image_url,
                }
              : null,
          }
        : null,
    };
    return mockSuccess(result);
  },

  /**
   * 使用AI分析植物病害
   */
  async analyzeDiseaseWithAI() {
    await mockDelay();
    const diseases = [
      {
        disease_type: "褐斑病",
        confidence: 0.85,
        diagnosis:
          "您的植物可能患有叶片褐斑病，这是由真菌感染引起的常见病害。主要表现为叶片上出现圆形或不规则的褐色斑点，周围可能有黄色晕圈。",
        treatment_plan:
          "1. 及时摘除病叶并销毁，避免病菌传播\n2. 保持环境通风良好，降低湿度\n3. 喷洒多菌灵或百菌清溶液，浓度按说明稀释\n4. 每7-10天喷一次，连续3-4次\n5. 减少叶面喷水，避免叶片长时间潮湿",
      },
      {
        disease_type: "根腐病",
        confidence: 0.78,
        diagnosis:
          "根系腐烂通常由浇水过多或排水不良引起。植株表现为叶片发黄、萎蔫，生长缓慢。严重时整株会死亡。",
        treatment_plan:
          "1. 立即停止浇水，让土壤充分干燥\n2. 将植株从盆中取出，检查根系状况\n3. 用消毒剪刀剪除所有腐烂的根部\n4. 在伤口处涂抹多菌灵粉剂消毒\n5. 更换新的疏松透气的土壤\n6. 重新上盆后暂时不浇水，放在通风处\n7. 3-5天后少量浇水，逐步恢复正常",
        recommended_products: [
          {
            id: 3,
            name: "腐殖土营养土 5L",
            price: 25.0,
            image:
              "https://images.pexels.com/photos/4750275/pexels-photo-4750275.jpeg?auto=compress&cs=tinysrgb&w=400",
          },
          {
            id: 1,
            name: "多菌灵杀菌剂 500g",
            price: 28.8,
            image:
              "https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=400",
          },
        ],
      },
      {
        disease_type: "虫害",
        confidence: 0.92,
        diagnosis:
          "发现蚜虫危害。蚜虫是常见的刺吸式害虫，会吸食植物汁液，导致叶片卷曲、变黄。还会分泌蜜露，引发煤污病。",
        treatment_plan:
          "1. 用湿布或水流冲洗虫体，清除虫体\n2. 喷洒吡虫啉或啶虫脒溶液\n3. 每5-7天喷一次，连续2-3次\n4. 加强通风，降低湿度\n5. 检查周边植物，防止交叉感染\n6. 可用黄色粘虫板进行监测和防治",
        recommended_products: [
          {
            id: 2,
            name: "有机营养液 500ml",
            price: 36.0,
            image:
              "https://images.pexels.com/photos/5591662/pexels-photo-5591662.jpeg?auto=compress&cs=tinysrgb&w=400",
          },
        ],
      },
      {
        disease_type: "叶片发黄",
        confidence: 0.73,
        diagnosis:
          "叶片发黄可能是由于缺乏氮元素或光照不足引起。老叶先发黄是正常代谢，新叶发黄则需要注意。",
        treatment_plan:
          "1. 检查光照是否充足，适当增加光照\n2. 施用氮肥或复合肥，补充营养\n3. 检查浇水是否适当，避免积水或过干\n4. 检查土壤pH值，确保在适宜范围\n5. 如果是老叶自然发黄，及时摘除即可\n6. 保持良好的通风环境",
        recommended_products: [
          {
            id: 2,
            name: "有机营养液 500ml",
            price: 36.0,
            image:
              "https://images.pexels.com/photos/5591662/pexels-photo-5591662.jpeg?auto=compress&cs=tinysrgb&w=400",
          },
          {
            id: 3,
            name: "腐殖土营养土 5L",
            price: 25.0,
            image:
              "https://images.pexels.com/photos/4750275/pexels-photo-4750275.jpeg?auto=compress&cs=tinysrgb&w=400",
          },
        ],
      },
      {
        disease_type: "健康",
        confidence: 0.95,
        diagnosis:
          "恭喜！您的植物目前看起来非常健康，生长状态良好。继续保持现有的养护方式。",
        treatment_plan:
          "1. 继续保持规律的浇水，见干见湿\n2. 每月施肥一次，薄肥勤施\n3. 定期清洁叶片，保持光合作用\n4. 注意观察植物状态，及时发现问题\n5. 保持良好的通风环境\n6. 根据季节调整养护方式",
        recommended_products: [
          {
            id: 2,
            name: "有机营养液 500ml",
            price: 36.0,
            image:
              "https://images.pexels.com/photos/5591662/pexels-photo-5591662.jpeg?auto=compress&cs=tinysrgb&w=400",
          },
        ],
      },
    ];
    // 随机选择一个疾病结果进行返回
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    return mockSuccess(randomDisease);
  },

  async getDiseaseRelatedProducts(diseaseType, limit = 6) {
    try {
      // 1. 参数校验
      if (!diseaseType || typeof diseaseType !== "string") {
        console.warn("疾病类型参数无效:", diseaseType);
        return [];
      }

      // 2. 模糊匹配疾病类型（支持部分匹配）
      // 例如：输入"根腐病"可以匹配"根部腐烂"
      const matchedMappings = DISEASE_PRODUCT_MAPPING.filter((mapping) => {
        const mappingType = mapping.disease_type.toLowerCase();
        const inputType = diseaseType.toLowerCase();

        // 精确匹配或包含匹配
        return (
          mappingType === inputType ||
          mappingType.includes(inputType) ||
          inputType.includes(mappingType)
        );
      });

      if (matchedMappings.length === 0) {
        console.warn(`未找到疾病类型 "${diseaseType}" 的产品映射`);
        return [];
      }

      // 3. 按优先级排序
      const sortedMappings = matchedMappings.sort(
        (a, b) => b.priority - a.priority
      );
      console.log(
        `找到 ${sortedMappings.length} 条匹配的产品映射，疾病类型: ${diseaseType}`
      );
      // 4. 关联产品数据
      const products = [];
      const addedProductIds = new Set(); // 防止重复

      for (const mapping of sortedMappings) {
        // 如果已经达到限制数量，停止
        if (products.length >= limit) break;

        // 如果产品已添加，跳过
        if (addedProductIds.has(mapping.product_id)) continue;
        console.log("处理产品ID:", mapping.product_id);
        // 查找对应的产品
        const product = ACCESSORY_PRODUCTS.find(
          (p) => p.id === mapping.product_id
        );
        console.log("找到产品:", product);
        // 产品存在且可用
        if (product && product.is_active && product.stock > 0) {
          products.push({
            id: product.id,
            name: product.name,
            price: product.price,
            original_price: product.original_price,
            image_url: product.image_url,
            sales: product.sales,
            stock: product.stock,
            tags: product.tags,
            usage_guide: product.usage_guide,
            specifications: product.specifications,
            recommendation_reason: mapping.recommendation_reason,
            priority: mapping.priority,
          });

          addedProductIds.add(mapping.product_id);
        }
      }

      // console.log(
      //   `找到 ${products.length} 个推荐产品，疾病类型: ${diseaseType}`
      // );
      return mockSuccess(products);
    } catch (error) {
      console.error("getDiseaseRelatedProducts 执行失败:", error);
      throw error;
    }
  },

  async getDiseaseRecord(recordId) {
    await mockDelay();

    const diseaseRecord = DISEASE_RECORDS.find(
      (record) => record.id === recordId
    );
    if (!diseaseRecord) {
      // 模仿 .single() 行为，如果找不到记录应该抛出错误
      throw new Error("Record not found");
    }

    // 联表查询：查找关联的 user_plants
    const userPlant = USER_PLANTS.find(
      (plant) => plant.id === diseaseRecord.user_plant_id
    );

    // 构建返回结果，只包含需要的字段
    const result = {
      ...diseaseRecord,
      user_plants: userPlant
        ? {
            nickname: userPlant.nickname,
            plant_database: userPlant.plant_database
              ? {
                  name: userPlant.plant_database.name,
                }
              : null,
          }
        : null,
    };

    return mockSuccess(result);
  },

  async getDeviceById(deviceId) {
    await mockDelay();

    const device =
      SENSOR_DEVICES.find((device) => device.id === deviceId) || null;

    return mockSuccess(device);
  },

  async getReadingsStats(deviceId, hours = 24) {
    console.log(
      "获取传感器读数统计，设备ID:",
      deviceId,
      "时间范围(小时):",
      hours
    );
    await mockDelay();

    // 计算开始时间
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    // 过滤指定设备和时间范围内的读数
    const data = SENSOR_READINGS.filter(
      (reading) =>
        reading.device_id === deviceId &&
        new Date(reading.reading_time) >= startTime
    ).sort((a, b) => new Date(a.reading_time) - new Date(b.reading_time));

    if (!data || data.length === 0) return mockSuccess(null);

    // 提取湿度和温度数据
    const moistures = data
      .map((r) => parseFloat(r.soil_moisture))
      .filter((m) => !isNaN(m));
    const temperatures = data
      .map((r) => parseFloat(r.soil_temperature))
      .filter((t) => !isNaN(t));

    const result = {
      count: data.length,
      moisture: {
        current: moistures[moistures.length - 1] || 0,
        avg:
          moistures.length > 0
            ? moistures.reduce((a, b) => a + b, 0) / moistures.length
            : 0,
        min: moistures.length > 0 ? Math.min(...moistures) : 0,
        max: moistures.length > 0 ? Math.max(...moistures) : 0,
      },
      temperature: {
        current: temperatures[temperatures.length - 1] || 0,
        avg:
          temperatures.length > 0
            ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length
            : 0,
        min: temperatures.length > 0 ? Math.min(...temperatures) : 0,
        max: temperatures.length > 0 ? Math.max(...temperatures) : 0,
      },
      history: data.map((item) => ({
        soil_moisture: parseFloat(item.soil_moisture) || 0,
        soil_temperature: parseFloat(item.soil_temperature) || 0,
        reading_time: item.reading_time,
      })),
    };

    return mockSuccess(result);
  },

  /** * 获取推荐植物列表
   */
  async getRecommendedPlants() {
    await mockDelay();

    const recommendedPlants = PLANT_DATABASE.filter(
      (plant) => plant.is_recommended === true
    ).sort(
      (a, b) => (a.recommendation_rank || 999) - (b.recommendation_rank || 999)
    );

    return mockSuccess(recommendedPlants);
  },

  // 获取商品分类
  async getProductCategories() {
    await mockDelay();

    const categories = PRODUCT_CATEGORIES.filter(
      (cat) => cat.is_active === true && cat.parent_id === null
    )
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        sort_order: cat.sort_order,
      }));

    return mockSuccess(categories);
  },

  // 获取养护用品列表
  async getAccessoryProducts(categoryName = null, limit = 20) {
    await mockDelay();

    let filteredProducts = ACCESSORY_PRODUCTS.filter(
      (product) => product.is_active === true
    );

    // 如果指定了分类名称，先查找分类ID
    if (categoryName) {
      const category = PRODUCT_CATEGORIES.find(
        (cat) => cat.name === categoryName
      );
      if (category) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category_id === category.id
        );
      }
    }

    // 按销量降序排序并限制数量
    const sortedProducts = filteredProducts
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, limit);

    // 构建返回数据，包含分类名称
    const result = sortedProducts.map((item) => {
      const category = PRODUCT_CATEGORIES.find(
        (cat) => cat.id === item.category_id
      );
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        image_url: item.image_url,
        stock: item.stock,
        sales: item.sales,
        tags: item.tags,
        is_featured: item.is_featured,
        category_name: category.name || "其他",
      };
    });

    return mockSuccess(result);
  },

  // 获取购物车商品数量
  async getCartCount() {
    await mockDelay();

    // 模拟获取当前用户

    // 统计用户购物车中的商品数量
    const count = SHOPPING_CART.filter(
      (item) => item.user_id === "mock_user_001"
    ).length;

    return mockSuccess(count);
  },

  // 获取某植物的推荐商品列表
  async getProductsByPlant(plantId) {
    await mockDelay();

    const products = PLANT_PRODUCTS.filter(
      (product) => product.plant_id === plantId && product.is_active === true
    )
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .map((product) => {
        const plant = PLANT_DATABASE.find((p) => p.id === product.plant_id);
        return {
          ...product,
          plant: plant || null,
        };
      });

    return mockSuccess(products);
  },

  // 获取养护用品详情
  async getAccessoryDetail(accessoryId) {
    await mockDelay();

    const accessory = ACCESSORY_PRODUCTS.find(
      (product) => product.id === accessoryId && product.is_active === true
    );

    if (!accessory) {
      throw new Error("商品不存在");
    }

    // 查找分类信息
    const category = PRODUCT_CATEGORIES.find(
      (cat) => cat.id === accessory.category_id
    );

    const result = {
      ...accessory,
      category_name: category.name || "其他",
      category_icon: category.icon || "🛒",
    };

    return mockSuccess(result);
  },

  // 获取养护用品规格
  async getAccessorySpecifications(accessoryId) {
    await mockDelay();

    const specifications = ACCESSORY_SPECIFICATIONS.filter(
      (spec) =>
        spec.accessory_product_id === accessoryId && spec.is_active === true
    ).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    return mockSuccess(specifications);
  },

  // 获取养护用品服务套餐
  async getAccessoryServicePackages() {
    await mockDelay();

    const packages = SERVICE_PACKAGES.filter(
      (pkg) => pkg.product_type === "accessory" && pkg.is_active === true
    ).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    return mockSuccess(packages);
  },

  // 获取植物相关的养护用品
  async getPlantRelatedProducts(plantId, limit = 6) {
    await mockDelay();

    // 查找植物相关的产品关联
    const associations = PRODUCT_ASSOCIATIONS.filter(
      (assoc) =>
        assoc.plant_id === plantId && assoc.product_type === "accessory"
    )
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, limit);

    console.log("找到的产品关联:", associations);
    if (!associations || associations.length === 0) {
      return mockSuccess([]);
    }

    const productIds = associations.map((a) => a.product_id);

    // 查找关联的产品信息
    const products = ACCESSORY_PRODUCTS.filter(
      (product) => productIds.includes(product.id) && product.is_active === true
    );

    // 合并关联信息和产品信息
    const result = associations
      .map((assoc) => {
        const product = products.find((p) => p.id === assoc.product_id);
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          sales: product.sales,
          tags: product.tags,
          recommendation_reason: assoc.recommendation_reason,
          priority: assoc.priority,
        };
      })
      .filter(Boolean);

    return mockSuccess(result);
  },

  // 获取购物车列表
  async getCart() {
    await mockDelay();

    const cartItems = SHOPPING_CART.map((item) => {
      // 构建植物产品信息
      let plantProduct = null;
      if (item.product_type === "plant" && item.plant_product_id) {
        const plantProd = PLANT_PRODUCTS.find(
          (p) => p.id === item.plant_product_id
        );
        if (plantProd) {
          const plant = PLANT_DATABASE.find((p) => p.id === plantProd.plant_id);
          plantProduct = {
            ...plantProd,
            plant: plant || null,
          };
        }
      }

      // 构建配件规格信息
      let accessorySpecification = null;
      if (
        item.product_type === "accessory" &&
        item.accessory_specification_id
      ) {
        const accessorySpec = ACCESSORY_SPECIFICATIONS.find(
          (s) => s.id === item.accessory_specification_id
        );
        if (accessorySpec) {
          const accessory = ACCESSORY_PRODUCTS.find(
            (a) => a.id === accessorySpec.accessory_product_id
          );
          accessorySpecification = {
            ...accessorySpec,
            accessory: accessory || null,
          };
        }
      }

      // 构建服务套餐信息
      let servicePackage = null;
      if (item.service_package_id) {
        servicePackage =
          SERVICE_PACKAGES.find((p) => p.id === item.service_package_id) ||
          null;
      }

      return {
        ...item,
        plant_product: plantProduct,
        accessory_specification: accessorySpecification,
        service_package: servicePackage,
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return mockSuccess(cartItems);
  },

  // 获取订单列表
  async getOrders(status = null) {
    await mockDelay();

    let orders = ORDERS.map((order) => {
      // 查找订单项
      const orderItems = ORDER_ITEMS.filter(
        (item) => item.order_id === order.id
      ).map((item) => {
        let plantProduct = null;
        if (item.plant_product_id) {
          const plantProd = PLANT_PRODUCTS.find(
            (p) => p.id === item.plant_product_id
          );
          if (plantProd) {
            const plant = PLANT_DATABASE.find(
              (p) => p.id === plantProd.plant_id
            );
            plantProduct = {
              ...plantProd,
              plant: plant || null,
            };
          }
        }

        let accessorySpecification = null;
        if (item.accessory_specification_id) {
          const accessorySpec = ACCESSORY_SPECIFICATIONS.find(
            (s) => s.id === item.accessory_specification_id
          );
          console.log("找到的配件规格:", accessorySpec);
          if (accessorySpec) {
            const accessory = ACCESSORY_PRODUCTS.find(
              (a) => a.id === accessorySpec.accessory_product_id
            );
            console.log("找到的配件商品:", accessory);
            accessorySpecification = {
              ...accessorySpec,
              accessory: accessory || null,
            };
          }
        }

        let servicePackage = null;
        if (item.service_package_id) {
          servicePackage =
            SERVICE_PACKAGES.find((p) => p.id === item.service_package_id) ||
            null;
        }

        return {
          ...item,
          plant_product: plantProduct,
          accessory_specification: accessorySpecification,
          service_package: servicePackage,
        };
      });

      return {
        ...order,
        order_items: orderItems,
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 根据状态过滤
    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    return mockSuccess(orders);
  },

  //
  async getOrder(orderId) {
    await mockDelay();

    const order = ORDERS.find((order) => order.id === orderId);

    if (!order) {
      throw new Error("订单不存在");
    }

    // 查找订单项
    const orderItems = ORDER_ITEMS.filter(
      (item) => item.order_id === orderId
    ).map((item) => {
      let plantProduct = null;
      if (item.plant_product_id) {
        const plantProd = PLANT_PRODUCTS.find(
          (p) => p.id === item.plant_product_id
        );
        if (plantProd) {
          const plant = PLANT_DATABASE.find((p) => p.id === plantProd.plant_id);
          plantProduct = {
            ...plantProd,
            plant: plant || null,
          };
        }
      }

      let accessorySpecification = null;
      if (item.accessory_specification_id) {
        const accessorySpec = ACCESSORY_SPECIFICATIONS.find(
          (s) => s.id === item.accessory_specification_id
        );
        if (accessorySpec) {
          const accessory = ACCESSORY_PRODUCTS.find(
            (a) => a.id === accessorySpec.accessory_product_id
          );
          accessorySpecification = {
            ...accessorySpec,
            accessory: accessory || null,
          };
        }
      }

      let servicePackage = null;
      if (item.service_package_id) {
        servicePackage =
          SERVICE_PACKAGES.find((p) => p.id === item.service_package_id) ||
          null;
      }

      return {
        ...item,
        plant_product: plantProduct,
        accessory_specification: accessorySpecification,
        service_package: servicePackage,
      };
    });

    const result = {
      ...order,
      order_items: orderItems,
    };

    return mockSuccess(result);
  },

  async getAddresses() {
    await mockDelay();

    const addresses = USER_ADDRESSES.sort((a, b) => {
      // 先按默认地址排序（默认地址在前）
      if (a.is_default && !b.is_default) return -1;
      if (!a.is_default && b.is_default) return 1;
      // 再按创建时间降序
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return mockSuccess(addresses);
  },

  //
  async getDiseaseList(filters = {}) {
    await mockDelay();

    try {
      let diseases = DISEASE_LIBRARY;

      // 按分类过滤
      if (filters.category) {
        diseases = diseases.filter(
          (disease) => disease.category === filters.category
        );
      }

      // 按严重程度过滤
      if (filters.severity) {
        diseases = diseases.filter(
          (disease) => disease.severity === filters.severity
        );
      }

      // 搜索过滤
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        diseases = diseases.filter(
          (disease) =>
            disease.name.toLowerCase().includes(searchTerm) ||
            (disease.name_en &&
              disease.name_en.toLowerCase().includes(searchTerm)) ||
            disease.description.toLowerCase().includes(searchTerm)
        );
      }

      // 按创建时间降序排序
      diseases.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return mockSuccess(diseases);
    } catch (error) {
      console.error("Error fetching disease list:", error);
      throw error;
    }
  },

  async getDiseaseDetail(diseaseId) {
    await mockDelay();

    try {
      const disease = DISEASE_LIBRARY.find((d) => d.id === diseaseId);

      if (!disease) {
        throw new Error("病害信息不存在");
      }

      return mockSuccess(disease);
    } catch (error) {
      console.error("Error fetching disease detail:", error);
      throw error;
    }
  },

  // 获取疾病包
  async getPackagesByDisease(diseaseId) {
    await mockDelay();

    try {
      const packages = TREATMENT_PACKAGES.filter(
        (pkg) => pkg.disease_id === diseaseId
      ).sort((a, b) => {
        // 先按推荐排序（推荐的在前面）
        if (a.is_recommended && !b.is_recommended) return -1;
        if (!a.is_recommended && b.is_recommended) return 1;
        // 再按评分降序排序
        return (b.rating || 0) - (a.rating || 0);
      });

      return mockSuccess(packages);
    } catch (error) {
      console.error("Error fetching treatment packages:", error);
      throw error;
    }
  },

  async getPackageDetail(packageId) {
    await mockDelay();

    try {
      const packageInfo = TREATMENT_PACKAGES.find(
        (pkg) => pkg.id === packageId
      );
      if (!packageInfo) throw new Error("治疗方案包不存在");

      const disease = DISEASE_LIBRARY.find(
        (d) => d.id === packageInfo.disease_id
      );

      const result = {
        ...packageInfo,
        disease: disease || null,
      };

      return mockSuccess(result);
    } catch (error) {
      console.error("Error fetching package detail:", error);
      throw error;
    }
  },

  async getPackageSteps(packageId) {
    await mockDelay();

    try {
      const steps = TREATMENT_STEPS.filter(
        (step) => step.package_id === packageId
      ).sort((a, b) => (a.step_order || 0) - (b.step_order || 0));

      return mockSuccess(steps);
    } catch (error) {
      console.error("Error fetching package steps:", error);
      throw error;
    }
  },

  async getPackageProducts(packageId) {
    await mockDelay();

    try {
      const packageProducts = TREATMENT_PACKAGE_PRODUCTS.filter(
        (item) => item.package_id === packageId
      )
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.product_id);
          return {
            ...item,
            product: product || null,
          };
        });

      return mockSuccess(packageProducts);
    } catch (error) {
      console.error("Error fetching package products:", error);
      throw error;
    }
  },
};

// ==================== 拦截器注入 ====================

/**
 * 安装Mock拦截器
 * 在 main.js 中调用 installMockInterceptor()
 */
export function installMockInterceptor() {
  if (!MOCK_ENABLED) return;

  console.log("🌿 植物管理Mock数据已启用");

  // 保存原始请求方法
  const originalGet = uni.$u.http.get;
  const originalPost = uni.$u.http.post;
  const originalPut = uni.$u.http.put;
  const originalDelete = uni.$u.http.delete;
  const iotPaths = ["/iot/plants", "/iot/sensors", "/iot/disease", "/iot/shop"];
  // 重写GET请求
  uni.$u.http.get = function (url, config = {}) {
    if (iotPaths.some((path) => url.startsWith(path))) {
      return handleMockRequest("GET", url, config);
    }
    return originalGet.call(this, url, config);
  };

  // 重写POST请求
  uni.$u.http.post = function (url, data, config = {}) {
    if (iotPaths.some((path) => url.startsWith(path))) {
      return handleMockRequest("POST", url, { ...config, data });
    }
    return originalPost.call(this, url, data, config);
  };

  // 重写PUT请求
  uni.$u.http.put = function (url, data, config = {}) {
    if (iotPaths.some((path) => url.startsWith(path))) {
      return handleMockRequest("PUT", url, { ...config, data });
    }
    return originalPut.call(this, url, data, config);
  };

  // 重写DELETE请求
  uni.$u.http.delete = function (url, config = {}) {
    if (iotPaths.some((path) => url.startsWith(path))) {
      return handleMockRequest("DELETE", url, config);
    }
    return originalDelete.call(this, url, config);
  };
}

/**
 * 处理Mock请求
 */
async function handleMockRequest(method, url, config) {
  console.log(`🔄 Mock拦截: ${method} ${url}`);

  try {
    let result;
    console.log("请求参数:", config);
    // 路由匹配
    if (url === "/iot/plants/list") {
      result = await plantsMock.getUserPlants(config.params);
    } else if (url === "/iot/sensors/latestReading") {
      result = await plantsMock.getLatestReading(config.params);
    } else if (url === "/iot/sensors/threshold") {
      result = await plantsMock.getThreshold(config.params);
    } else if (url === "/iot/sensors/devices") {
      result = await plantsMock.getUserDevices(config.params);
    } else if (url === "/iot/sensors/deviceBinding") {
      result = await plantsMock.getDeviceBinding(config.params);
    } else if (url === "/iot/plants" && method === "POST") {
      result = await plantsMock.addPlant(config.data);
    } else if (url === "/iot/plants" && method === "PUT") {
      result = await plantsMock.updatePlant(config.data);
    } else if (url.match(/^\/iot\/plants\/\w+$/) && method === "DELETE") {
      const plantId = url.split("/").pop();
      result = await plantsMock.deletePlant(plantId);
    } else if (url.match(/^\/iot\/plants\/status\/\w+$/)) {
      console.log("获取植物状态ID:", url.split("/")[4]);
      const plantId = url.split("/")[4];
      result = await plantsMock.getPlantStatus(
        plantId,
        config.params.includeResolved
      );
    } else if (url === "/iot/plants/status" && method === "POST") {
      result = await plantsMock.addPlantStatus(config.data);
    } else if (
      url.match(/^\/iot\/plants\/status\/\w+\/resolve$/) &&
      method === "PUT"
    ) {
      const statusId = url.split("/")[4];
      result = await plantsMock.resolvePlantStatus(statusId);
    } else if (url === "/iot/plants/database") {
      result = await plantsMock.getPlantDatabase(config.params);
    } else if (url === "/iot/plants/search") {
      console.log("搜索关键词:", config.params.keyword);
      result = await plantsMock.searchPlants(config.params.keyword);
    } else if (url === "/iot/plants/databaseDetail") {
      result = await plantsMock.getPlantDatabaseById(config.params.plantId);
    } else if (url === "/iot/plants/recommended-products") {
      result = await plantsMock.getRecommendedProducts(config.params);
    } else if (url === "/iot/plants/service-packages") {
      result = await plantsMock.getServicePackages(config.params);
    } else if (url === "/iot/plants/care-records") {
      result = await plantsMock.getCareRecords(config.params);
    } else if (url === "/iot/disease/diseaseRecords") {
      result = await plantsMock.getDiseaseRecords(config.params);
    } else if (url === "/iot/sensors/allBindings") {
      result = await plantsMock.getPlantAllBindings(config.params);
    } else if (url === "/iot/sensors/deviceDetail") {
      result = await plantsMock.getDeviceById(config.params.device_id);
    } else if (url === "/iot/sensors/readingsStats") {
      const { device_id, hours } = config.params;
      result = await plantsMock.getReadingsStats(device_id, hours);
    } else if (url.match(/^\/iot\/plants\/\w+$/)) {
      console.log("获取植物ID:", url.split("/").pop());
      const plantId = url.split("/").pop();
      result = await plantsMock.getPlantDetail(plantId);
    } else if (url === "/iot/disease/analyzeAI") {
      result = await plantsMock.analyzeDiseaseWithAI();
    } else if (url === "/iot/disease/getPackageDetail") {
      result = await plantsMock.getPackageDetail(config.params.id);
    } else if (url === "/iot/disease/getPackageSteps") {
      result = await plantsMock.getPackageSteps(config.params.id);
    } else if (url === "/iot/disease/getPackageProducts") {
      result = await plantsMock.getPackageProducts(config.params.id);
    } else if (url === "/iot/disease/relatedProducts") {
      result = await plantsMock.getDiseaseRelatedProducts(
        config.data.disease_type
      );
    } else if (url === "/iot/disease/diseaseRecord") {
      result = await plantsMock.getDiseaseRecord(config.params.recordId);
    } else if (url === "/iot/disease/getDiseaseList") {
      result = await plantsMock.getDiseaseList(config.params);
    } else if (url === "/iot/disease/getDiseaseDetail") {
      result = await plantsMock.getDiseaseDetail(config.params.id);
    } else if (url === "/iot/disease/getPackagesByDisease") {
      result = await plantsMock.getPackagesByDisease(config.params.id);
    } else if (url === "/iot/shop/recommendedPlants") {
      result = await plantsMock.getRecommendedPlants(config.params);
    } else if (url === "/iot/shop/getProductCategories") {
      result = await plantsMock.getProductCategories(config.params);
    } else if (url === "/iot/shop/getAccessoryProducts") {
      const { categoryName, limit } = config.params;
      result = await plantsMock.getAccessoryProducts(categoryName, limit);
    } else if (url === "/iot/shop/cartCount") {
      result = await plantsMock.getCartCount(config.params);
    } else if (url === "/iot/shop/productsByPlant") {
      result = await plantsMock.getProductsByPlant(config.params.plantId);
    } else if (url === "/iot/shop/accessoryDetail") {
      result = await plantsMock.getAccessoryDetail(config.params.productId);
    } else if (url === "/iot/shop/accessorySpecifications") {
      result = await plantsMock.getAccessorySpecifications(
        config.params.productId
      );
    } else if (url === "/iot/shop/accessoryServicePackages") {
      result = await plantsMock.getAccessoryServicePackages();
    } else if (url === "/iot/shop/plantRelatedProducts") {
      const { plantId, limit } = config.params;
      result = await plantsMock.getPlantRelatedProducts(plantId, limit);
    } else if (url === "/iot/shop/cart") {
      result = await plantsMock.getCart();
    } else if (url === "/iot/shop/orders") {
      result = await plantsMock.getOrders(config.params.status);
    } else if (url === "/iot/shop/getOrder") {
      result = await plantsMock.getOrder(config.params.orderId);
    } else if (url === "/iot/shop/addresses") {
      result = await plantsMock.getAddresses(config.params);
    } else {
      // 未匹配的接口返回默认响应
      result = mockError("Mock接口未实现");
    }

    return result;
  } catch (error) {
    console.error("Mock请求错误:", error);
    return mockError(error.message || "Mock请求失败");
  }
}
