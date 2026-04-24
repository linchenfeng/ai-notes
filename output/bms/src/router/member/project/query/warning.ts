import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/warning',
    name: 'QueryWarning',
    meta: {
      title: '预警解除查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:warning' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/warning/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/query/warning/detail/:refcode',
    name: 'QueryWarningDetail',
    meta: {
      title: '预警解除详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:warning' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/warning/Detail.vue', {
      pageType: `top`
    })
  }
]
