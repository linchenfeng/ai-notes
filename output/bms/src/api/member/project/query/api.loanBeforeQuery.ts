/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-18 14:35:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2024-10-18 15:51:48
 * @Description  : 贷前查询公共接口
 */
import { request } from '@/api/api.request'
import { BusinessData } from '@/interfaces/member/project/apply/fillingApplication'
export default {
  //获取数据量统计
  getBusinessCount() {
    return request<BusinessData>('GET', '/api-sme/loanBeforeQuery/getBusinessCount')
  }
}
