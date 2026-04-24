/*
 * @Author       : Mingchun.Cheng
 * @Date         : 2025-08-11 13:50:43
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-11 13:52:31
 * @Description  : 冻结/解冻查询
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/freeze',
    name: 'QueryFreeze',
    meta: {
      title: '额度冻结/解冻查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:freeze' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/freeze/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/query/freeze/detail/:refcode',
    name: 'QueryFreezeDetail',
    meta: {
      title: '额度冻结/解冻详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:freeze' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/freeze/Detail.vue', {
      pageType: `top`
    })
  }
]
