/*
 * @Author       : ran.zhu
 * @Date         : 2025-09-17 14:00:37
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-22 09:23:28
 * @Description  : 获取项目资料复核信息
 */
import { request } from '@/api/api.request'
import {
  DocumentReviewList,
  DocumentReviewCount,
  DocumentReviewInfo,
  DocumentReviewSubmitData,
  FileInfo,
  PreLoanExamineHistoryList
} from '@/interfaces/member/project/audit/documentReview'

export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 资料复核列表统计
   */
  getDocumentReviewCount(data: object) {
    return request<DocumentReviewCount>('POST', '/api-sme/documentReview/getDocumentReviewCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 资料复核列表
   */
  findDocumentReviewPage(data: object) {
    type ReqDocumentReviewList = {
      documentReviewList: DocumentReviewList[]
    }
    return request<ReqDocumentReviewList>('POST', '/api-sme/documentReview/findDocumentReviewPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取资料复核详情
   */
  getDocumentReviewInfo(refcode: number | string) {
    return request<DocumentReviewInfo>('GET', `/api-sme/documentReview/getDocumentReviewInfo/${refcode}`)
  },

  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 资料复核提交
   */
  doSubmitDocumentReview(data: DocumentReviewSubmitData) {
    return request('POST', '/api-sme/documentReview/doSubmitDocumentReview', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 查询客户上传资料
   */
  getCustomerUploadInfo(data: object) {
    return request<FileInfo>('POST', '/api-sme/documentReview/getCustomerUploadInfo', data)
  },

  /**
   * @Author: ran.zhu
   * @Date: 2025-09-17 15:22:38
   * @param {number} refcode
   * @return {*}
   * @description: 查询贷前审查历程
   */
  getPreLoanExamineHistory(data) {
    return request<PreLoanExamineHistoryList[]>('POST', '/api-sme/documentReview/getPreLoanExamineHistory', data)
  }
}
