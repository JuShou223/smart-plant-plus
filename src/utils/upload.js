import config from "@/env.config.js";
import { tansParams } from "./common.js";

// 如果你需要在这里使用 Pinia，可以取消注释下面两行
// import { useUserStore } from '@/stores/user.js';
// const userStore = useUserStore();

let timeout = 10000;
const baseUrl = config.baseUrl;

const upload = (config) => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false;
  config.header = config.header || {};

  // 方式 1: 继续使用本地缓存获取 Token (最通用，兼容性好)
  let token = uni.getStorageSync("token");

  // 方式 2: 如果想用 Pinia (需要确保 Pinia 已初始化)
  // const userStore = useUserStore();
  // let token = userStore.vuex_token;

  if (token && !isToken) {
    config.header["Authorization"] = "Bearer " + token;
  }

  // get请求映射params参数
  if (config.params) {
    let url = config.url + "?" + tansParams(config.params);
    url = url.slice(0, -1);
    config.url = url;
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      timeout: config.timeout || timeout,
      url: baseUrl + config.url,
      filePath: config.filePath,
      name: config.name || "file",
      header: config.header,
      formData: config.formData,
      success: (res) => {
        // uni.uploadFile 返回的 data 是字符串，需要 parse
        let result = {};
        try {
          result = JSON.parse(res.data);
        } catch (e) {
          reject("JSON解析失败");
          return;
        }

        const code = result.code;
        const msg = result.msg;

        if (code === 200) {
          resolve(result);
        } else if (code == 401) {
          uni.showModal({
            title: "提示",
            content: "登录状态已过期，您可以继续留在该页面，或者重新登录?",
            cancelText: "取消",
            confirmText: "确认",
            showCancel: true,
            confirmColor: "#999999",
            cancelColor: "#39B54A",
            success: (res) => {
              if (res.confirm) {
                // 清除 Token
                uni.setStorageSync("token", "");
                // 推荐：同时也调用 Pinia 的 logout 方法清理状态
                // const userStore = useUserStore();
                // userStore.logout();

                uni.reLaunch({ url: "/pages/login/index" });
              }
            },
          });
          // 401 也可以 reject 出去
          reject("无效的会话，或者会话已过期，请重新登录。");
        } else {
          // ⚠️ 修改点：Vue3 JS文件中无法通过 this/vm 访问 $u
          // uView-Plus 将 $u 挂载到了 uni 对象上
          if (uni.$u && uni.$u.toast) {
            uni.$u.toast(msg);
          } else {
            // 兜底使用原生提示
            uni.showToast({ title: msg, icon: "none" });
          }
          reject(msg);
        }
      },
      fail: (err) => {
        console.log(err);
        // ⚠️ 修改点：网络错误应该 reject，否则调用方会一直等待
        uni.showToast({ title: "文件上传失败，请检查网络", icon: "none" });
        reject(err);
      },
    });
  });
};

export default upload;
