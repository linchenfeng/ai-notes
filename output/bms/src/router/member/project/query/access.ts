/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-30 09:41:21
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-16 09:45:44
 * @Description  : 贷前查询
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/access',
    name: 'ProjectPreLoan',
    meta: {
      title: '准入查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:preLoan' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/access/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    // refcode流水号
    path: '/member/project/query/access/detail/:refcode',
    name: 'ProjectPreLoanDetail',
    meta: {
      title: '准入查询详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids:
        'member:project:query:preLoan,member:project:apply:assist,member:project:audit:assistAppoint:query,member:project:audit:assistAppoint:submit,member:project:audit:documentReview:query,member:project:audit:documentReview:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/access/Detail.vue', {
      pageType: `top`
      // style: {
      //   onReachBottomDistance: 100
      // }
    })
  },
  {
    // refcode流水号
    path: '/member/project/query/access/detail/history/:refcode',
    name: 'ProjectPreLoanDetailHistory',
    meta: {
      title: '准入历程',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:preLoan' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/access/History.vue', {
      pageType: `top`
      // style: {
      //   onReachBottomDistance: 100
      // }
    })
  }
]
