/*
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-07 11:19:54
 * @LastEditors  : MingChun.Cheng
 * @LastEditTime : 2023-09-07 13:21:48
 * @Description  : 预计回款信息反馈接口
 */
import { request } from '@/api/api.request'
import { PreRetrunAmtList, FadlRemindMVoDetail, ReconDayList } from '@/interfaces/member/myinfo/paymentInfoFeedback'

export default {
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 预计回款信息反馈列表
   */
  findPaymentPage(data) {
    return request<PreRetrunAmtList>('POST', '/api-sme/paymentFeedback/findPaymentPage', data)
  },
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 查询预计回款信息反馈列表详情
   */
  getPrePaymentInfo(refcode) {
    return request<FadlRemindMVoDetail>('GET', `/api-sme/paymentFeedback/getPrePaymentInfo/${refcode}`)
  },
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 查询实际买方对账回款明细
   */
  getActualPayInfo(refcode) {
    return request<ReconDayList>('GET', `/api-sme/paymentFeedback/getActualPayInfo/${refcode}`)
  },
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 提交预计回款信息反馈
   */
  doPreRetrunSubmit(data) {
    return request('POST', '/api-sme/paymentFeedback/doPreRetrunSubmit', data)
  }
}
