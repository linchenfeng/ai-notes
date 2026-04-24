/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:11
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-10 16:31:42
 * @Description  :企业核查api
 */
import { request } from '@/api/api.request'
import {
  VerifyUserInfo,
  CheckSubmit,
  CheckCount,
  FintAplChkVoList,
  QueryVerifyInfo,
  FintAplChkVo,
  SubmitData,
  QueryVerifyHistory,
  HisCheckList,
  CheckStatus
} from '@/interfaces/member/project/audit/check'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {string} aplRefcode
   * @description: 获取核查人
   */
  getVerifyUserInfo(aplRefcode: string | number) {
    return request<VerifyUserInfo>('GET', `/api-sme/internationOrgVerify/getVerifyUserInfo/${aplRefcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 提交企业核查申请
   */
  doSubmitVerifyApply(data: CheckSubmit) {
    return request('POST', '/api-sme/internationOrgVerify/doSubmitVerifyApply', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取待核查企业列表统计数
   */
  findWaitVerifyCount(data: object) {
    return request<CheckCount>('POST', '/api-sme/internationOrgVerify/findWaitVerifyCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取待核查企业列表
   */
  findWaitVerifyPage(data: object) {
    type ReqFintAplChkVoList = {
      fintAplChkVoList: FintAplChkVoList[]
    }
    return request<ReqFintAplChkVoList>('POST', '/api-sme/internationOrgVerify/findWaitVerifyPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取企业核查信息
   */
  getOrgVerifyInfo(data: QueryVerifyInfo) {
    return request<{ fintAplChkVo: FintAplChkVo }>('POST', '/api-sme/internationOrgVerify/getOrgVerifyInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 提交核查结果
   */
  doSubmitVerifyResult(data: SubmitData) {
    type ResultData = {
      /**
       * 失败标记【0=准入已删除/1=准入已撤回】，关联准入数据异常提交失败
       */
      errorFlag?: string
    }
    return request<ResultData>('POST', '/api-sme/internationOrgVerify/doSubmitVerifyResult', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取企业核查历程
   */
  getOrgVerifyHistory(data: QueryVerifyHistory) {
    type ReqHisCheckList = {
      hisCheckList: HisCheckList[]
    }
    return request<ReqHisCheckList>('POST', '/api-sme/internationOrgVerify/getOrgVerifyHistory', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取最新核查结果
   */
  getNewestVerifyInfo(data: QueryVerifyInfo) {
    return request<{ fintAplChkVo: FintAplChkVo }>('POST', '/api-sme/internationOrgVerify/getNewestVerifyInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {string} aplRefcode
   * @description: 获取准入核查状态
   */
  getVerifyStatus(aplRefcode: string | number) {
    return request<CheckStatus>('GET', `/api-sme/internationOrgVerify/getVerifyStatus/${aplRefcode}`)
  }
}
