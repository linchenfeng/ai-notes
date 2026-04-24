/*
 * @Author       : Mingchun.Cheng
 * @Date         : 2025-07-31 16:31:49
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-08 11:33:00
 * @Description  : 冻结/解冻申请审批
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/freeze',
    name: 'ProjectFreezeAudit',
    meta: {
      title: '额度冻结/解冻审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:freeze' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/freeze/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  // refcode： 冻结/解冻审批
  {
    path: '/member/project/audit/freeze/audit/:refcode/:taskRefcode',
    name: 'ProjectFreezeAuditAudit',
    meta: {
      title: '额度冻结/解冻审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:freeze:query,member:project:audit:freeze:audit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/freeze/Audit.vue', {
      pageType: `top`
    })
  }
]
