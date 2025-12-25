import { ref } from "vue";

const CACHE_KEY = "STORE_PRODUCTS_DATA_V1";

/**
 * 商品数据管理Hook
 * 包含加载、查找、分类筛选等功能
 */
export function useStoreProducts() {
  const products = ref([]);

  /**
   * 加载商品数据
   */
  const loadProducts = () => {
    try {
      const cached = uni.getStorageSync(CACHE_KEY);
      if (cached && cached.length > 0) {
        products.value = cached;
      } else {
        products.value = STORE_PRODUCTS;
        uni.setStorageSync(CACHE_KEY, STORE_PRODUCTS);
      }
      return products.value;
    } catch (e) {
      console.error("Failed to load store products", e);
      products.value = STORE_PRODUCTS;
      return products.value;
    }
  };

  /**
   * 根据商品ID查找商品
   * @param {string} id - 商品ID
   * @returns {object|null} 找到的商品对象或null
   */
  const findProductById = (id) => {
    if (products.value.length === 0) loadProducts();
    if (!id || !products.value || !Array.isArray(products.value)) {
      return null;
    }
    return products.value.find((product) => product.id === id) || null;
  };

  /**
   * 根据商品ID数组查找商品
   * @param {string} id - 商品ID
   * @returns {object|null} 找到的商品对象或null
   */
  const findProductByIds = (ids) => {
    if (products.value.length === 0) loadProducts();
    if (!ids || !products.value || !Array.isArray(products.value)) {
      return null;
    }
    return products.value.filter((product) => ids.includes(product.id)) || null;
  };

  /**
   * 根据商品名称查找商品
   * @param {string} name - 商品名称
   * @returns {object|null} 找到的商品对象或null
   */
  const findProductByName = (name) => {
    if (products.value.length === 0) loadProducts();
    if (!name || !products.value || !Array.isArray(products.value)) {
      return null;
    }
    return (
      products.value.find(
        (product) => product.name.includes(name) || name.includes(product.name)
      ) || null
    );
  };

  /**
   * 根据名称或ID查找商品（通用方法）
   * @param {string} nameOrId - 商品名称或ID
   * @returns {object|null} 找到的商品对象或null
   */
  const findProduct = (nameOrId) => {
    if (!nameOrId || !products.value || !Array.isArray(products.value)) {
      return null;
    }
    // 优先按ID查找，找不到再按名称查找
    return findProductById(nameOrId) || findProductByName(nameOrId);
  };

  /**
   * 根据分类筛选商品
   * @param {string} category - 商品分类 (all/device/plant/medicine/tool/soil)
   * @returns {Array} 筛选后的商品数组
   */
  const filterByCategory = (category) => {
    if (products.value.length === 0) loadProducts();
    if (!category || category === "all") return products.value;
    return products.value.filter((product) => product.category === category);
  };

  /**
   * 根据植物库ID查找关联商品
   * @param {string} libraryId - 植物库ID
   * @returns {object|null} 找到的植物商品或null
   */
  const findProductByLibraryId = (libraryId) => {
    if (products.value.length === 0) loadProducts();
    if (!libraryId) return null;
    return (
      products.value.find((product) => product.libraryId === libraryId) || null
    );
  };

  /**
   * 获取热销商品
   * @param {number} limit - 返回数量限制，默认10
   * @returns {Array} 按销量排序的商品数组
   */
  const getTopSelling = (limit = 10) => {
    if (products.value.length === 0) loadProducts();
    return [...products.value]
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, limit);
  };

  /**
   * 获取高评分商品
   * @param {number} minRating - 最低评分，默认4.8
   * @param {number} limit - 返回数量限制，默认10
   * @returns {Array} 筛选后的商品数组
   */
  const getHighRated = (minRating = 4.8, limit = 10) => {
    if (products.value.length === 0) loadProducts();
    return products.value
      .filter((product) => (product.rating || 0) >= minRating)
      .slice(0, limit);
  };

  /**
   * 搜索商品（支持名称、标签、详情搜索）
   * @param {string} keyword - 搜索关键词
   * @returns {Array} 匹配的商品数组
   */
  const searchProducts = (keyword) => {
    if (products.value.length === 0) loadProducts();
    if (!keyword) return products.value;

    const lowerKeyword = keyword.toLowerCase();
    return products.value.filter((product) => {
      return (
        product.name.toLowerCase().includes(lowerKeyword) ||
        (product.details &&
          product.details.toLowerCase().includes(lowerKeyword)) ||
        (product.tag && product.tag.toLowerCase().includes(lowerKeyword))
      );
    });
  };

  return {
    products,
    loadProducts,
    findProduct,
    findProductById,
    findProductByName,
    findProductByLibraryId,
    filterByCategory,
    getTopSelling,
    getHighRated,
    searchProducts,
    findProductByIds,
  };
}

