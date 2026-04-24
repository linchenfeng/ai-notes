/*
 * @Author       : may.ruan
 * @Date         : 2022-10-08 11:39:29
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-01 13:32:15
 * @Description  : 客户路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
import statistics from './statistics'
import businessMaterial from './businessMaterial'
export default [
  {
    path: '/member/customer',
    name: 'Customer',
    meta: {
      title: '我的客户',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: false, // 是否显示导航栏左侧箭头
      funids: 'member:customer' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/customer/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100 // 设置底部距离触发事件
      }
    })
  },
  {
    // refcode:客户流水号
    path: '/member/customer/detail/:refcode/:isUnfold?',
    name: 'CustomerDetail',
    meta: {
      title: '我的客户',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头1
      funids: 'member:customer'
    },
    component: __dynamicImportComponent__('@/pages/member/customer/detail/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/customer/invited/:refcode/:fromType?', // fromType: 来源类型[1=客户列表/2=准入详情]
    name: 'CustomerInvited',
    meta: {
      title: '邀请企业',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头1
      funids: 'member:customer'
    },
    component: __dynamicImportComponent__('@/pages/member/customer/invited/index.vue', {
      pageType: `top`
    })
  },
  {
    // refcode=客户流水号,queryType=查询类型[A=待签约/B=完成签约]
    path: '/member/customer/signProcess/detail/:refcode/:queryType',
    name: 'SignDetail',
    meta: {
      title: '签约详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头

      funids: 'member:customer' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/customer/signProcess/Detail.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/customer/identificationProcess/detail/:refcode',
    name: 'IdentificationDetail',
    meta: {
      title: '认证详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:customer' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/customer/identificationProcess/Detail.vue', {
      pageType: `top`
    })
  },
  {
    // refcode:客户流水号，imtestr: 选中的数据jsonString
    path: '/member/customer/assetStatistics/detail/:refcode/:itemstr',
    name: 'AssetStatisticsDetail',
    meta: {
      title: '资产详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:customer' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/customer/assetStatistics/Detail.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100
      }
    })
  },
  {
    // refcode:客户流水号 approveStatus:审批进度
    path: '/member/customer/projectStatistics/info/:refcode/:approveStatus?',
    name: 'ProjectStatisticsInfo',
    meta: {
      title: '更多项目信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:customer' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/customer/projectStatistics/Info.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100
      }
    })
  },
  {
    //refcode:客户流水/buyerName：交易对手名称/applyDate:融资申请日/approveStatus:审批进度
    path: '/member/customer/projectStatistics/detail/:refcode/:buyerName/:applyDate/:approveStatus?',
    name: 'ProjectStatisticsDetail',
    meta: {
      title: '项目详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:customer' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/customer/projectStatistics/Detail.vue', {
      pageType: `top`
    })
  },

  ...statistics,
  ...businessMaterial
]
