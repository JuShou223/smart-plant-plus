<template>
  <view class="min-h-screen flex bg-white font-sans overflow-hidden relative">

    <!-- 左侧：沉浸式视觉区 (Splash) -->
    <!-- <view
      class="fixed inset-0 z-50 bg-slate-900 overflow-hidden transition-all duration-1000 cubic-bezier(0.7, 0, 0.3, 1) lg:relative lg:inset-auto lg:w-1/2 lg:flex lg:transform-none lg:opacity-100"
      :class="[!showSplash ? '-translate-y-full opacity-0 pointer-events-none lg:pointer-events-auto' : 'translate-y-0 opacity-100']">
      <image
        src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
        mode="aspectFill"
        class="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 hover:scale-110 transition-transform duration-[20s] ease-in-out" />
      <view class="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />

      <view
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-md flex flex-col justify-center h-full lg:h-auto lg:block">
        <view class="lg:hidden absolute top-12 left-0 right-0 text-center animate-fade-in-down flex justify-center">
          <view
            class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <text class="iconfont icon-lucide-sprout text-emerald-400 text-xl"></text>
            <text class="text-white font-bold tracking-wider ml-2">SmartGreen</text>
          </view>
        </view>

        <view class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl animate-fade-in-up">
          <view class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <view class="flex items-center space-x-2">
              <view class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></view>
              <text class="text-emerald-100 text-xs font-mono tracking-widest uppercase">System Initialization</text>
            </view>
          </view>

          <view class="space-y-4">
            <view>
              <view class="flex items-center justify-between text-white/80 text-sm mb-1">
                <text>Environment Scan</text>
                <text class="text-emerald-300">Complete</text>
              </view>
              <view class="h-1 bg-white/10 rounded-full overflow-hidden">
                <view class="h-full bg-emerald-500 w-full"></view>
              </view>
            </view>

            <view>
              <view class="flex items-center justify-between text-white/80 text-sm mb-1">
                <text>Sensor Calibration</text>
                <text class="text-emerald-300">Ready</text>
              </view>
              <view class="h-1 bg-white/10 rounded-full overflow-hidden">
                <view class="h-full bg-emerald-500 w-[90%]"></view>
              </view>
            </view>
          </view>

          <view class="mt-6 p-4 bg-emerald-900/30 rounded-xl border border-emerald-500/20">
            <text class="text-emerald-100 text-xs leading-relaxed block">
              "加入我们的智能生态网络，让科技呵护每一片绿叶。"
            </text>
          </view>
        </view>

        <view class="mt-8 text-center lg:text-center">
          <text class="text-3xl font-bold text-white tracking-tight block">开启绿色旅程</text>
          <text class="text-emerald-200/80 mt-2 font-light block">注册账号，打造您的专属智能花园</text>
        </view>

        <view class="lg:hidden mt-12 text-center animate-bounce-slow flex justify-center">
          <button @click="showSplash = false"
            class="group flex flex-col items-center justify-center bg-transparent border-0 after:border-0"
            hover-class="none">
            <view
              class="bg-emerald-500/20 p-3 rounded-full border border-emerald-500/50 backdrop-blur-sm transition-transform active:scale-95">
              <text class="iconfont icon-lucide-chevron-up text-emerald-400 text-2xl"></text>
            </view>
            <text class="text-emerald-100 text-sm font-medium tracking-widest uppercase opacity-80 mt-2">开始注册</text>
          </button>
        </view>
      </view>
    </view> -->

    <!-- 右侧：注册表单 -->
    <view
      class="w-full h-full box-border min-h-screen lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative bg-[#FAFAFA] overflow-y-auto">
      <!-- 装饰背景 -->
      <text
        class="iconfont icon-lucide-leaf absolute -top-20 -right-20 text-[300px] text-emerald-900 opacity-[0.03] rotate-45 pointer-events-none"></text>

      <view class="w-full max-w-md relative z-10 animate-fade-in py-8">
        <view class="mb-8">
          <view @click="handleBackToLogin"
            class="text-slate-400 hover:text-emerald-600 flex items-center text-sm font-medium mb-4 transition-colors cursor-pointer">
            <text class="mr-1">←</text> <text>返回登录</text>
          </view>
          <text class="text-3xl font-bold text-slate-900 mb-2 block">创建账号</text>
          <text class="text-slate-500 block">只需几步，即可连接您的智能设备</text>
        </view>

        <view class="space-y-5">

          <!-- Username Input -->
          <view class="relative group">
            <view class="relative">
              <input type="text" v-model="registerForm.username"
                class="peer block w-full border-0 bg-transparent py-2 text-slate-900 focus:ring-0 text-base font-medium border-b border-slate-200 focus:border-emerald-600 transition-colors"
                placeholder="" placeholder-class="placeholder-transparent" @focus="activeField = 'username'"
                @blur="activeField = null" @input="clearError" />
              <text class="absolute left-0 text-xs text-slate-500 transition-all font-medium pointer-events-none"
                :class="[
                  (activeField === 'username' || registerForm.username) ? '-top-3.5 text-xs text-emerald-600' : 'top-2 text-base text-slate-400'
                ]">
                用户名
              </text>
              <view class="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200"></view>
              <view
                class="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-600 transition-transform duration-500 origin-left"
                :class="[activeField === 'username' ? 'scale-x-100' : 'scale-x-0']"></view>
            </view>
            <view class="absolute right-0 top-2 transition-colors duration-300">
              <text class="iconfont icon-lucide-user text-xl"
                :class="[activeField === 'username' ? 'text-emerald-600' : 'text-slate-300']"></text>
            </view>
          </view>

          <!-- Phone Input -->
          <view class="relative group">
            <view class="relative">
              <input type="tel" v-model="registerForm.phonenumber"
                class="peer block w-full border-0 bg-transparent py-2 text-slate-900 focus:ring-0 text-base font-medium border-b border-slate-200 focus:border-emerald-600 transition-colors"
                placeholder="" placeholder-class="placeholder-transparent" @focus="activeField = 'phonenumber'"
                @blur="activeField = null" @input="clearError" maxlength="11" />
              <text class="absolute left-0 text-xs text-slate-500 transition-all font-medium pointer-events-none"
                :class="[
                  (activeField === 'phonenumber' || registerForm.phonenumber) ? '-top-3.5 text-xs text-emerald-600' : 'top-2 text-base text-slate-400'
                ]">
                手机号码
              </text>
              <view class="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200"></view>
              <view
                class="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-600 transition-transform duration-500 origin-left"
                :class="[activeField === 'phonenumber' ? 'scale-x-100' : 'scale-x-0']"></view>
            </view>
            <view class="absolute right-0 top-2 transition-colors duration-300">
              <text class="iconfont icon-lucide-phone text-xl"
                :class="[activeField === 'phonenumber' ? 'text-emerald-600' : 'text-slate-300']"></text>
            </view>
          </view>

          <!-- Password Input -->
          <view class="relative group">
            <view class="relative">
              <input type="password" v-model="registerForm.password"
                class="peer block w-full border-0 bg-transparent py-2 text-slate-900 focus:ring-0 text-base font-medium border-b border-slate-200 focus:border-emerald-600 transition-colors"
                placeholder="" placeholder-class="placeholder-transparent" @focus="activeField = 'password'"
                @blur="activeField = null" @input="clearError" />
              <text class="absolute left-0 text-xs text-slate-500 transition-all font-medium pointer-events-none"
                :class="[
                  (activeField === 'password' || registerForm.password) ? '-top-3.5 text-xs text-emerald-600' : 'top-2 text-base text-slate-400'
                ]">
                设置密码
              </text>
              <view class="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200"></view>
              <view
                class="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-600 transition-transform duration-500 origin-left"
                :class="[activeField === 'password' ? 'scale-x-100' : 'scale-x-0']"></view>
            </view>
            <view class="absolute right-0 top-2 transition-colors duration-300">
              <text class="iconfont icon-lucide-lock text-xl"
                :class="[activeField === 'password' ? 'text-emerald-600' : 'text-slate-300']"></text>
            </view>
          </view>

          <!-- Confirm Password Input -->
          <view class="relative group">
            <view class="relative">
              <input type="password" v-model="registerForm.confirmPassword"
                class="peer block w-full border-0 bg-transparent py-2 text-slate-900 focus:ring-0 text-base font-medium border-b border-slate-200 focus:border-emerald-600 transition-colors"
                placeholder="" placeholder-class="placeholder-transparent" @focus="activeField = 'confirmPassword'"
                @blur="activeField = null" @input="clearError" />
              <text class="absolute left-0 text-xs text-slate-500 transition-all font-medium pointer-events-none"
                :class="[
                  (activeField === 'confirmPassword' || registerForm.confirmPassword) ? '-top-3.5 text-xs text-emerald-600' : 'top-2 text-base text-slate-400'
                ]">
                确认密码
              </text>
              <view class="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200"></view>
              <view
                class="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-600 transition-transform duration-500 origin-left"
                :class="[activeField === 'confirmPassword' ? 'scale-x-100' : 'scale-x-0']"></view>
            </view>
            <view class="absolute right-0 top-2 transition-colors duration-300">
              <text class="iconfont icon-lucide-lock text-xl"
                :class="[activeField === 'confirmPassword' ? 'text-emerald-600' : 'text-slate-300']"></text>
            </view>
          </view>

          <!-- Captcha Input -->
          <view class="flex space-x-4 items-end pt-2">
            <view class="relative flex-1 group">
              <input type="text" v-model="registerForm.code"
                class="peer block w-full border-0 bg-transparent py-2 text-slate-900 focus:ring-0 text-base font-medium border-b border-slate-200 focus:border-emerald-600 transition-colors uppercase tracking-widest"
                placeholder="" placeholder-class="placeholder-transparent" @focus="activeField = 'code'"
                @blur="activeField = null" @input="clearError" maxlength="4" />
              <text class="absolute left-0 text-xs text-slate-500 transition-all font-medium pointer-events-none"
                :class="[
                  (activeField === 'code' || registerForm.code) ? '-top-3.5 text-xs text-emerald-600' : 'top-2 text-base text-slate-400'
                ]">
                验证码
              </text>
              <view class="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200"></view>
              <view
                class="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-600 transition-transform duration-500 origin-left"
                :class="[activeField === 'code' ? 'scale-x-100' : 'scale-x-0']"></view>
              <view class="absolute right-0 top-2 transition-colors duration-300">
                <text class="iconfont icon-lucide-shield-check text-xl"
                  :class="[activeField === 'code' ? 'text-emerald-600' : 'text-slate-300']"></text>
              </view>
            </view>
            <!-- 验证码图片 -->
            <view @click="getCode"
              class="w-32 h-10 flex items-center justify-center cursor-pointer border border-slate-200 rounded overflow-hidden bg-slate-50">
              <image v-if="codeUrl" :src="codeUrl" class="w-full h-full object-cover" mode="scaleToFill" />
              <view v-else class="animate-pulse w-full h-full bg-slate-200"></view>
            </view>
          </view>

          <!-- Error Message -->
          <view v-if="errorMsg"
            class="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg flex items-center space-x-2 animate-fade-in border border-red-100">
            <text class="iconfont icon-lucide-alert-circle text-base"></text>
            <text class="font-medium">{{ errorMsg }}</text>
          </view>

          <!-- Register Button -->
          <view>
            <button @click="handleRegister" :disabled="loading"
              class="w-full py-3.5 rounded-xl text-white font-bold text-sm bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center space-x-2"
              :class="{ 'opacity-70': loading }">
              <view v-if="loading" class="animate-spin mr-2">
                <text class="iconfont icon-lucide-loader-2 text-xl"></text>
              </view>
              <view v-else>立即注册</view>
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { captchaImage, register } from '@/apis/modules/common.js'; // 引入注册和验证码 API

