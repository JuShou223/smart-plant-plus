/*
 * @Date: 2025-12-08 09:43:30
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-08 09:49:54
 * @Description:
 */
import { defineStore } from "pinia";

// 需要永久存储的变量名 (对应原 index.js 中的 saveStateKeys)
const saveStateKeys = ["vuex_token", "profile"];

export const useUserStore = defineStore("user", {
  state: () => {
    // 启动时尝试从本地缓存读取数据
    let lifeData = uni.getStorageSync("lifeData") || {};
    return {
      // 如果缓存里有就用缓存的，没有就用默认值
      vuex_token: lifeData.vuex_token || "token",
      profile: lifeData.profile || {},
    };
  },
  actions: {
    // 替代原来的 $uStore mutation
    // 现在的 Pinia 可以直接修改 state，但为了兼容性或统一封装，你可以保留这个方法
    setProfile(data) {
      this.profile = data;
    },
    setToken(token) {
      this.vuex_token = token;
    },
    // 通用更新方法 (如果你想保留类似 this.$u.vuex('user.name', 'val') 的灵活性)
    setValue(key, value) {
      this[key] = value;
    },
  },
});

// 监听持久化逻辑：独立封装，不混在 Store 内部
export function setupUserStorePersistence(store) {
  store.$subscribe((mutation, state) => {
    // 获取本地存储的 lifeData
    let tmp = uni.getStorageSync("lifeData") || {};

    // 遍历需要存储的 key，更新 tmp 对象
    let needSave = false;
    saveStateKeys.forEach((key) => {
      if (state[key] !== undefined) {
        tmp[key] = state[key];
        needSave = true;
      }
    });

    // 保存回本地
    if (needSave) {
      uni.setStorageSync("lifeData", tmp);
    }
  });
}
