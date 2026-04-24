/*
 * @Author       : oscar.yu
 * @Date         : 2023-1-16 09:12:09
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-10 16:18:48
 * @Description  : 公共模块
 */
import { request } from '@/api/api.request'
import { SystemConfig, SipaBurMVo, SMSData, CountryDataList, PasswordCheckObj, passData, CtyData, MinIOToken } from '@/interfaces/common/common'
export default {
  /**
   * @Author: oscar.yu
   * @Date: 2023-1-16 09:12:09
   * @description: 获取服务端系统配置信息
   */
  getServerSystemConfig() {
    return request<SystemConfig>('GET', `/api-sme/common/getServerSystemConfig`, {}, false)
  },
  /**
   * @Author: jacky.cai
   * @Date: 2023-12-25 13:43:11
   * @param {*}  data
   * @description: 工号是否存在
   */
  loginidIsFlag(data) {
    return request<SipaBurMVo>('POST', '/api-sme/common/loginidIsFlag', data)
  },
  /**
   * @Author: jacky.cai
   * @Date: 2023-12-26 13:43:11
   * @param {*}  data
   * @description: 发送短信验证码
   */
  doSendPhoneCode(data) {
    return request<SMSData>('POST', '/api-sme/common/doSendPhoneCode', data)
  },
  /**
   * @Author: jacky.cai
   * @Date: 2024-01-04 16:01:11
   * @param {*}  data
   * @description: 发送邮箱验证码
   */
  doSendEmailCode(data) {
    return request<SMSData>('POST', '/api-sme/common/doSendEmailCode', data)
  },
  /**
   * @Author: jacky.cai
   * @Date: 2023-12-26 15:43:11
   * @param {*}  data
   * @description: 验证短信验证码
   */
  doCheckPhoneVerificationCode(data) {
    return request<SMSData>('POST', '/api-sme/common/doCheckPhoneVerificationCode', data)
  },
  /**
   * @Author: jacky.cai
   * @Date: 2024-01-04 16:11:11
   * @param {*}  data
   * @description: 验证邮箱验证码
   */
  doCheckEmailVerificationCode(data) {
    return request<SMSData>('POST', '/api-sme/common/doCheckEmailVerificationCode', data)
  },
  //  1=白名单/2=黑名单（默认查全部）
  getCountryList(cityFlag = '-', cityName = '') {
    return request<CountryDataList>('GET', `/api-sme/common/getCountryList/${cityFlag}/${cityName}`, {}, false)
  },

  // 检验密码规律性
  isPasswordValid(data) {
    return request<PasswordCheckObj>('POST', '/api-sme/common/isPasswordValid', data)
  },
  // 验证预设密码是否正确
  checkPassword(data) {
    return request<passData>('POST', '/api-sme/common/checkPassword', data)
  },
  getCountryInfo(ctyid: string) {
    return request<CtyData>('GET', `/api-sme/common/getCountryInfo/${ctyid}`)
  },
  // 获取文件中心token
  getToken() {
    return request<MinIOToken>('GET', `/api-sme/minIOAuth/getToken`, {}, true, false)
  }
}
