/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-08 10:04:44
 * @Description:
 */
// H5端开发和生产环境协议
let protocalDev = "ws://";
let protocalProd = "wss://";

// 条件编译，微信端和移动端使用wxs协议
// #ifdef MP-WEIXIN || APP-PLUS
protocalDev = "wx://";
protocalProd = "wx://";
// #endif

// 腾讯地图key
let qqmapKey = "4PDBZ-4KQKU-AX6VO-GU7NB-INDZJ-YBFXC";

// 心知天气key
let xinzhiKey = "SBh45_yy21FU5ErV_";

const CONFIG = {
  // 开发环境配置
  development: {
    officialWebUrl: "https://fastbee.cn/",
    // baseUrl: "http://192.168.0.142:8080",
    baseUrl: "http://118.178.93.44:8080",
    // mqttServer: protocalDev + "192.168.0.142:8083/mqtt",
    mqttServer: protocalDev + "118.178.93.44:8083/mqtt",
    decoderUrl: "http://localhost/", //主项目前端部署地址,能访问到js/jessibuca/decoder.js文件
    qqmapKey,
    xinzhiKey,
  },
  // 生产环境配置
  production: {
    officialWebUrl: "https://fastbee.cn/",
    baseUrl: "http://118.178.93.44:8080",
    mqttServer: protocalProd + "118.178.93.44:8083/mqtt",
    decoderUrl: "http://localhost/", //主项目前端部署地址,能访问到js/jessibuca/decoder.js文件
    qqmapKey,
    xinzhiKey,
  },
};
export default CONFIG[process.env.NODE_ENV];
