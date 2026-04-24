/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-29 14:42:01
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 14:50:02
 * @Description  :上会结果审批
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/meetingApproval',
    name: 'ProjectMeetingApproval',
    meta: {
      title: '上会结果审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:meetingApproval' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/meetingApproval/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/audit/meetingApproval/detail/:refcode',
    name: 'ProjectMeetingApprovalDetail',
    meta: {
      title: '上会结果审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:meetingApproval:query,member:project:audit:meetingApproval:audit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/meetingApproval/Detail.vue', {
      pageType: `top`
    })
  }
]
