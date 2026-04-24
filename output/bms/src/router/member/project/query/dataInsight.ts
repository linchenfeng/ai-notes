/*
 * @Author       : may.ruan
 * @Date         : 2025-09-01 11:13:22
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-10-20 11:10:43
 * @Description  : 项目-数据洞察
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/dataInsight',
    name: 'DataInsight',
    meta: {
      title: '数据洞察',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:dataInsight' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/dataInsight/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: false,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/query/dataInsight/detail',
    name: 'DataInsightDetail',
    meta: {
      title: '详细查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:dataInsight:detail' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/dataInsight/Detail.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: false,
        onReachBottomDistance: 100
      }
    })
  }
]
