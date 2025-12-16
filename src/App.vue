<!--
 * @Date: 2025-11-03 20:06:25
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-15 09:50:10
 * @Description:
-->
<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
@import '@/static/css/iconfont.css';
@import '@/static/css/tailwind.css';
@import "uview-plus/index.scss";


.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* 保留 inset 以备后用，但前面的 top/right... 已经能确保定位生效了 */
  inset: 0;
}

/* 如果你用了 inset-x-0 (水平铺满) */
.inset-x-0 {
  left: 0;
  right: 0;
  inset-inline: 0;
}

/* 如果你用了 inset-y-0 (垂直铺满) */
.inset-y-0 {
  top: 0;
  bottom: 0;
  inset-block: 0;
}

button {
  cursor: pointer;
  outline: none;
  border: none;
  background: none;
  margin: 0;
  line-height: 1 !important;
}

button:after {
  content: "";
  border: none;
  outline: none;
}

uni-button:after {
  content: "";
  border: none !important;
  outline: none !important;
}


/*每个页面公共css */
/* 定义动画 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
