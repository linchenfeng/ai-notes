/*
 * @Author       : may.ruan
 * @Date         : 2022-10-08 11:39:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 09:35:04
 * @Description  : 项目路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
import audit from './audit' //项目-业务审核路由
import apply from './apply' // 项目-业务申请
import query from './query' // 项目-业务查询
export default [
  {
    path: '/member/project',
    name: 'Project',
    meta: {
      title: '',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: false, // 是否显示导航栏左侧箭头
      funids: 'member:project' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/index.vue', {
      pageType: `top`
      // style: {
      //   enablePullDownRefresh: true,
      //   onReachBottomDistance: 100
      // }
    })
  },
  ...apply,
  ...audit,
  ...query
]
