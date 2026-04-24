/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-29 10:24:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-01 14:17:07
 * @Description  : 项目-业务申请-受理客户申请相关路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/acceptCus',
    name: 'ProjectApplyAcceptCus',
    meta: {
      title: '受理客户申请',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:acceptCus' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/acceptCus/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/apply/acceptCus/apply/:refcode?',
    name: 'ProjectApplyAcceptCusApply',
    meta: {
      title: '受理客户申请',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:acceptCus' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/acceptCus/Apply.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/acceptCus/buyerInfo/:index/:productType?/:bizScene?',
    name: 'ProjectAcceptCusApplyBuyerEdit',
    meta: {
      title: '买方及贸易信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:acceptCus' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/acceptCus/BuyerInfoEdit.vue', {
      pageType: `top`
    })
  }
]
