/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:11
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-06 10:57:00
 * @Description  :业务准入api
 */
import { request } from '@/api/api.request'
import {
  FintAplMListData,
  QaListData,
  DataCount,
  AccessCount,
  ApproveList,
  QueryBaseAplHistoryList,
  BaseAplHistoryList
} from '@/interfaces/member/project/audit/businessAccess'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取业务准入列表
   */
  findOverseasBusinessAccessPage(data: object) {
    return request<FintAplMListData>('POST', '/api-sme/internationfinancing/findOverseasBusinessAccessPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 国际业务准入审批
   */
  doApproveOverseasBusinessInfo(data: object) {
    return request('POST', '/api-sme/internationfinancing/doApproveAplInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 国际业务准入提问
   */
  doQuiz(data: object) {
    return request('POST', '/api-sme/internationfinancing/doQuiz', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 国际业务准入回复
   */
  doReply(data: object) {
    return request('POST', '/api-sme/internationfinancing/doReply', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 国际业务准入问答列表
   */
  findQuizPage(data: object) {
    return request<QaListData>('POST', '/api-sme/internationfinancing/findQuizPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 业务准入查询列表页获取业务准入各个状态的数量
   */
  getOverseasBusinessCountInfo(data: object) {
    return request<DataCount>('POST', '/api-sme/internationfinancing/getOverseasBusinessCountInfo', data)
  },
  // 业务准入审核页
  getOverseasBusinessAccessCount(data: object) {
    return request<AccessCount>('POST', '/api-sme/internationfinancing/getOverseasBusinessAccessCount', data)
  },
  // 查询准入历程
  getApproveHistory(refcode: string | number) {
    return request<{ approveList: ApproveList[] }>('GET', `/api-sme/internationfinancing/getApproveHistory/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取历史准入买方（同卖方下的）
   */
  getBaseAplHistoryList(data: QueryBaseAplHistoryList) {
    return request<{ fintAplMList: BaseAplHistoryList[] }>('POST', '/api-sme/internationfinancing/getBaseAplHistoryList', data)
  }
}
