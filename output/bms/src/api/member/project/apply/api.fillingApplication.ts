/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-12 10:31:00
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-18 17:45:49
 * @Description  : 填报申请书相关api
 */
import { isNotEmpty } from '@/utils/validate'
import { encodeBase64 } from '@/utils/crypto'
import { request, download } from '@/api/api.request'
import {
  FinanceCount,
  AppList,
  ApplicationInfo,
  ApplyOrgInfo,
  FactoringList,
  ApplicationBuyer,
  FindBuyerList
} from '@/interfaces/member/project/apply/fillingApplication'

export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 待填报申请书总数
   */
  getFinanceCount(data: object) {
    return request<FinanceCount>('POST', '/api-sme/fillingApplication/getFinanceCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 待填报申请书列表
   */
  findFinancePage(data: object) {
    type TemAppList = {
      appList: AppList[]
    }
    return request<TemAppList>('POST', '/api-sme/fillingApplication/findFinancePage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 获取申请书详情
   */
  getApplicationInfo(data: object, needToken) {
    return request<ApplicationInfo>('POST', '/api-sme/fillingApplication/getApplicationInfo', data, needToken)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 发送邀请链接时状态变更
   */
  doSendInviteLink(data: object) {
    return request('POST', '/api-sme/fillingApplication/doSendInviteLink', data, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 获取企业信息
   */
  getApplyOrgInfo(orgname, queryType?: string) {
    // queryType1=正常查询（可以不传）/2=不抛出异常
    const data = {
      orgname,
      queryType: queryType || '1'
    }
    return request<ApplyOrgInfo>('POST', '/api-sme/fillingApplication/getApplyOrgInfo', data, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 申请书临时保存
   */
  doSubmitApplicationTemp(data, needToken, showLoadingFlag) {
    type TemData = {
      refcode: number
    }
    return request<TemData>('POST', '/api-sme/fillingApplication/doSubmitApplicationTemp', data, needToken, showLoadingFlag)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 提交申请书
   */
  doSubmitApplication(data: object) {
    return request('POST', '/api-sme/fillingApplication/doSubmitApplication', data, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 客户经理申请书确认
   */
  doSubmitConfirm(data: object) {
    return request('POST', '/api-sme/fillingApplication/doSubmitConfirm', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 检查申请书状态
   */
  doCheckApplication(data: object) {
    type TemApplyStatus = {
      applyStatus: string
      /**
       * 邀请已读状态[0=未读/1=已读]
       */
      pushReadStatus: string
      /**
       * 邀请状态[0=未邀请/1=已发送邀请]
       */
      pushStatus: string
    }
    return request<TemApplyStatus>('POST', '/api-sme/fillingApplication/doCheckApplication', data, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @description: 获取保理商信息
   */
  getFactoringInfo(needToken) {
    return request<FactoringList>('GET', '/api-sme/fillingApplication/getFactoringInfo', {}, needToken)
  },
  /**
   * @Author: Charon.Lin
   * @Date: 2025-01-09 17:08:12
   * @description: 回单OCR识别
   */
  doOcrReceipt(resourceUuid: string) {
    type PayeeAcctName = {
      payeeAcctName: string
      payeeBankName: string
      payeeAcctNo: string
    }
    return request<PayeeAcctName>('GET', `/api-sme/fillingApplication/doOcrReceipt/${resourceUuid}`, {}, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @description: 获取保理商信息
   */
  checkApplicationBuyer(refcode: string, needToken) {
    return request<ApplicationBuyer>('GET', `/api-sme/fillingApplication/checkApplicationBuyer/${refcode}`, {}, needToken)
  },
  //查询可新增准入买方
  findAplBuyerPage(data: object) {
    return request<FindBuyerList>('POST', '/api-sme/fillingApplication/findAplBuyerPage', data)
  },
  //删除已新增买方
  doRemoveAplBuyer(data: object) {
    return request('POST', '/api-sme/fillingApplication/doRemoveAplBuyer', data)
  },
  // 下载付款委托书附件模板
  doDownloadTemplate(refcode, payeeAcctName, payeeBankName, payeeAcctNo) {
    const encodeRefcode = encodeBase64(refcode || 0)
    const encodePayeeAcctName = isNotEmpty(payeeAcctName) ? encodeBase64(payeeAcctName) : '-'
    const encodePayeeBankName = isNotEmpty(payeeBankName) ? encodeBase64(payeeBankName) : '-'
    const encodePayeeAcctNo = isNotEmpty(payeeAcctNo) ? encodeBase64(payeeAcctNo) : '-'
    return download(
      `/api-sme/fillingApplication/doDownloadTemplate/${encodeRefcode}/${encodePayeeAcctName}/${encodePayeeBankName}/${encodePayeeAcctNo}`
    )
  }
}
