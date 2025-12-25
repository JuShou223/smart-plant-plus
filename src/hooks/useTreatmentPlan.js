import { ref, computed } from "vue";

const CACHE_KEY = "TREATMENT_PLANS_V1";
const ACTIVE_PLAN_KEY = "ACTIVE_TREATMENT_PLAN_V1";

/**
 * 治疗方案管理Hook
 * 包含创建、加载、更新、完成治疗方案等功能
 */
export function useTreatmentPlan() {
  const plans = ref([]);
  const activePlan = ref(null);

  /**
   * 加载所有治疗方案
   */
  const loadPlans = () => {
    try {
      const cached = uni.getStorageSync(CACHE_KEY);
      if (cached && Array.isArray(cached)) {
        plans.value = cached;
      } else {
        plans.value = [];
        uni.setStorageSync(CACHE_KEY, []);
      }
      return plans.value;
    } catch (e) {
      console.error("Failed to load treatment plans", e);
      plans.value = [];
      return plans.value;
    }
  };

  /**
   * 加载当前激活的治疗方案
   */
  const loadActivePlan = () => {
    try {
      const cached = uni.getStorageSync(ACTIVE_PLAN_KEY);
      if (cached) {
        activePlan.value = cached;
      } else {
        activePlan.value = null;
      }
      return activePlan.value;
    } catch (e) {
      console.error("Failed to load active treatment plan", e);
      activePlan.value = null;
      return activePlan.value;
    }
  };

  /**
   * 创建新的治疗方案
   * @param {object} diseaseInfo - 病害信息
   * @param {object} bundleInfo - 治疗套装信息
   * @param {string} plantId - 植物ID（可选）
   * @returns {object} 创建的治疗方案
   */
  const createPlan = (diseaseInfo, bundleInfo, plantId = null) => {
    const newPlan = {
      id: `plan_${Date.now()}`,
      diseaseId: diseaseInfo.id,
      diseaseName: diseaseInfo.name,
      bundleId: bundleInfo.id,
      bundleName: bundleInfo.name,
      bundlePrice: bundleInfo.price,
      bundleImage: bundleInfo.image,
      plantId,
      startDate: formatDate(new Date()),
      totalSteps: bundleInfo.schedule?.length || 0,
      currentStepIndex: 0,
      status: "active", // active, completed, abandoned
      schedule: bundleInfo.schedule.map((step, index) => ({
        ...step,
        isCompleted: false,
        completedAt: null,
        stepIndex: index,
      })),
      products: bundleInfo.products || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // 保存到列表
    const allPlans = loadPlans();
    allPlans.unshift(newPlan);
    savePlans(allPlans);

    // 设置为当前激活方案
    setActivePlan(newPlan);

    return newPlan;
  };

  /**
   * 保存所有治疗方案
   */
  const savePlans = (plansList) => {
    try {
      uni.setStorageSync(CACHE_KEY, plansList);
      plans.value = plansList;
    } catch (e) {
      console.error("Failed to save treatment plans", e);
    }
  };

  /**
   * 设置当前激活的治疗方案
   */
  const setActivePlan = (plan) => {
    try {
      uni.setStorageSync(ACTIVE_PLAN_KEY, plan);
      activePlan.value = plan;
    } catch (e) {
      console.error("Failed to set active treatment plan", e);
    }
  };

  /**
   * 根据ID查找治疗方案
   * @param {string} id - 方案ID
   * @returns {object|null} 找到的方案或null
   */
  const findPlanById = (id) => {
    loadPlans();
    return plans.value.find((plan) => plan.id === id) || null;
  };

  /**
   * 更新治疗方案
   * @param {string} planId - 方案ID
   * @param {object} updates - 要更新的字段
   */
  const updatePlan = (planId, updates) => {
    const allPlans = loadPlans();
    const planIndex = allPlans.findIndex((p) => p.id === planId);

    if (planIndex !== -1) {
      allPlans[planIndex] = {
        ...allPlans[planIndex],
        ...updates,
        updatedAt: Date.now(),
      };
      savePlans(allPlans);

      // 如果是当前激活的方案，同步更新
      if (activePlan.value?.id === planId) {
        setActivePlan(allPlans[planIndex]);
      }

      return allPlans[planIndex];
    }
    return null;
  };

  /**
   * 完成某个步骤
   * @param {string} planId - 方案ID
   * @param {number} stepIndex - 步骤索引
   */
  const completeStep = (planId, stepIndex) => {
    const plan = findPlanById(planId);
    if (!plan) return null;

    const updatedSchedule = [...plan.schedule];
    if (updatedSchedule[stepIndex]) {
      updatedSchedule[stepIndex].isCompleted = true;
      updatedSchedule[stepIndex].completedAt = Date.now();
    }

    // 更新当前步骤索引
    let newStepIndex = plan.currentStepIndex;
    if (
      stepIndex === plan.currentStepIndex &&
      stepIndex < updatedSchedule.length - 1
    ) {
      newStepIndex = stepIndex + 1;
    }

    // 检查是否全部完成
    const allCompleted = updatedSchedule.every((step) => step.isCompleted);
    const newStatus = allCompleted ? "completed" : "active";

    return updatePlan(planId, {
      schedule: updatedSchedule,
      currentStepIndex: newStepIndex,
      status: newStatus,
    });
  };

  /**
   * 放弃治疗方案
   * @param {string} planId - 方案ID
   */
  const abandonPlan = (planId) => {
    return updatePlan(planId, { status: "abandoned" });
  };

  /**
   * 删除治疗方案
   * @param {string} planId - 方案ID
   */
  const deletePlan = (planId) => {
    const allPlans = loadPlans();
    const filteredPlans = allPlans.filter((p) => p.id !== planId);
    savePlans(filteredPlans);

    // 如果删除的是当前激活方案，清除激活状态
    if (activePlan.value?.id === planId) {
      clearActivePlan();
    }
  };

  /**
   * 清除当前激活的方案
   */
  const clearActivePlan = () => {
    try {
      uni.removeStorageSync(ACTIVE_PLAN_KEY);
      activePlan.value = null;
    } catch (e) {
      console.error("Failed to clear active plan", e);
    }
  };

  /**
   * 获取进行中的方案
   */
  const getActivePlans = () => {
    loadPlans();
    return plans.value.filter((plan) => plan.status === "active");
  };

  /**
   * 获取已完成的方案
   */
  const getCompletedPlans = () => {
    loadPlans();
    return plans.value.filter((plan) => plan.status === "completed");
  };

  /**
   * 获取方案的完成百分比
   */
  const getPlanProgress = (plan) => {
    if (!plan || !plan.schedule || plan.schedule.length === 0) return 0;
    const completed = plan.schedule.filter((step) => step.isCompleted).length;
    return Math.round((completed / plan.schedule.length) * 100);
  };

  /**
   * 获取方案中使用的产品
   */
  const getPlanProducts = (plan) => {
    return plan?.products || [];
  };

  /**
   * 获取当前步骤应使用的产品
   */
  const getCurrentStepProducts = (plan) => {
    if (!plan || !plan.schedule) return [];
    const currentStep = plan.schedule[plan.currentStepIndex];
    if (!currentStep || !currentStep.productsUsed) return [];

    return plan.products.filter((p) => currentStep.productsUsed.includes(p.id));
  };

  /**
   * 格式化日期
   */
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /**
   * 计算治疗天数
   */
  const getTreatmentDays = (plan) => {
    if (!plan || !plan.startDate) return 0;
    const start = new Date(plan.startDate);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Computed
  const activePlansCount = computed(() => getActivePlans().length);
  const completedPlansCount = computed(() => getCompletedPlans().length);

  return {
    plans,
    activePlan,
    activePlansCount,
    completedPlansCount,
    loadPlans,
    loadActivePlan,
    createPlan,
    findPlanById,
    updatePlan,
    completeStep,
    abandonPlan,
    deletePlan,
    setActivePlan,
    clearActivePlan,
    getActivePlans,
    getCompletedPlans,
    getPlanProgress,
    getPlanProducts,
    getCurrentStepProducts,
    getTreatmentDays,
  };
}

// 治疗方案状态配置
export const PLAN_STATUS = {
  active: {
    label: "进行中",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  completed: { label: "已完成", color: "text-blue-600", bgColor: "bg-blue-50" },
  abandoned: {
    label: "已放弃",
    color: "text-slate-400",
    bgColor: "bg-slate-50",
  },
};

// 步骤类型配置
export const STEP_TYPES = {
  physical: {
    icon: "icon-lucide-scissors",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    label: "物理干预",
  },
  medicine: {
    icon: "icon-lucide-flask-conical",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    label: "药剂处理",
  },
  environment: {
    icon: "icon-lucide-wind",
    color: "text-sky-500",
    bgColor: "bg-sky-50",
    label: "环境调控",
  },
  observation: {
    icon: "icon-lucide-eye",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    label: "状态观察",
  },
  default: {
    icon: "icon-lucide-zap",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    label: "常规护理",
  },
};
