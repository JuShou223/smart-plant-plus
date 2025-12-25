import { ref } from "vue";

const CACHE_KEY = "PLANT_DISEASES_DATA_V1";
/**
 * 植物病虫害数据管理Hook
 * 包含加载、查找、分类筛选等功能
 */
export function usePlantDiseases() {
  const diseases = ref([]);

  /**
   * 加载病虫害数据
   */
  const loadDiseases = () => {
    try {
      const cached = uni.getStorageSync(CACHE_KEY);
      if (cached && cached.length > 0) {
        diseases.value = cached;
      } else {
        diseases.value = PLANT_DISEASES;
        uni.setStorageSync(CACHE_KEY, PLANT_DISEASES);
      }
      return diseases.value;
    } catch (e) {
      console.error("Failed to load plant diseases", e);
      diseases.value = PLANT_DISEASES;
      return diseases.value;
    }
  };

  /**
   * 根据病虫害ID查找
   * @param {string} id - 病虫害ID
   * @returns {object|null} 找到的病虫害对象或null
   */
  const findDiseaseById = (id) => {
    if (diseases.value.length === 0) loadDiseases();
    if (!id || !diseases.value || !Array.isArray(diseases.value)) {
      return null;
    }
    return diseases.value.find((disease) => disease.id === id) || null;
  };

  /**
   * 根据病虫害名称查找
   * @param {string} name - 病虫害名称（支持中文名或英文别名）
   * @returns {object|null} 找到的病虫害对象或null
   */
  const findDiseaseByName = (name) => {
    if (diseases.value.length === 0) loadDiseases();
    if (!name || !diseases.value || !Array.isArray(diseases.value)) {
      return null;
    }
    return (
      diseases.value.find(
        (disease) =>
          disease.name.includes(name) ||
          name.includes(disease.name) ||
          disease.alias.toLowerCase().includes(name.toLowerCase())
      ) || null
    );
  };

  /**
   * 根据名称或ID查找病虫害（通用方法）
   * @param {string} nameOrId - 病虫害名称或ID
   * @returns {object|null} 找到的病虫害对象或null
   */
  const findDisease = (nameOrId) => {
    if (!nameOrId || !diseases.value || !Array.isArray(diseases.value)) {
      return null;
    }
    // 优先按ID查找，找不到再按名称查找
    return findDiseaseById(nameOrId) || findDiseaseByName(nameOrId);
  };

  /**
   * 根据类型筛选病虫害
   * @param {string} type - 病虫害类型 (all/pest/fungus/environment)
   * @returns {Array} 筛选后的病虫害数组
   */
  const filterByType = (type) => {
    if (diseases.value.length === 0) loadDiseases();
    if (!type || type === "all") return diseases.value;
    return diseases.value.filter((disease) => disease.type === type);
  };

  /**
   * 根据严重程度筛选病虫害
   * @param {string} severity - 严重程度 (low/medium/high)
   * @returns {Array} 筛选后的病虫害数组
   */
  const filterBySeverity = (severity) => {
    if (diseases.value.length === 0) loadDiseases();
    if (!severity) return diseases.value;
    return diseases.value.filter((disease) => disease.severity === severity);
  };

  /**
   * 根据症状搜索病虫害
   * @param {string} symptom - 症状关键词
   * @returns {Array} 匹配的病虫害数组
   */
  const searchBySymptom = (symptom) => {
    if (diseases.value.length === 0) loadDiseases();
    if (!symptom) return diseases.value;

    const lowerSymptom = symptom.toLowerCase();
    return diseases.value.filter((disease) =>
      disease.symptoms.some((s) => s.toLowerCase().includes(lowerSymptom))
    );
  };

  /**
   * 全文搜索病虫害
   * @param {string} keyword - 搜索关键词
   * @returns {Array} 匹配的病虫害数组
   */
  const searchDiseases = (keyword) => {
    if (diseases.value.length === 0) loadDiseases();
    if (!keyword) return diseases.value;

    const lowerKeyword = keyword.toLowerCase();
    return diseases.value.filter((disease) => {
      return (
        disease.name.toLowerCase().includes(lowerKeyword) ||
        disease.alias.toLowerCase().includes(lowerKeyword) ||
        disease.symptoms.some((s) => s.toLowerCase().includes(lowerKeyword)) ||
        disease.treatment.some((t) => t.toLowerCase().includes(lowerKeyword)) ||
        (disease.prevention &&
          disease.prevention.toLowerCase().includes(lowerKeyword))
      );
    });
  };

  /**
   * 获取有治疗套装的病虫害
   * @returns {Array} 包含治疗套装的病虫害数组
   */
  const getDiseasesWithBundle = () => {
    if (diseases.value.length === 0) loadDiseases();
    return diseases.value.filter((disease) => disease.bundle);
  };

  /**
   * 根据套装ID查找病虫害
   * @param {string} bundleId - 套装ID
   * @returns {object|null} 找到的病虫害对象或null
   */
  const findDiseaseByBundleId = (bundleId) => {
    if (diseases.value.length === 0) loadDiseases();
    if (!bundleId) return null;
    return (
      diseases.value.find((disease) => disease.bundle?.id === bundleId) || null
    );
  };

  return {
    diseases,
    loadDiseases,
    findDisease,
    findDiseaseById,
    findDiseaseByName,
    filterByType,
    filterBySeverity,
    searchBySymptom,
    searchDiseases,
    getDiseasesWithBundle,
    findDiseaseByBundleId,
  };
}

