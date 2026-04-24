/*
 * @Author       : Codex
 * @Date         : 2026-04-24 17:04:00
 * @LastEditors  : Codex
 * @LastEditTime : 2026-04-24 17:04:00
 * @Description  : 项目-业务审核-开票审核新增 /member/project/audit/invoiceReview
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'

export default [
  {
    path: '/member/project/audit/invoiceReview',
    name: 'ProjectAuditInvoiceReview',
    meta: {
      title: '开票审核',
      requiresAuth: true,
      showNavBar: true,
      showNavBarLeftArrow: true,
      funids: 'member:project:audit:invoiceReview'
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/invoiceReview/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  }
]
