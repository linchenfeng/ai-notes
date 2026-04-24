/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-25 17:13:28
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 09:35:11
 * @Description  : 预警解除申请
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/warning',
    name: 'ProjectApplyWarningLifted',
    meta: {
      title: '预警解除申请',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:warning' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/warning/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/apply/warning/apply/:refcode/:applyStatus?',
    name: 'ProjectWarningLiftedApply',
    meta: {
      title: '预警解除申请',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:warning' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/warning/Apply.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/warning/riskDetail/:refcode?',
    name: 'ProjectApplyWarningLiftedBusinessRisk',
    meta: {
      title: '企业风险信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:warning' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/warning/RiskDetail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/warning/success',
    name: 'ProjectApplyWarningLiftedSuccess',
    meta: {
      title: '提交成功',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:warning' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/warning/Success.vue', {
      pageType: `top`
    })
  }
]
