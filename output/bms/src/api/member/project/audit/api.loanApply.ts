/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:41
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-03 14:15:12
 * @Description  : 融资申请审核相关api
 */
import { request } from '@/api/api.request'
import { LoanApplyCount, Search, FintLoaList, SubmitData, HistoryList } from '@/interfaces/member/project/audit/loanApply'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 统计融资申请审核数量
   */
  getApprovalCount(data: object) {
    return request<LoanApplyCount>('POST', '/api-sme/intCbeLoan/getApprovalCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {Search} data
   * @description: 查询融资申请审核列表
   */
  findApprovalPage(data: Search) {
    return request<{ fintLoaList: FintLoaList[] }>('POST', '/api-sme/intCbeLoan/findApprovalPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {SubmitData} data
   * @description: 提交融资审批结果
   */
  doSubmitApproval(data: SubmitData) {
    return request('POST', '/api-sme/intCbeLoan/doSubmitApproval', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @description: 融资审批历程
   */
  getApprovalHistory(refcode: string) {
    return request<{ historyList: HistoryList[] }>('GET', `/api-sme/intCbeLoan/getApprovalHistory/${refcode}`)
  }
}
