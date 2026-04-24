/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-30 09:29:26
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-24 10:36:33
 * @Description  : 填报申请书详情
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/application',
    name: 'QueryApplication',
    meta: {
      title: '申请书查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:preLoan' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/application/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/query/application/detail/:refcode',
    name: 'QueryApplicationDetail',
    meta: {
      title: '申请书详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:preLoan' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/application/Detail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/query/application/buyerInfo/:refcode',
    name: 'QueryApplicationBuyerInfo',
    meta: {
      title: '买方信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids:
        'member:project:query:preLoan,member:project:apply:assist,member:project:audit:assistAppoint:query,member:project:audit:assistAppoint:submit,member:project:audit:documentReview:query,member:project:audit:documentReview:submit,member:project:apply:application' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/application/BuyerInfo.vue', {
      pageType: `top`
    })
  }
]
