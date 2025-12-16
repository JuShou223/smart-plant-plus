/*
 * @Description: Vue 3 + Pinia + uView-Plus 主入口文件
 * @LastEditors: 徐一鸣
 */
import { createSSRApp } from "vue";
import * as Pinia from "pinia";
import { installMockInterceptor } from "@/common/mock.js";
import App from "./App.vue";

// 1. 引入样式 (Tailwind CSS)
// 假设你的 tailwind.css 在 src 根目录下
// import '@/tailwind.css';

// 2. 引入 uView-Plus (uView 的 Vue3 版本)
// 记得运行: npm install uview-plus
import uviewPlus from "uview-plus";

// 3. 引入公共工具
// 注意：bus.js 必须已改为使用 mitt (参考之前的 common/bus.js 修改)
import bus from "@/common/bus.js";
import mqttTool from "@/common/mqttTool.js";
import * as filters from "@/common/filters.js";
import tools from "@/common/tools.js";
// 扩展方法直接执行
import "@/common/extend.js";

// 4. 引入 API 和 拦截器
import httpInterceptor from "@/apis/http.interceptor.js";
import httpApi from "@/apis/http.api.js";

// 5. 引入 Store 持久化设置 (适配 Pinia)
// 这个文件紧接着在下面提供，必须创建！
import { useUserStore, setupUserStorePersistence } from "@/stores/user.js";

// 6. Mock 数据 (仅开发环境使用)
// 确保你 src/common/mock.js 文件存在
// import { installMockInterceptor } from "@/common/mock.js";

export function createApp() {
  const app = createSSRApp(App);

  // A. 初始化 Pinia
  const store = Pinia.createPinia();
  app.use(store);

  // B. 初始化 uView-Plus
  app.use(uviewPlus);

  // C. 挂载全局属性 (替代 Vue.prototype)
  app.config.globalProperties.$mqttTool = mqttTool;
  app.config.globalProperties.$bus = bus;

  // 过滤器适配：挂载到 $filters 对象上
  // 页面中使用: {{ $filters.parseTime(item.createTime) }}
  app.config.globalProperties.$filters = filters;

  // D. 安装自定义插件
  // 注意：Vue3 插件 install 方法第一个参数是 app
  app.use(tools);
  app.use(httpInterceptor); // 拦截器现在内部使用 Pinia 获取 token
  app.use(httpApi);

  // E. 初始化 Store 持久化 (关键)
  // 必须在 Pinia 安装后执行，用于从 localStorage 恢复 token 和用户信息
  const userStore = useUserStore(store);
  setupUserStorePersistence(userStore);

  // F. 启用 Mock
  // 根据需要保留或注释
  // #ifdef H5
  // installMockInterceptor();
  // console.log("🌿 植物管理Mock已启用 - 开发模式");
  // #endif
  // ==================== 植物管理Mock数据 ====================
  // 开发阶段启用Mock,后端接口实现后注释掉这3行即可
  installMockInterceptor();
  console.log("🌿 植物管理Mock已启用 - 开发模式");
  // ==================== Mock数据 END ====================

  return {
    app,
    Pinia, // 必须导出 Pinia，UniApp 机制需要
  };
}
