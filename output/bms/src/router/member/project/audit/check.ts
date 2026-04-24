/*
 * @Author       : Charon.Lin
 * @Date         : 2025-11-03 17:28:01
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-03 17:28:44
 * @Description  : 核查企业信息路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/check',
    name: 'ProjectCheck',
    meta: {
      title: '核查企业信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:check' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/check/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/audit/check/audit/:refcode/:checkStatus',
    name: 'ProjectCheckAudit',
    meta: {
      title: '核查企业信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:check:query,member:project:audit:check:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/check/Audit.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/audit/check/history/:orgname',
    name: 'ProjectCheckHistory',
    meta: {
      title: '核查历程',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:check:query,member:project:audit:check:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/check/History.vue', {
      pageType: `top`
    })
  }
]
