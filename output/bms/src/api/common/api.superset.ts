/*
 * @Author       : may.ruan
 * @Date         : 2025-06-13 14:02:45
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-15 15:05:17
 * @Description  : superset相关Api
 */
import { request } from '@/api/api.request'
import { SupersetToken } from '@/interfaces/common/superset'

export default {
  /**
   * @Author: may.ruan
   * @Date: 2025-06-13 14:05:56
   * @param {string} uuid 仪表盘id或uuid
   * @description: 获取看板访客口令牌
   */
  getGuestTokenInfo(uuid: string) {
    return request<SupersetToken>('GET', `/api-sme/superset/getGuestTokenInfo/${uuid}`, {}, true, true, false)
  }
}
