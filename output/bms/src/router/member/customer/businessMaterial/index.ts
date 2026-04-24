/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-01 13:29:29
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-11 19:18:37
 * @Description  : 收集资料进度路由
 */

import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    //refcode:客户流水/type:类型
    path: '/member/customer/businessMaterial/detail/:refcode/:type',
    name: 'BusinessMaterial',
    meta: {
      title: '收集资料进度',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:customer' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/customer/businessMaterial/Detail.vue', {
      pageType: `top`
    })
  }
]
