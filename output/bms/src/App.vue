<!--
 * @Author       : may.ruan
 * @Date         : 2023-08-07 09:49:56
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-06-23 10:47:33
 * @Description  : app入口文件
-->
<script lang="ts" setup>
import { $getServerSystemConfig, $refreshFunids } from '@/hooks/initMinxin'
import { onLaunch /*, onShow, onHide  */ } from '@dcloudio/uni-app'
// 当uni-app 初始化完成时触发（全局只触发一次）
onLaunch(() => {
  $refreshFunids() // 更新权限
  $getServerSystemConfig() // 获取系统配置
})
// 当 uni-app 启动，或从后台进入前台显示
// onShow(() => {})
// // 当 uni-app 从前台进入后台
// onHide(() => {})
//判断浏览器是否是微信浏览器
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
@import '@/styles/reset.scss';
@import '@/styles/global.scss';
@import '@/styles/theme.scss';
@import '@/styles/uview-plus/reset.scss';
@import '@/styles/uview-plus/member/index.scss';
</style>
