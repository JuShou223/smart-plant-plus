// common/http.interceptor.js
import projectConfig from "@/env.config.js";
// 引入 Pinia Store (假设你已经按之前的建议创建了 stores/user.js)
import { useUserStore } from "@/stores/user.js";

const install = (app) => {
  // uView 2.0+ 的 http 挂载在 uni.$u.http 上
  uni.$u.http.setConfig((config) => {
    config.baseURL = projectConfig.baseUrl;
    config.header = {};
    config.dataType = "json";
    config.responseType = "text";
    config.custom = {
      ShowLoading: false,
      LoadingMask: true,
      LoadingText: "正在加载",
    };
    config.timeout = 60000;

    // #ifdef APP-PLUS
    config.sslVerify = true;
    config.firstIpv4 = false;
    // #endif

    // #ifdef H5
    config.withCredentials = false;
    // #endif

    config.validateStatus = (statusCode) => {
      return statusCode >= 200 && statusCode < 300;
    };
    return config;
  });

  // 请求拦截
  uni.$u.http.interceptors.request.use(
    (config) => {
      if (config.custom.ShowLoading) {
        uni.showLoading({
          title: config.custom.LoadingText || "正在加载",
          mask: config.custom.LoadingMask || false,
        });
      }

      // 关键修改：获取 Token 的 Vue 3 + Pinia 写法
      const userStore = useUserStore();

      // 排除不需要 token 的接口
      if (
        config.url != "/captchaImage" &&
        config.url != "/login" &&
        config.url != "/iot/tool/register"
      ) {
        // 从 Pinia 中获取 token
        const token = userStore.vuex_token;
        if (token) {
          config.header.Authorization = "Bearer " + token;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截
  uni.$u.http.interceptors.response.use(
    (res) => {
      if (res.config.custom.ShowLoading) {
        uni.hideLoading();
      }

      if (res.statusCode === 200) {
        let result = res.data;
        if (result.code === 200 || result.code === 500 || result.code === 450) {
          return result;
        } else if (result.code == 401) {
          // Token 过期处理
          const userStore = useUserStore();
          userStore.setToken(""); // 清空 token
          uni.setStorageSync("token", "");

          uni.reLaunch({
            url: "/pages/login/index",
          });
          uni.showToast({ title: "请重新登录", icon: "none" });
        } else {
          console.log(result);
          uni.showToast({ title: result.msg || "请求失败", icon: "none" });
        }
      } else {
        uni.showToast({ title: res.data.msg || "网络错误", icon: "none" });
      }
      // uView 响应拦截器如果返回 false 或 reject，会进入 catch
      return false; // 或者 Promise.reject(res)
    },
    (error) => {
      // 这里的 error 可能是网络错误等
      if (
        error.config &&
        error.config.custom &&
        error.config.custom.ShowLoading
      ) {
        uni.hideLoading();
      }
      return Promise.reject(error);
    }
  );
};

export default {
  install,
};
