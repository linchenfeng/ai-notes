/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-10 17:49:59
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-31 13:47:49
 * @Description  : 现场尽调路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/siteDueDiligence',
    name: 'ProjectApplySiteDueDiligence',
    meta: {
      title: '现场尽调',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:siteDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/siteDueDiligence/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  // refcode 尽调流水号，cddUserRefcode尽调人员流水号
  {
    path: '/member/project/apply/siteDueDiligence/edit/:refcode/:cddUserRefcode',
    name: 'ProjectApplySiteDueDiligenceEdit',
    meta: {
      title: '现场尽调',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      fileCenter: true, // 是否直连文件中心
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:siteDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/siteDueDiligence/Edit.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/siteDueDiligence/edit/moreFile/:cddUserRefcode/:fileType',
    name: 'ProjectApplySiteDueDiligenceEditMoreFile',
    meta: {
      title: '现场尽调',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      fileCenter: true, // 是否直连文件中心
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:siteDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/siteDueDiligence/MoreFile.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/siteDueDiligence/edit/materialQuery/:cddRefcode/:cddUserRefcode',
    name: 'ProjectApplySiteDueDiligenceEditMaterialQuery',
    meta: {
      title: '现场尽调',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      fileCenter: true, // 是否直连文件中心
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:siteDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/siteDueDiligence/MaterialQuery.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/siteDueDiligence/edit/tagManagement/:cddRefcode/:cddUserRefcode',
    name: 'ProjectApplySiteDueDiligenceEditMaterialQueryTagManagement',
    meta: {
      title: '全部标签',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      fileCenter: true, // 是否直连文件中心
      funids: 'member:project:apply:siteDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/siteDueDiligence/TagManagement.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/siteDueDiligence/edit/makeTag/:cddUserRefcode/:cddTagRefcode/:selectRefcode?',
    name: 'ProjectApplySiteDueDiligenceEditMaterialQueryMakeTag',
    meta: {
      title: '全部材料',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      fileCenter: true, // 是否直连文件中心
      funids: 'member:project:apply:siteDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/siteDueDiligence/MakeTag.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/siteDueDiligence/detail/:cddRefcode',
    name: 'ProjectApplySiteDueDiligenceEditMaterialQueryDetail',
    meta: {
      title: '尽调结果查询',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      fileCenter: true, // 是否直连文件中心
      funids: 'member:project:apply:siteDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/siteDueDiligence/Detail.vue', {
      pageType: `top`
    })
  }
]
