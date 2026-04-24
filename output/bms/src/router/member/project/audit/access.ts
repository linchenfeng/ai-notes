/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:49:36
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-06 11:05:23
 * @Description  : 业务准入路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/access',
    name: 'ProjectAccess',
    meta: {
      title: '业务准入',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:access' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/access/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    // refcode 业务申请流水号
    path: '/member/project/audit/access/audit/success',
    name: 'ProjectAccessAuditSuccess',
    meta: {
      title: '审核成功',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:access:approve,member:project:audit:access:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/access/Success.vue', {
      pageType: `top`
    })
  },
  {
    // refcode 业务申请流水号
    path: '/member/project/audit/access/audit/question/:refcode',
    name: 'ProjectAccessAuditQuestion',
    meta: {
      title: '提问',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:access:approve,member:project:audit:access:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/access/Question.vue', {
      pageType: `top`
    })
  },
  {
    // refcode 业务申请流水号
    path: '/member/project/audit/access/audit/:refcode/:taskType?',
    name: 'ProjectAccessAudit',
    meta: {
      title: '业务准入详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:access:approve,member:project:audit:access:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/access/Audit.vue', {
      pageType: `top`
    })
  },
  {
    // orgname 买方名称 //remarkRefcode核查意见流水号
    path: '/member/project/audit/access/history/:dtcRefcode/:refcode/:orgname/:remarkRefcode?',
    name: 'ProjectAccessHistory',
    meta: {
      title: '核查历程',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:access:approve,member:project:audit:access:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/access/History.vue', {
      pageType: `top`
    })
  }
]
