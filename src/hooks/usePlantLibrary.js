import { ref } from "vue";

// ==================== 静态 Mock 数据 ====================
export const DEFAULT_LIBRARY = [
  // --- 梯队 1: 国民销量王 ---
  {
    id: "1023",
    name: "绿萝",
    alias: "魔鬼藤、黄金葛、石柑子、抽叶藤、万年青、金钱藤",
    scientificName: "Epipremnum aureum",
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/sandra-martins-Gp3Y7zVhHms-unsplash.jpg",
    price: 15,
    rating: 4.9,
    difficulty: "easy",
    sales: 99999,
    viewers: 93,
    tags: [
      "养植小白",
      "净化甲醛",
      "长效耐旱",
      "个人工位",
      "卫浴点缀",
      "赛博打工人",
      "自动化适配",
    ],
    description: "生命力极强，被称为“生命之花”，是每个新手的第一株植物。",
    requirements: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 50, max: 80 },
      soilMoisture: { min: 40, max: 70 },
      light: { min: 500, max: 1500 },
    },
    careTips: {
      water: "喜湿润。土表干了就浇透，也可水培。",
      light: "散射光养护，忌强光直射。",
      temperature: "适温15-25℃，怕冻。",
      soil: "疏松透气排水好。",
    },
  },
  {
    id: "1024",
    name: "龟背竹",
    alias: "蓬莱蕉、龟背蕉、电线兰、电信兰、麒麟叶、凤梨蕉、洞洞叶芋",
    scientificName: "Monstera deliciosa",
    price: 45,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/jannet-serhan-DBXzXY6h5rM-unsplash.jpg",
    rating: 4.9,
    difficulty: "easy",
    viewers: 110,
    sales: 72000,
    tags: ["养植小白", "客厅C位", "网红打卡", "净化甲醛"],
    description: "叶形奇特，孔裂纹状，极具热带风情，是北欧风家居的标配绿植。",
    requirements: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 60, max: 90 },
      soilMoisture: { min: 40, max: 70 },
      light: { min: 800, max: 2500 },
    },
    careTips: {
      water: "喜湿润，需经常喷水增加环境湿度。",
      light: "耐阴，忌强光暴晒，散射光最佳。",
      temperature: "不耐寒，冬季需保暖。",
      soil: "疏松肥沃的微酸性土。",
    },
  },
  {
    id: "1026",
    name: "虎皮兰",
    alias: "虎尾兰、千岁兰、锦兰、黄边虎尾兰",
    scientificName: "Sansevieria trifasciata",
    price: 39,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/feey-URA9g8uTFqg-unsplash.jpg",
    rating: 4.8,
    difficulty: "easy",
    sales: 54000,
    viewers: 64,
    tags: [
      "卧室静谧",
      "玄关迎客",
      "空气净化",
      "低频维护",
      "赛博打工人",
      "极简主义",
      "耐空调环境",
    ],
    description: "天然氧吧，极其耐旱，几乎不需要打理。",
    requirements: {
      temperature: { min: 15, max: 32 },
      humidity: { min: 30, max: 60 },
      soilMoisture: { min: 15, max: 35 },
      light: { min: 500, max: 3000 },
    },
    careTips: {
      water: "耐旱之王。等盆土全干后再浇。水多必烂根。",
      light: "半阴环境最理想。阳光太强会导致叶片灼伤发黄。",
      temperature: "怕冷。冬季10℃以下要严格控水。",
      soil: "喜通气。泥炭和粗沙比例3:1最佳。",
    },
  },
  {
    id: "1027",
    name: "富贵竹",
    alias: "万寿竹、开运竹、塔竹、转运竹",
    scientificName: "Dracaena sanderiana",
    price: 9.9,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/feey-9c0J8P4qHX0-unsplash.jpg",
    rating: 4.8,
    difficulty: "easy",
    sales: 88000,
    tags: [
      "招财纳福",
      "净化甲醛",
      "养植小白",
      "步步高升",
      "玄关迎客",
      "员工茶歇",
    ],
    description: "寓意“花开富贵，竹报平安”，水培干净卫生，是办公桌和家居常客。",
    requirements: {
      temperature: { min: 18, max: 32 },
      humidity: { min: 60, max: 90 },
      soilMoisture: { min: 80, max: 100 },
      light: { min: 500, max: 1500 },
    },
    careTips: {
      water: "水培需勤换水，保持水质清洁。",
      light: "喜散射光，黄叶多为光照过强或缺铁。",
      temperature: "喜暖怕寒，冬季防冻。",
      soil: "多为水培，土培需疏松。",
    },
  },
  {
    id: "1028",
    name: "吊兰",
    alias: "垂盆草、挂兰、折鹤兰、空气卫士",
    scientificName: "Chlorophytum comosum",
    price: 12,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/anna-manson-tq_3G1WuLgs-unsplash.jpg",
    rating: 4.7,
    difficulty: "easy",
    sales: 76000,
    tags: [
      "阳光阳台",
      "空气净化",
      "长效耐旱",
      "卫浴点缀",
      "养植小白",
      "防灰尘",
    ],
    description: "空气卫士，能有效吸收甲醛，垂吊姿态优美。",
    requirements: {
      temperature: { min: 15, max: 28 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 40, max: 60 },
      light: { min: 800, max: 2000 },
    },
    careTips: {
      water: "肉质根耐旱，宁干勿湿。",
      light: "明亮散射光，夏季遮阴。",
      temperature: "较耐寒，适应性强。",
      soil: "排水良好的沙质土。",
    },
  },
  // --- 梯队 2: 网红/中高端 ---
  {
    id: "1029",
    name: "日本大叶伞",
    alias: "昆士兰伞木、澳洲鸭脚木、伞树",
    scientificName: "Schefflera actinophylla",
    price: 880,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/064f6c30bdc98ac32197c9424f377150.jpeg",
    rating: 4.9,
    difficulty: "medium",
    sales: 12000,
    tags: [
      "客厅C位",
      "极简主义",
      "中古博主",
      "出片率高",
      "增加湿度",
      "调性提升",
    ],
    description: "极简主义家庭的首选，伞状叶片极具现代感。",
    requirements: {
      temperature: { min: 18, max: 30 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 30, max: 60 },
      light: { min: 1000, max: 2500 },
    },
    careTips: {
      water: "见干见湿，忌积水。",
      light: "喜光照，耐半阴。",
      temperature: "喜温暖，冬季需保温。",
      soil: "肥沃疏松的壤土。",
    },
  },
  {
    id: "1030",
    name: "大叶琴叶榕",
    alias: "琴叶榕、提琴叶榕",
    scientificName: "Ficus lyrata",
    price: 450,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/karthik-sridasyam-l53aoaOAfyI-unsplash.jpg",
    rating: 4.7,
    difficulty: "medium",
    sales: 28000,
    viewers: 23,
    tags: [
      "客厅C位",
      "网红打卡",
      "出片率高",
      "极简主义",
      "调性提升",
      "工业复古",
    ],
    description: "时尚界的宠儿，独特的叶形让空间瞬间高级。",
    requirements: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 60 },
      light: { min: 2000, max: 5000 },
    },
    careTips: {
      water: "保持湿润但不能积水。",
      light: "喜充足光照，需定期转盆。",
      temperature: "喜热怕冷。",
      soil: "需定期擦拭叶片灰尘。",
    },
  },
  {
    id: "1031",
    name: "橡皮树",
    alias: "印度榕、印度橡皮树、橡胶树",
    scientificName: "Ficus elastica",
    price: 68,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/feey-MU4w6amQR24-unsplash.jpg",
    rating: 4.8,
    difficulty: "medium",
    sales: 21000,
    tags: ["客厅C位", "防灰尘", "工业复古", "极简主义", "耐空调环境"],
    description: "叶片厚实黑亮，具有极强的吸附粉尘作用，是天然的除尘器。",
    requirements: {
      temperature: { min: 18, max: 32 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 30, max: 50 },
      light: { min: 1500, max: 4000 },
    },
    careTips: {
      water: "耐旱，干透浇透。",
      light: "喜光，耐半阴。",
      temperature: "喜暖。",
      soil: "定期清洁叶面。",
    },
  },
  {
    id: "1032",
    name: "罗汉松",
    alias: "土杉、金钱松",
    scientificName: "Podocarpus macrophyllus",
    price: 380,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/benjamin-dehant-HHDo46HmWtA-unsplash.jpg",
    rating: 4.9,
    difficulty: "medium",
    sales: 9000,
    tags: ["客厅C位", "书房禅意", "沉稳领导", "精品买手", "艺术策展人"],
    description: "“家有罗汉松，世世不受穷”，造型古朴典雅，极具收藏价值。",
    requirements: {
      temperature: { min: 10, max: 30 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 40, max: 60 },
      light: { min: 1500, max: 4000 },
    },
    careTips: {
      water: "保持土壤湿润，不可积水。",
      light: "喜光，夏季适当遮阴。",
      temperature: "较耐寒。",
      soil: "喜微酸性土壤。",
    },
  },
  // --- 梯队 3: 商务/招财/送礼 ---
  {
    id: "1033",
    name: "发财树",
    alias: "马拉巴栗、瓜栗、中美木棉、招财树",
    scientificName: "Pachira Aquatica",
    price: 1280,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/yasmina-h-O8JSc0DJ4_0-unsplash.jpg",
    rating: 4.9,
    difficulty: "easy",
    sales: 42000,
    tags: [
      "总裁办公室",
      "接待大厅",
      "招财纳福",
      "步步高升",
      "沉稳领导",
      "开业大吉",
    ],
    description: "寓意财源广进，是商业空间和办公室最受欢迎的大型绿植。",
    requirements: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 20, max: 40 },
      light: { min: 800, max: 2000 },
    },
    careTips: {
      water: "极不喜水，宁干勿湿，烂根杀手。",
      light: "喜散射光。",
      temperature: "喜高温高湿。",
      soil: "透气性要求极高。",
    },
  },
  {
    id: "1034",
    name: "金钱树",
    alias: "雪铁芋、金币树、龙凤木",
    scientificName: "Zamioculcas zamiifolia",
    price: 198,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/feey-QPYPkFRcwSE-unsplash.jpg",
    rating: 4.9,
    difficulty: "easy",
    sales: 35000,
    tags: [
      "个人工位",
      "收银聚财",
      "招财纳福",
      "低频维护",
      "高效专注",
      "差旅无忧",
    ],
    description: "叶片肥厚如钱串，象征财源滚滚。",
    requirements: {
      temperature: { min: 20, max: 32 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 10, max: 30 },
      light: { min: 500, max: 1500 },
    },
    careTips: {
      water: "地下块茎储水，非常耐旱。",
      light: "耐阴，忌强光暴晒。",
      temperature: "怕冷，冬季需保暖。",
      soil: "疏松透气。",
    },
  },
  {
    id: "1035",
    name: "红掌",
    alias: "花烛、安祖花、火鹤花、烛台花",
    scientificName: "Anthurium andraeanum",
    price: 45,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/ashley-kaneko-rZxIYDJ6BbY-unsplash.jpg",
    rating: 4.8,
    difficulty: "medium",
    sales: 45000,
    tags: ["开业大吉", "招财纳福", "商务礼赠", "增加客留", "财源滚滚"],
    description: "花叶俱美，花期持久，寓意大展宏图，鸿运当头。",
    requirements: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 70, max: 90 },
      soilMoisture: { min: 50, max: 80 },
      light: { min: 1000, max: 2000 },
    },
    careTips: {
      water: "喜湿润，需经常喷雾。",
      light: "忌强光，散射光养护。",
      temperature: "喜高温。",
      soil: "透气排水好的基质。",
    },
  },
  {
    id: "1036",
    name: "白掌",
    alias: "白鹤芋、和平芋、一帆风顺、苞叶芋",
    scientificName: "Spathiphyllum kochii",
    price: 28,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/4b4efb3ee94c48cbd6f7bec8e1e1a24b.jpeg",
    rating: 4.6,
    difficulty: "easy",
    sales: 39000,
    tags: ["个人工位", "空气净化", "商务礼赠", "卫浴点缀", "步步高升"],
    description: "寓意一帆风顺，花朵洁白如帆，适合室内光线不足的地方。",
    requirements: {
      temperature: { min: 18, max: 28 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 50, max: 75 },
      light: { min: 500, max: 1500 },
    },
    careTips: {
      water: "需水量大，缺水易倒伏。",
      light: "极耐阴，适合室内。",
      temperature: "怕冷。",
      soil: "保持盆土湿润。",
    },
  },
  {
    id: "1037",
    name: "君子兰",
    alias: "剑叶石蒜、大叶石蒜、达木兰",
    scientificName: "Clivia miniata",
    price: 60,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/16a07c12be66e4e15f9b6f9d35bc9507.jpeg",
    rating: 4.6,
    difficulty: "medium",
    sales: 15000,
    tags: ["书房禅意", "商务礼赠", "沉稳领导", "精品买手", "文人空间"],
    description: "叶片挺拔如剑，花朵艳丽，象征君子之风，高贵典雅。",
    requirements: {
      temperature: { min: 15, max: 25 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 30, max: 50 },
      light: { min: 800, max: 2000 },
    },
    careTips: {
      water: "肉质根，干透浇透。",
      light: "喜柔和光照。",
      temperature: "喜凉爽，温差利于开花。",
      soil: "专用君子兰土。",
    },
  },
  {
    id: "1038",
    name: "幸福树",
    alias: "菜豆树、蛇树、豆角树、接骨凉伞",
    scientificName: "Heteropanax fragrans",
    price: 158,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/0fe6242915f7e18d9cb4a2b1ef85b056.jpeg",
    rating: 4.8,
    difficulty: "medium",
    sales: 18000,
    tags: ["客厅C位", "空气净化", "增加湿度", "家庭和睦", "持久翠绿"],
    description: "寓意幸福平安，叶片茂密翠绿，为家庭带来生机与活力。",
    requirements: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 70 },
      light: { min: 1000, max: 3000 },
    },
    careTips: {
      water: "保持湿润，多喷水。",
      light: "喜光耐阴，全日照生长更好。",
      temperature: "喜暖热。",
      soil: "疏松肥沃。",
    },
  },
  // --- 梯队 4: 桌面小巧/功能类 ---
  {
    id: "1039",
    name: "芦荟",
    alias: "油葱、狼牙掌、芦荟草、象鼻草",
    scientificName: "Aloe vera",
    price: 18,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/feey-nU9U66FMutc-unsplash.jpg",
    rating: 4.9,
    difficulty: "easy",
    sales: 62000,
    tags: ["卧室静谧", "空气净化", "长效耐旱", "养植小白", "净化甲醛"],
    description: "集观赏、美容、药用于一身，夜间释放氧气，助眠神器。",
    requirements: {
      temperature: { min: 15, max: 35 },
      humidity: { min: 30, max: 50 },
      soilMoisture: { min: 10, max: 30 },
      light: { min: 2000, max: 5000 },
    },
    careTips: {
      water: "非常耐旱，少浇水。",
      light: "喜光，耐半阴。",
      temperature: "不耐寒。",
      soil: "沙质土壤。",
    },
  },
  {
    id: "1040",
    name: "薄荷",
    alias: "银丹草、夜息香、鱼香草",
    scientificName: "Mentha",
    price: 9.9,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/saymom-leao-jEUyu5DRAFM-unsplash.jpg",
    rating: 4.8,
    difficulty: "easy",
    sales: 58000,
    tags: ["阳光阳台", "高效专注", "芳香疗愈", "周末园艺", "自然香氛"],
    description: "清凉香气，可泡水、做菜，生长迅速，随手一摘就是清新。",
    requirements: {
      temperature: { min: 10, max: 30 },
      humidity: { min: 50, max: 80 },
      soilMoisture: { min: 60, max: 90 },
      light: { min: 1500, max: 4000 },
    },
    careTips: {
      water: "喜水，缺水极易枯萎。",
      light: "喜充足阳光。",
      temperature: "耐寒性较好。",
      soil: "生长迅速，需勤修剪。",
    },
  },
  {
    id: "1041",
    name: "铜钱草",
    alias: "中华天胡荽、钱币草、圆币草、香菇草",
    scientificName: "Hydrocotyle vulgaris",
    price: 8,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/28f7d3e91cb42b2956dc872f3b76018a.jpeg",
    rating: 4.9,
    difficulty: "easy",
    sales: 65000,
    tags: ["招财纳福", "养植小白", "增加湿度", "个人工位", "亲子教育"],
    description: "叶片圆润如铜钱，寓意团团圆圆、财源滚滚，遇水即活。",
    requirements: {
      temperature: { min: 10, max: 35 },
      humidity: { min: 70, max: 100 },
      soilMoisture: { min: 80, max: 100 },
      light: { min: 1000, max: 3000 },
    },
    careTips: {
      water: "半土半水最好，不能缺水。",
      light: "光照越足叶子越大。",
      temperature: "喜温暖。",
      soil: "耐贫瘠。",
    },
  },
  {
    id: "1042",
    name: "豆瓣绿",
    alias: "椒草、青叶碧玉、圆叶椒草",
    scientificName: "Peperomia tetraphylla",
    price: 12,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/8b6a2682d7f129cda24da32ea94c14fa.jpeg",
    rating: 4.8,
    difficulty: "easy",
    sales: 41000,
    tags: ["个人工位", "防辐护眼", "养植小白", "赛博打工人", "卫浴点缀"],
    description: "叶片碧绿光亮，小巧玲珑，适合摆放在电脑旁缓解视疲劳。",
    requirements: {
      temperature: { min: 18, max: 28 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 30, max: 50 },
      light: { min: 500, max: 1500 },
    },
    careTips: {
      water: "肉质叶，不耐涝。",
      light: "喜散射光，耐阴。",
      temperature: "喜暖。",
      soil: "疏松透气。",
    },
  },
  {
    id: "1043",
    name: "多肉组合",
    alias: "多肉植物、肉质植物、多浆植物",
    scientificName: "Succulents",
    price: 29.9,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/lan-deng-CFKwL570ZSc-unsplash.jpg",
    rating: 4.8,
    difficulty: "easy",
    sales: 95000,
    tags: ["阳光阳台", "个人工位", "多肉达人", "商务礼赠", "养植小白"],
    description: "形态各异，萌态可掬，治愈系植物的首选，适合组合拼盘。",
    requirements: {
      temperature: { min: 10, max: 30 },
      humidity: { min: 20, max: 40 },
      soilMoisture: { min: 10, max: 30 },
      light: { min: 3000, max: 8000 },
    },
    careTips: {
      water: "宁干勿湿，控水防徒长。",
      light: "需充足光照上色。",
      temperature: "大温差利于出状态。",
      soil: "颗粒土为主。",
    },
  },
  {
    id: "1044",
    name: "文竹",
    alias: "云片松、刺天冬、云竹",
    scientificName: "Asparagus setaceus",
    price: 25,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/86578927aab461de168f5215320f48fd.jpeg",
    rating: 4.7,
    difficulty: "medium",
    sales: 31000,
    tags: ["书房禅意", "个人工位", "高效专注", "增加湿度", "艺术策展人"],
    description: "姿态轻盈，富有书卷气息。",
    requirements: {
      temperature: { min: 15, max: 25 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 60 },
      light: { min: 500, max: 1500 },
    },
    careTips: {
      water: "不可积水，喜湿润空气。",
      light: "忌强光，散射光。",
      temperature: "怕烟尘。",
      soil: "排水良好。",
    },
  },
  // --- 梯队 5: 开花/芳香类 ---
  {
    id: "1045",
    name: "茉莉花",
    alias: "茉莉、香魂、莫利花",
    scientificName: "Jasminum sambac",
    price: 25,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/4b9e8aed27319b0c05743ff2e04f27e3.jpeg",
    rating: 4.7,
    difficulty: "medium",
    sales: 33000,
    tags: ["阳光阳台", "芳香疗愈", "周末园艺", "自然香氛", "法式浪漫"],
    description: "“好一朵美丽的茉莉花”，花香浓郁，可熏茶，夏季清凉首选。",
    requirements: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 50, max: 70 },
      light: { min: 2500, max: 6000 },
    },
    careTips: {
      water: "喜水，夏季早晚浇。",
      light: "晒不死的茉莉，喜强光。",
      temperature: "喜高温。",
      soil: "喜酸性土，勤施肥。",
    },
  },
  {
    id: "1046",
    name: "栀子花",
    alias: "黄栀子、山栀、白蟾",
    scientificName: "Gardenia jasminoides",
    price: 22,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/cb9d643252a131b6f3460b57dce97738.jpeg",
    rating: 4.6,
    difficulty: "hard",
    sales: 29000,
    tags: ["阳光阳台", "芳香疗愈", "增加湿度", "法式浪漫", "亲子教育"],
    description: "花白叶绿，香气袭人，代表永恒的爱与约定。",
    requirements: {
      temperature: { min: 18, max: 28 },
      humidity: { min: 70, max: 90 },
      soilMoisture: { min: 60, max: 80 },
      light: { min: 2000, max: 5000 },
    },
    careTips: {
      water: "喜大水，保持湿润。",
      light: "喜光。",
      temperature: "喜暖。",
      soil: "缺铁易黄叶，需硫酸亚铁。",
    },
  },
  {
    id: "1047",
    name: "长寿花",
    alias: "圣诞伽蓝菜、矮生伽蓝菜、寿星花",
    scientificName: "Kalanchoe blossfeldiana",
    price: 18,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/4945f1fde169062bcb9acea60923476a.jpeg",
    rating: 4.9,
    difficulty: "easy",
    sales: 36000,
    tags: ["阳光阳台", "多肉达人", "周末园艺", "增加客留", "健康长寿"],
    description: "寓意健康长寿，花期长达数月，花色丰富，是送给长辈的最佳礼物。",
    requirements: {
      temperature: { min: 15, max: 25 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 20, max: 40 },
      light: { min: 2000, max: 5000 },
    },
    careTips: {
      water: "耐旱，干透浇透。",
      light: "短日照促花。",
      temperature: "适温开花。",
      soil: "疏松沙壤土。",
    },
  },
  {
    id: "1048",
    name: "仙客来",
    alias: "兔子花、兔耳花、一品冠",
    scientificName: "Cyclamen persicum",
    price: 25,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/a7ddacb60d437dcb68b4c2522e50aec1.jpeg",
    rating: 4.6,
    difficulty: "medium",
    sales: 20000,
    tags: ["玄关迎客", "商务礼赠", "增加客留", "自然香氛", "开业大吉"],
    description: "花形独特如兔耳，寓意喜迎贵客，是冬季和春节的重要花卉。",
    requirements: {
      temperature: { min: 10, max: 20 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 40, max: 60 },
      light: { min: 1000, max: 3000 },
    },
    careTips: {
      water: "浸盆法浇水，叶心怕水。",
      light: "喜光。",
      temperature: "喜凉爽，怕热。",
      soil: "富含腐殖质。",
    },
  },
  {
    id: "1049",
    name: "无尽夏绣球",
    alias: "绣球花、八仙花、紫阳花",
    scientificName: "Hydrangea macrophylla",
    price: 88,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/vitalik-Skx_cS0BOt4-unsplash.jpg",
    rating: 4.8,
    difficulty: "hard",
    sales: 22000,
    tags: ["阳光阳台", "周末园艺", "法式浪漫", "增加湿度", "出片率高"],
    description: "开花量巨大，颜色可随土壤酸碱度变化。",
    requirements: {
      temperature: { min: 15, max: 28 },
      humidity: { min: 60, max: 90 },
      soilMoisture: { min: 60, max: 90 },
      light: { min: 1000, max: 3000 },
    },
    careTips: {
      water: "抽水机，夏季需早晚浇水。",
      light: "半阴，忌暴晒。",
      temperature: "耐寒性一般。",
      soil: "调色需调酸碱度。",
    },
  },
  {
    id: "1050",
    name: "千年木",
    alias: "红边竹蕉、七彩铁、三色龙血树",
    scientificName: "Dracaena marginata",
    price: 360,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/9563b9e23d75c20695349a62864afe11.jpeg",
    rating: 4.9,
    difficulty: "medium",
    sales: 8000,
    tags: ["极简主义", "净化甲醛", "沉稳领导", "调性提升", "客厅C位"],
    description: "线条感极强，色彩丰富，适合现代办公环境。",
    requirements: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 30, max: 50 },
      light: { min: 1000, max: 3000 },
    },
    careTips: {
      water: "耐旱，干透浇透。",
      light: "喜光耐半阴。",
      temperature: "喜暖。",
      soil: "疏松透气。",
    },
  },
  // --- New Additions to fill gaps ---
  {
    id: "1051",
    name: "波士顿蕨",
    alias: "高肾蕨、皱叶肾蕨",
    scientificName: "Nephrolepis exaltata",
    price: 29,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/6945ab65b2bd9f3e8159d9930c41c5f4.png",
    rating: 4.8,
    difficulty: "medium",
    sales: 18000,
    tags: ["宠物安全", "雨林玩家", "卫浴点缀", "增加湿度"],
    description: "典型的蕨类植物，叶片翠绿，安全无毒，是宠物友好型植物。",
    requirements: {
      temperature: { min: 18, max: 28 },
      humidity: { min: 60, max: 90 },
      soilMoisture: { min: 50, max: 80 },
      light: { min: 500, max: 1500 },
    },
    careTips: {
      water: "喜湿润，需经常喷水。",
      light: "喜散射光，耐阴。",
      temperature: "喜温暖。",
      soil: "排水良好的腐叶土。",
    },
  },
  {
    id: "1052",
    name: "日本吊钟",
    alias: "灯台躑躅、吊钟花",
    scientificName: "Enkianthus perulatus",
    price: 350,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/ac006e83b82cd58139b691f80465200e.jpg",
    rating: 4.9,
    difficulty: "hard",
    sales: 5000,
    tags: ["日系Muji", "客厅C位", "极简主义", "审美格调"],
    description: "叶片层层叠叠，姿态优雅，极具日式禅意，是高端家居的常客。",
    requirements: {
      temperature: { min: 15, max: 25 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 40, max: 70 },
      light: { min: 1000, max: 2500 },
    },
    careTips: {
      water: "保持湿润，避免积水。",
      light: "喜半阴环境。",
      temperature: "喜凉爽。",
      soil: "酸性土壤。",
    },
  },
  {
    id: "1053",
    name: "含羞草",
    alias: "感应草、知羞草、怕丑草",
    scientificName: "Mimosa pudica",
    price: 9.9,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/99f5345a4f0e209a5d51ff2b9091ed01.jpeg",
    rating: 4.7,
    difficulty: "easy",
    sales: 28000,
    tags: ["亲子教育", "阳光阳台", "养植小白"],
    description: "叶片触碰即合，趣味性强，是儿童自然教育的极佳素材。",
    requirements: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 40, max: 70 },
      light: { min: 1500, max: 3000 },
    },
    careTips: {
      water: "见干见湿。",
      light: "喜光照。",
      temperature: "喜温暖。",
      soil: "排水良好。",
    },
  },
  {
    id: "1054",
    name: "散尾葵",
    alias: "黄椰子、紫葵",
    scientificName: "Dypsis lutescens",
    price: 150,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/e35393f443a915ae1b8bc182d3a3bd2b.jpeg",
    rating: 4.8,
    difficulty: "easy",
    sales: 22000,
    tags: ["会议中心", "走廊绿廊", "净化甲醛", "大厅"],
    description: "羽状叶片修长优雅，能有效净化空气，适合大型办公空间。",
    requirements: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 70 },
      light: { min: 1000, max: 3000 },
    },
    careTips: {
      water: "喜湿润，需多喷水。",
      light: "耐半阴。",
      temperature: "怕冷，冬季保温。",
      soil: "微酸性沙壤土。",
    },
  },
  {
    id: "1055",
    name: "一叶兰",
    alias: "蜘蛛抱蛋、箬叶",
    scientificName: "Aspidistra elatior",
    price: 45,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/50ffdd116b39725d89948370583f0886.jpeg",
    rating: 4.8,
    difficulty: "easy",
    sales: 15000,
    tags: ["企业统购", "走廊绿廊", "低频维护", "耐阴"],
    description: "耐阴性极强，适应性广，是企业走廊和低光照区域的理想选择。",
    requirements: {
      temperature: { min: 10, max: 30 },
      humidity: { min: 40, max: 70 },
      soilMoisture: { min: 30, max: 60 },
      light: { min: 300, max: 1500 },
    },
    careTips: {
      water: "干透浇透。",
      light: "极耐阴。",
      temperature: "耐寒耐热。",
      soil: "不择土壤。",
    },
  },
  {
    id: "1056",
    name: "空气凤梨",
    alias: "铁兰花、空气草",
    scientificName: "Tillandsia",
    price: 15,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/feey-zAdAmgP5JJk-unsplash.jpg",
    rating: 4.9,
    difficulty: "medium",
    sales: 30000,
    tags: ["科技极客", "个人工位", "极简主义", "差旅无忧"],
    description: "无需土壤，依靠空气生存，适合追求科技感和极简风格的桌面。",
    requirements: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 50, max: 80 },
      soilMoisture: { min: 0, max: 0 },
      light: { min: 1000, max: 3000 },
    },
    careTips: {
      water: "每周喷水2-3次。",
      light: "散射光。",
      temperature: "适温生长。",
      soil: "无需土壤。",
    },
  },
  {
    id: "1057",
    name: "国兰",
    alias: "中国兰、幽兰、芝兰",
    scientificName: "Cymbidium ensifolium",
    price: 120,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/18288667aaa36589c3702106ca35dd61.jpeg",
    rating: 4.7,
    difficulty: "medium",
    sales: 10000,
    tags: ["优雅行政", "总裁办公室", "文人空间", "商务礼赠"],
    description: "香气幽远，姿态高雅，象征高洁的品格，适合行政和领导办公室。",
    requirements: {
      temperature: { min: 15, max: 25 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 60 },
      light: { min: 1000, max: 2500 },
    },
    careTips: {
      water: "保持湿润，忌积水。",
      light: "喜散射光。",
      temperature: "喜凉爽。",
      soil: "专用兰花土。",
    },
  },
  {
    id: "1058",
    name: "量天尺",
    alias: "仙人柱、霸王花、剑花",
    scientificName: "Cereus jamacaru",
    price: 88,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/9aec9c261b937485e47c6d90b0b8ba98.jpeg",
    rating: 4.8,
    difficulty: "easy",
    sales: 18000,
    tags: ["店铺橱窗", "潮流主理人", "工业复古", "长效耐旱"],
    description: "线条硬朗，极具雕塑感，是潮流店铺和橱窗陈列的百搭单品。",
    requirements: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 30, max: 50 },
      soilMoisture: { min: 10, max: 30 },
      light: { min: 2000, max: 5000 },
    },
    careTips: {
      water: "极耐旱，少浇水。",
      light: "喜光照。",
      temperature: "喜热。",
      soil: "沙质土壤。",
    },
  },
  {
    id: "1059",
    name: "三角梅",
    alias: "叶子花、九重葛、勒杜鹃",
    scientificName: "Bougainvillea spectabilis",
    price: 45,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/pranjali-thorat-gwZiYY83sc0-unsplash.jpg",
    rating: 4.9,
    difficulty: "medium",
    sales: 40000,
    tags: ["外摆美化", "常开常青", "开业大吉", "增加客留"],
    description: "花色艳丽，花期长，热烈奔放，非常适合店铺外摆吸引目光。",
    requirements: {
      temperature: { min: 15, max: 35 },
      humidity: { min: 50, max: 80 },
      soilMoisture: { min: 40, max: 70 },
      light: { min: 3000, max: 8000 },
    },
    careTips: {
      water: "控水促花，花期多浇。",
      light: "喜强光，光照越足花越艳。",
      temperature: "喜暖。",
      soil: "微酸性。",
    },
  },
  {
    id: "1060",
    name: "高山榕",
    alias: "黄金榕、富贵榕",
    scientificName: "Ficus altissima",
    price: 320,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/fdbaabd52ad8988cb34137615257e191.png",
    rating: 4.8,
    difficulty: "medium",
    sales: 12000,
    tags: ["客休空间", "自然主义", "调性提升", "增加客留"],
    description: "树形优美，叶片宽大，能营造出宁静舒适的自然氛围，适合客休区。",
    requirements: {
      temperature: { min: 18, max: 30 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 60 },
      light: { min: 1500, max: 4000 },
    },
    careTips: {
      water: "保持湿润。",
      light: "喜光耐阴。",
      temperature: "喜暖。",
      soil: "肥沃土壤。",
    },
  },
  {
    id: "1061",
    name: "天堂鸟",
    alias: "鹤望兰、极乐鸟花",
    scientificName: "Strelitzia Nicolai",
    price: 128,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/arkadiusz-sliwinski-SLm-6FWxlVo-unsplash.jpg",
    rating: 4.8,
    difficulty: "medium",
    tags: ["客厅C位", "宠物安全", "空气净化", "大型植物"],
    description:
      "不仅是植物，更是家中的艺术品。巨大的叶片带来浓郁的热带风情，让您的花园瞬间提升档次。",
    recommendReason: "拉高层高的视觉焦点",
    sales: 1200,
    viewers: 45,
    buyerData: { percentage: 88, tag: "室内设计师选择" },
    requirements: {
      light: { min: 2000, max: 5000 },
      temperature: { min: 18, max: 30 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 60 },
    },
    careTips: {
      water: "喜湿润，夏季多浇水并向叶面喷雾，冬季微干。",
      light: "喜充足阳光，但也耐半阴，避开夏季烈日暴晒。",
      temperature: "不耐寒，冬季保持10℃以上，最适20-30℃。",
      soil: "喜疏松肥沃、排水良好的砂质土壤，需深盆。",
    },
  },
  {
    id: "1062",
    name: "爱心球兰",
    alias: "心叶球兰、腊兰、腊花",
    scientificName: "Hoya Kerrii",
    price: 39,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/feey-6AWnoA79lHk-unsplash.jpg",
    rating: 4.9,
    difficulty: "easy",
    tags: ["卧室静谧", "亲子教育", "极简主义"],
    description:
      "在这个快节奏的世界里，送自己一颗永不凋谢的爱心。极其耐旱，哪怕一个月忘记浇水也能茁壮成长。",
    recommendReason: "表达爱意的最佳载体",
    sales: 3500,
    viewers: 128,
    buyerData: { percentage: 95, tag: "送礼用户首选" },
    requirements: {
      light: { min: 800, max: 2500 },
      temperature: { min: 15, max: 28 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 10, max: 30 },
    },
    careTips: {
      water: "极耐旱，”宁干勿湿“，土干透后再浇水。",
      light: "喜明亮散射光，忌强光直射，光照不足生长慢。",
      temperature: "适宜18-28℃，冬季保持5℃以上即可。",
      soil: "需使用排水性极佳的多肉专用土或颗粒土。",
    },
  },
  {
    id: "1063",
    name: "宝莲灯",
    alias: "粉苞酸脚杆、珍珠宝莲",
    scientificName: "Medinilla Magnifica",
    price: 299,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1669148911895-a95de51d09ca.png",
    rating: 4.7,
    difficulty: "hard",
    tags: ["书房禅意", "空气净化", "商务礼赠"],
    description:
      "植物界的贵族，粉色的花朵如同华丽的宫灯垂下。拥有它，您的花园将成为邻居羡慕的焦点。",
    recommendReason: "自带贵族气息的宫灯花",
    sales: 150,
    viewers: 32,
    requirements: {
      light: { min: 1500, max: 3000 },
      temperature: { min: 20, max: 30 },
      humidity: { min: 70, max: 90 },
      soilMoisture: { min: 50, max: 70 },
    },
    careTips: {
      water: "喜高湿，经常喷雾增湿，盆土保持湿润不积水。",
      light: "喜半阴，忌强光，明亮散射光利于开花。",
      temperature: "极不耐寒，冬季需15℃以上，注意保暖。",
      soil: "喜疏松透气、富含腐殖质的微酸性土壤。",
    },
  },
  {
    id: "1064",
    name: "镜面草",
    alias: "金钱草、圆叶冷水花、铜钱草",
    scientificName: "Pilea Peperomioides",
    price: 58,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1674237276501-595398f90f87.png",
    rating: 4.6,
    difficulty: "easy",
    tags: ["招财纳福", "宠物安全", "差旅无忧"],
    description:
      "圆圆的叶片象征着团圆和财富。它不仅可爱，而且对猫狗完全无毒，是铲屎官的完美选择。",
    recommendReason: "宠物友好的招财萌物",
    sales: 890,
    viewers: 67,
    buyerData: { percentage: 92, tag: "养宠家庭选择" },
    requirements: {
      light: { min: 1000, max: 3000 },
      temperature: { min: 15, max: 28 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 30, max: 50 },
    },
    careTips: {
      water: "见干见湿，保持微湿。定期擦拭叶片灰尘。",
      light: "喜明亮散射光，耐阴。避免暴晒防卷叶。",
      temperature: "较耐寒，0℃以上可过冬，适宜15-25℃。",
      soil: "对土壤要求不严，排水良好的沙质壤土即可。",
    },
  },
  {
    id: "1065",
    name: "油画竹芋",
    alias: "白脉竹芋、孔雀竹芋",
    scientificName: "Calathea Fusion White",
    price: 88,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/palnts/feey-3frihNsWLPo-unsplash.jpg",
    rating: 4.5,
    difficulty: "medium",
    tags: ["书房禅意", "法式浪漫", "周末园艺", "净化甲醛"],
    description:
      "大自然的调色盘。每一片叶子都是独一无二的油画作品，为单调的角落带来生机勃勃的色彩。",
    recommendReason: "点亮暗角的自然油画",
    sales: 420,
    viewers: 29,
    requirements: {
      light: { min: 500, max: 1500 },
      temperature: { min: 18, max: 26 },
      humidity: { min: 70, max: 90 },
      soilMoisture: { min: 50, max: 80 },
    },
    careTips: {
      water: "对水敏感，保持湿润。必须经常喷雾防焦边。",
      light: "喜阴，完全避光直射，光强会褪色灼伤。",
      temperature: "喜温暖，适温20-30℃，冬季不低于15℃。",
      soil: "需疏松、排水良好且保水性强的微酸性土。",
    },
  },
  {
    id: "1066",
    name: "橄榄树",
    alias: "油橄榄、齐墩果",
    scientificName: "Olea Europaea",
    price: 158,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1681807326535-621ae5ef9da3.png",
    rating: 4.8,
    difficulty: "medium",
    tags: ["员工茶歇", "步步高升", "沉稳领导"],
    description:
      "简约而不简单的北欧风格代表。银灰色的叶片在阳光下闪闪发光，象征着和平与智慧。",
    recommendReason: "极简北欧风的灵魂",
    sales: 680,
    viewers: 55,
    buyerData: { percentage: 80, tag: "极简主义者青睐" },
    requirements: {
      light: { min: 3000, max: 6000 },
      temperature: { min: 10, max: 35 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 20, max: 50 },
    },
    careTips: {
      water: "较耐旱，土干透浇透。室内养护注意通风。",
      light: "极喜光，需全日照，光照不足会大量落叶。",
      temperature: "耐寒性较强，耐短时-5℃，适宜20-30℃。",
      soil: "喜碱性土壤，需排水性极佳，可混入颗粒。",
    },
  },
  {
    id: "99999999",
    name: "未知",
    alias: "待识别植物",
    scientificName: "Unknown",
    price: 158,
    image:
      "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1681807326535-621ae5ef9da3.png",
    rating: 4.8,
    difficulty: "medium",
    tags: ["员工茶歇", "步步高升", "沉稳领导"],
    description:
      "简约而不简单的北欧风格代表。银灰色的叶片在阳光下闪闪发光，象征着和平与智慧。",
    recommendReason: "极简北欧风的灵魂",
    sales: 680,
    viewers: 55,
    buyerData: { percentage: 80, tag: "极简主义者青睐" },
    requirements: {
      light: { min: 3000, max: 6000 },
      temperature: { min: 10, max: 35 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 20, max: 50 },
    },
    careTips: {
      water: "较耐旱，土干透浇透。室内养护注意通风。",
      light: "极喜光，需全日照，光照不足会大量落叶。",
      temperature: "耐寒性较强，耐短时-5℃，适宜20-30℃。",
      soil: "喜碱性土壤，需排水性极佳，可混入颗粒。",
    },
  },
];