// ==================== 静态商品数据 ====================
export const STORE_PRODUCTS = [
  /* --- 1. 智能硬件 --- */
  {
    id: "s100",
    category: "device",
    name: "SmartGreen V2 增强型传感器",
    price: 129,
    originalPrice: 159,
    image:
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=400&auto=format&fit=crop",
    rating: 5.0,
    sales: 1200,
    tag: "旗舰爆款",
    details:
      "搭载最新一代电化学传感器，支持土壤湿度、环境温湿度、光照、电导率(EC)监测。",
    specs: [
      { label: "连接方式", value: "蓝牙 5.2 / Zigbee" },
      { label: "防水等级", value: "IP67 全身防水" },
      { label: "续航时间", value: "365天" },
    ],
    usageSteps: [
      "开启手机蓝牙并确保定位权限已打开",
      "将传感器金属探针垂直插入盆土 2/3 深度，避免碰撞石块",
      "在 APP 首页点击'添加设备'进行搜索配对",
      "配对完成后在设备详情中绑定对应的植物品种以激活预警",
    ],
    precautions: [
      "探针忌长时间浸泡在纯水中，以免传感器失效",
      "更换电池后请确保底部密封圈安装到位，否则将失去防水能力",
      "请勿在极寒环境（-10℃以下）长期暴露",
    ],
  },
  {
    id: "s102",
    category: "device",
    name: "WiFi 智能网关 V2",
    price: 88,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    sales: 3500,
    tag: "远程必备",
    details: "让传感器数据实时上云，支持跨房间连接，覆盖半径达 15 米。",
    usageSteps: [
      "接入 Type-C 电源并插入插座",
      "等待指示灯蓝光闪烁，进入 APP 配对流程",
      "输入家庭 WiFi 密码完成组网",
      "将附近的蓝牙传感器添加至网关子设备列表即可实现远程监控",
    ],
    precautions: [
      "请避开大型金属遮挡物，以免信号大幅衰减",
      "建议安装在离地 1 米以上的开阔位置",
    ],
  },

  /* --- 2. 精品绿植 --- */
  {
    id: "p1",
    category: "plant",
    name: "白犀牛海芋 ( M-Size )",
    libraryId: "lib-p1",
    price: 268,
    image:
      "https://images.unsplash.com/photo-1620127252536-03bdfcf6d5c3?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    sales: 240,
    tag: "稀缺品种",
    details:
      "海芋界的'银色奇迹'。叶片质感坚硬如鳞片，银灰色的金属光泽赋予了它极高的艺术装饰价值。",
    usageSteps: [
      "收到后请放置在阴凉通风处缓苗 3-5 天，切忌直接暴晒",
      "使用透气性极佳的颗粒土（颗粒石占比建议 50% 以上）",
      "保持环境湿度在 70% 以上，干燥季节需使用加湿器",
      "环境温度低于 15℃ 时需严格控水，使其进入休眠",
    ],
    precautions: [
      "海芋全株汁液有微量毒性，请放置在儿童和宠物触碰不到的地方",
      "忌盆土长期积水，否则极易诱发根腐病",
    ],
  },
  {
    id: "p2",
    category: "plant",
    name: "北欧琴叶榕 ( 1.2m )",
    libraryId: "lib-p2",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    sales: 8500,
    tag: "人气王",
    details: "经典的阔叶植物，具有极强的耐阴性和空气净化能力。",
    usageSteps: [
      "放置在明亮散射光处，如窗边或阳台侧边",
      "盆土表面干透约 1/2 时进行浇水，直到盆底流出水为止",
      "定期用温湿抹布清洁巨大的叶面，有助于植物呼吸",
      "春季生长期建议每两周施用一次高氮水溶肥",
    ],
    precautions: [
      "严禁突然改变光照环境（如从阴暗处搬到烈日下），会导致叶片晒伤脱落",
      "对空调直吹非常敏感，应避开出风口",
    ],
  },
  {
    id: "p3",
    category: "plant",
    name: "北欧原生 橄榄树 ( L-Size )",
    libraryId: "lib-p3",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1615485737457-f07082c77813?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    sales: 600,
    tag: "中古风",
    details:
      "地中海风格的灵魂绿植。银绿色的叶片在阳光下闪烁，极具电影感的骨架形态。",
    usageSteps: [
      "橄榄树极度喜阳，必须摆放在全日照环境",
      "遵循'宁干勿湿'原则，土面下 3cm 干透后再浇水",
      "定期修剪交叉枝和过密枝，以保持其艺术化的骨架感",
    ],
    precautions: [
      "不耐阴，长期光照不足会导致严重掉叶",
      "冬季室温不宜过高，适当的低温（5-10℃）有利于翌年花芽分化",
    ],
  },

  /* --- 3. 药剂肥料 --- */
  {
    id: "s1",
    category: "medicine",
    name: "日本住友 小白药 (内吸型)",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1628608832049-563b72803893?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    sales: 5300,
    tag: "杀虫必备",
    usageSteps: [
      "每 10cm 盆径使用 1-2g 药剂",
      "均匀撒在盆土表面",
      "使用耙子轻轻划锄入土 1-2cm",
      "浇透水以利于药剂溶解并被根系内吸",
    ],
    precautions: [
      "本品为内吸杀虫剂，仅对取食汁液的害虫有效",
      "请务必密封保存在阴凉处，严禁儿童接触",
    ],
  },
  {
    id: "s6",
    category: "medicine",
    name: "广谱杀菌 多菌灵 (50g)",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    sales: 9200,
    tag: "根腐克星",
    usageSteps: [
      "日常预防：1g 兑水 1000ml 进行全株喷洒",
      "治疗烂根：1g 兑水 500ml 稀释后进行根部灌溉",
      "伤口处理：直接将药粉涂抹在修剪后的植物剪口处",
    ],
    precautions: ["不可与强碱性农药混用", "建议在傍晚或阴天使用，避免高温强光"],
  },
  {
    id: "s7",
    category: "medicine",
    name: "高活性 生根粉 (速效)",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1599591037488-82605663787c?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    sales: 8500,
    tag: "促根神器",
    usageSteps: [
      "扦插：1g 兑水 500ml，插穗浸泡 2 小时",
      "移栽：1g 兑水 1000ml 灌根，诱发新根萌发",
      "叶喷：1g 兑水 2000ml，增强植物抗性",
    ],
  },
  {
    id: "s8",
    category: "medicine",
    name: "螯合铁液 (黄叶转绿)",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1587334274328-641c50ce3f05?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    sales: 1500,
    tag: "补铁专用",
    usageSteps: [
      "针对新叶发黄但脉络保持绿色的'缺铁症'",
      "取 5ml 原液兑水 1000ml 稀释",
      "进行全株叶面喷施，正反面均需喷到",
      "每隔 10 天使用一次，连续使用 3 次",
    ],
    precautions: ["避开中午高温，以免烧叶"],
  },
  {
    id: "s9",
    category: "medicine",
    name: "高纯 磷酸二氢钾",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?q=80&w=400&auto=format&fit=crop",
    rating: 5.0,
    sales: 12000,
    tag: "促花保果",
    usageSteps: [
      "花期前一个月开始使用",
      "1g 兑水 1000ml 稀释",
      "每周进行一次叶面喷施或根部浇灌",
      "有助于茎干粗壮和花芽分化",
    ],
  },
  {
    id: "s10",
    category: "medicine",
    name: "速效 补氮水溶肥",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    sales: 3200,
    tag: "长叶专用",
    usageSteps: [
      "针对生长期缓慢、全株发黄的情况",
      "稀释比例 1:1000",
      "仅在生长期（春季、初夏）使用",
      "结合浇水同步进行",
    ],
  },

  /* --- 4. 工具及土壤 --- */
  {
    id: "t1",
    category: "tool",
    name: "纳米 细雾喷壶 (300ml)",
    price: 39,
    image:
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    sales: 5600,
    tag: "雾化极佳",
    usageSteps: [
      "注入清水或稀释后的肥料/药剂",
      "连续按压手柄以产生持续的超细水雾",
      "适合喷洒热带植物叶面以增加环境湿度",
    ],
  },
  {
    id: "t2",
    category: "tool",
    name: "日本原产 园艺剪",
    price: 188,
    image:
      "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?q=80&w=400&auto=format&fit=crop",
    rating: 5.0,
    sales: 890,
    tag: "专业之选",
    usageSteps: [
      "修剪残花：在花下第一对叶片处斜剪",
      "疏剪密枝：靠近主干基部平剪",
      "修根：剪除黑腐烂根",
    ],
    precautions: ["使用后请擦干汁液并涂油防锈", "刀刃极度锋利，严禁儿童玩耍"],
  },
  {
    id: "m1",
    category: "soil",
    name: "酸性营养土",
    price: 42,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01FshLl01eLBTIzNzpd_%21%214611686018427382206-0-item_pic.jpg_.png",
    rating: 4.7,
    sales: 3200,
    tag: "喜酸植物专用",
    usageSteps: [
      "专为栀子、茉莉、杜鹃等喜酸植物配制",
      "pH值5.5-6.5，含有硫磺粉及腐殖酸",
      "直接使用，无需额外调酸",
      "换盆时使用，可维持土壤酸性2-3个月",
    ],
    precautions: [
      "开封后请尽快使用，避免有效成分挥发",
      "不适合仙人掌、多肉等喜碱性或中性植物",
      "储存于阴凉干燥处，避免受潮结块",
    ],
  },
  {
    id: "m2",
    category: "soil",
    name: "轻质 颗粒土调配包",
    price: 38,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01TZpCSw25xC0o6V2As_%21%212214255127592.jpg_.png",
    rating: 4.9,
    sales: 4500,
    tag: "多肉专用",
    usageSteps: [
      "包含麦饭石、火山岩、珍珠岩等",
      "适合与泥炭土 7:3 或 8:2 混合使用",
      "提供绝佳的排水性和透气性，防止闷根",
    ],
    precautions: [
      "珍珠岩粉尘较多，建议混合时佩戴口罩",
      "颗粒土不保水，需适当增加浇水频率",
      "不适合对排水性要求不高的水生或湿生植物",
    ],
  },
  {
    id: "m3",
    category: "soil",
    name: "有机营养土（通用型）",
    price: 35,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01ft0Q0X26eFGiOkDiw_%21%213384077686.jpg_.png",
    rating: 4.8,
    sales: 6800,
    tag: "通用",
    usageSteps: [
      "富含腐殖质、蚯蚓粪、椰糠",
      "适合绝大多数室内观叶植物",
      "换盆时直接使用，无需混合",
      "肥效温和，可持续3-4个月",
    ],
    precautions: [
      "可能含有少量未完全腐熟的有机质，敏感植物建议先少量试用",
      "本身含有养分，换盆后1个月内无需额外施肥",
      "避免长期积水，以免产生异味",
    ],
  },
  {
    id: "tp-1",
    category: "tool",
    name: "园艺修枝剪",
    price: 28,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01Y31tSZ1xpqkTouOO7_%21%212218637136493.jpg_.png",
    rating: 4.8,
    sales: 2100,
    tag: "必备工具",
    usageSteps: [
      "不锈钢材质，防锈耐用",
      "使用前后用酒精擦拭消毒",
      "适合修剪直径2cm以下的枝条和根系",
    ],
    precautions: [
      "请勿用于修剪铁丝、塑料等硬物，以免损坏刃口",
      "使用后擦干水分，涂抹少量润滑油防锈",
      "放在儿童无法触及的地方",
    ],
  },
  {
    id: "tp-2",
    category: "medicine",
    name: "多菌灵粉剂（广谱杀菌）",
    price: 12.5,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01UhnR3A1cg8IQjQ53q_%21%210-item_pic.jpg_.png",
    rating: 4.6,
    sales: 8900,
    tag: "急救必备",
    usageSteps: [
      "50g装，可多次使用",
      "灌根：1g兑水1升，浇透土壤",
      "浸泡：2g兑水1升，浸泡根系15-30分钟",
      "喷雾：1g兑水1.5升，喷洒病害部位",
    ],
    precautions: [
      "不可与强碱性农药混用",
      "建议在傍晚或阴天使用，避免高温强光",
      "连续使用易产生抗药性，一个生长季勿超过3次",
      "对鱼类有毒，请勿污染水源",
    ],
  },
  {
    id: "tp-3",
    category: "medicine",
    name: "强力生根粉",
    price: 15.8,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01mZa7XQ1w4qFGeKpgZ_%21%210-item_pic.jpg_.png",
    rating: 4.7,
    sales: 5400,
    tag: "促根生长",
    usageSteps: [
      "含萘乙酸、吲哚丁酸等植物激素",
      "扦插：蘸取粉末后插入基质",
      "移栽/救根：1g兑水2升，浇灌根系",
      "每月使用1次，促进毛细根发育",
    ],
    precautions: [
      "严格按推荐浓度使用，过量会抑制生长",
      "对已经腐烂的根系无效，需先修剪干净",
      "现配现用，稀释后不宜久存",
      "避免接触皮肤和眼睛",
    ],
  },
  {
    id: "tp-4",
    category: "fertilizer",
    name: "速效尿素颗粒（高氮）",
    price: 9.9,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01jMM5Rj1e07FlOKOYm_%21%212212531923808.jpg_.png",
    rating: 4.5,
    sales: 3800,
    tag: "快速复绿",
    usageSteps: [
      "46%高氮含量，50g装",
      "急救灌根：5-10粒溶于1升水，浇灌盆土",
      "切勿直接撒施于土表，避免烧苗",
      "使用后7-10天可见叶片明显转绿",
    ],
    precautions: [
      "高温季节（>30℃）需加倍稀释，或暂停使用",
      "勿与碱性肥料（如草木灰）混合使用",
      "植物休眠期或虚弱时禁止使用",
      "远离火源，密封防潮",
    ],
  },
  {
    id: "tp-5",
    category: "fertilizer",
    name: "通用型液体肥（N-P-K 20-20-20）",
    price: 24.9,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01IrwppA1eDOoGOU68w_%21%213188353837.jpg_.png",
    rating: 4.8,
    sales: 7200,
    tag: "均衡营养",
    usageSteps: [
      "500ml瓶装，含微量元素",
      "生长期：1瓶盖兑水2升，每周一次",
      "叶面喷施：稀释1000倍，喷于叶背",
      "冬季休眠期：每月一次或停用",
    ],
    precautions: [
      "“薄肥勤施”，切勿浓度过高",
      "叶面喷施避免在正午强光下进行",
      "施肥前确保土壤湿润，避免烧根",
      "摇匀后使用，底部沉淀属正常现象",
    ],
  },
  {
    id: "tp-6",
    category: "soil",
    name: "有机营养土",
    price: 18,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01ft0Q0X26eFGiOkDiw_%21%213384077686.jpg_.png",
    rating: 4.7,
    sales: 5600,
    tag: "换盆必备",
    usageSteps: [
      "5L装，含腐熟牛粪、蚯蚓粪、椰糠",
      "直接用于换盆，或与园土1:1混合",
      "提供基础肥力，减少换盆应激",
    ],
    precautions: [
      "有轻微天然有机质气味，属正常现象",
      "不适合单独用于播种育苗（需混合细沙）",
      "袋内可能有少量小飞虫，建议阳光下暴晒后使用",
    ],
  },
  {
    id: "tp-7",
    category: "fertilizer",
    name: "螯合铁溶液（EDTA-Fe）",
    price: 22,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01t9U2pU1ey766N6rLz_%21%2157583939.png_.png",
    rating: 4.7,
    sales: 2900,
    tag: "黄叶克星",
    usageSteps: [
      "100ml滴瓶装，高效吸收",
      "叶面喷施：10滴兑水500ml，喷于新叶",
      "灌根：20滴兑水1升，每月一次",
      "适合栀子、茉莉、杜鹃等喜酸植物",
    ],
    precautions: [
      "对由其他原因（如烂根、红蜘蛛）引起的黄叶无效",
      "与磷肥混用时可能产生沉淀，建议分开使用",
      "溶液呈淡黄色，避免污染浅色衣物或台面",
    ],
  },
  {
    id: "tp-8",
    category: "soil",
    name: "酸性营养土",
    price: 16,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01FshLl01eLBTIzNzpd_%21%214611686018427382206-0-item_pic.jpg_.png",
    rating: 4.6,
    sales: 3100,
    tag: "调酸专用",
    usageSteps: [
      "5L小包装，方便使用",
      "pH值5.5-6.0，含硫磺和腐殖酸",
      "换盆时替换部分旧土，或全盆更换",
      "有效改善碱性土壤导致的缺铁黄化",
    ],
    precautions: [
      "仅用于局部土壤改良，不能显著改变大面积或户外土壤pH",
      "使用后初期浇水可能呈淡黄色，属正常现象",
      "与石灰、草木灰等碱性物质接触会失效",
    ],
  },
  {
    id: "tp-9",
    category: "tool",
    name: "数显pH测试笔",
    price: 39.9,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01MJbwqM1TbFYKdwi8t_%21%212210805122400.jpg_.png",
    rating: 4.5,
    sales: 1200,
    tag: "土壤检测",
    usageSteps: [
      "一键校准，数显结果",
      "测试土壤：将探头插入湿润土中读数",
      "测试水质：直接插入水中读数",
      "使用后清洗探头，保持干燥",
    ],
    precautions: [
      "切勿将整个笔身浸入水中",
      "长期不用时请取出电池",
      "定期使用标准缓冲液校准（pH4.0/7.0）以保证精度",
      "探头玻璃泡脆弱，避免碰撞",
    ],
  },
  {
    id: "tp-10",
    category: "fertilizer",
    name: "食品级硫酸镁（泻盐）",
    price: 8.5,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01DdgHm41JcUZvjTlfy_%21%212164601049-0-picasso.jpg_.png",
    rating: 4.6,
    sales: 2300,
    tag: "老叶复绿",
    usageSteps: [
      "100g瓶装，高纯度",
      "叶面喷施：5g兑水1升，喷于老叶背面",
      "灌根：10g兑水2升，每月一次",
      "快速纠正缺镁引起的黄化",
    ],
    precautions: [
      "对缺氮、缺铁等其他原因引起的黄叶无效",
      "极易溶于水，需密封防潮",
      "过量使用可能导致土壤盐分累积",
      "食用级纯度，但请勿误食",
    ],
  },
  {
    id: "tp-11",
    category: "fertilizer",
    name: "钙镁磷复合肥（缓释型）",
    price: 18.5,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01t3ztLo1e07GjFwbdH_%21%212212531923808.jpg_.png",
    rating: 4.7,
    sales: 1800,
    tag: "长效补充",
    usageSteps: [
      "250g袋装，颗粒缓释",
      "基肥：换盆时与土壤混合",
      "追肥：沿盆边浅埋5-10克，覆土浇水",
      "肥效持续2-3个月，预防缺镁缺钙",
    ],
    precautions: [
      "碱性肥料，不适合喜酸植物频繁使用",
      "缓释肥效，切勿过量，以免后期盐害",
      "埋施后需覆土并浇水，避免裸露在表面",
      "与硫酸铵、尿素等酸性肥料混合会降低肥效",
    ],
  },
  {
    id: "tp-12",
    category: "tool",
    name: "压力式喷雾喷壶",
    price: 15.9,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01ByhYsC22S6Itu8C5J_%21%212219468497118.jpg_.png",
    rating: 4.8,
    sales: 4500,
    tag: "叶面施肥",
    usageSteps: [
      "500ml容量，可调雾化",
      "叶面施肥：均匀喷洒至叶片滴水",
      "加湿：日常为植物喷雾增加湿度",
      "使用后清洗壶内，防止堵塞",
    ],
    precautions: [
      "请勿装入热水（>50℃）或强腐蚀性液体",
      "加压时请勿将喷嘴对准人、动物或电器",
      "长期存放请排空内部液体并放松压杆",
      "避免阳光直射和高温环境，以防塑料老化",
    ],
  },
  {
    id: "tp-13",
    category: "medicine",
    name: "苯醚甲环唑悬浮剂（治疗型）",
    price: 25,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01Fb8iU71EF4AALq7b3_%21%214611686018427382129-0-item_pic.jpg_.png",
    rating: 4.7,
    sales: 3300,
    tag: "内吸治疗",
    usageSteps: [
      "10ml小包装，精准用量",
      "治疗喷施：1ml兑水1.5-2升，全株均匀喷雾",
      "重点喷洒叶片背面及病害部位",
      "间隔7-10天使用一次，连续不超过3次",
    ],
    precautions: [
      "具有内吸性，请在病害初期或中期使用效果最佳",
      "对蜜蜂、鱼类等水生生物有毒，室外使用需注意",
      "与其他作用机制的杀菌剂轮换使用，避免产生抗性",
      "现配现用，充分摇匀",
    ],
  },
  {
    id: "tp-14",
    category: "medicine",
    name: "代森锰锌可湿性粉剂（保护型）",
    price: 14.5,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/product/O1CN01bAqqGa2A0B58jKFty_%21%212214711608140-0-picasso.jpg_.png",
    rating: 4.8,
    sales: 5100,
    tag: "广谱预防",
    usageSteps: [
      "30g袋装，经济实惠",
      "预防喷施：1g兑水1升，全株喷雾",
      "雨季或高湿季节来临前使用",
      "保护期一般为7-10天",
    ],
    precautions: [
      "为保护性杀菌剂，应在病害发生前或初期使用",
      "药液需均匀覆盖叶片正反面，形成保护膜",
      "不可与铜制剂或碱性农药混用",
      "对皮肤有轻微刺激性，操作时建议佩戴手套",
    ],
  },
];

// 商品分类配置
export const PRODUCT_CATEGORIES = [
  { id: "all", label: "全部", icon: "icon-lucide-layers" },
  { id: "plant", label: "精品绿植", icon: "icon-lucide-sprout" },
  { id: "device", label: "智能硬件", icon: "icon-lucide-cpu" },
  { id: "medicine", label: "药剂肥料", icon: "icon-lucide-flask-conical" },
  { id: "tool", label: "园艺工具", icon: "icon-lucide-scissors" },
  { id: "soil", label: "配方土壤", icon: "icon-lucide-droplets" },
];
