/*
 * @Description  : 精简示例-列表页 API
 * @ExampleFrom  : api/member/project/apply/api.quota.ts
 */
import { request } from '@/api/api.request'
import { DemoCount, DemoListItem, DemoSearch } from '@/interfaces/demo/list'

export default {
  getListCount(data: object) {
    return request<DemoCount>('POST', '/api-sme/demo/getListCount', data)
  },
  findListPage(data: DemoSearch) {
    type DemoListResponse = {
      list: DemoListItem[]
    }
    return request<DemoListResponse>('POST', '/api-sme/demo/findListPage', data)
  }
}
