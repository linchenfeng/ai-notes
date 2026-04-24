/*
 * @Author       : Charon.Lin
 * @Date         : 2025-12-03 14:05:52
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-24 14:55:30
 * @Description  : 项目-业务申请-审批融资-融资申请审批 /member/project/audit/loanApply
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/loanApply',
    name: 'ProjectAuditLoanApply',
    meta: {
      title: '融资申请审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:loanApply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/loanApply/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    // refcode 业务申请流水号
    path: '/member/project/audit/loanApply/audit/:refcode',
    name: 'ProjectAuditLoanApplyAudit',
    meta: {
      title: '融资申请审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:loanApply:audit,member:project:audit:loanApply:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/loanApply/Audit.vue', {
      pageType: `top`
    })
  },
  {
    // refcode 业务申请流水号
    path: '/member/project/audit/loanApply/detail/:refcode',
    name: 'ProjectAuditLoanApplyDetail',
    meta: {
      title: '融资申请审批',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:loanApply:audit,member:project:audit:loanApply:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/loanApply/Detail.vue', {
      pageType: `top`
    })
  },
  {
    // orgname 买方名称 //remarkRefcode核查意见流水号
    path: '/member/project/audit/loanApply/history/:refcode',
    name: 'ProjectAuditLoanApplyHistory',
    meta: {
      title: '审批历程',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:loanApply:audit,member:project:audit:loanApply:query,member:project:query:loanApply' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/loanApply/History.vue', {
      pageType: `top`
    })
  }
]
