/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:41
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-22 16:02:57
 * @Description  : 特批申请api
 */
import { request } from '@/api/api.request'
import {
  SpecialAppCount,
  SpecialItem,
  LoginUser,
  ProductType,
  OrgListItem,
  SaveSpecialVo,
  ShopInfo,
  BuyerInfo
} from '@/interfaces/member/project/apply/specialApproval'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询特批申请统计数据
   */
  getSpecialAppCount(data: object) {
    return request<SpecialAppCount>('POST', '/api-sme/specialApproval/getSpecialAppCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 获取用户信息(主管替换)
   */
  findSpecialAppPage(data: object) {
    type SpecialAppList = {
      saaList: SpecialItem[]
    }
    return request<SpecialAppList>('POST', '/api-sme/specialApproval/findSpecialAppPage', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询特批申请统计数据
   */
  getUserInfo() {
    type TemLoginUser = {
      loginUser: LoginUser
    }
    return request<TemLoginUser>('GET', '/api-sme/specialApproval/getUserInfo')
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 获取产品类型
   */
  getProductTypeList() {
    type ProductTypeList = {
      productTypeList: ProductType[]
    }
    return request<ProductTypeList>('GET', '/api-sme/specialApproval/getProductTypeList')
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 获取客户信息列表
   */
  listOrgInfo(data: object) {
    type OrgList = {
      orgList: OrgListItem[]
    }
    return request<OrgList>('POST', '/api-sme/specialApproval/listOrgInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 保存特批申请信息
   */
  doSaveSpecialAppInfo(data: SaveSpecialVo) {
    type TemData = {
      refcode: number
    }
    return request<TemData>('POST', '/api-sme/specialApproval/doSaveSpecialAppInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 提交特批申请信息
   */
  doSubmitSpecialAppInfo(data: SaveSpecialVo) {
    type TemData = {
      refcode: number
    }
    return request<TemData>('POST', '/api-sme/specialApproval/doSubmitSpecialAppInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 删除特批审批数据
   */
  doRemoveSpecialAppInfo(data) {
    return request('POST', `/api-sme/specialApproval/doRemoveSpecialAppInfo`, data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 获取店铺信息
   */
  listShopInfo(data) {
    return request<ShopInfo>('POST', `/api-sme/specialApproval/listShopInfo`, data)
  },
  /**
   * @Author: Mingchun.Cheng
   * @Date: 2025-08-20 17:31:45
   * @param {*} data
   * @return {*}
   * @description: 获取买方名称信息
   */
  listBuyerNameInfo(data) {
    type TemData = {
      buyerInfo: BuyerInfo
    }
    return request<TemData>('POST', `/api-sme/specialApproval/listBuyerNameInfo`, data)
  },
  /**
   * @Author: Mingchun.Cheng
   * @Date: 2025-08-22 16:02:48
   * @param {*} data
   * @return {*}
   * @description: 撤回特批申请信息（客户经理撤回）
   */
  doRevokeSpecialAppInfo(data) {
    return request('POST', `/api-sme/specialApproval/doRevokeSpecialAppInfo`, data)
  }
}
