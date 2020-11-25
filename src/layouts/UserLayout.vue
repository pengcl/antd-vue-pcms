<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="user-header">
        <a class="header-logo" href="javascript:;">
          <img src="~@/assets/login-logo.png">
        </a>
        <div data-bind="text: environmentTag" class="EnvironmentTag">UAT (#uat_202003-003)</div>
      </div>
      <router-view/>

      <!--<div class="footer">
        <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2018 vueComponent
        </div>
      </div>-->
      <footer class="footer fixed-bottom footer-dark navbar-border navbar-shadow">
        <p class="clearfix blue-grey lighten-2 text-sm-center mb-0 px-2">
          <span class="float-md-left d-block d-md-inline-block">
            © 新世界中国地产有限公司 2020。 版权所有。

          </span>

        </p>
      </footer>
    </div>
  </div>
</template>

<script>
  import { deviceMixin } from '@/store/device-mixin'

  export default {
    name: 'UserLayout',
    mixins: [deviceMixin],
    mounted () {
      document.body.classList.add('userLayout')
    },
    beforeDestroy () {
      document.body.classList.remove('userLayout')
    }
  }
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background: #4DD0E1 !important;
      background-size: 100%;
      position: relative;

      .user-header {
        height: 72px;
        background: #2C303B;
        box-shadow: 0 2px 30px 2px rgba(0, 0, 0, .1);
        .header-logo {
          width: 260px;
          padding: 8px 30px 0 30px;
          display: block;
          float: left;
          img {
            display: block;
            width: 100%;
          }
        }
        .EnvironmentTag {
          font-size: 30px;
          color: red;
          font-weight: bold;
          // font-family: Quicksand,Georgia,'Times New Roman',Times,serif;
        }
      }

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

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
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
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
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        max-width: 25%;
        padding: 20px;
        margin: 30px auto;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 10px 18px 0 rgba(62,57,107,.2)
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;

          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;

            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }

        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
      footer.footer-dark {
        background: #2C303B;
      }
      footer.footer-dark {
        background: #2C303B;
      }
      footer.navbar-border {
        border-top: 1px solid #E4E7ED;
      }
      footer.footer {
        padding: 12px;
        margin: 0;
        .pl-2, .px-2 {
          padding-left: 1.5rem !important;
        }
        p {
          margin: 0;
          text-align: left;
          color: #fff;
        }
      }
      .fixed-bottom {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1030;
      }
    }
  }
</style>
