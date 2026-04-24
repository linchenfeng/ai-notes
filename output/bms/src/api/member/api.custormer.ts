/*
 * @Author       : may.ruan
 * @Date         : 2022-10-12 14:05:12
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-28 18:50:01
 * @Description  : 客户APi
 */
import { request } from '@/api/api.request'
import { FbpaOrgMVoList } from '@/interfaces/member/customer'
import { ApprovalProcess } from '@/interfaces/member/customer/approvalProcess'
import { SignDetail, SignProcess } from '@/interfaces/member/customer/signProcess'
import { AssetStatistics } from '@/interfaces/member/customer/assetStatistics'
import { ProjectInfo, ProjectDetailVo, QuotaOverviewInfo } from '@/interfaces/member/project/query/projectStatistics'
import { IdenfyDetail } from '@/interfaces/member/customer/identificationProcess'
import { ASDetailModel } from '@/interfaces/member/customer/asDetail'
import { CusBusinessMaterialVo, CreditRepFileVo } from '@/interfaces/member/customer/businessMaterial'
export default {
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:43:11
   * @param {*}  data
   * @description: 获取客户信息列表
   */
  findCustomInfoPage(data) {
    return request<FbpaOrgMVoList>('POST', '/api-sme/customInfo/findCustomInfoPage', data)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:44:32
   * @param {*} refcode // 客户流水号
   * @description: 获取客户审批进度信息
   */
  getCustomApprovalInfo(refcode) {
    return request<ApprovalProcess>('GET', `/api-sme/customInfo/getCustomApprovalInfo/${refcode}`)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:51:36
   * @param {*} refcode // 客户流水号
   * @description: 获取客户签约进度信息
   */
  getCustomSignInfo(refcode) {
    return request<SignProcess>('GET', `/api-sme/customInfo/getCustomSignInfo/${refcode}`)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:52:02
   * @param {*} refcode // 客户流水号
   * @description: 获取客户资产统计信息
   */
  getCustomAssetStatistics(refcode) {
    return request<AssetStatistics>('GET', `/api-sme/customInfo/getCustomAssetStatistics/${refcode}`)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:59:15
   * @param {*} refcode 客户流水号
   * @return {*}
   * @description: 获取客户认证详情
   */
  getCustomAuthInfo(refcode) {
    return request<IdenfyDetail>('GET', `/api-sme/customInfo/getCustomAuthInfo/${refcode}`)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:59:47
   * @param {*} data
   * @return {*}
   * @description: 获取客户签约详情
   */
  findCustomSignDetailsPage(data) {
    return request<SignDetail>('POST', `/api-sme/customInfo/findCustomSignDetailsPage`, data)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:54:18
   * @param {*} data
   * @return {*}
   * @description: 获取我的客户模块项目列表以及更多项目列表
   */
  findProjectStatisticsPage(data) {
    return request<ProjectInfo>('POST', `/api-sme/customInfo/findProjectStatisticsPage`, data)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 13:55:57
   * @param {*} data
   * @return {*}
   * @description: 获取客户项目详情
   */
  getCustomProjectList(data) {
    return request<ProjectDetailVo>('POST', `/api-sme/customInfo/getCustomProjectList`, data)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-20 14:01:01
   * @param {*} data
   * @return {*}
   * @description: 获取资产统计详情列表
   */
  getAssetStatisticDetailListAPI(data) {
    return request<ASDetailModel>('POST', '/api-sme/customInfo/findAssetStatisticsPage', data)
  },
  /**
   * @Author: FangFang.Wu
   * @Date: 2023-04-27 13:40:47
   * @param {*} data
   * @return {*}
   * @description: 提交入驻邀请信息
   */
  doSubmitEntryInvitationInfo(data) {
    return request('POST', '/api-sme/customInfo/doSubmitEntryInvitationInfo', data)
  },
  /**
   * @Author: MingChun.Cheng
   * @Date: 2022-10-20 13:55:57
   * @param {*} data
   * @return {*}
   * @description: 获取客户额度概况信息
   */
  getCustomCLInfo(data) {
    type FclbCusMVo = {
      fclbCusMVo: QuotaOverviewInfo
    }
    return request<FclbCusMVo>('POST', `/api-sme/customInfo/getCustomCLInfo`, data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-08-26 14:05:34
   * @param {*}
   * @description:  获取客户业务资料清单
   */
  getCusBusinessMaterial(refcode) {
    return request<CusBusinessMaterialVo>('GET', `/api-sme/customInfo/getCusBusinessMaterial/${refcode}`)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-08-26 14:05:34
   * @param {*}
   * @description:  获取客户信用分析报告文件
   */
  getCreditRepFile(orgname) {
    return request<CreditRepFileVo>('GET', `/api-sme/customInfo/getCreditRepFile/${orgname}`)
  }
}
