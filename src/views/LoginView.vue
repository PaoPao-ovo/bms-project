<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import '@/assets/css/fontawesome-all.min.css'
import('@/assets/css/echarts.css')
const loginLoading = ref(false)
const signUploading = ref(false)

const loginRef = ref(null)
const signUpRef = ref(null)

const loginForm = ref({
  name: '',
  password: ''
})

const signUpForm = ref({
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const loginRules = {
  name: [
    {
      required: true,
      message: '请输入账号/手机号',
      type: 'string',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      type: 'string',
      trigger: 'blur'
    }
  ]
}

const signUpRules = {
  name: [
    {
      required: true,
      message: '请输入账号',
      type: 'string',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入11位手机号',
      type: 'string',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      type: 'string',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== signUpForm.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      type: 'string',
      trigger: 'blur'
    }
  ]
}

onBeforeMount(() => {
  loginLoading.value = false
  signUploading.value = false
})

onMounted(() => {
  const sign_in_btn = document.querySelector('#sign-in-btn')
  const sign_up_btn = document.querySelector('#sign-up-btn')
  const container = document.querySelector('.container')

  sign_in_btn.addEventListener('click', () => {
    container.classList.remove('sign-up-mode')
  })

  sign_up_btn.addEventListener('click', () => {
    container.classList.add('sign-up-mode')
  })
})

const Login = () => {
  loginRef.value.validate((valid) => {
    if (valid) {
      loginLoading.value = true
      // TODO: axios 登录请求
      setTimeout(() => {
        ElMessage.success('登录成功')
        loginLoading.value = false
        router.push('/bmu')
      }, 500)
    }
  })
}

const SignUp = () => {
  signUpRef.value.validate((valid) => {
    if (valid) {
      signUploading.value = true
      // TODO: axios 注册请求
      setTimeout(() => {
        ElMessage.success('注册成功')
        signUpRef.value.resetFields()
        document.getElementById('sign-in-btn').click()
      }, 500)
    }
  })
  signUploading.value = false
}
</script>

<template>
  <div class="container">
    <div class="forms-container">
      <div class="signin-signup">
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="sign-in-form">
          <h2 class="title">登录</h2>
          <div class="input-field">
            <i class="fa-solid fa-user"></i>
            <el-form-item prop="name">
              <el-input
                v-model="loginForm.name"
                placeholder="账号/手机号"
                @keyup.enter="Login(loginForm)"
              />
            </el-form-item>
          </div>
          <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                autocomplete="off"
                show-password
                @keyup.enter="Login(loginForm)"
              />
            </el-form-item>
          </div>
          <el-button
            type="primary"
            :loading="loginLoading"
            @click="Login(loginForm)"
            class="btn form"
            round
          >
            {{ loginLoading ? '登 录 中' : '登 录' }}
          </el-button>
        </el-form>
        <el-form ref="signUpRef" :model="signUpForm" :rules="signUpRules" class="sign-up-form">
          <h2 class="title">注册</h2>
          <div class="input-field">
            <i class="fa-solid fa-user"></i>
            <el-form-item prop="name">
              <el-input v-model="signUpForm.name" placeholder="姓名/称呼" />
            </el-form-item>
          </div>
          <div class="input-field">
            <i class="fa-solid fa-phone"></i>
            <el-form-item prop="phone">
              <el-input v-model="signUpForm.phone" placeholder="手机号" />
            </el-form-item>
          </div>
          <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <el-form-item prop="password">
              <el-input
                v-model="signUpForm.password"
                type="password"
                placeholder="密码"
                autocomplete="off"
                show-password
              />
            </el-form-item>
          </div>
          <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="signUpForm.confirmPassword"
                type="password"
                placeholder="确认密码"
                autocomplete="off"
                show-password
              />
            </el-form-item>
          </div>
          <el-button
            type="primary"
            :loading="signUploading"
            @click="SignUp(signUpForm)"
            class="btn form"
            round
          >
            {{ signUploading ? '注 册 中' : '注 册' }}
          </el-button>
        </el-form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>新用户 ?</h3>
          <p>输入您的信息成为我们的客户</p>
          <button class="btn transparent" id="sign-up-btn">注 册</button>
        </div>
        <img src="../assets/image/log.svg" class="image" alt="" />
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>已有账号 ?</h3>
          <p>请登录以享受我们更多的服务</p>
          <button class="btn transparent" id="sign-in-btn">登 录</button>
        </div>
        <img src="../assets/image/register.svg" class="image" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap');

input {
  font-family: 'Poppins', sans-serif;
}

.container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.input-field .el-input input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field .el-input input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4481eb;
  border-color: #4481eb;
}

.btn {
  width: 150px;
  background-color: #5995fd;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #4d84e2;
}

.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: '';
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.btn.transparent:hover {
  background: #fff;
  color: #5995fd;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }

  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }

  .panel .content {
    padding: 0.5rem 1rem;
  }

  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>
