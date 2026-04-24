/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-23 11:35:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-22 10:13:05
 * @Description  : 现场尽调api
 */
import { request } from '@/api/api.request'
import {
  FintCddList,
  DiligenceCount,
  CustomerInfo,
  UserCddInfo,
  SaveCddInfo,
  CddApxInfo,
  SaveCddTag,
  FintCddApxList,
  AddCddTag,
  doSaveCddApx
} from '@/interfaces/member/project/apply/siteDueDiligence'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 现场尽调分页查询
   */
  findDueDiligencePage(data: object) {
    type TemFintCddList = {
      fintCddList: FintCddList[]
    }
    return request<TemFintCddList>('POST', '/api-sme/siteDueDiligence/findDueDiligencePage', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 现场尽调计数查询
   */
  findDueDiligenceCount(data: object) {
    return request<DiligenceCount>('POST', '/api-sme/siteDueDiligence/findDueDiligenceCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 现场尽调客户详情查询
   */
  queryCddCustomerInfo(refcode: number | string) {
    return request<CustomerInfo>('GET', `/api-sme/siteDueDiligence/queryCddCustomerInfo/${refcode}`)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 用户现场尽调详情接口
   */
  queryCddInfo(cddUserRefcode: number | string) {
    return request<UserCddInfo>('GET', `/api-sme/siteDueDiligence/queryCddInfo/${cddUserRefcode}`)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {SaveCddInfo} data
   * @description: 现场尽调保存
   */
  doSaveCddInfo(data: SaveCddInfo) {
    return request('POST', '/api-sme/siteDueDiligence/doSaveCddInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 现场尽调信息更多查询
   */
  queryCddApxInfo(data: object) {
    type TemCddApxInfo = {
      cddApxInfo: CddApxInfo
    }
    return request<TemCddApxInfo>('POST', '/api-sme/siteDueDiligence/queryCddApxInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 现场尽调信息删除
   */
  doRemoveCddApx(data: object) {
    return request('POST', '/api-sme/siteDueDiligence/doRemoveCddApx', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {SaveCddTag} data
   * @description: 尽调标签新增
   */
  doSaveCddTag(data: SaveCddTag) {
    return request('POST', '/api-sme/siteDueDiligence/doSaveCddTag', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 尽调标签更新
   */
  doUpdateCddTag(data: object) {
    return request('POST', '/api-sme/siteDueDiligence/doUpdateCddTag', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 尽调标签删除
   */
  doRemoveCddTag(data: object) {
    return request('POST', '/api-sme/siteDueDiligence/doRemoveCddTag', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 查询用户全部尽调材料信息
   */
  queryAllCddApx(data: object) {
    type TemFintCddApxList = {
      fintCddUserApx: FintCddApxList
    }
    return request<TemFintCddApxList>('POST', '/api-sme/siteDueDiligence/queryAllCddApx', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {AddCddTag} data
   * @description: 尽调材料添加标签
   */
  doSaveCddApxTag(data: AddCddTag) {
    return request('POST', '/api-sme/siteDueDiligence/doSaveCddApxTag', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {object} data
   * @description: 现场尽调提交
   */
  doSubmitCddInfo(data: SaveCddInfo) {
    return request('POST', '/api-sme/siteDueDiligence/doSubmitCddInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {doSaveCddApx} data
   * @description: 尽调材料保存
   */
  doSaveCddApx(data: doSaveCddApx) {
    return request('POST', '/api-sme/siteDueDiligence/doSaveCddApx', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-23 09:52:02
   * @param {doSaveCddApx} data
   * @description: 尽调材料提交
   */
  doSubmitCddApx(data: doSaveCddApx) {
    return request('POST', '/api-sme/siteDueDiligence/doSubmitCddApx', data)
  }
}
