/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-29 10:48:06
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-19 17:14:52
 * @Description  : 项目-业务申请-申请征信/协销相关路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/assist',
    name: 'ProjectApplyAssist',
    meta: {
      title: '申请协销/征信',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:assist' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/assist/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/apply/assist/apply/:queryFlag/:aplRefcode/:refcode?',
    name: 'ProjectApplyAssistApply',
    meta: {
      title: '申请协销/征信详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:assist' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/assist/Apply.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/assist/detail/:refcode',
    name: 'ProjectApplyAssistDetail',
    meta: {
      title: '申请协销/征信详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:assist' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/assist/Detail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/assist/buyerinfo/:refcode',
    name: 'ProjectApplyAssistBuyerInfo',
    meta: {
      title: '买方信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids:
        'member:project:apply:assist,member:project:audit:assistAppoint:query,member:project:audit:assistAppoint:submit,member:project:audit:documentReview:query,member:project:audit:documentReview:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/assist/BuyerInfo.vue', {
      pageType: `top`
    })
  }
]
