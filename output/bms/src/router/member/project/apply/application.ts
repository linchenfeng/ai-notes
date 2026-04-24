/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-12 11:03:52
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-25 10:34:19
 * @Description  : 填报申请书
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/application',
    name: 'ProjectApplication',
    meta: {
      title: '填报申请书',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:application' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/apply/application/apply/:refcode/:orgname/:ctyid/:bizScene?/:productType?',
    name: 'ProjectApplicationApply',
    meta: {
      title: '填报申请书',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:application' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/Apply.vue', {
      pageType: `top`
      // style: {
      //   enablePullDownRefresh: true,
      //   onReachBottomDistance: 100
      // }
    })
  },
  {
    // orgname 卖方名称
    path: '/member/project/apply/application/buyerInfo/:index/:orgname?',
    name: 'ProjectApplicationBuyerInfo',
    meta: {
      title: '买方信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:application' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/BuyerInfo.vue', {
      pageType: `top`
      // style: {
      //   enablePullDownRefresh: true,
      //   onReachBottomDistance: 100
      // }
    })
  },
  {
    // orgname 买方名称
    path: '/member/project/apply/application/success',
    name: 'ProjectApplicationSuccess',
    meta: {
      title: '提交成功',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:application' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/Success.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/application/detail/:refcode/:orgname/:ctyid',
    name: 'QueryApplicationApplyDetail',
    meta: {
      title: '申请书详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:application' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/Detail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/application/buyerInfoDetail/:refcode',
    name: 'QueryApplicationBuyerInfoDetail',
    meta: {
      title: '买方信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:application' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/BuyerInfoDetail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/application/failure',
    name: 'ProjectApplicationFailure',
    meta: {
      title: '填报申请书',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: false // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/Failure.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/application/invoice/:applyNo/:refcode/:orgname/:ctyid/:ccyid',
    name: 'ProjectApplicationInvoice',
    meta: {
      title: '已开发票',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:application' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/Invoice.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  }
]
