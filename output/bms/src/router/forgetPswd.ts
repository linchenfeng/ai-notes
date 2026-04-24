/*
 * @Author       : jacky.cai
 * @Date         : 2023-12-25 14:25:37
 * @LastEditors  : jacky.cai
 * @LastEditTime : 2024-01-11 13:14:34
 * @Description  : 忘记密码，无需登录
 */

import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/forgetPswd',
    name: 'ForgetPswd',
    meta: {
      title: '找回密码',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/forgetPswd/index.vue', {
      pageType: `top`
    })
  },
  {
    path: '/forgetPswd/selectType/:loginId/:email?/:mobilephone?',
    name: 'ForgetPswd/SelectType',
    meta: {
      title: '找回密码',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/forgetPswd/SelectType.vue', {
      pageType: `top`
    })
  },
  {
    path: '/forgetPswd/phoneAuth/:loginId/:mobilephone',
    name: 'ForgetPswd/PhoneAuth',
    meta: {
      title: '找回密码',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/forgetPswd/PhoneAuth.vue', {
      pageType: `top`
    })
  },
  {
    path: '/forgetPswd/emailAuth/:loginId/:email',
    name: 'ForgetPswd/EmailAuth',
    meta: {
      title: '找回密码',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/forgetPswd/EmailAuth.vue', {
      pageType: `top`
    })
  },
  {
    path: '/forgetPswd/success',
    name: 'ForgetPswd/Success',
    meta: {
      title: '重置成功',
      requiresAuth: false, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true // 是否显示导航栏左侧箭头
    },
    component: __dynamicImportComponent__('@/pages/forgetPswd/Success.vue', {
      pageType: `top`
    })
  }
]
