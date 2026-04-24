/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-30 09:35:28
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 09:35:28
 * @Description  : 贷中
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/lending',
    name: 'ProjectLending',
    meta: {
      title: '贷中项目',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:lending' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/lending/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    // orgname:客户名称/cpOrgname:交易对手名称/year:年度/approveStatus:审批进度
    path: '/member/project/query/lending/detail/:orgname/:cpOrgname/:year/:approveStatus?',
    name: 'ProjectDetail',
    meta: {
      title: '项目信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:lending' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/lending/detail/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100
      }
    })
  },
  {
    // refcode:融资流水号
    path: '/member/project/query/lending/info/:refcode',
    name: 'ProjectInfo',
    meta: {
      title: '项目详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:lending' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/lending/detail/Info.vue', {
      pageType: `top`
    })
  }
]
