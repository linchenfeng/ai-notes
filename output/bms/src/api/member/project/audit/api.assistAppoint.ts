/*
 * @Author       : Charon.Lin
 * @Date         : 2025-09-06 09:52:17
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-27 14:45:36
 * @Description  :指派协销
 */
import { request } from '@/api/api.request'
import {
  AppointAssistList,
  AppointCount,
  AppointInfo,
  AppointSubmitData,
  ReAppointSubmitData,
  RejectData
} from '@/interfaces/member/project/audit/assistAppoint'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 指派协销/征信列表统计
   */
  getAppointAssistCount(data: object) {
    return request<AppointCount>('POST', '/api-sme/appointAssist/getAppointAssistCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 指派协销/征信列表
   */
  findAppointAssistPage(data: object) {
    type ReqAppointAssistList = {
      appointAssistList: AppointAssistList[]
    }
    return request<ReqAppointAssistList>('POST', '/api-sme/appointAssist/findAppointAssistPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取申请协销/征信详情
   */
  getAppointAssistInfo(refcode: number | string) {
    return request<AppointInfo>('GET', `/api-sme/appointAssist/getAppointAssistInfo/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 申请协销/征信提交
   */
  doSubmitAppointAssist(data: AppointSubmitData) {
    return request('POST', '/api-sme/appointAssist/doSubmitAppointAssist', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 重新指派提交
   */
  doReapplySubmitApplyAssist(data: ReAppointSubmitData) {
    return request('POST', '/api-sme/appointAssist/doReapplySubmitApplyAssist', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 退回申请协销/征信信息
   */
  doReturnApplyAssist(data: RejectData) {
    return request('POST', '/api-sme/appointAssist/doReturnApplyAssist', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 拒绝申请协销/征信信息
   */
  doRefUseApplyAssist(data: RejectData) {
    return request('POST', '/api-sme/appointAssist/doRefUseApplyAssist', data)
  }
}
