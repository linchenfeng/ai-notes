/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-29 10:48:06
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-17 14:18:41
 * @Description  : 项目-业务申请-申请买方额度相关路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/quota',
    name: 'ProjectApplyQuota',
    meta: {
      title: '申请买方额度',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:quota' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/quota/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/apply/quota/apply/:aplRefcode/:appRefcode?',
    name: 'ProjectApplyQuotaApply',
    meta: {
      title: '申请买方额度',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:quota' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/quota/Apply.vue', {
      pageType: `top`
    })
  },
  {
    // orgname 卖方名称
    path: '/member/project/apply/quota/buyerInfo/:index/:orgname/:productType',
    name: 'ProjectQuotaBuyerInfo',
    meta: {
      title: '买方及额度申请信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:quota' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/quota/BuyerInfo.vue', {
      pageType: `top`
    })
  }
]
