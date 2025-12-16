/*
 * @Date: 2025-12-11 09:19:36
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-11 09:19:39
 * @Description:
 */
/**
 * 参数处理
 * @param params 参数
 */
export function tansParams(params) {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== "" &&
            typeof value[key] !== "undefined"
          ) {
            let params = propName + "[" + key + "]";
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
}

/**
 * 参数处理，避免小程序跳转10层后无法跳转
 * @param url
 */
export function navigateBackTo(url) {
  const backUrl = url.slice(1);
  const pages = getCurrentPages();
  const num = pages.length; // 当前页面栈总数
  const index = pages.findIndex((item) => item.route === backUrl);
  const backnum = num - index - 1;
  uni.navigateBack({ delta: backnum });
}