export const SCENE_CONFIGS = {
  home: {
    label: "家庭住宅",
    accent: "emerald",
    sections: [
      {
        label: "空间位置",
        items: [
          "客厅C位",
          "卧室静谧",
          "阳光阳台",
          "书房禅意",
          "玄关迎客",
          "卫浴点缀",
        ],
      },
      {
        label: "生活意图",
        items: [
          "空气净化",
          "宠物安全",
          "芳香疗愈",
          "增加湿度",
          "母婴友好",
          "亲子教育",
        ],
      },
      {
        label: "审美格调",
        items: [
          "中古博主",
          "极简主义",
          "雨林玩家",
          "日系Muji",
          "多肉达人",
          "法式浪漫",
        ],
      },
      {
        label: "养护契约",
        items: ["周末园艺", "长效耐旱", "养植小白", "自动化适配"],
      },
    ],
  },
  office: {
    label: "公司企业",
    accent: "blue",
    sections: [
      {
        label: "职场点缀",
        items: [
          "总裁办公室",
          "接待大厅",
          "会议中心",
          "个人工位",
          "员工茶歇",
          "走廊绿廊",
        ],
      },
      {
        label: "商务抱负",
        items: [
          "招财纳福",
          "步步高升",
          "防辐护眼",
          "高效专注",
          "净化甲醛",
          "商务礼赠",
        ],
      },
      {
        label: "职场人设",
        items: ["商务精英", "科技极客", "沉稳领导", "赛博打工人", "优雅行政"],
      },
      {
        label: "养护精力",
        items: ["差旅无忧", "低频维护", "耐空调环境", "企业统购"],
      },
    ],
  },
  store: {
    label: "商家店铺",
    accent: "purple",
    sections: [
      {
        label: "店面布局",
        items: [
          "店铺橱窗",
          "收银聚财",
          "网红打卡",
          "VIP包厢",
          "客休空间",
          "外摆美化",
        ],
      },
      {
        label: "商业期许",
        items: [
          "开业大吉",
          "财源滚滚",
          "出片率高",
          "调性提升",
          "增加客留",
          "自然香氛",
        ],
      },
      {
        label: "主理格调",
        items: ["潮流主理人", "艺术策展人", "自然主义", "精品买手", "工业复古"],
      },
      {
        label: "维护标准",
        items: ["持久翠绿", "防灰尘", "专业级养护", "常开常青"],
      },
    ],
  },
};

