/*
 * @Author       : LongCan.Yang
 * @Date         : 2023-11-27 11:34:37
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 11:16:49
 * @Description  : 分享给融资企业收集信息路由，无需登录
 */

import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/finFirmCollect',
    name: 'FinFirmCollectInfo',
    meta: {
      title: '签约信息收集',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/finFirmCollect/index.vue', {
      pageType: `top`
    })
  },
  {
    // 买方企业信息 供应链&&供应链+保理
    path: '/finFirmCollect/actualBuyerInfo',
    name: 'FinFirmCollectActualBuyerInfo',
    meta: {
      title: '买方企业信息详情',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/ActualBuyerInfo.vue', {
      pageType: `top`
    })
  },
  {
    path: '/finFirmCollect/counterParty/:refcode/:bussType',
    name: 'FinFirmCollectCounterParty',
    meta: {
      title: '买方企业信息详情',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/CounterParty.vue', {
      pageType: `top`
    })
  },
  {
    path: '/finFirmCollect/suretyEnterprise/:refcode',
    name: 'FinFirmCollectSuretyEnterprise',
    meta: {
      title: '连带保证公司信息详情',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/SuretyEnterprise.vue', {
      pageType: `top`
    })
  },
  {
    path: '/finFirmCollect/suretyPerson/:refcode',
    name: 'FinFirmCollectSuretyPerson',
    meta: {
      title: '连带保证人信息详情',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/SuretyPerson.vue', {
      pageType: `top`
    })
  },
  {
    path: '/clientApplication',
    name: 'ClientApplication',
    meta: {
      title: '填报申请书',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/clientApplication/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/clientApplication/buyerInfo/:index',
    name: 'ClientApplicationBuyerInfo',
    meta: {
      title: '买方信息',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/application/BuyerInfo.vue', {
      pageType: `top`
    })
  },
  {
    path: '/additionalComments',
    name: 'AdditionalComments',
    meta: {
      title: '补充意见',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/additionalComments/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/invoice',
    name: 'Invoice',
    meta: {
      title: '开票详情',
      type: 'share',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/invoice/index.vue', {
      pageType: `top`
    })
  }
]
