/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:11
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-03-03 09:19:28
 * @Description  :开票管理api
 */
import { request } from '@/api/api.request'
import {
  ListCount,
  InvoiceList,
  FgaiAppVo,
  FintAppList,
  ReserveListCount,
  FactoringList,
  OrgnameList,
  QueryFbpaAccList,
  FgaiAppList,
  BindInvoice,
  FactoringListFactoringList
} from '@/interfaces/member/myinfo/invoice'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 开票管理状态统计
   */
  getInvoiceCount(data: object) {
    return request<ListCount>('POST', '/api-sme/invoiceManage/getInvoiceCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 开票管理列表查询
   */
  findInvoicePage(data: object) {
    return request<{ invoiceList: InvoiceList[] }>('POST', '/api-sme/invoiceManage/findInvoicePage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {string} refcode
   * @description: 获取发票详情
   */
  getInvoiceDetail(refcode: string | number, needToken = true) {
    return request<{ fgaiAppVo: FgaiAppVo }>('GET', `/api-sme/invoiceManage/getInvoiceDetail/${refcode}`, {}, needToken)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 候补发票列表
   */
  findReservePage(data: object) {
    return request<{ fintAppList: FintAppList[] }>('POST', '/api-sme/invoiceManage/findReservePage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 候补发票统计
   */
  getReserveCount(data: object) {
    return request<ReserveListCount>('POST', '/api-sme/invoiceManage/getReserveCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {string} refcode
   * @description: 获取后补发票详情
   */
  getReserveDetail(refcode: string | number) {
    return request<{ fgaiAppVo: FgaiAppVo }>('GET', `/api-mock/invoiceManage/getReserveDetail/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {string} refcode
   * @description: 获取开票主体名称（保理商）
   */
  getFactoringInfo(needToken = true) {
    return request<{ factoringList: FactoringList[] }>('GET', '/api-sme/invoiceManage/getFactoringInfo', {}, needToken)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取准入企业名称
   */
  getAplOrgnameList(data: object) {
    return request<{ orgnameList: OrgnameList[] }>('POST', '/api-sme/invoiceManage/getAplOrgnameList', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 提交发票申请
   */
  doSubmitInfo(data: FgaiAppVo, needToken = true) {
    return request<{ refcode: string }>('POST', '/api-sme/invoiceManage/doSubmitInfo', data, needToken)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取征信费账户信息
   */
  getCreditAccountInfo(data: QueryFbpaAccList) {
    return request<{ factoringList: FactoringListFactoringList[] }>('POST', '/api-sme/invoiceManage/getCreditAccountInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取可选先开发票
   */
  getBeforeInvoiceList(data: object) {
    return request<{ fgaiAppList: FgaiAppList[] }>('POST', '/api-sme/invoiceManage/getBeforeInvoiceList', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 提交发票申请
   */
  doBindBusinessApp(data: BindInvoice, needToken = true) {
    return request<{ refcode: string }>('POST', '/api-sme/invoiceManage/doBindBusinessApp', data, needToken)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取可选先开发票
   */
  getBusinessInvoiceApp(data: object, needToken = true) {
    return request<{ fgaiAppVo: FgaiAppVo }>('POST', '/api-sme/invoiceManage/getBusinessInvoiceApp', data, needToken)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 发票后补提交
   */
  doSubmitReserve(data: object) {
    return request('POST', '/api-sme/invoiceManage/doSubmitReserve', data)
  }
}
