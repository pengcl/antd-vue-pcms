<template>
  <div>
    <pro-layout
      :menus="menus"
      :collapsed="collapsed"
      :mediaQuery="query"
      :isMobile="isMobile"
      :handleMediaQuery="handleMediaQuery"
      :handleCollapse="handleCollapse"
      :i18nRender="i18nRender"
      v-bind="settings"
    >
      <!-- 1.0.0+ 版本 pro-layout 提供 API，
            我们推荐使用这种方式进行 LOGO 和 title 自定义
      -->
      <template v-slot:menuHeaderRender>
        <div>
          <logo-svg/>
          <h1>{{ title }}</h1>
        </div>
      </template>

      <!--<setting-drawer :settings="settings" @change="handleSettingChange" />-->
      <template v-slot:rightContentRender>
        <span class="uat" v-if="appType === 'development'">DEV</span>
        <span class="uat" v-if="appType === 'uat'">UAT</span>
        <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme"/>
      </template>
      <template v-slot:footerRender>
        <global-footer/>
      </template>
      <router-view/>
    </pro-layout>
    <div v-show="show" :class="'report-frame' + ' ss'">
      <iframe :style="{height: height}" id="iframe" :src="url"></iframe>
      <a-icon @click="setFullscreen()" type="fullscreen-exit"/>
    </div>
  </div>
</template>

<script>
  import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
  import { i18nRender } from '@/locales'
  import { mapState } from 'vuex'
  import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

  import defaultSettings from '@/config/defaultSettings'
  import RightContent from '@/components/GlobalHeader/RightContent'
  import GlobalFooter from '@/components/GlobalFooter'
  import LogoSvg from '../assets/logo.svg?inline'

  export default {
    name: 'BasicLayout',
    components: {
      SettingDrawer,
      RightContent,
      GlobalFooter,
      LogoSvg
    },
    data () {
      return {
        // preview.pro.antdv.com only use.
        isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
        // end
        appType: process.env.NODE_ENV,
        // base
        menus: [],
        show: false,
        url: '',
        // 侧栏收起状态
        collapsed: false,
        title: defaultSettings.title,
        settings: {
          // 布局类型
          layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
          // CONTENT_WIDTH_TYPE
          contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
          // 主题 'dark' | 'light'
          theme: defaultSettings.navTheme,
          // 主色调
          primaryColor: defaultSettings.primaryColor,
          fixedHeader: defaultSettings.fixedHeader,
          fixSiderbar: defaultSettings.fixSiderbar,
          colorWeak: defaultSettings.colorWeak,

          hideHintAlert: false,
          hideCopyButton: false
        },
        // 媒体查询
        query: {},

        // 是否手机模式
        isMobile: false
      }
    },
    computed: {
      ...mapState({
        // 动态主路由
        mainMenu: state => state.permission.addRouters
      })
    },
    created () {
      const routes = this.mainMenu.find(item => item.path === '/')
      this.menus = (routes && routes.children) || []
      // 处理侧栏收起状态
      this.$watch('collapsed', () => {
        this.$store.commit(SIDEBAR_TYPE, this.collapsed)
      })
      this.$watch('isMobile', () => {
        this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
      })
      window.eventBus.$on('report', (data) => {
        this.show = data.show
        this.url = data.url
      })
    },
    mounted () {
      const userAgent = navigator.userAgent
      if (userAgent.indexOf('Edge') > -1) {
        this.$nextTick(() => {
          this.collapsed = !this.collapsed
          setTimeout(() => {
            this.collapsed = !this.collapsed
          }, 16)
        })
      }

      // first update color
      // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
      if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
        updateTheme(this.settings.primaryColor)
      }
    },
    methods: {
      i18nRender,
      handleMediaQuery (val) {
        this.query = val
        if (this.isMobile && !val['screen-xs']) {
          this.isMobile = false
          return
        }
        if (!this.isMobile && val['screen-xs']) {
          this.isMobile = true
          this.collapsed = false
          this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          // this.settings.fixSiderbar = false
        }
      },
      handleCollapse (val) {
        this.collapsed = val
      },
      handleSettingChange ({ type, value }) {
        console.log('type', type, value)
        type && (this.settings[type] = value)
        switch (type) {
          case 'contentWidth':
            this.settings[type] = value
            break
          case 'layout':
            if (value === 'sidemenu') {
              this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
            } else {
              this.settings.fixSiderbar = false
              this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
            }
            break
        }
      },
      setFullscreen () {
        window.eventBus.$emit('report', { show: false, url: '' })
      }
    }
  }
</script>

<style lang="less">
  @import "./BasicLayout.less";

  .uat {
    font-size: 20px;
    color: red;
  }

  .report-frame {
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .anticon {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 18px;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      padding: 5px;
      cursor: pointer;
    }
  }
</style>
