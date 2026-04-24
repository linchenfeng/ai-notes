/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 11:34:05
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-01 14:47:57
 * @Description  : 上会结果复核 路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/meetingReview',
    name: 'ProjectMeetingReview',
    meta: {
      title: '上会结果复核',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:meetingReview' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/meetingReview/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/audit/meetingReview/detail/history/:refcode',
    name: 'ProjectMeetingReviewDetailHistory',
    meta: {
      title: '审核历程',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids:
        'member:project:audit:meetingReview,member:project:audit:meetingApproval,member:project:query:preLoan,member:project:audit:meetingCollect' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/meetingReview/History.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/audit/meetingReview/detail/:refcode/:type',
    name: 'ProjectMeetingReviewDetail',
    meta: {
      title: '上会结果复核',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:meetingReview:query,member:project:audit:meetingReview:audit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/meetingReview/Detail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/audit/meetingReview/success',
    name: 'ProjectMeetingReviewDetailSuccess',
    meta: {
      title: '提交成功',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:meetingReview:audit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/meetingReview/Success.vue', {
      pageType: `top`
    })
  }
]
