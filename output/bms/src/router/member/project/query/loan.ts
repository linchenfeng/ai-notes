/*
 * @Author       : may.ruan
 * @Date         : 2025-09-01 11:13:22
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-17 17:32:33
 * @Description  : 项目-数据洞察-放款信息
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/query/business/loan',
    name: 'businessLoan',
    meta: {
      title: '放款信息',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:query:business:loan' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/query/business/loan/index.vue', {
      pageType: `top`,
      style: {
        enablePullDownRefresh: false,
        onReachBottomDistance: 100
      }
    })
  }
]
