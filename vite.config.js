/*
 * @Date: 2025-11-03 20:06:25
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-09 13:33:15
 * @Description:
 */
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from "weapp-tailwindcss/vite";

export default defineConfig({
  // uni 是 uni-app 官方插件， uvtw 一定要放在 uni 后，对生成文件进行处理
  plugins: [
    uni(),
    uvwt({
      // rem2rpx: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        // require('tailwindcss')() 和 require('tailwindcss') 等价的，表示什么参数都不传，如果你想传入参数
        // require('tailwindcss')({} <- 这个是postcss插件参数)
        require("tailwindcss"),
        require("autoprefixer"),
        // 2. 🟢 新增：使用专门的插件处理全端 rem -> rpx
        require("postcss-rem-to-responsive-pixel")({
          // 核心计算公式：
          // Tailwind 默认 1rem = 16px
          // UniApp 规定 1px = 2rpx
          // 所以 1rem = 32rpx
          rootValue: 32,

          // 转换所有的属性（margin, padding, width, font-size 等）
          propList: ["*"],

          // 目标单位
          transformUnit: "rpx",
        }),
      ],
    },
    preprocessorOptions: {
      scss: {
        // 取消sass废弃API的报警
        silenceDeprecations: ["legacy-js-api", "color-functions", "import"],
      },
    },
  },
});
