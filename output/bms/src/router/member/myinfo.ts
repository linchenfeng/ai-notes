/*
 * @Author       : may.ruan
 * @Date         : 2022-10-08 11:39:52
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-28 11:00:48
 * @Description  : 个人中心路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/myinfo',
    name: 'Myinfo',
    meta: {
      title: '个人中心',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: false, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/contractCollect',
    name: 'MyinfoContractCollect',
    meta: {
      title: '签约信息收集',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:contract' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100
      }
    })
  },
  {
    path: '/member/myinfo/contractCollect/collectInfo/:refcode',
    name: 'MyinfoContractCollectInfo',
    meta: {
      title: '签约信息收集',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:contract' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/CollectInfo.vue', {
      pageType: `top`
    })
  },
  {
    // 买方企业信息 供应链&&供应链+保理
    path: '/member/myinfo/contractCollect/actualBuyerInfo',
    name: 'MyinfoContractCollectActualBuyerInfo',
    meta: {
      title: '买方企业信息详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:contract' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/ActualBuyerInfo.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/contractCollect/counterParty/:refcode/:bussType',
    name: 'MyinfoContractCollectCounterParty',
    meta: {
      title: '买方企业信息详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:contract' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/CounterParty.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/contractCollect/suretyEnterprise/:refcode',
    name: 'MyinfoContractCollectSuretyEnterprise',
    meta: {
      title: '连带保证公司信息详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:contract' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/SuretyEnterprise.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/contractCollect/suretyPerson/:refcode',
    name: 'MyinfoContractCollectSuretyPerson',
    meta: {
      title: '连带保证人信息详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:contract' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/contractCollect/SuretyPerson.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/interestTrial',
    name: 'MyinfoInterestTrial',
    meta: {
      title: '逾期利息预缴试算',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:cal:predict' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/interestTrial/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/interestTrial/detail/:refcode',
    name: 'MyinfoInterestTrialDetail',
    meta: {
      title: '逾期利息预缴试算',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:cal:predict' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/interestTrial/Detail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/paymentInfoFeedback',
    name: 'MyinfoPaymentInfoFeedback',
    meta: {
      title: '预计回款信息反馈',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:cal:due' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/paymentInfoFeedback/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/paymentInfoFeedback/FeedBackDetail/:refcode',
    name: 'MyinfoPaymentInfoFeedbackDetail',
    meta: {
      title: '预计回款信息反馈',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:cal:due' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/paymentInfoFeedback/FeedBackDetail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/invitationCode',
    name: 'MyinfoInvitationCode',
    meta: {
      title: '我的邀请码',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:invitationCode' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/invitationCode/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/zdw',
    name: 'MyinfoZdw',
    meta: {
      title: '中登授权',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:zdw:loginInfo' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/zdw/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/paymentInfoFeedback/BuyerDetail/:busscontNo',
    name: 'MyinfoPaymentInfoFeedbackBuyerDetail',
    meta: {
      title: '买方对账回款明细',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:cal:due' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/paymentInfoFeedback/BuyerDetail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/paymentInfoFeedback/OverdueDetail/:refcode',
    name: 'MyinfoPaymentInfoFeedbackOverdueDetail',
    meta: {
      title: '融资企业融资逾期明细',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:cal:due' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/paymentInfoFeedback/OverdueDetail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/invoice',
    name: 'MemberMyinfoinvoice',
    meta: {
      title: '开票管理',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:invoice' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/invoice/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/myinfo/invoice/generate',
    name: 'MemberMyinfoinvoiceGenerate',
    meta: {
      title: '开具发票',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:invoice' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/invoice/generate/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  // 后申请开票
  {
    path: '/member/myinfo/invoice/generate/apply/:refcode',
    name: 'MemberMyinfoGenerateInvoiceApply',
    meta: {
      title: '开票详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:invoice' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/invoice/generate/Apply.vue', {
      pageType: `top`
    })
  },
  // 申请开票
  {
    path: '/member/myinfo/invoice/apply/:type/:refcode?',
    name: 'MemberMyinfoInvoiceApply',
    meta: {
      title: '开票详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:invoice' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/invoice/Apply.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/invoice/detail/:refcode',
    name: 'MemberMyinfoInvoiceDetail',
    meta: {
      title: '开票详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:invoice' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/invoice/Detail.vue', {
      pageType: `top`
    })
  },
  {
    path: '/member/myinfo/invoice/success/:type',
    name: 'MemberMyinfoInvoiceSuccess',
    meta: {
      title: '提交成功',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:myinfo:invoice' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/myinfo/invoice/Success.vue', {
      pageType: `top`
    })
  }
]
