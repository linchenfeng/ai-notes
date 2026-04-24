/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-25 17:54:15
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 16:19:48
 * @Description  : 预警解除审批
 */

import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/warning',
    name: 'ProjectWarningAudit',
    meta: {
      title: '预警解除审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:warning' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/warning/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  // refcode： 预警解除流水号 taskRefcode：任务流水号
  {
    path: '/member/project/audit/warning/audit/:refcode/:taskRefcode',
    name: 'ProjectWarningAuditAudit',
    meta: {
      title: '预警解除审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:warning:query,member:project:audit:warning:audit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/warning/Audit.vue', {
      pageType: `top`
    })
  }
]
