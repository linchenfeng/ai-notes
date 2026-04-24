/*
 * @Author       : Charon.Lin
 * @Date         : 2025-12-11 17:16:55
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-11 17:18:53
 * @Description  :
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/loanApply',
    name: 'ProjectQueryLoanApply',
    meta: {
      title: '融资申请查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:loanApply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/loanApply/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    // refcode 业务申请流水号
    path: '/member/project/query/loanApply/detail/:refcode',
    name: 'ProjectqueryLoanApplyquery',
    meta: {
      title: '融资申请详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:loanApply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/loanApply/Detail.vue', {
      pageType: `top`
    })
  }
]