const CACHE_KEY = "PLANT_LIBRARY_DATA_V1";

export function usePlantLibrary() {
  const library = ref([]);

  const loadLibrary = () => {
    try {
      const cached = uni.getStorageSync(CACHE_KEY);
      if (cached && cached.length > 0) {
        library.value = cached;
      } else {
        library.value = DEFAULT_LIBRARY.filter((item) => item.id != 99999999);
        uni.setStorageSync(CACHE_KEY, DEFAULT_LIBRARY);
      }
      return library.value;
    } catch (e) {
      console.error("Failed to load plant library", e);
      library.value = DEFAULT_LIBRARY.filter((item) => item.id != 99999999);
      return library.value;
    }
  };

  /**
   * 根据植物名称查找植物
   * @param {string} name - 植物名称
   * @returns {object|null} 找到的植物对象或null
   */
  const findPlantByName = (name) => {
    if (library.value.length === 0) loadLibrary();
    if (!name || !library.value || !Array.isArray(library.value)) {
      return null;
    }
    return (
      library.value.find(
        (plant) =>
          plant.name.includes(name) ||
          name.includes(plant.name) ||
          plant.alias.includes(name)
      ) || null
    );
  };

  /**
   * 根据植物ID查找植物
   * @param {string} id - 植物ID
   * @returns {object|null} 找到的植物对象或null
   */
  const findPlantById = (id) => {
    if (library.value.length === 0) loadLibrary();
    if (!id || !library.value || !Array.isArray(library.value)) {
      return null;
    }
    return library.value.find((plant) => plant.id === id) || null;
  };

  /**
   * 根据名称或ID查找植物（通用方法）
   * @param {string} nameOrId - 植物名称或ID
   * @returns {object|null} 找到的植物对象或null
   */
  const findPlant = (nameOrId) => {
    if (!nameOrId || !library.value || !Array.isArray(library.value)) {
      return null;
    }
    // 优先按ID查找，找不到再按名称查找
    return findPlantById(nameOrId) || findPlantByName(nameOrId);
  };

  return {
    library,
    loadLibrary,
    findPlant,
    findPlantByName,
    findPlantById,
  };
}
