/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-29 10:48:06
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-10 09:19:23
 * @Description  : 项目-业务申请-申请融资相关路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/loanApply',
    name: 'ProjectLoanApply',
    meta: {
      title: '申请融资',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:loanApply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/loanApply/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/apply/loanApply/apply/:refcode?',
    name: 'ProjectApplyLoanApplyApply',
    meta: {
      title: '申请融资',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:loanApply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/loanApply/Apply.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/loanApply/detail/:refcode',
    name: 'ProjectApplyLoanApplyDetail',
    meta: {
      title: '申请融资',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:loanApply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/loanApply/Detail.vue', {
      pageType: `top`
    })
  }
]
