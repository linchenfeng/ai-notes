/*
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-07 11:19:54
 * @LastEditors  : MingChun.Cheng
 * @LastEditTime : 2023-09-22 15:48:01
 * @Description  : 逾期利息预缴试算接口
 */
import { request } from '@/api/api.request'
import { OverDueList, FadlCusLoaMVo, InterestTrialResult, SendResult } from '@/interfaces/member/myinfo/interestTrial'
export default {
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 获取逾期利息试算信息列表
   */
  findOverDuePage(data) {
    return request<OverDueList>('POST', '/api-sme/prepaidOverdue/findOverduePage', data)
  },
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 查询逾期利息预缴试算详情
   */
  getOverDueInfo(data) {
    return request<FadlCusLoaMVo>('POST', '/api-sme/prepaidOverdue/getOverdueInfo', data)
  },
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 逾期利息预缴试算
   */
  doOverdueCount(data) {
    return request<InterestTrialResult>('POST', '/api-sme/prepaidOverdue/doOverdueCount', data)
  },
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 逾期利息预缴试算发送客户
   */
  doSendOverDueInfo(data) {
    return request<SendResult>('POST', '/api-sme/prepaidOverdue/doSendOverdueInfo', data)
  }
}
