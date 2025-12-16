/*
 * @Date: 2025-12-08 09:58:04
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-08 09:58:26
 * @Description:
 */
// 移除了 import Vue...

// 只是普通的导出函数即可
export function toUpperCase(arg) {
  return arg && arg.toUpperCase();
}

// 你可以添加更多格式化函数...
// export function formatDate(value) {
//     // ...
// }
// ```

// **使用方式变更**：
// * **方法 A (全局挂载 - 推荐)**：
//     你在 `main.js` 中已经通过 `app.config.globalProperties.$filters = filters` 挂载了（参考我上一条回复的 main.js 代码）。
//     ```html
//     <!-- 组件中使用 -->
//     <view>{{ $filters.toUpperCase(name) }}</view>
//     ```

// * **方法 B (按需引入)**：
//     ```javascript
//     import { toUpperCase } from '@/common/filters.js'
//     // 在 script setup 中直接使用 toUpperCase(name)
//     ```

// ---
