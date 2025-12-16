/*
 * @Date: 2025-12-08 10:09:08
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:06:56
 * @Description: API 接口文件 - 修复 uni.$u 未定义问题
 */

// ❌ 移除这行，因为文件加载时 uView 还没初始化
// const http = uni.$u.http;

// 💡 技巧：如果不想改下面的每行代码，可以使用 Proxy 动态获取 (可选)
// 或者直接用 uni.$u.http 替换 http (推荐，更直观)

// 查询所有产品列表
export function listShortProduct() {
  // ✅ 在函数内部调用，此时 uView 已初始化完成
  return uni.$u.http.get("/iot/product/shortList");
}

// 获取验证码
export function captchaImage() {
  return uni.$u.http.get("/captchaImage");
}

// 获取用户信息
export function getProfile() {
  return uni.$u.http.get("/system/user/profile");
}

// 个人中心-微信绑定-app和小程序
export function wechatBind(params) {
  return uni.$u.http.post("/wechat/bind", params);
}

// 解除微信绑定
export function secureBind(params) {
  return uni.$u.http.post("/wechat/cancelBind", params);
}

// 登录
export function login(params) {
  return uni.$u.http.post("/login", params);
}

// 绑定登录
export function bindLogin(params) {
  return uni.$u.http.post("/auth/bind/login", params);
}

// 绑定注册
export function bindRegister(params) {
  return uni.$u.http.post("/auth/bind/register", params);
}

// 获取短信验证码
export function getSmsCode(phoneNumber) {
  return uni.$u.http.request({
    url: "/notify/smsLoginCaptcha?phoneNumber=" + phoneNumber,
    method: "get",
  });
}

// 短信登录
export function smsLogin(params) {
  return uni.$u.http.post("/auth/sms/login", params);
}

// 退出登录
export function logout() {
  return uni.$u.http.post("/logout");
}

// 注册方法
export function register(params) {
  return uni.$u.http.post("/iot/tool/register", params);
}

// 查询用户列表
export function listUser(params) {
  return uni.$u.http.get("/iot/tool/userList", {
    params: params,
  });
}

// 注销账号
export function unsubscribe() {
  return uni.$u.http.post("/unsubscribe");
}
