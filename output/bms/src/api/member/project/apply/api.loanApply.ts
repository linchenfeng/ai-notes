/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:41
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-03 17:16:48
 * @Description  : 申请融资相关api
 */
import { request } from '@/api/api.request'
import { LoanApplyCount, Search, FintLoaList, FintLoaVo, ProductTypeList, ChannelNameList } from '@/interfaces/member/project/apply/loanApply'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 统计申请融资数量
   */
  getApplyCount(data: object) {
    return request<LoanApplyCount>('POST', '/api-sme/intCbeLoan/getApplyCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {Search} data
   * @description: 查询申请融资列表
   */
  findApplyList(data: Search) {
    return request<{ fintLoaList: FintLoaList[] }>('POST', '/api-sme/intCbeLoan/findApplyList', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @description: 获取融资详情
   */
  getLoanDetail(refcode: string | number) {
    return request<{ fintLoaVo: FintLoaVo }>('GET', `/api-sme/intCbeLoan/getLoanDetail/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @description: 获取所有产品列表
   */
  getProductList() {
    return request<{ productTypeList: ProductTypeList[] }>('GET', '/api-sme/intCbeLoan/getProductList')
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @description: 获取所有支付渠道
   */
  getChannelNameList() {
    return request<ChannelNameList>('GET', '/api-sme/intCbeLoan/getChannelNameList')
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {Search} data
   * @description: 融资申请临时保存
   */
  doSubmitLoanInfoTemp(data: FintLoaVo) {
    return request<{ refcode: string }>('POST', '/api-sme/intCbeLoan/doSubmitLoanInfoTemp', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {Search} data
   * @description: 融资申请提交
   */
  doSubmitLoanInfo(data: FintLoaVo) {
    return request<{ refcode: string }>('POST', '/api-sme/intCbeLoan/doSubmitLoanInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @description: 删除融资申请
   */
  doDeleteLoanInfo(refcode: string) {
    return request('GET', `/api-sme/intCbeLoan/doDeleteLoanInfo/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @description: 撤回融资申请
   */
  doWithdrawLoanInfo(refcode: string) {
    return request('GET', `/api-sme/intCbeLoan/doWithdrawLoanInfo/${refcode}`)
  }
}