const loading = ref(false);
const showSplash = ref(true);
const activeField = ref(null);
const errorMsg = ref(null);

const codeUrl = ref('');

// 表单数据
const registerForm = reactive({
  username: '',
  phonenumber: '', // 后端通常用 phonenumber
  password: '',
  confirmPassword: '',
  code: '',
  uuid: '',
  bindId: ''
});

onMounted(() => {
  getCode();
});

// 获取验证码
const getCode = () => {
  captchaImage().then(res => {
    codeUrl.value = 'data:image/gif;base64,' + res.img;
    registerForm.uuid = res.uuid;
    registerForm.code = '';
  }).catch(err => {
    console.error(err);
    uni.showToast({ title: '验证码加载失败', icon: 'none' });
  });
};

// 校验函数 (移植原 rules 逻辑)
const validateForm = () => {
  // Username
  if (!registerForm.username || registerForm.username.length < 4 || registerForm.username.length > 20) {
    return '请输入用户名,长度4-20位';
  }
  // Mobile
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!registerForm.phonenumber || !phoneReg.test(registerForm.phonenumber)) {
    return '手机号码格式不正确';
  }
  // Password
  if (!registerForm.password || registerForm.password.length < 5 || registerForm.password.length > 20) {
    return '请输入密码且长度5-20位';
  }
  // Confirm Password
  if (!registerForm.confirmPassword || registerForm.password !== registerForm.confirmPassword) {
    return '两次输入的密码不一致';
  }
  // Code
  if (!registerForm.code) {
    return '请输入验证码';
  }
  return null;
};

