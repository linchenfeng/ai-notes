/*
 * @Author       : Mingchun.Cheng
 * @Date         : 2024-10-15 14:38:10
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2024-10-15 15:24:37
 * @Description  : 我的邀请码接口
 */
import { request } from '@/api/api.request'
import { CodeInfo } from '@/interfaces/member/myinfo/invitationCodeInfo'
export default {
  /**
   * @Author: Mingchun.Cheng
   * @Date: 2024-10-15 14:42:17
   * @param {string} platformCode
   * @return {*}
   * @description: 通过平台代号获取邀请码链接
   */
  getInvitationCodeLinkByPlatformCode(platformCode: string) {
    return request<CodeInfo>('GET', `/api-sme/invitationCode/getInvitationCodeLinkByPlatformCode/${platformCode}`)
  },
  /**
   * @Author: Mingchun.Cheng
   * @Date: 2024-10-15 14:42:20
   * @param {*} data
   * @return {*}
   * @description: 生成邀请码链接
   */
  doGenerateInvitationCodeLink(data) {
    return request<CodeInfo>('POST', '/api-sme/invitationCode/doGenerateInvitationCodeLink', data)
  }
}
