/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-30 09:37:41
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 09:51:50
 * @Description  : 上会详情 路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/meeting',
    name: 'QueryMeeting',
    meta: {
      title: '上会结果查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:preLoan' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/meeting/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/query/meeting/detail/:refcode',
    name: 'QueryMeetingDetail',
    meta: {
      title: '上会结果详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:preLoan' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/meeting/Detail.vue', {
      pageType: `top`
    })
  }
]
