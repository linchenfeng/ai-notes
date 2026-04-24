/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-23 09:51:20
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-07 17:24:04
 * @Description  : 指派尽调相关api
 */
import { request } from '@/api/api.request'
import {
  DueDiligenceCount,
  FintCddList,
  OrgnameList,
  DiligenceOrgInfo,
  AssignDiligenceInfo,
  DueDiligenceInfo,
  ResponseCddUserList,
  CddTagList,
  DueDiligenceApx,
  OptionalCddUserList,
  FintCddHistory
} from '@/interfaces/member/project/audit/assignDueDiligence'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 指派尽调计数查询
   */
  findDueDiligenceCount(data: object) {
    return request<DueDiligenceCount>('POST', '/api-sme/assignDueDiligence/findDueDiligenceCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 指派尽调分页查询
   */
  findDueDiligencePage(data: object) {
    return request<FintCddList>('POST', '/api-sme/assignDueDiligence/findDueDiligencePage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 指派尽调客户列表查询
   */
  queryAplOrgNameByPerConf(data) {
    type TemOrgnameList = {
      orgnameList: OrgnameList[]
    }
    return request<TemOrgnameList>('POST', `/api-sme/assignDueDiligence/queryAplOrgNameByPerConf`, data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 指派尽调客户信息查询
   */
  queryOrgInfo(orgname: string) {
    return request<DiligenceOrgInfo>('GET', `/api-sme/assignDueDiligence/queryOrgInfo/${orgname}`)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 提交客户尽调指派
   */
  doSubmitDueDiligence(data: object) {
    return request<AssignDiligenceInfo>('POST', '/api-sme/assignDueDiligence/doSubmitDueDiligence', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 指派尽调详情查询
   */
  queryDueDiligenceInfo(refcode: number | string) {
    return request<DueDiligenceInfo>('GET', `/api-sme/assignDueDiligence/queryDueDiligenceInfo/${refcode}`)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 修改客户尽调指派
   */
  doUpdateDueDiligence(data: object) {
    return request<AssignDiligenceInfo>('POST', '/api-sme/assignDueDiligence/doUpdateDueDiligence', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 取消尽调指派
   */
  doCancelDueDiligence(data: object) {
    return request('POST', '/api-sme/assignDueDiligence/doCancelDueDiligence', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 检查协销人员尽调状态
   */
  checkUserDueDiligenceStatus(data: object) {
    type CddUserNameList = {
      cddUserNameList: string[]
    }
    return request<CddUserNameList>('POST', `/api-sme/assignDueDiligence/checkUserDueDiligenceStatus`, data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 尽调结果人员信息查询
   */
  queryDueDiligenceUserList(refcode: number) {
    return request<ResponseCddUserList>('GET', `/api-sme/assignDueDiligence/queryDueDiligenceUserList/${refcode}`)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 尽调标签信息查询
   */
  queryDueDiligenceTagList(data: object) {
    return request<CddTagList>('POST', `/api-sme/assignDueDiligence/queryDueDiligenceTagList`, data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 尽调结果查询尽调材料信息
   */
  queryDueDiligenceApx(data: object) {
    return request<DueDiligenceApx>('POST', '/api-sme/assignDueDiligence/queryDueDiligenceApx', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 指派尽调可选协销人员查询
   */
  queryOptionalCddUserList(data) {
    type TemOptionalCddUserList = {
      optionalCddUserList: OptionalCddUserList[]
    }
    return request<TemOptionalCddUserList>('POST', `/api-sme/assignDueDiligence/queryOptionalCddUserList`, data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 查询尽调历程
   */
  queryDueDiligenceHistory(data: object) {
    type TemFintCddHistory = {
      fintCddHistory: FintCddHistory[]
    }
    return request<TemFintCddHistory>('POST', '/api-sme/assignDueDiligence/queryDueDiligenceHistory', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 检查是否允许再次尽调
   */
  checkOrgAgainCddFlag(refcode: number) {
    type AgainCddFlag = {
      orgAgainCddFlag: boolean
    }
    return request<AgainCddFlag>('GET', `/api-sme/assignDueDiligence/checkOrgAgainCddFlag/${refcode}`)
  }
}
