/*
 * @Author       : Charon.Lin
 * @Date         : 2025-07-09 10:30:52
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-06 14:38:13
 * @Description  :  项目-业务审核-指派协销/征信 /project/audit/assistAppoint
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/assistAppoint',
    name: 'ProjectAuditAssist',
    meta: {
      title: '指派协销/征信',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assistAppoint' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assistAppoint/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/audit/assistAppoint/audit/:refcode/:appointStatus',
    name: 'ProjectAssistAppointAudit',
    meta: {
      title: '指派协销/征信详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assistAppoint:query,member:project:audit:assistAppoint:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assistAppoint/Audit.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/audit/assistAppoint/detail/:refcode',
    name: 'ProjectAssistAppointDetail',
    meta: {
      title: '指派协销/征信详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assistAppoint:query,member:project:audit:assistAppoint:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assistAppoint/Detail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/audit/assistAppoint/reAudit/:refcode',
    name: 'ProjectAssistAppointReAudit',
    meta: {
      title: '指派协销/征信详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assistAppoint:query,member:project:audit:assistAppoint:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assistAppoint/ReAudit.vue', {
      pageType: `top`
    })
  }
]
