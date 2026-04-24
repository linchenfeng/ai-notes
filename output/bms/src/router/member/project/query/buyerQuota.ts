/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-30 09:42:31
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 10:00:47
 * @Description  :买方额度查询 路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/buyerQuota',
    name: 'ProjectQueryBuyerQuota',
    meta: {
      title: '买方额度查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/buyerQuota/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/query/buyerQuota/detail/:refcode',
    name: 'ProjectQueryBuyerQuotaDetail',
    meta: {
      title: '买方额度详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/buyerQuota/Detail.vue', {
      pageType: `top`
    })
  }
]
