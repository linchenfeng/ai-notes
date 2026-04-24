import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/special',
    name: 'QuerySpecial',
    meta: {
      title: '特批查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:special' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/special/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/query/special/detail/:refcode',
    name: 'QuerySpecialDetail',
    meta: {
      title: '特批申请详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:special' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/special/Detail.vue', {
      pageType: `top`
    })
  }
]
