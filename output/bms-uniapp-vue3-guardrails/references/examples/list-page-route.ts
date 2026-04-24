/*
 * @Description  : 精简示例-列表页路由
 * @ExampleFrom  : router/member/project/apply/quota.ts
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'

export default [
  {
    path: '/member/project/apply/demo',
    name: 'ProjectApplyDemo',
    meta: {
      title: '示例列表',
      requiresAuth: true,
      showNavBar: true,
      showNavBarLeftArrow: true,
      funids: 'member:project:apply:demo'
    },
    component: __dynamicImportComponent__('@/pages/member/project/apply/demo/index.vue', {
      pageType: 'top',
      style: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 100
      }
    })
  }
]