// ==================== 静态病虫害数据 ====================
export const PLANT_DISEASES = [
  {
    id: "d1",
    name: "根腐病",
    alias: "Root Rot",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/u%3D2877563340%2C2181624480%26fm%3D253%26app%3D138%26f%3DJPEG%20%281%29.jpeg",
    type: "fungus",
    severity: "high",
    symptoms: [
      "叶片发黄、枯萎",
      "根部发黑、腐烂",
      "植物生长停滞",
      "土壤有霉味",
    ],
    treatment: [
      "立即停止浇水",
      "剪除腐烂根系",
      "更换透气新土",
      "使用多菌灵灌根",
    ],
    prevention: "控制浇水频率，确保盆底排水良好，避免土壤长期积水。",
    bundle: {
      id: "tb-1",
      name: "根腐病急救包",
      description: "针对烂根的一站式解决方案，含修剪、杀菌与促根产品。",
      price: 39.9,
      originalPrice: 55,
      image:
        "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/u%3D2877563340%2C2181624480%26fm%3D253%26app%3D138%26f%3DJPEG%20%281%29.jpeg",
      products: [
        {
          id: "tp-1",
          name: "园艺修枝剪",
          price: 15,
          image:
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=200&auto=format&fit=crop",
          description: "不锈钢消毒剪刀",
        },
        {
          id: "tp-2",
          name: "多菌灵粉剂",
          price: 9.9,
          image:
            "https://images.unsplash.com/photo-1628608832049-563b72803893?q=80&w=200&auto=format&fit=crop",
          description: "50g 强效杀菌",
        },
        {
          id: "tp-3",
          name: "生根粉",
          price: 12,
          image:
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop",
          description: "快速恢复根系",
        },
      ],
      schedule: [
        {
          day: "第1天（手术日）",
          title: "脱盆检查与清创手术",
          description:
            "1. 停水脱盆：提前几天停止浇水，让土壤变干，便于脱盆且减少伤根。轻轻拍打盆壁，取出整个土坨。\n2. 冲洗检视：用水流轻柔冲掉旧土，完全暴露根系。健康根为白色或淡黄色，有韧性；腐烂根为黑色、褐色，一捏就碎，有腐臭味。\n3. 彻底清创：用消毒过的剪刀（可用酒精擦拭或火烧），毫不留情地剪除所有腐烂、发黑、软烂的根系，直至露出健康的切口组织。少量多次修剪，避免错剪。\n4. 药剂消毒：将多菌灵按说明书配制成溶液，将修剪后的根系浸泡其中15-30分钟。",
          productsUsed: ["tp-1", "tp-2"], // 修枝剪、多菌灵
        },
        {
          day: "第1-2天（晾根关键期）",
          title: "伤口晾干",
          description:
            "这是决定成败的关键一步，极易被忽略！\n将消毒后的植株取出，置于阴凉、通风、无直射光的地方，摊开根系晾干伤口。目标是让所有修剪切口形成一层干燥的保护膜（愈伤组织）。根据湿度和伤口大小，通常需要24-48小时。用手触摸切口，感觉干燥不粘手即可。切勿着急上盆！",
          productsUsed: [], // 无产品，但至关重要
        },
        {
          day: "第3天（重植日）",
          title: "换盆与促根准备",
          description:
            "1. 准备新盆土：使用全新的、疏松透气的土壤（如多肉专用土、混合大量珍珠岩/蛭石的营养土）。花盆必须有底孔，最好也是新的或经消毒的。\n2. 上盆：在盆底垫一层陶粒或碎瓦片利于排水。放入部分新土，将植株扶正，舒展根系，然后填满土，轻轻压实。不要立即浇水！（此为“潮土上盆法”：土壤提前拌至微微湿润，手握成团，松手即散的状态）。\n3. 定植：将盆栽放在与之前“晾根”相同的阴凉通风处。",
          productsUsed: [], // 或可加入“新营养土”作为产品
        },
        {
          day: "第4-14天（危重监护期）",
          title: "禁水观察与诱发新根",
          description:
            "1. 严格控水：上盆后至少一周内不要浇水！此时无健康根系吸收水分，浇水必烂。保持土壤处于“潮土”状态即可。\n2. 首次促根：大约在上盆后第7天左右，如果盆土已完全干透，可沿盆边极其缓慢地浇入少量（约50-100ml）兑有生根粉的水溶液，目的是诱导根系向有水处生长。\n3. 环境管理：保持明亮散射光，绝对避免暴晒。保持良好通风。\n4. 核心观察：此阶段叶片可能持续萎蔫、发黄甚至掉落，这是植株的“断尾求生”，将养分和水分优先供给存活部分。只要茎秆没有持续变黑变软，就有希望。",
          productsUsed: ["tp-3"], // 生根粉
        },
        {
          day: "第15-30天（缓慢恢复期）",
          title: "逐步恢复养护",
          description:
            "1. 确认存活：轻轻晃动植株，若感觉有抓土力，或发现顶芽有萌动迹象（哪怕只是一点点变绿），说明新根已开始生长。\n2. 逐步增加供水：确认有新根后，可开始逐步、缓慢地增加浇水量，但仍要遵循“干透浇透”的原则，浇水间隔要比健康植株长。\n3. 严禁施肥：在新根系统建立前（至少1-2个月内），绝对不要施加任何肥料，以免烧根。\n4. 耐心等待：植物恢复生机是一个漫长的过程，可能需要数月才能重新枝繁叶茂。",
          productsUsed: [],
        },
        {
          day: "第31天及以后",
          title: "复盘与预防",
          description:
            "1. 复盘原因：成功救活后，务必反思导致烂根的原因——是浇水过频、盆土板结、花盆无孔，还是环境不通风？从根源上改变养护习惯。\n2. 转入正常养护：待植株明显恢复生长后，可开始施用极其稀薄的肥料，并逐渐增加光照。\n3. 记住教训：对于多数室内植物，“宁干勿湿”是黄金法则。浇水前，务必用手指探入土壤2-3厘米深处判断干湿。",
          productsUsed: [],
        },
      ],
    },
  },
  {
    id: "d7",
    name: "缺氮症",
    alias: "Nitrogen Deficiency",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/disease/ChatGPT%20Image%202025%E5%B9%B412%E6%9C%8823%E6%97%A5%2020_10_00.png",
    type: "environment",
    severity: "medium",
    symptoms: [
      "整体叶片均匀失绿发黄",
      "从老叶开始黄化",
      "新生叶片变小变薄",
      "植株生长缓慢停滞",
      "茎秆细弱",
    ],
    treatment: [
      "施用速效氮肥（如尿素溶液）",
      "叶面喷施稀释的液体肥",
      "更换富含有机质的新土",
      "定期补充缓释肥",
    ],
    prevention:
      "生长季节每月补充一次稀薄氮肥，定期换盆更新土壤，使用含氮的通用型观叶植物肥料。",
    bundle: {
      id: "tb-2",
      name: "营养失衡急救包（缺氮型）",
      description: "针对叶片黄化、生长停滞的氮元素补充方案。",
      image:
        "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/disease/ChatGPT%20Image%202025%E5%B9%B412%E6%9C%8823%E6%97%A5%2020_10_00.png",
      price: 32.9,
      originalPrice: 45,
      products: [
        {
          id: "tp-4",
          name: "速效尿素颗粒",
          price: 8.9,
          image:
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop",
          description: "50g 高纯度氮肥",
        },
        {
          id: "tp-5",
          name: "通用液体肥",
          price: 18,
          image:
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop",
          description: "500ml 均衡营养",
        },
        {
          id: "tp-6",
          name: "有机营养土",
          price: 12,
          image:
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=200&auto=format&fit=crop",
          description: "5L 富含腐殖质",
        },
      ],
      schedule: [
        {
          day: "第1天",
          title: "紧急诊断与速效补氮",
          description:
            "确认症状：全株叶片（尤其老叶）均匀失绿发黄，生长缓慢。立即采取快速补氮措施：将5-10粒尿素（或按说明书）溶解于1升水中，沿盆边缓慢浇灌，确保土壤均匀湿润。避免浇到叶片和茎基部。记录处理前的植株状态（可拍照）。",
          productsUsed: ["tp-4"], // 速效尿素颗粒
        },
        {
          day: "第2-5天（快速吸收与转运期）",
          title: "环境优化与初步观察",
          description:
            "1. 环境管理：将植物移至光线充足但无烈日直射的位置（如明亮的散射光下），以最大化光合效率，促进氮的利用。\n2. 水分控制：保持土壤微湿但绝不积水。\n3. 初步观察：此阶段根系开始吸收氮素并向顶部转运，外观上可能无明显变化，但植物内部代谢正在加速。注意观察叶片是否停止进一步黄化。",
          productsUsed: [],
        },
        {
          day: "第6-10天（生长响应关键期）",
          title: "评估效果与叶面辅助",
          description:
            "1. 核心评估：仔细观察植株顶端的生长点和最新长出的小叶。若补氮有效，应能观察到：新生叶片颜色变得更绿（不再是黄绿色），且生长点开始恢复活力（有新的嫩芽或叶片开始膨大）。\n2. 辅助措施（视情况而定）：如果新生叶片改善不明显，可进行一次叶面补充：将通用液体肥稀释1000倍，喷洒叶片正反面。叶面施肥能快速提供养分，绕过可能受损的根系。\n3. 注意：切勿在此时再次进行土壤追肥，以免造成肥害。",
          productsUsed: ["tp-5"], // 通用液体肥（仅在需要时使用）
        },
        {
          day: "第11-20天（恢复巩固期）",
          title: "均衡施肥与状态巩固",
          description:
            "1. 第二次土壤施肥：此时植物已进入恢复轨道。使用稀释的通用液体肥（氮磷钾均衡）进行灌根，为全面恢复提供所有必需元素。\n2. 持续观察：老叶的黄色可能不会完全恢复绿色，这是正常现象。重点应放在所有新生叶片是否健康、深绿、生长正常上。\n3. 根系检查（可选）：如果植株恢复仍然很慢，检查是否同时存在烂根或土壤板结问题，这两者会严重影响养分吸收。",
          productsUsed: ["tp-5"], // 通用液体肥
        },
        {
          day: "第21天及以后",
          title: "建立长期养护方案",
          description:
            "1. 转入预防性养护：缺氮通常是长期营养不良的体现。从此开始，在植物生长季（春、夏、秋），每2-4周使用一次稀释的通用液体肥。\n2. 考虑换盆：如果超过1年未换盆，应在下一个适合换盆的季节（通常是春季），更换新的、肥沃的营养土，这是预防缺素最根本的方法。\n3. 养护口诀：“薄肥勤施，胜过一次猛药”。",
          productsUsed: ["tp-5", "tp-6"], // 通用液体肥、有机营养土（为未来换盆准备）
        },
      ],
    },
  },
  {
    id: "d8",
    name: "缺铁症",
    alias: "Iron Deficiency",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/disease/ChatGPT%20Image%202025%E5%B9%B412%E6%9C%8823%E6%97%A5%2020_08_04.png",
    type: "environment",
    severity: "medium",
    symptoms: [
      "新叶叶肉变黄或变白",
      "叶脉保持深绿色（网状脉络）",
      "严重时新叶全白",
      "生长点可能坏死",
    ],
    treatment: [
      "叶面喷施螯合铁或硫酸亚铁溶液",
      "改良土壤酸碱度（施用硫磺粉或腐殖酸）",
      "避免使用碱性水（如自来水）直接浇灌",
    ],
    prevention:
      "定期施用酸性肥料（如硫酸亚铁），对喜酸植物使用雨水或酸化水浇灌，每年更换酸性营养土。",
    bundle: {
      id: "tb-3",
      name: "缺铁黄化专用救治包",
      description: "针对新叶网脉状黄化的铁元素补充与土壤改良方案。",
      price: 36.9,
      originalPrice: 50,
      image:
        "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/disease/ChatGPT%20Image%202025%E5%B9%B412%E6%9C%8823%E6%97%A5%2020_08_04.png",
      products: [
        {
          id: "tp-7",
          name: "螯合铁溶液",
          price: 15,
          image:
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop",
          description: "100ml 高效吸收",
        },
        {
          id: "tp-8",
          name: "酸性营养土",
          price: 14,
          image:
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=200&auto=format&fit=crop",
          description: "5L 喜酸植物专用",
        },
        {
          id: "tp-9",
          name: "pH测试笔",
          price: 9.9,
          image:
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop",
          description: "检测土壤酸碱度",
        },
      ],
      schedule: [
        {
          day: "第1天",
          title: "诊断与应急处理",
          description:
            "确认症状为缺铁（新叶叶脉绿、叶肉黄）。使用pH试纸检测土壤和浇水用水的酸碱度。立即进行第一次叶面喷施：将螯合铁稀释1000倍，均匀喷洒于新生黄叶的正反面，直至滴水。",
          productsUsed: ["tp-7", "tp-9"],
        },
        {
          day: "第2-7天（关键观察期）",
          title: "等待与观察",
          description:
            "停止任何其他肥料施用。将植物置于光线明亮但无直射光处。保持土壤正常湿润。重点观察：叶面喷施后3-5天，新生黄叶的叶肉是否有开始转绿的迹象？",
          productsUsed: [],
        },
        {
          day: "第8-10天",
          title: "评估与巩固",
          description:
            "根据观察结果决定：1) 若叶色明显改善：说明叶面补铁有效，可进行第二次叶面喷施（同样浓度）。2) 若改善不明显且土壤pH>7：说明土壤碱化严重，需用螯合铁溶液灌根（按说明书稀释），或考虑更换部分酸性营养土。",
          productsUsed: ["tp-7", "tp-8"], // 根据情况选择使用
        },
        {
          day: "第14-30天（长期调整期）",
          title: "土壤改良与预防",
          description:
            "1) 每月一次用螯合铁或硫酸亚铁稀释液灌根，逐步改良土壤。2) 调整浇水习惯：尽量使用雨水、晾晒过的自来水或添加了少量醋/柠檬酸的水（将pH调到6左右）浇灌。3) 等待新生叶片完全恢复正常颜色，此过程可能需要1-2个月。",
          productsUsed: ["tp-7"],
        },
      ],
    },
  },
  {
    id: "d9",
    name: "缺镁症",
    alias: "Magnesium Deficiency",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/disease/ChatGPT%20Image%202025%E5%B9%B412%E6%9C%8823%E6%97%A5%2020_06_02.png",
    type: "environment",
    severity: "low",
    symptoms: [
      "老叶叶肉变黄",
      "叶脉及附近保持绿色（鱼骨状）",
      "严重时叶片黄化脱落",
      "症状从植株下部向上蔓延",
    ],
    treatment: [
      "叶面喷施硫酸镁（泻盐）溶液",
      "土施钙镁磷肥或含镁的缓释肥",
      "改善土壤排水，避免钾肥过量拮抗镁吸收",
    ],
    prevention:
      "定期施用含镁的均衡肥料，避免长期单一使用高钾肥，每年换盆补充新土。",
    bundle: {
      id: "tb-4",
      name: "镁元素补充包",
      description: "针对老叶斑驳黄化的镁元素快速补充方案。",
      price: 28.9,
      originalPrice: 40,
      image:
        "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/disease/ChatGPT%20Image%202025%E5%B9%B412%E6%9C%8823%E6%97%A5%2020_06_02.png",
      products: [
        {
          id: "tp-10",
          name: "硫酸镁（泻盐）",
          price: 6.9,
          image:
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop",
          description: "100g 食品级",
        },
        {
          id: "tp-11",
          name: "钙镁磷复合肥",
          price: 16,
          image:
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=200&auto=format&fit=crop",
          description: "250g 缓释型",
        },
        {
          id: "tp-12",
          name: "喷壶",
          price: 8,
          image:
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop",
          description: "500ml 压力喷壶",
        },
      ],
      schedule: [
        {
          day: "第1天",
          title: "确认症状与快速叶面补充",
          description:
            "1. 确诊：确认症状为典型缺镁——老叶叶肉变黄，叶脉及附近保持绿色（“鱼骨状”或“圣诞树”图案），且从植株下部开始向上蔓延。\n2. 紧急处理：立即进行叶面喷施。将5克硫酸镁（泻盐）溶于1升温水中，充分溶解后冷却至室温。使用喷壶对出现症状的老叶叶片背面进行细致、均匀的喷雾，直至叶面布满细密水珠但不滴落。镁主要通过叶背气孔吸收，因此喷叶背效果最佳。\n3. 记录：拍照记录处理前最典型的叶片状态。",
          productsUsed: ["tp-10", "tp-12"], // 硫酸镁、喷壶
        },
        {
          day: "第2-4天（快速吸收与显效期）",
          title: "优化环境与初次效果观察",
          description:
            "1. 环境管理：确保植物接受充足但温和的光照（如东向窗台），镁是光合作用的关键，充足的光照能促进镁的利用。避免强光直射，以免受损叶片加剧失水。\n2. 关键观察：从第3天左右开始，密切观察接受过喷施的黄化老叶。有效的标志是：黄化的叶肉区域开始出现“复绿”的迹象，颜色从亮黄或白色向黄绿色转变。注意：严重黄化的部分可能无法完全恢复，观察重点是“恶化停止”和“出现转机”。\n3. 暂停其他施肥：尤其避免施用高钾肥，因为钾会拮抗镁的吸收。",
          productsUsed: [],
        },
        {
          day: "第5-7天",
          title: "评估效果与土壤追肥",
          description:
            "1. 效果评估：如果叶面喷施后，黄化叶片的叶肉有明显复绿趋势，说明诊断正确且治疗有效。\n2. 土壤长效补充：进行土壤追肥，以解决根本问题。在盆土边缘挖2-3个小浅坑，每个坑放入约2-3克钙镁磷复合肥，覆土后浇透水。这是一种缓释型补充，能为植物提供持续数周的镁元素。\n3. 二次叶面喷施（可选）：如果第一次喷施效果不明显，可在此日重复一次叶面喷施（同第1天方法）。",
          productsUsed: ["tp-11"], // 钙镁磷复合肥
        },
        {
          day: "第8-21天（根系吸收与全面恢复期）",
          title: "巩固效果与整体养护",
          description:
            "1. 持续观察：土壤中的镁开始被根系吸收并输送到新生叶片。观察重点是：新生叶片是否健康深绿，以及黄化现象是否不再向更上部的叶片蔓延。\n2. 正常水肥管理：可以恢复使用均衡型液体肥（N-P-K-Mg均有），但频率减半（例如每月一次），直至植株完全恢复。\n3. 水分管理：保持规律浇水，避免干旱，因为干旱胁迫会加剧镁的缺乏。",
          productsUsed: [], // 可建议用户使用自有的均衡肥
        },
        {
          day: "第22天及以后",
          title: "预防复发与土壤健康",
          description:
            "1. 转为预防性施肥：在以后的养护中，特别是在频繁开花、结果或快速生长后，定期（每季度或换盆时）使用一次钙镁磷复合肥或专门含镁的肥料。\n2. 注意肥料搭配：避免长期单一使用高钾肥（如促花肥）。如果使用，应间隔补充镁肥。\n3. 土壤检测：如果植物频繁出现缺镁症状，应考虑检测土壤pH值。酸性过强（pH<5.5）或碱性过强（pH>7.5）都会导致镁难以被吸收，此时需要调整土壤酸碱度至中性偏微酸。",
          productsUsed: ["tp-11", "tp-9"], // 钙镁磷复合肥、pH测试笔
        },
      ],
    },
  },
  {
    id: "d5",
    name: "叶斑病",
    alias: "Leaf Spot Disease",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/disease/ChatGPT%20Image%202025%E5%B9%B412%E6%9C%8824%E6%97%A5%2009_31_56.png",
    type: "fungus/bacteria",
    severity: "medium",
    symptoms: [
      "叶片上出现圆形、椭圆形或不规则形病斑",
      "病斑初期多为褐色、黑色或灰白色，边缘清晰",
      "后期病斑中心可能干枯、穿孔或脱落",
      "病斑周围常有黄色晕圈",
      "严重时病斑连片，导致整叶枯萎脱落",
    ],
    treatment: [
      "立即隔离病株，剪除并销毁所有病叶、病枝",
      "加强通风，降低环境湿度",
      "喷洒广谱杀菌剂（如代森锰锌、苯醚甲环唑）",
      "调整浇水方式，避免叶片长期残留水珠",
      "暂停叶面施肥和喷水",
    ],
    prevention:
      "避免植株过密，保证通风透光；浇水时避开花叶，尽量从盆土浇灌；定期清理枯叶、落叶；雨季前后可喷洒保护性杀菌剂预防。",
    bundle: {
      id: "tb-5",
      name: "叶斑病防治套装",
      description: "针对叶片斑点、枯斑的一站式杀菌与修复方案。",
      price: 41.9,
      originalPrice: 58,
      image:
        "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/disease/ChatGPT%20Image%202025%E5%B9%B412%E6%9C%8824%E6%97%A5%2009_31_56.png",
      products: [
        {
          id: "tp-1",
          name: "园艺修枝剪",
          price: 15,
          image:
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=200&auto=format&fit=crop",
          description: "不锈钢消毒剪刀",
        },
        {
          id: "tp-13",
          name: "苯醚甲环唑悬浮剂（治疗型）",
          price: 18.5,
          image:
            "https://images.unsplash.com/photo-1628608832049-563b72803893?q=80&w=200&auto=format&fit=crop",
          description: "10ml 内吸性杀菌",
        },
        {
          id: "tp-14",
          name: "代森锰锌可湿性粉剂（保护型）",
          price: 11.9,
          image:
            "https://images.unsplash.com/photo-1628608832049-563b72803893?q=80&w=200&auto=format&fit=crop",
          description: "30g 广谱预防",
        },
      ],
      schedule: [
        {
          day: "第1天",
          title: "隔离与清创",
          description:
            "将病株移至远离其他植物的独立区域。用消毒后的剪刀彻底剪除所有带有明显病斑的叶片和枝条，并装入塑料袋密封丢弃，切勿堆肥。",
          productsUsed: ["tp-1"],
        },
        {
          day: "第1天",
          title: "首次治疗性喷施",
          description:
            "将苯醚甲环唑按说明书（通常为1ml兑水1.5-2升）稀释，对植株剩余的叶片进行**全面、细致**的喷雾，确保叶片正反面、茎秆都均匀覆盖药液。此药具有内吸治疗作用。",
          productsUsed: ["tp-13"],
        },
        {
          day: "第2-3天",
          title: "环境调控",
          description:
            "将植株放置在通风极佳的位置，有条件可增加风扇促进空气流通。严格控制浇水，保持盆土“见干见湿”，确保叶片在夜间来临前完全干燥。",
          productsUsed: [],
        },
        {
          day: "第5-7天",
          title: "二次保护性喷施",
          description:
            "将代森锰锌按说明书（通常为1g兑水1升）稀释，对植株进行第二次全面喷雾。此药主要起保护作用，在叶片表面形成保护膜，防止新感染。",
          productsUsed: ["tp-14"],
        },
        {
          day: "第10-14天",
          title: "评估与后续预防",
          description:
            "观察是否还有新病斑出现。若没有，说明控制成功。以后可每隔15-20天喷洒一次代森锰锌进行预防，尤其在雨季或高湿季节。恢复健康前不要进行叶面喷水或施肥。",
          productsUsed: ["tp-14"],
        },
      ],
    },
  },
  {
    id: "d2",
    name: "红蜘蛛",
    alias: "Spider Mites",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/u%3D1631170119%2C4290503434%26fm%3D3074%26app%3D3074%26f%3DJPEG.jpeg",
    type: "pest",
    severity: "medium",
    symptoms: [
      "叶片出现细小黄斑",
      "叶背有红色小点",
      "严重时有丝网",
      "叶片失去光泽",
    ],
    treatment: ["用高压水枪冲洗叶背", "喷洒螨危或阿维菌素", "增加环境湿度"],
    prevention: "经常向叶面喷雾，保持环境通风湿润，红蜘蛛怕湿。",
  },
  {
    id: "d3",
    name: "白粉病",
    alias: "Powdery Mildew",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/088691d963eaa67825172eecc6513dfe.png",
    type: "fungus",
    severity: "medium",
    symptoms: ["叶片出现白色粉末状斑点", "叶片卷曲变形", "光合作用受阻"],
    treatment: ["剪除病叶集中销毁", "喷洒代森锰锌或粉锈宁", "使用小苏打水擦拭"],
    prevention: "加强通风，增加光照，避免氮肥过多，叶面不要积水。",
  },
  {
    id: "d4",
    name: "叶焦/晒伤",
    alias: "Leaf Scorch",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/photo-1627474480590-40c23de6b0b9.png",
    type: "environment",
    severity: "low",
    symptoms: ["叶尖或叶缘干枯发黄", "叶片出现褐色焦斑", "斑点边界清晰"],
    treatment: ["移至阴凉通风处", "剪去严重焦枯部分", "适量喷水降温"],
    prevention: "夏季避免正午阳光直射，喜阴植物严格遮阴。",
  },
  {
    id: "d5",
    name: "蚜虫",
    alias: "Aphids",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/u%3D3650439281%2C352198504%26fm%3D253%26app%3D138%26f%3DJPEG.jpeg",
    type: "pest",
    severity: "medium",
    symptoms: ["嫩叶卷曲、畸形", "叶面有粘液（蜜露）", "可能诱发煤污病"],
    treatment: ["数量少可人工刷除", "喷洒吡虫啉或护花神", "悬挂黄板诱杀"],
    prevention: "保持通风，及时清除周边杂草，定期检查嫩梢。",
  },
  {
    id: "d6",
    name: "缺铁性黄叶",
    alias: "Iron Deficiency",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/5290577f163670964e40f315db36d0dd%20%281%29.png",
    type: "environment",
    severity: "low",
    symptoms: ["新叶叶肉发黄", "叶脉保持绿色", "严重时全叶发白"],
    treatment: ["使用硫酸亚铁溶液灌根", "喷施螯合铁叶面肥", "改善土壤酸碱度"],
    prevention: "喜酸性植物定期施用酸性肥料（如硫酸亚铁）。",
  },
];

// 病虫害分类配置
export const DISEASE_TYPES = [
  { id: "all", label: "全部" },
  { id: "pest", label: "虫害" },
  { id: "fungus", label: "病害" },
  { id: "environment", label: "环境" },
];

// 严重程度配置
export const SEVERITY_LEVELS = {
  low: { label: "轻度", color: "#52c41a", bgColor: "#f6ffed" },
  medium: { label: "中度", color: "#faad14", bgColor: "#fffbe6" },
  high: { label: "严重", color: "#ff4d4f", bgColor: "#fff1f0" },
};
