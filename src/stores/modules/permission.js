import { defineStore } from "pinia";
import permision from "@/utils/permission.js";

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    ACCESS_FINE_LOCATION: false,
    CAMERA: false,
    READ_EXTERNAL_STORAGE: false,
    /* #ifdef APP-PLUS */
    isIos: plus.os.name == "iOS",
    /* #endif */
    /* #ifndef APP-PLUS */
    isIos: false,
    /* #endif */
    mapping: {
      ACCESS_FINE_LOCATION: {
        title: "位置信息权限说明",
        content: "便于您使用该功能获取当前位置天气情况、WIFI列表等场景。",
        stateKey: "ACCESS_FINE_LOCATION", // 对应 state 中的 key
      },
      CAMERA: {
        title: "相机权限说明",
        content: "便于您使用该功能扫码添加设备。",
        stateKey: "CAMERA",
      },
      READ_EXTERNAL_STORAGE: {
        title: "存储空间/照片权限说明",
        content:
          "便于您使用该功能上传您的照片/图片及用于更换头像与扫描添加设备等场景中读取和写入相册和文件内容。",
        stateKey: "READ_EXTERNAL_STORAGE",
      },
    },
  }),
  actions: {
    // 修改权限状态
    setPermission(key, value) {
      if (this.$state.hasOwnProperty(key)) {
        this[key] = value;
      }
    },

    // 权限获取 Action
    async requestPermissions(permissionID) {
      try {
        if (!this[permissionID] && !this.isIos) {
          // Pinia 中可以直接调用其他 action，不需要 dispatch
          var viewObj = this.createNativeObjView(permissionID);
          viewObj.show();
        }
        return new Promise(async (resolve, reject) => {
          // 苹果不需要这个
          if (this.isIos) {
            resolve(1);
            return;
          }
          // Android权限查询
          const result = await permision.requestAndroidPermission(
            "android.permission." + permissionID
          );

          const mappingItem = this.mapping[permissionID];

          if (result === 1) {
            // 已获得授权
            this[mappingItem.stateKey] = true;
          } else if (result === 0) {
            // 未获得授权
            this[mappingItem.stateKey] = false;
          } else {
            // 被永久拒绝，引导去设置
            this[mappingItem.stateKey] = true; // 这里原逻辑似乎是置为 true? 需根据业务确认
            uni.showModal({
              title: "提示",
              content: "操作权限已被拒绝，请手动前往设置",
              confirmText: "立即设置",
              success: (res) => {
                if (res.confirm) {
                  permision.gotoAppPermissionSetting();
                }
              },
            });
          }
          if (viewObj) viewObj.close();
          resolve(result);
        });
      } catch (error) {
        console.log(error);
        // reject(error); // Pinia action 抛出错误最好处理一下
        throw error;
      }
    },

    // 提示框 (原 nativeObjView)
    createNativeObjView(permissionID) {
      const systemInfo = uni.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;
      const navigationBarHeight = systemInfo.platform === "android" ? 48 : 44;
      const totalHeight = statusBarHeight + navigationBarHeight;

      // 这里的逻辑与 Vue 版本无关，是 Plus API，保持不变
      let view = new plus.nativeObj.View("per-modal", {
        top: "0px",
        left: "0px",
        width: "100%",
        backgroundColor: "#444",
      });
      // ... (绘图逻辑保持原样，省略以节省篇幅，直接复制你原来的 view.drawRect 等代码即可)
      view.drawRect(
        {
          color: "#fff",
          radius: "10px",
        },
        {
          top: totalHeight + "px",
          left: "5%",
          width: "90%",
          height: "100px",
        }
      );

      const mappingItem = this.mapping[permissionID];

      view.drawText(
        mappingItem.title,
        {
          top: totalHeight + 7 + "px",
          left: "10%",
          height: "32px",
        },
        {
          align: "left",
          color: "#000",
        }
      );

      view.drawText(
        mappingItem.content,
        {
          top: totalHeight + 35 + "px",
          height: "62px",
          left: "10%",
          width: "80%",
        },
        {
          whiteSpace: "normal",
          size: "14px",
          align: "left",
          color: "#656563",
        }
      );

      function show() {
        view = plus.nativeObj.View.getViewById("per-modal");
        if (view) view.show();
      }

      function close() {
        view = plus.nativeObj.View.getViewById("per-modal");
        if (view) view.close();
        view = null;
      }
      return {
        show,
        close,
      };
    },
  },
});
