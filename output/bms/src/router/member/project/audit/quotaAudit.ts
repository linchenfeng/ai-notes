/*
 * @Author       : Charon.Lin
 * @Date         : 2025-07-09 10:30:52
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-01 14:37:56
 * @Description  :  项目-业务审核-额度审核 /project/audit/quotaAudit
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/quotaAudit',
    name: 'ProjectAuditQuota',
    meta: {
      title: '额度审核',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:quotaAudit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/quotaAudit/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/audit/quotaAudit/audit/:refcode',
    name: 'ProjectAuditQuotaAudit',
    meta: {
      title: '买方额度审核详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:quotaAudit:query,member:project:audit:quotaAudit:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/quotaAudit/Audit.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/audit/quotaAudit/detail/:refcode',
    name: 'ProjectAuditQuotaDetail',
    meta: {
      title: '买方额度审核详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:quotaAudit:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/quotaAudit/Detail.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  }
]
