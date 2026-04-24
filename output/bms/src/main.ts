/*
 * @Author       : may.ruan
 * @Date         : 2023-08-07 09:49:56
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-12 17:58:57
 * @Description  : main入口
 */

import '@/iconfont/icon-default/iconfont.css'
import '@/iconfont/icon-bms-color/iconfont.css'
import '@/iconfont/icon-menu/iconfont.css'
import App from './App.vue'
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import uviewPlus from 'uview-plus'
import router from '@/router'
// 增强动作指令
import { registerDirectives } from '@/directive'
import { registerGlobalComponents } from '@/plugins'
import { isEmpty } from './utils/validate'
import uPicker from '@/components/picker/index.vue' // 根据实际路径调整
export function createApp() {
  const app = createSSRApp(App)
  app.use(registerGlobalComponents)
  app.use(Pinia.createPinia())
  app.use(uviewPlus)
  registerDirectives(app)

  // 如此配置即可
  uni.$u.config.unit = 'rpx'
  // 重写uview的isEmpty方法
  uni.$u.test.empty = isEmpty
  // 重写u-cell-group默认样式
  uni.$u.props.cellGroup.border = false
  // 重写u-cell默认样式
  uni.$u.props.cell.border = false
  // 扩展原始组件，修改默认 Props
  const CustomPicker = {
    ...uPicker,
    props: {
      ...uPicker.props,
      closeOnClickOverlay: {
        type: Boolean,
        default: true // 修改默认值为 true
      }
    },
    methods: {
      ...uPicker.methods, // 保留其他方法
      //覆写关闭方法
      closeHandler() {
        this.$emit('cancel')
      }
    }
  }

  // 全局注册修改后的组件（保持同名以覆盖）
  app.component('UPicker', CustomPicker)
  return {
    app,
    router,
    Pinia
  }
}