const handleRegister = () => {
  const error = validateForm();
  if (error) {
    errorMsg.value = error;
    // 如果错误是验证码相关的，可能需要刷新，这里暂时不强制刷新
    return;
  }

  loading.value = true;
  errorMsg.value = null;

  register(registerForm)
    .then(res => {
      let content = '';
      if (res.code === 200) {
        content = "恭喜你，您的账号 " + registerForm.username + " 注册成功！";
        // 成功弹窗
        uni.showModal({
          title: '注册成功',
          content: content,
          showCancel: false,
          success: () => {
            // 确认后跳转登录
            uni.reLaunch({ url: '/pages/login/index' });
          }
        });
      } else {
        content = res.msg || '注册失败';
        errorMsg.value = content;
        getCode(); // 失败刷新验证码
      }
    })
    .catch(err => {
      console.error(err);
      errorMsg.value = '网络请求错误';
      getCode();
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleBackToLogin = () => {
  uni.navigateBack();
};

const clearError = () => {
  errorMsg.value = null;
};

const openLink = () => {
  uni.showToast({ title: '查看隐私协议', icon: 'none' });
};
</script>

<style scoped>
/* 移除 input 默认轮廓 */
input {
  outline: none;
}

/* 如果你的项目有 unocss 或 tailwind，placeholder-class 也可以用来控制样式 */
.placeholder-transparent {
  color: transparent;
}

/* 动画定义 */
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