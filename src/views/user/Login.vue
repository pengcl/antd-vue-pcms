<template>
  <div class="main">
    <div class="header">
      <a href="/" class="logo">
        <img src="~@/assets/logoPCMS.png" alt="logo">
        <!--<span class="title">PCMS</span>-->
      </a>
    </div>
    <!--<div class="desc">
      NWCL PCMS系统登录
    </div>-->
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert
        v-if="isLoginError"
        type="error"
        showIcon
        style="margin-bottom: 24px;"
        message="用户名或密码错误"/>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="用户名"
          v-decorator="[
            'userNameOrEmailAddress',
            {initialValue: appType === 'production' ? '' : 'test01', rules: [{ required: true, message: '请输入用户名' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          placeholder="密码"
          v-decorator="[
            'password',
            {initialValue: appType === 'production' ? '' : 'abc123', rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>

      <!--      <a-form-item>
              <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
              <router-link
                :to="{ name: 'recover', params: { user: 'aaa'} }"
                class="forge-password"
                style="float: right;"
              >忘记密码</router-link>
            </a-form-item>-->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >登入
        </a-button>
      </a-form-item>
    </a-form>
    <div class="footer">
      <p><a :href="url">AD域快捷登录</a></p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  name: 'Login',
  components: {},
  data () {
    return {
      loginBtn: false,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      appType: process.env.NODE_ENV,
      url: 'WebPage/ADLogin.aspx?url=' + window.location.protocol + '//' + window.location.host,
      form: this.$form.createForm(this),
      state: {
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 1
      }
    }
  },
  created () {
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      /* const {state} = this;
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (regex.test(value)) {
        state.loginType = 0;
      } else {
        state.loginType = 1;
      } */
      callback()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

        state.loginBtn = true

        const validateFieldsKey = ['userNameOrEmailAddress', 'password']

        validateFields(validateFieldsKey, { force: true }, (err, values) => {
          if (!err) {
            console.log('login form', values)
            const loginParams = { ...values }
            delete loginParams.userNameOrEmailAddress
            loginParams.userNameOrEmailAddress = values.userNameOrEmailAddress
            loginParams.password = values.password
            Login(loginParams)
              .then((res) => this.loginSuccess(res))
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
          } else {
            setTimeout(() => {
              state.loginBtn = false
            }, 600)
          }
        })
      },
      loginSuccess (res) {
        console.log(res)
        // check res.homePage define, set $router.push name res.homePage
        // Why not enter onComplete
        /*
        this.$router.push({ name: 'analysis' }, () => {
          console.log('onComplete')
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        })
        */
        this.$router.push({ path: '/' })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
        this.isLoginError = false
      },
      requestFailed () {
        this.isLoginError = true
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    height: 54px;
    line-height: 54px;
    text-align: center;
margin-bottom: 20px;
    border-bottom: 1px solid #DADADA;
    .badge {
      position: absolute;
      display: inline-block;
      line-height: 1;
      vertical-align: middle;
      margin-left: -12px;
      margin-top: -10px;
      opacity: 0.8;
    }

    .logo {
      width: 32%;
      vertical-align: top;
      border-style: none;
      display: block;
      margin: 0 auto;

      img {
        display: block;
        width: 100%;
      }
    }

    .title {
      font-size: 33px;
      color: rgba(0, 0, 0, .85);
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      top: 2px;
    }
  }

  .desc {
    font-size: 18px;
    margin-top: 12px;
    margin-bottom: 40px;
    text-align: center;
  }

  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 50px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
  /deep/ .ant-input {
    border-radius: 4px;
  }

  .footer {
    p {
      margin:0;
      text-align: right;
      a {
        color: red;
        text-decoration: none;
      }
    }
  }
</style>
