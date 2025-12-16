/*
 * @Date: 2025-12-15 14:55:08
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-15 14:56:12
 * @Description:
 */
export const h5ImageToBase64 = (tempFilePath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = tempFilePath;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      // console.log('base64', base64)
      // 去掉 data:image/jpeg;base64, 前缀
      const pureBase64 = base64.replace(/^data:image\/jpeg;base64,/, "");
      resolve(pureBase64);
    };
  });
};

export const appImageToBase64 = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    const relativePath = tempFilePath.replace("file://", "");
    plus.io.resolveLocalFileSystemURL(relativePath, (entry) => {
      entry.file((file) => {
        const fileReader = new plus.io.FileReader();
        fileReader.onloadend = (e) => {
          resolve(e.target.result);
        };
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
      });
    });
  });
};

export const mpImageToBase64 = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    const fileManager = wx.getFileSystemManager();
    fileManager.readFile({
      filePath: tempFilePath,
      encoding: "base64",
      success: (res) => {
        // 微信小程序返回的是纯base64，需要拼接data URL
        const base64 = `data:image/jpeg;base64,${res.data}`;
        resolve(base64);
      },
      fail: reject,
    });
  });
};
