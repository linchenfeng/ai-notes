/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:50:02
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:18:54
 * @Description  :业务查询相关api
 */

import { request } from '@/api/api.request'
import { FintAplMListData } from '@/interfaces/member/project/audit/businessAccess'
import { HistoryListItem } from '@/interfaces/member/project/apply/businessApply'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取国际业务列表
   */
  findOverseasBusinessPage(data: object) {
    return request<FintAplMListData>('POST', '/api-sme/internationfinancing/findOverseasBusinessPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 补充国际业务申请信息
   */
  doUpdateOverseasBusinessInfo(data: object) {
    return request('POST', '/api-sme/internationfinancing/doUpdateOverseasBusinessInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取业务申请历程
   */
  getInternationalHistoryInfo(refcode) {
    type HistoryList = {
      historyList: HistoryListItem[]
    }
    return request<HistoryList>('GET', `/api-sme/internationfinancing/getInternationalHistoryInfo/${refcode}`)
  }
}
