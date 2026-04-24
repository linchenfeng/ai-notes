/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:41
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-06 10:54:42
 * @Description  : 业务申请相关api
 */
import { request } from '@/api/api.request'
import {
  InternationBusiness,
  FintAplMVo,
  OrgListData,
  InternationBackRequest,
  listOaRequest,
  AplListRequest,
  ProductTypeListRequest,
  DataCount
} from '@/interfaces/member/project/apply/businessApply'
import { MyInfo } from '@/interfaces/member/myinfo/myinfo'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取国际业务列表
   */
  findOverseasBusinessPage(data: object) {
    return request<InternationBusiness>('POST', '/api-sme/internationfinancing/findOverseasBusinessPage', data)
  },

  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:56
   * @param {number} refcode
   * @description: 获取国际业务详情
   */
  getOverseasBusinessInfo(refcode: number | string) {
    const data = {
      refcode
    }
    return request<FintAplMVo>('POST', `/api-sme/internationfinancing/getOverseasBusinessInfo`, data)
  },

  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:57:11
   * @param {object} data
   * @description: 提交国际业务数据
   */
  doSubmitOverseasBusinessInfo(data: FintAplMVo) {
    type TemData = {
      refcode: number
    }
    return request<TemData>('POST', '/api-sme/internationfinancing/doSubmitAplInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:57:11
   * @param {object} data
   * @description: 受理客户申请
   */
  doSubmitAcceptBusinessInfo(data: FintAplMVo) {
    type TemData = {
      refcode: number
    }
    return request<TemData>('POST', '/api-sme/internationfinancing/doSubmitAcceptBusinessInfo', data)
  },

  /**
   * @Author: ran.zhu
   * @Date: 2024-07-16 17:47:21
   * @param {FintAplMVo} data
   * @return {*}
   * @description: 撤回国际业务申请
   */
  doWithdrawOverseasBusinessInfo(data: InternationBackRequest) {
    return request('POST', '/api-sme/internationfinancing/doWithdrawOverseasBusinessInfo', data)
  },

  /**
   * @Author: ran.zhu
   * @Date: 2024-07-22 15:41:48
   * @param {FintAplMVo} data
   * @return {*}
   * @description: 修改国际业务
   */
  doUpdateOverseasBusinessInfo(data: FintAplMVo) {
    return request('POST', '/api-sme/internationfinancing/doUpdateOverseasBusinessInfo', data)
  },

  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:57:29
   * @param {object} data
   * @description: 修改国际业务数据
   */
  // doUpdateOverseasBusinessInfo(data: object) {
  //   return request('POST', '/api-sme/internationfinancing/doUpdateOverseasBusinessInfo', data)
  // }
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:57:11
   * @param {string} orgType 查询类型[1=卖方/2=买方]
   * @description: 提交国际业务数据
   */
  getApplyOrgInfo(orgType: string) {
    return request<OrgListData>('GET', `/api-sme/internationfinancing/getApplyOrgInfo/${orgType}`)
  },
  /**
   * @Author: charon.Lin
   * @Date: 2025-02-17 15:41:48
   * @return {*}
   * @description: 获取准入申请及OA企业列表
   */
  listOaAndAppOrgInfo(data: object) {
    return request<listOaRequest>('POST', '/api-sme/internationfinancing/listOaAndAppOrgInfo', data)
  },
  //准入查询标记填报状态
  doUpdateFillingStatus(data: object) {
    return request('POST', '/api-sme/internationfinancing/doUpdateFillingStatus', data)
  },
  findBusinessPage(data: object) {
    return request<AplListRequest>('POST', '/api-sme/internationfinancing/findBusinessPage', data)
  },
  // 获取业务产品类型
  getProductTypeList() {
    return request<ProductTypeListRequest>('GET', '/api-sme/internationfinancing/getProductTypeList')
  },
  // 业务准入统计
  getBusinessCount(data: object) {
    return request<DataCount>('POST', '/api-sme/internationfinancing/getBusinessCount', data)
  },
  getUserInfo() {
    return request<MyInfo>('GET', '/api-sme/internationfinancing/getUserInfo')
  },
  /**
   * @Author: aolin.qu
   * @Date: 2025-12-03 14:42:27
   * @description: 解除暂缓
   */
  doCancelPostpone(data: object) {
    return request('POST', '/api-sme/internationfinancing/doCancelPostpone', data)
  }
}
