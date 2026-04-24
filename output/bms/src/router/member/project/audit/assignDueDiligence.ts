/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-23 15:43:38
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-28 13:28:04
 * @Description  : 指派尽调路由
 */
import { __dynamicImportComponent__ } from '@/uni-simple-router'
export default [
  {
    path: '/member/project/audit/assignDueDiligence',
    name: 'AuditAssignDueDiligence',
    meta: {
      title: '指派尽调',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assignDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assignDueDiligence/index.vue', {
      pageType: `top`,
      style: {
        onReachBottomDistance: 100,
        enablePullDownRefresh: true
      }
    })
  },
  {
    path: '/member/project/audit/assignDueDiligence/add',
    name: 'AuditAssignDueDiligenceAdd',
    meta: {
      title: '新增指派尽调',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      fileCenter: true, // 是否直连文件中心
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assignDueDiligence:query,member:project:audit:assignDueDiligence:insert' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assignDueDiligence/Edit.vue', {
      pageType: `top`
    })
  },
  {
    // refcode 指派尽调流水号
    path: '/member/project/audit/assignDueDiligence/edit/:refcode/:orgname?',
    name: 'AuditAssignDueDiligenceEdit',
    meta: {
      title: '指派尽调详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      fileCenter: true, // 是否直连文件中心
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assignDueDiligence:query,member:project:audit:assignDueDiligence:insert' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assignDueDiligence/Edit.vue', {
      pageType: `top`
    })
  },
  {
    // refcode 指派尽调流水号
    path: '/member/project/audit/assignDueDiligence/detail/:refcode',
    name: 'AuditAssignDueDiligenceDetail',
    meta: {
      title: '指派尽调详情',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      fileCenter: true, // 是否直连文件中心
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assignDueDiligence:query,member:project:audit:assignDueDiligence:insert' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assignDueDiligence/Detail.vue', {
      pageType: `top`
    })
  },
  {
    // 地图中心点标记 longitude 经度 latitude 纬度
    path: '/member/project/audit/assignDueDiligence/baiduMap/:longitude?/:latitude?',
    name: 'AuditAssignDueDiligenceBaiduMap',
    meta: {
      title: '客户尽调',
      requiresAuth: true, // 是否需要登录验证
      showNavBar: true, // 是否显示导航栏
      showNavBarLeftArrow: true, // 是否显示导航栏左侧箭头
      funids: 'member:project:audit:assignDueDiligence:query,member:project:audit:assignDueDiligence:insert,member:project:apply:siteDueDiligence' // 权限id
    },
    component: __dynamicImportComponent__('@/pages/member/project/audit/assignDueDiligence/BaiduMap.vue', {
      pageType: `top`
    })
  }
]
