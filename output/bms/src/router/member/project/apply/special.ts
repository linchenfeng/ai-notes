/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-06 17:35:21
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 09:32:36
 * @Description  : 特批申请
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/apply/special',
    name: 'ProjectApplySpecialApproval',
    meta: {
      title: '特批申请',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:special' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/special/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/project/apply/special/apply/:refcode?/:taskType?',
    name: 'ProjectSpecialApprovalApply',
    meta: {
      title: '特批申请',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:special' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/special/Apply.vue', {
      pageType: `top`
    })
  },
  // orgname 客户名称 identity 身份【apply=客户经理申请/aduit=审批】 refcode 特批申请流水号
  {
    path: '/member/project/apply/special/shopSelect/:orgname/:identity/:refcode',
    name: 'ProjectSpecialShopSelect',
    meta: {
      title: '店铺信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:special' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/special/ShopSelect.vue', {
      pageType: `top`
    })
  },
  // refcode 特批申请流水号
  {
    path: '/member/project/apply/special/shopDetail/:refcode',
    name: 'ProjectSpecialShopDetail',
    meta: {
      title: '店铺信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:special' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/special/ShopDetail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/project/apply/special/success',
    name: 'ProjectApplySpecialApprovalSuccess',
    meta: {
      title: '提交成功',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:apply:special' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/special/Success.vue', {
      pageType: `top`
    })
  }
]
