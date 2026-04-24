/*
 * @Author       : jacky.cai
 * @Date         : 2022-10-17 15:59:31
 * @LastEditors  : jacky.cai
 * @LastEditTime : 2022-10-24 14:13:12
 * @Description  :项目模块接口
 */
import { request } from '@/api/api.request'
import { ProjectList, ProjectProgressInfo } from '@/interfaces/member/project'
import { MyProjectDetail, FloaArpMVo } from '@/interfaces/member/project/query/projectStatistics'
export default {
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 14:01:34
   * @param {*} data
   * @return {*}
   * @description: 获取项目列表
   */
  findProjectPage(data) {
    return request<ProjectList>('POST', `/api-sme/projectCommon/findProjectPage`, data)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 14:01:51
   * @return {*}
   * @description: 获取项目进度数据
   */
  getProjectProgressInfo() {
    return request<ProjectProgressInfo>('GET', '/api-sme/projectCommon/getProjectProgressInfo')
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:57:37
   * @param {*} data
   * @return {*}
   * @description: 获取我的项目中与某一交易对手的项目列表
   */
  findCustomProjectPage(data) {
    return request<MyProjectDetail>('POST', '/api-sme/projectCommon/findCustomProjectPage', data)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:57:53
   * @param {*} refcode 融资流水号
   * @return {*}
   * @description: 获取项目明细
   */
  getProjectInfo(refcode) {
    return request<FloaArpMVo>('GET', `/api-sme/projectCommon/getProjectInfo/${refcode}`)
  }
}
