/*
 * @Author       : longcan.Yang
 * @Date         : 2022-10-13 17:08:10
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-03-30 14:53:30
 * @Description  : 签约信息接口返回
 */
export interface SignProcess {
  /**
   * 待签约
   */
  signedTotal: number
  /**
   * 已完成签约
   */
  waitSignTotal: number
}
/*
 * @Author       : jacky.cai
 * @Date         : 2022-10-13 13:26:47
 * @LastEditors  : jacky.cai
 * @LastEditTime : 2022-10-13 13:30:47
 * @Description  :签约详情中vtsignFcnMVoList
 */
export interface SignListItem {
  /**
   * 流水号
   */
  refcode: number
  /**
   * 合同名称(文件名称)
   */
  contName: string
  /**
   * 合同文件流水号
   */
  contFileUuid: string
  /**
   * 签署方企业名
   */
  secOrgnames: string
  /**
   * 签署方企业名数组
   */
  secOrgnamesList?: Array<string>
  /**
   * 合同签章开始时间
   */
  contStartTime: string
  /**
   * 合同签章结束时间
   */
  contEndTime: string
  /**
   * 签署时间
   */
  signTime: string
}

/*
 * @Author       : jacky.cai
 * @Date         : 2022-10-13 13:29:47
 * @LastEditors  : jacky.cai
 * @LastEditTime : 2022-10-13 13:32:21
 * @Description  :签约详情bean
 */
export interface SignDetail {
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 签约数据列表
   */
  vtsignFcnMVoList: Array<SignListItem>
}
