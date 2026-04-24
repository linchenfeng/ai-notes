/*
 * @Author       : Charon.Lin
 * @Date         : 2025-07-11 11:18:08
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-01 14:41:03
 * @Description  : 项目-业务审核-业务报价 /project/audit/quotation
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/quotation',
    name: 'ProjectAuditQuotation',
    meta: {
      title: '业务报价',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:quotation' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/quotation/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/audit/quotation/audit/:refcode',
    name: 'ProjectAuditQuotationAudit',
    meta: {
      title: '业务报价详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:quotation:query,member:project:audit:quotation:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/quotation/Audit.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/audit/quotation/detail/:refcode',
    name: 'ProjectAuditQuotationDetail',
    meta: {
      title: '业务报价详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:quotation:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/quotation/Detail.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  }
]
