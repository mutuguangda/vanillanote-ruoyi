<template>
  <div class="login">
    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFCB4C" d="M35.597 14.232c2.083 9.72-4.108 19.289-13.828 21.372C12.049 37.687 2.48 31.496.397 21.776-1.686 12.056 4.506 2.487 14.225.404c9.72-2.084 19.289 4.108 21.372 13.828"/><path fill="#F4F7F9" d="M29.284 9.012c.779 3.636-1.537 7.216-5.173 7.995-3.636.779-7.216-1.537-7.996-5.173-.779-3.636 1.537-7.216 5.173-7.995s7.217 1.536 7.996 5.173z"/><circle fill="#292F33" cx="22.306" cy="9.291" r="2.037"/><path fill="#F4F7F9" d="M14.088 14.282c.456 2.126-.899 4.219-3.025 4.675s-4.219-.899-4.675-3.025c-.456-2.126.899-4.219 3.025-4.675s4.219.899 4.675 3.025z"/><ellipse transform="rotate(-12.095 10.236 15.853)" fill="#292F33" cx="10.238" cy="15.857" rx="1.942" ry="1.942"/><path fill="#65471B" d="M18.625 20.937c-3.543.759-5.981.85-9.01.908-.691.015-1.955.419-1.536 2.375.838 3.911 6.379 7.837 12.642 6.495 6.262-1.342 9.708-7.194 8.87-11.105-.419-1.956-1.739-1.808-2.375-1.536-2.786 1.187-5.048 2.104-8.591 2.863z"/><path fill="#E8596E" d="M11 24.004v6c0 3 2 6 6 6s6-3 6-6v-6H11z"/><path fill="#DD2F45" d="M17 31.883c.301 0 .545-.244.545-.545v-6.295h-1.091v6.295c.001.301.245.545.546.545z"/><path fill="#FFF" d="M10.034 23.801s3.143.349 9.01-.908c5.867-1.257 8.591-2.864 8.591-2.864s-1.117 4.33-7.962 5.797c-6.845 1.467-9.639-2.025-9.639-2.025z"/></svg>
    <p class="title">vanillanote</p>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          size="medium"
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2022 ruoyi.vip All Rights Reserved.</span> -->
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaOnOff: false,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            if (this.captchaOnOff) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input__inner {
  background-color: transparent !important;
}

.login {
  // text-align: center;
  display: flex;
  // justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
  // background-image: url("../assets/images/login-background.jpg");
  // background-size: cover;
  background-color: #f9f7f1;
  > svg {
    margin: 50px 0 20px;
  }
}

.title {
  margin: 20px 0 30px;
  font-size: 48px;
}

.login-form {
  border: 1px #000 solid;
  // border-radius: 6px;
  // background: #ffffff;
  width: 400px;
  padding: 40px 50px 30px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
