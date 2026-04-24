/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:41
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-16 16:11:22
 * @Description  : 国际业务公共接口
 */
import { request } from '@/api/api.request'
import { BuyerList, QuerySuperiorInfo, AssistSuperiorList, CreditUsersInfo } from '@/interfaces/member/project/internationfinancingCommon'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 依据卖方获取买方及贸易信息列表
   */
  listPreLoanBuyerBusinessBySellerInfo(data: object) {
    type ReqBuyerList = {
      fintAplDtcVoList: BuyerList[]
    }
    return request<ReqBuyerList>('POST', '/api-sme/internationfinancing/listPreLoanBuyerBusinessBySellerInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取贷前配置协销主管列表
   */
  getPreLoanAssistSuperiorInfo(data: QuerySuperiorInfo) {
    type ReqAssistSuperiorList = {
      assistSuperiorList: AssistSuperiorList[]
    }
    return request<ReqAssistSuperiorList>('POST', '/api-sme/internationfinancing/getPreLoanAssistSuperiorInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取贷前配置协销人员列表
   */
  getPreLoanAssistUsersInfo(data: QuerySuperiorInfo) {
    type ReqAssistUsersList = {
      assistUsersList: AssistSuperiorList[]
    }
    return request<ReqAssistUsersList>('POST', '/api-sme/internationfinancing/getPreLoanAssistUsersInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取贷前配置征信人员列表
   */
  getPreLoanCreditUsersInfo(data: QuerySuperiorInfo) {
    return request<CreditUsersInfo>('POST', '/api-sme/internationfinancing/getPreLoanCreditUsersInfo', data)
  }
}
