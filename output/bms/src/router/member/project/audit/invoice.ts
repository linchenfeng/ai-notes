/*
 * @Author       : Charon.Lin
 * @Date         : 2025-07-11 11:18:08
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-26 18:07:13
 * @Description  : 项目-业务审核-开票审核 /project/audit/invoice
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/invoice',
    name: 'ProjectAuditInvoice',
    meta: {
      title: '开票审核',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:invoice' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/invoice/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/audit/invoice/audit/:refcode',
    name: 'ProjectAuditInvoiceAudit',
    meta: {
      title: '开票审核详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:invoice:query,member:project:audit:invoice:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/invoice/Audit.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  }
]
