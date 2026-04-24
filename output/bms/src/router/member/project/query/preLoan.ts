/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-30 10:02:17
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-01 15:05:11
 * @Description  : 贷前项目
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/preLoan',
    name: 'ProjectPreLending',
    meta: {
      title: '贷前项目',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:preLoan' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/preLoan/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: false,
        onReachBottomDistance: 100
      }
    })
  }
]
