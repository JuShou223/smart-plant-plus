/*
 * @Date: 2025-12-08 09:55:31
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-08 09:55:44
 * @Description:
 */
// common/bus.js
import mitt from "mitt";

const bus = mitt();

export default bus;
// ```

// **使用方式变更**：
// * **旧 (Vue 2)**: `uni.$emit('evt', val)` 或 `this.$bus.$emit(...)`
// * **新 (Vue 3)**:
//     ```javascript
//     import bus from '@/common/bus.js'

//     // 发送
//     bus.emit('eventName', data)

//     // 监听
//     bus.on('eventName', (data) => {
//       console.log(data)
//     })

//     // 移除
//     bus.off('eventName')
