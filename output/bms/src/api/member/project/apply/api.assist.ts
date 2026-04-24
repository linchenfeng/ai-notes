/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:41
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-18 15:49:04
 * @Description  : 申请征信协销相关api
 */
import { request } from '@/api/api.request'
import { AssistCount, ApplyAssistList, AssistInfo, SubmitAssistData } from '@/interfaces/member/project/apply/assist'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 申请协销/征信列表统计
   */
  getApplyAssistCount(data: object) {
    return request<AssistCount>('POST', '/api-sme/applyAssist/getApplyAssistCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 申请协销/征信列表
   */
  findApplyAssistPage(data: object) {
    type ReqApplyAssistList = {
      applyAssistList: ApplyAssistList[]
    }
    return request<ReqApplyAssistList>('POST', '/api-sme/applyAssist/findApplyAssistPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取申请协销/征信详情
   */
  getApplyAssistInfo(refcode: number | string, isQueryApplyFlag = '0') {
    type ReqAssistAppointM = {
      assistAppointM: AssistInfo
    }
    const data = {
      refcode,
      isQueryApplyFlag
    }
    return request<ReqAssistAppointM>('POST', '/api-sme/applyAssist/getApplyAssistInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 申请协销/征信提交
   */
  doSubmitApplyAssist(data: SubmitAssistData) {
    return request('POST', '/api-sme/applyAssist/doSubmitApplyAssist', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:56
   * @param {number} refcode
   * @description: 撤回申请协销/征信信息
   */
  doWithdrawApplyAssist(data) {
    return request('POST', `/api-sme/applyAssist/doWithdrawApplyAssist`, data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:56
   * @param {number} refcode
   * @description: 删除申请协销/征信信息
   */
  doRemoveApplyAssist(data) {
    return request('POST', `/api-sme/applyAssist/doRemoveApplyAssist`, data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 申请协销/征信提交
   */
  doRefUseResubmit(data: SubmitAssistData) {
    return request('POST', '/api-sme/applyAssist/doRefUseResubmit', data)
  }
}
