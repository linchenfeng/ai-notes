/*
 * @Author       : may.ruan
 * @Date         : 2022-10-08 11:41:11
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2024-06-21 13:33:06
 * @Description  : 会员路由入口
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'

import customer from './customer'
import myinfo from './myinfo'
import project from './project/index'
const routes = [
  {
    path: '/member',
    name: 'Member',
    redirect: '/member/customer',
    meta: {
      title: '会员中心入口',
      requiresAuth: true // 是否需要登录验证
    },
    component: __dynamicImportComponent__('@/pages/member/index.vue', {
      pageType: `top`
    })
    // children: [...customer, ...myinfo, ...project]
  },
  ...customer,
  ...myinfo,
  ...project
]
export default routes
