/*
 * @Description  : 路由与接口示例 /examples/router-api-example
 */

export const routerExample = `(pre, meta) => [
  {
    path: 'meeting/meetingPush',
    name: \`\${pre}meeting-meeting-push\`,
    component: () => import('@/pages/ecommerce/meeting/meetingPush'),
    meta: { ...meta, title: '上会结果推送' }
  },
  {
    path: 'meeting/meetingPush/detail/:refcode',
    name: \`\${pre}meeting-meeting-push-detail\`,
    component: () => import('@/pages/ecommerce/meeting/meetingPush/Detail.vue'),
    meta: { ...meta, title: '上会结果推送详情' }
  }
]`

export const apiExample = `export default {
  findOnMeetingPushPage(data) {
    return apiRequest.request('post', '/api-sme/operation/onMeetingPush/findOnMeetingPushPage', data)
  },
  getOnMeetingPushInfo(refcode) {
    return apiRequest.request('get', \`/api-sme/operation/onMeetingPush/getOnMeetingPushInfo/\${refcode}\`)
  }
}`
