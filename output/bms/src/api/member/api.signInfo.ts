/*
 * @Author       : longcan.Yang
 * @Date         : 2023-01-12 14:52:45
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2023-12-13 09:26:54
 * @Description  : 签约信息收集模块接口
 */
import { request } from '@/api/api.request'
import {
  AccountInfo,
  FconMakMVoList,
  FconMakInfo,
  ValidateInfo,
  ContractStatus,
  SipaBurMVoInfo,
  LoanOrgInfo,
  LoanOrgTransferLinkInfo,
  GatherInfo,
  FconDtcMListObj,
  JointInfo,
  FconScmVo,
  GuarantorEnterpriseInfo,
  RecBillingInfo
} from '@/interfaces/member/myinfo/contractCollect'
export default {
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-11 17:42:11
   * @param {*} data message:待识别的文本信息 bussType:业务大类
   * @return {*}
   * @description:文本识别融资企业信息
   */
  getEnterpriseInfo(data: { message: string; bussType: number }) {
    return request<AccountInfo>('POST', '/api-sme/contract/getEnterpriseInfo', data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-11 17:42:11
   * @param {*} data {message：待识别的文本信息}
   * @description:文本识别开票信息
   */

  getBillingInfo(data: { message: string }) {
    return request<RecBillingInfo>('POST', '/api-sme/contract/getBillingInfo', data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-11 17:42:11
   * @param {*} data {message：待识别的文本信息}
   * @description:文本识别连带保证公司信息
   */
  getJointInfo(data: { message: string }) {
    return request<JointInfo>('POST', '/api-sme/contract/getJointInfo', data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 10:11:27
   * @param {*} data
   * @description: 获取待收集签约信息列表
   */
  findMakingContractPage(data) {
    return request<FconMakMVoList>('POST', '/api-sme/contract/findMakingContractPage', data)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:28:16
   * @param {*} refcode 合同制作流水号
   * @return {*}
   * @description: 获取待补充数据
   */
  getMakingContractInfo(refcode: number) {
    return request<FconMakInfo>('GET', `/api-sme/contract/getMakingContractInfo/${refcode}`)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:40:43
   * @param {*} data
   * @return {*}
   * @description: 提交签约信息补充的数据
   */
  doSubmitMakingContractInfo(data: GatherInfo) {
    return request('POST', '/api-sme/contract/doSubmitMakingContractInfo', data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:55:53
   * @param {*} data
   * @description: 校验签约信息补充的数据
   */
  doCheckMakingContractInfo(data: GatherInfo) {
    return request<ValidateInfo>('POST', '/api-sme/contract/doCheckMakingContractInfo', data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:55:53
   * @param {*} refcode 合同制作流水号
   * @return {*}
   * @description: 获取合同制作状态
   */
  getMakingContractStatus(refcode: number) {
    return request<ContractStatus>('GET', `/api-sme/contract/getMakingContractStatus/${refcode}`, {}, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:55:53
   * @param {*} data refcode 合同制作流水号
   * @return {*} LoanOrgInfo
   * @description: 查询融资企业基本信息
   */
  getLoanOrgInfo(data: { refcode: number }) {
    type LoanOrgInfoData = {
      loanOrgInfo: LoanOrgInfo
    }
    return request<LoanOrgInfoData>('POST', `/api-sme/contract/getLoanOrgInfo`, data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:55:53
   * @param {*} data refcode 合同制作流水号
   * @return {*}LoanOrgTransferLinkInfo
   * @description: 查询融资企业贸易阶段联系人信息
   */
  getLoanOrgTransferLinkInfo(data: { refcode: number }) {
    type LoanOrgTransferLinkInfoData = {
      loanOrgTransferLinkInfo: LoanOrgTransferLinkInfo
    }
    return request<LoanOrgTransferLinkInfoData>('POST', `/api-sme/contract/getLoanOrgTransferLinkInfo`, data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:55:53
   * @param {*} data refcode 合同制作流水号
   * @return {*}
   * @description: 查询供应链&供应链+保理实际买方信息
   */
  getSupplyActualBuyerInfo(data: { refcode: number }) {
    return request<FconScmVo>('POST', `/api-sme/contract/getSupplyActualBuyerInfo`, data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:55:53
   * @param {*} data {refcode:合同制作流水号,guaType:连带保证人类型[1=企业/2=个人]}
   * @return {*}
   * @description: 查询连带保证人(企业)信息列表
   */
  getGuarantorInfo(data: { refcode: number; guaType: string }) {
    type GuarantorEnterpriseList = {
      guarantorEnterpriseList: Array<GuarantorEnterpriseInfo>
    }
    return request<GuarantorEnterpriseList>('POST', `/api-sme/contract/getGuarantorInfo`, data, false)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2023-01-12 13:55:53
   * @param {*} data refcode 合同制作流水号
   * @return {*}
   * @description: 查询买方列表信息  非供应链
   */
  getCounterpartyList(data: { refcode: number }) {
    type FconDtcMList = {
      buyerInfoList: Array<FconDtcMListObj>
    }
    return request<FconDtcMList>('POST', `/api-sme/contract/getCounterpartyList`, data, false)
  },
  /**
   * @Author: MingChun.Cheng
   * @Date: 2023-10-20 13:23:34
   * @return {*}
   * @description:获取页面列表条数
   */
  getPiecesInfo() {
    type SipaBurMVo = {
      sipaBurMVo: SipaBurMVoInfo
    }
    return request<SipaBurMVo>('GET', '/api-sme/personal/getPiecesInfo')
  }
}
