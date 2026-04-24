/*
 * @Author       : Charon.Lin
 * @Date         : 2025-07-09 10:30:52
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-22 16:28:54
 * @Description  :  项目-业务审核-资料复核 /project/audit/documentReview
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/documentReview',
    name: 'ProjectDocumentReview',
    meta: {
      title: '资料复核',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:documentReview' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/documentReview/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/audit/documentReview/audit/:refcode',
    name: 'ProjectDocumentReviewAudit',
    meta: {
      title: '资料复核',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:documentReview:query,member:project:audit:documentReview:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/documentReview/Audit.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/audit/documentReview/detail/:refcode',
    name: 'ProjectDocumentReviewDetail',
    meta: {
      title: '资料复核详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:documentReview:query,member:project:audit:documentReview:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/documentReview/Detail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/audit/documentReview/fileList/:orgname/:dqscNo',
    name: 'ProjectDocumentReviewFileList',
    meta: {
      title: '资料清单',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:documentReview:query,member:project:audit:documentReview:submit' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/documentReview/FileList.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/audit/documentReview/history/:dqscNo',
    name: 'ProjectDocumentReviewHistory',
    meta: {
      title: '审核历程',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:documentReview:query' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/documentReview/History.vue', {
      pageType: `top`
    })
  }
]
