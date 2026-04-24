/*
 * @Author       : may.ruan
 * @Date         : 2025-09-01 11:13:22
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-09-01 11:15:01
 * @Description  : 客户-统计查询
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/customer/statistics',
    name: 'CustomerStatistics',
    meta: {
      title: '统计查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:customer:statistics' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/customer/statistics/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: false,
        onReachBottomDistance: 100
      }
    })
  }
]
