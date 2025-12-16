<template>
  <view class="min-h-screen flex bg-white font-sans overflow-hidden relative">

    <!-- 左侧：背景视觉区 (保持不变) -->
    <view
      class="fixed inset-0 z-50 bg-slate-900 overflow-hidden transition-all duration-1000 cubic-bezier(0.7, 0, 0.3, 1) lg:relative lg:inset-auto lg:w-1/2 lg:flex lg:transform-none lg:opacity-100"
      :class="[!showSplash ? '-translate-y-full opacity-0 pointer-events-none lg:pointer-events-auto' : 'translate-y-0 opacity-100']">
      <image src="https://xym-test.oss-cn-beijing.aliyuncs.com/photo-1542601906990-b4d3fb778b09.png" mode="aspectFill"
        class="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 hover:scale-110 transition-transform duration-[20s] ease-in-out" />
      <view class="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />

      <!-- 数据 HUD -->
      <view
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-md flex flex-col justify-center h-full lg:h-auto lg:block">
        <!-- Mobile Header -->
        <view class="lg:hidden absolute top-12 left-0 right-0 text-center animate-fade-in-down flex justify-center">
          <view
            class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <text class="iconfont icon-lucide-sprout text-emerald-400"></text>
            <text class="text-white font-bold tracking-wider ml-2">SmartGreen</text>
          </view>
        </view>

        <view class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl animate-fade-in-up">
          <view class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <view class="flex items-center space-x-2">
              <view class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></view>
              <text class="text-emerald-100 text-xs font-mono tracking-widest uppercase">System Online</text>
            </view>
            <text class="iconfont icon-lucide-wifi text-emerald-400 opacity-80"></text>
          </view>
          <view class="grid grid-cols-2 gap-4">
            <view class="bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
              <text class="iconfont icon-lucide-thermometer text-emerald-300 mb-2"></text>
              <text class="text-3xl font-light text-white font-mono mt-2">24.5°</text>
              <text class="text-[10px] text-emerald-200/60 mt-1 uppercase">Temperature</text>
            </view>
            <view class="bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
              <text class="iconfont icon-lucide-droplets text-blue-300 mb-2"></text>
              <text class="text-3xl font-light text-white font-mono mt-2">68%</text>
              <text class="text-[10px] text-emerald-200/60 mt-1 uppercase">Humidity</text>
            </view>
          </view>
        </view>

        <view class="mt-8 text-center lg:text-center">
          <text class="text-3xl font-bold text-white tracking-tight block">连接自然与科技</text>
          <text class="text-emerald-200/80 mt-2 font-light block">让每一株植物都拥有表达的能力</text>
        </view>

        <!-- 开启体验按钮 -->
        <view class="lg:hidden mt-12 text-center animate-bounce-slow flex justify-center">
          <button @click="showSplash = false"
            class="group flex flex-col items-center justify-center bg-transparent border-0 after:border-0"
            hover-class="none">
            <view
              class="bg-emerald-500/20 p-3 rounded-full border border-solid border-emerald-500/50 backdrop-blur-sm transition-transform active:scale-95">
              <text class="iconfont icon-lucide-chevron-up text-emerald-400"></text>
            </view>
            <text class="text-emerald-100 text-sm font-medium tracking-widest uppercase opacity-80 mt-2">开启体验</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 右侧：登录交互区 -->
    <view
      class="w-full h-full box-border min-h-screen lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative bg-[#FAFAFA]">
      <!-- 装饰背景 -->
      <text
        class="iconfont icon-lucide-leaf absolute -top-20 -right-20 text-[300px] text-emerald-900 opacity-[0.03] rotate-45 pointer-events-none"></text>
      <text
        class="iconfont icon-lucide-leaf absolute bottom-0 left-0 text-[200px] text-emerald-900 opacity-[0.02] -rotate-12 pointer-events-none"></text>

      <view class="w-full max-w-md relative z-10 animate-fade-in">
        <view class="mb-8">
          <view class="flex items-center space-x-3 mb-2">
            <view class="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-200 flex items-center justify-center">
              <text class="iconfont icon-lucide-sprout text-white"></text>
            </view>
            <text class="text-xl font-bold text-slate-800 tracking-tight">智能养植</text>
          </view>
          <view class="mt-6 mb-2">
            <text class="text-4xl font-bold text-slate-900 block">欢迎回来</text>
          </view>
          <text class="text-slate-500 block">请输入您的账号以管理您的智能花园</text>
        </view>

        <view class="space-y-6">
          <!-- 账号 Input -->
          <view class="relative group">
            <view class="relative">
              <input type="text" v-model="loginForm.username"
                class="peer block w-full border-0 bg-transparent py-2.5 text-slate-900 focus:ring-0 text-lg font-medium placeholder-transparent"
                placeholder="" @focus="activeField = 'username'" @blur="activeField = null" @input="clearError" />
              <text class="absolute left-0 text-xs text-slate-500 transition-all font-medium pointer-events-none"
                :class="[
                  (activeField === 'username' || loginForm.username) ? '-top-3.5 text-xs text-emerald-600' : 'top-2 text-base text-slate-400'
                ]">
                账号
              </text>
              <view class="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200"></view>
              <view
                class="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600 transition-transform duration-500 origin-left"
                :class="[activeField === 'username' ? 'scale-x-100' : 'scale-x-0']"></view>
            </view>
            <view class="absolute right-0 top-2 transition-colors duration-300">
              <text class="iconfont icon-lucide-user text-xl"
                :class="[activeField === 'username' ? 'text-emerald-600' : 'text-slate-300']"></text>
            </view>
          </view>

          <!-- 密码 Input -->
          <view class="relative group">
            <view class="relative">
              <input type="password" v-model="loginForm.password"
                class="peer block w-full border-0 bg-transparent py-2.5 text-slate-900 focus:ring-0 text-lg font-medium placeholder-transparent"
                placeholder="" @focus="activeField = 'password'" @blur="activeField = null" @input="clearError" />
              <text class="absolute left-0 text-xs text-slate-500 transition-all font-medium pointer-events-none"
                :class="[
                  (activeField === 'password' || loginForm.password) ? '-top-3.5 text-xs text-emerald-600' : 'top-2 text-base text-slate-400'
                ]">
                密码
              </text>
              <view class="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200"></view>
              <view
                class="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600 transition-transform duration-500 origin-left"
                :class="[activeField === 'password' ? 'scale-x-100' : 'scale-x-0']"></view>
            </view>
            <view class="absolute right-0 top-2 transition-colors duration-300">
              <text class="iconfont icon-lucide-lock text-xl"
                :class="[activeField === 'password' ? 'text-emerald-600' : 'text-slate-300']"></text>
            </view>
          </view>

          <!-- 验证码 Input -->
          <view class="flex space-x-4 items-end">
            <view class="relative group flex-1">
              <view class="relative">
                <input type="text" v-model="loginForm.code"
                  class="peer block w-full border-0 bg-transparent py-2.5 text-slate-900 focus:ring-0 text-lg font-medium placeholder-transparent uppercase tracking-widest"
                  placeholder="" @focus="activeField = 'code'" @blur="activeField = null" @input="clearError"
                  maxlength="4" />
                <text class="absolute left-0 text-xs text-slate-500 transition-all font-medium pointer-events-none"
                  :class="[
                    (activeField === 'code' || loginForm.code) ? '-top-3.5 text-xs text-emerald-600' : 'top-2 text-base text-slate-400'
                  ]">
                  验证码
                </text>
                <view class="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200"></view>
                <view
                  class="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600 transition-transform duration-500 origin-left"
                  :class="[activeField === 'code' ? 'scale-x-100' : 'scale-x-0']"></view>
              </view>
              <view class="absolute right-0 top-2 transition-colors duration-300">
                <text class="iconfont icon-lucide-shield-check text-xl"
                  :class="[activeField === 'code' ? 'text-emerald-600' : 'text-slate-300']"></text>
              </view>
            </view>

            <!-- 验证码图片 -->
            <!-- <view @click="getCode"
              class="w-32 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden group/captcha">
              <image v-if="codeUrl" :src="codeUrl" class="w-full h-full object-cover" mode="scaleToFill" />
              <view v-else class="animate-pulse w-full h-full bg-slate-200"></view>
            </view> -->
            <!-- Captcha Display Area -->
            <view @click="getCode"
              class="w-32 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden group/captcha">
              <!-- Noise background simulation -->
              <view class="absolute inset-0 opacity-10 bg-slate-900"
                style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 4px 4px;"></view>
              <image v-if="codeUrl" :src="codeUrl" class="w-[90%] h-[80%] object-cover" mode="scaleToFill" />
              <!-- <text class="text-2xl font-mono font-bold text-slate-600 tracking-[0.2em] relative z-10 drop-shadow-sm">
                {{ captchaCode }}
              </text> -->
              <!-- <view class="absolute top-1 right-1">
                <text class="iconfont icon-lucide-refresh-cw text-xs text-slate-400"></text>
              </view> -->
            </view>
          </view>

          <!-- <view class="flex justify-between items-center">
            <view class="flex items-center space-x-2" @click="handleRememberMe">
              <view class="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                :class="[loginForm.rememberMe ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white']">
                <text v-if="loginForm.rememberMe" class="iconfont icon-lucide-check text-white text-[10px]"></text>
              </view>
              <text class="text-xs text-slate-500">记住密码</text>
            </view>

            <text class="text-sm font-medium text-emerald-600" @click="handleForgotPassword">忘记密码?</text>
          </view> -->

          <!-- 协议勾选 -->
          <view class="flex items-center space-x-3">
            <view
              class="relative flex items-center justify-center mt-0.5 w-5 h-5 rounded-md border border-solid transition-all cursor-pointer"
              :class="[isClause ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-transparent']"
              @click="toggleClause">
              <text v-if="isClause" class="iconfont icon-lucide-check text-white text-xs font-bold"></text>
            </view>
            <view class="text-xs text-slate-500 leading-relaxed flex-1">
              <text @click="toggleClause">我已阅读并同意 </text>
              <text class="text-emerald-600 font-bold" @click.stop="handleService">《服务协议》</text>
              <text> 和 </text>
              <text class="text-emerald-600 font-bold" @click.stop="handlePrivacy">《隐私政策》</text>
            </view>
          </view>

          <!-- 错误提示 -->
          <view v-if="errorMsg"
            class="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl flex items-center space-x-2 animate-fade-in border border-red-100">
            <text class="iconfont icon-lucide-alert-circle text-base"></text>
            <text class="font-medium">{{ errorMsg }}</text>
          </view>

          <!-- 登录按钮 -->
          <!-- 套一层view标签解决小程序space-y-6样式对button不生效问题 -->
          <view>
            <button @click="handleLogin" :disabled="loading"
              class="w-full relative flex items-center justify-center py-4 px-6 border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-emerald-600 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-emerald-200"
              :class="{ 'opacity-70': loading }">
              <view v-if="loading" class="animate-spin mr-2">
                <text class="iconfont icon-lucide-loader-2 text-xl"></text>
              </view>
              <view v-else class="flex items-center relative z-10">
                <text>进入我的花园</text>
                <view class="ml-2">
                  <text class="iconfont icon-lucide-arrow-right text-base"></text>
                </view>
              </view>
              <view
                class="absolute inset-0 bg-emerald-600 opacity-0 active:opacity-100 transition-opacity duration-300">
              </view>
            </button>
          </view>
        </view>

        <view class="mt-8 flex items-center justify-center space-x-2">
          <text class="text-slate-400 text-sm">还没有账号?</text>
          <text class="text-emerald-600 font-bold text-sm" @click="handleRegister">立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { login, captchaImage, getProfile } from '@/apis/modules/common.js'; // 确保这些 API 已经正确导出
import { useUserStore } from '@/stores/user.js';
// import projectConfig from '@/env.config.js';

const userStore = useUserStore();
const loading = ref(false);
const showSplash = ref(true);
const activeField = ref(null);
const errorMsg = ref(null);

// 验证码图片 Base64
const codeUrl = ref('');

// 登录表单
const loginForm = reactive({
  username: 'fastbee',
  password: '123456',
  rememberMe: false,
  code: '',
  uuid: '',
});

// 协议勾选状态
const isClause = ref(false);

// 初始化
onMounted(() => {
  // 检查本地是否有 Token，如果有直接跳转（可选）
  // if (uni.getStorageSync('token')) {
  //    uni.switchTab({ url: '/pages/tabBar/home/index' });
  //    return;
  // }

  getCode();
  getAccount();
});

// 获取验证码
const getCode = () => {
  captchaImage().then(res => {
    // 后端通常返回 { img: 'base64...', uuid: '...' }
    // 注意：有些后端返回直接是 'data:image/...'，有些不是，这里按照你提供的逻辑拼接
    codeUrl.value = 'data:image/gif;base64,' + res.img;
    loginForm.uuid = res.uuid;
    loginForm.code = ''; // 刷新后清空输入
  }).catch(err => {
    console.error('验证码获取失败', err);
    uni.showToast({ title: '验证码获取失败', icon: 'none' });
  });
};

// 登录处理
const handleLogin = async () => {
  errorMsg.value = null;

  // 1. 基础校验
  if (!loginForm.username || !loginForm.password) {
    errorMsg.value = '账号信息不能为空';
    return;
  }
  if (!loginForm.code) {
    errorMsg.value = '请输入验证码';
    return;
  }
  if (!isClause.value) {
    errorMsg.value = '请阅读并勾选协议';
    return;
  }

  loading.value = true;

  try {
    const res = await login(loginForm);

    if (res.code === 200) {
      // 1. 存储 Token (Local + Pinia)
      uni.setStorageSync('token', res.token);
      userStore.setToken(res.token);

      // 2. 记住密码逻辑
      saveAccount();

      // 3. 获取并存储用户信息
      try {
        const profileRes = await getProfile();
        // 注意：这里根据后端返回结构可能需要 .data
        const profile = profileRes.data || profileRes;
        userStore.setProfile(profile);
      } catch (e) {
        console.error('获取用户信息失败', e);
      }

      // 4. 跳转主页
      uni.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        uni.switchTab({ url: '/pages/index/index' });
      }, 500);

    } else {
      // 登录失败
      errorMsg.value = res.msg || '登录失败';
      // 刷新验证码
      setTimeout(() => {
        getCode();
      }, 1000);
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = err.msg || '网络请求错误';
    getCode();
  } finally {
    loading.value = false;
  }
};

