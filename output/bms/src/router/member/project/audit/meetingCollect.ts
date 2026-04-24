/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-29 14:45:49
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 14:51:26
 * @Description  : 核贷书意见汇整复核 路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/meetingCollect',
    name: 'ProjectMeetingCollect',
    meta: {
      title: '核贷书意见汇整复核',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:meetingCollect' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/meetingCollect/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/audit/meetingCollect/detail/:refcode',
    name: 'ProjectMeetinCollectDetail',
    meta: {
      title: '核贷书意见汇整复核',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:meetingCollect:query,member:project:audit:meetingCollect:audit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/meetingCollect/Detail.vue', {
      pageType: `top`
    })
  }
]
