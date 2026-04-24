/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-29 10:48:06
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-09 14:59:01
 * @Description  : 项目-业务申请-申请准入相关路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/access',
    name: 'ProjectApplyInternation',
    meta: {
      title: '申请准入',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:access' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/access/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/access/buyerInfo/:index/:productType?/:bizScene?',
    name: 'ProjectApplyBuyerEdit',
    meta: {
      title: '买方及贸易信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/access/BuyerInfoEdit.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/access/detail/buyerInfo/:index/:productType?/:bizScene?',
    name: 'ProjectApplyBuyerDetail',
    meta: {
      title: '买方及贸易信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/access/BuyerInfoDetail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/access/apply/:refcode?',
    name: 'ProjectInternationApply',
    meta: {
      title: '申请准入详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/access/Apply.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/access/detail/:refcode',
    name: 'ProjectInternationDetail',
    meta: {
      title: '申请准入详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/access/Detail.vue', {
      pageType: `top`
    })
  },

  {
    path: '/member/project/apply/access/success',
    name: 'ProjectApplyInternationSuccess',
    meta: {
      title: '提交成功',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:access' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/access/Success.vue', {
      pageType: `top`
    })
  }
]
