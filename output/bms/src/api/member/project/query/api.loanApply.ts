/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:41
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-11 17:56:36
 * @Description  : 融资申请审核查询相关api
 */
import { request } from '@/api/api.request'
import { LoanApplyCount, Search, FintLoaList } from '@/interfaces/member/project/query/loanApply'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 统计融资申请查询数量
   */
  getLoanQueryCount(data: object) {
    return request<LoanApplyCount>('POST', '/api-sme/intCbeLoan/getLoanQueryCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {Search} data
   * @description: 查询融资申请列表
   */
  findApprovalPage(data: Search) {
    return request<{ fintLoaList: FintLoaList[] }>('POST', '/api-sme/intCbeLoan/findLoanQueryPage', data)
  }
}
