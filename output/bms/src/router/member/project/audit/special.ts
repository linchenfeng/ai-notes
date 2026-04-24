/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-10 10:41:15
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-01 14:54:25
 * @Description  : 特批申请审批
 */

import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/special',
    name: 'ProjectSpecialAudit',
    meta: {
      title: '特批申请审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:special' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/special/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  // refcode： 特批申请流水号 taskRefcode：任务流水号
  {
    path: '/member/project/audit/special/audit/:refcode/:taskRefcode/:taskType?',
    // taskType
    name: 'ProjectSpecialAuditAudit',
    meta: {
      title: '特批申请审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:special:query,member:project:audit:special:audit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/special/Audit.vue', {
      pageType: `top`
    })
  }
]
