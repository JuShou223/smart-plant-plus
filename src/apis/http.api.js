/*
 * @Date: 2025-12-08 10:08:31
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-08 10:08:42
 * @Description:
 */
import * as common from "./modules/common.js";
// import * as account from "./modules/account.js";
// import * as group from "./modules/group.js";
// import * as deviceUser from "./modules/deviceUser.js";
// import * as deviceLog from "./modules/deviceLog.js";
// import * as device from "./modules/device.js";

// api 接口管理
const install = (app) => {
  // Vue 3 写法
  app.config.globalProperties.$api = {
    // import modules
    common,
    // group,
    // deviceUser,
    // deviceLog,
    // device,
    // account,
  };
};

export default {
  install,
};
