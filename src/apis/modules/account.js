/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:07:14
 * @Description:
 */
import upload from "@/utils/upload";
//修改个人信息
export function updateProfile(params) {
  return uni.$u.http.put("/system/user/profile", params);
}

//用户头像上传
export function uploadAvatar(data) {
  return upload({
    url: "/system/user/profile/avatar",
    method: "post",
    name: data.name,
    filePath: data.filePath,
  });
}

//用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  return uni.$u.http.request({
    url:
      "/system/user/profile/updatePwd?oldPassword=" +
      oldPassword +
      "&newPassword=" +
      newPassword,
    method: "put",
  });
}