// 记住密码逻辑
const saveAccount = () => {
  if (loginForm.rememberMe) {
    uni.setStorageSync('username', loginForm.username);
    uni.setStorageSync('password', loginForm.password);
  } else {
    uni.removeStorageSync('username');
    uni.removeStorageSync('password');
  }
};

// 恢复记住的密码
const getAccount = () => {
  const username = uni.getStorageSync('username');
  const password = uni.getStorageSync('password');
  if (username) {
    loginForm.username = username;
    loginForm.rememberMe = true;
  }
  if (password) {
    loginForm.password = password;
  }
};

// 杂项交互
const toggleClause = () => {
  isClause.value = !isClause.value;
  if (isClause.value) clearError();
};

const handleRememberMe = () => {
  loginForm.rememberMe = !loginForm.rememberMe;
};

const clearError = () => {
  errorMsg.value = null;
};

const handleRegister = () => {
  uni.navigateTo({ url: '/pages/login/register' });
};

const handleForgotPassword = () => {
  uni.showToast({ title: '请联系管理员重置密码', icon: 'none' });
};

const handleService = () => {
  // 假设你有 webview 页面
  // uni.navigateTo({ url: `/pages/webview/index?url=${projectConfig.officialWebUrl}service.html` });
  uni.showToast({ title: '打开服务协议', icon: 'none' });
};

const handlePrivacy = () => {
  uni.showToast({ title: '打开隐私政策', icon: 'none' });
};
</script>

<style scoped>
input {
  outline: none;
}

/* 动画定义 (保持原有) */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}
</style>