/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 11:27:57
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:22:28
 * @Description  : 预警解除申请api
 */
import { request } from '@/api/api.request'
import { WarningCount, WarningListItem, WarningAppInfo } from '@/interfaces/member/project/apply/warningApproval'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询预警解除申请统计数据
   */
  getWarningAppCount(data: object) {
    return request<WarningCount>('POST', '/api-sme/warningApproval/getWarningAppCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询特批申请列表
   */
  findWarningAppList(data: object) {
    type WarningList = {
      warningList: WarningListItem[]
    }
    return request<WarningList>('POST', '/api-sme/warningApproval/findWarningAppList', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {WarningAppInfo} data
   * @description: 保存预警解除申请信息
   */
  doSaveWarningAppInfo(data: WarningAppInfo) {
    type TemData = {
      refcode: number
    }
    return request<TemData>('POST', '/api-sme/warningApproval/doSaveWarningAppInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {WarningAppInfo} data
   * @description: 提交预警解除申请信息
   */
  doSubmitWarningAppInfo(data: WarningAppInfo) {
    return request('POST', '/api-sme/warningApproval/doSubmitWarningAppInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 删除预警解除申请信息
   */
  doRemoveWarningAppInfo(data: object) {
    return request('POST', '/api-sme/warningApproval/doRemoveWarningAppInfo', data)
  }
}
