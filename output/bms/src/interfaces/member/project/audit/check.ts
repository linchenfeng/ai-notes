/*
 * @Author       : Charon.Lin
 * @Date         : 2025-11-03 14:55:07
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-23 13:30:10
 * @Description  : 企业核查API
 */
export interface VerifyUserInfo {
  /**
   * 核查主管集合
   */
  verifySuperior: string[]
  /**
   * 核查人集合
   */
  verifyUsers: string[]
  /**
   * 最后一次核查申请备注
   */
  lastApplyRemark?: string
}
export interface CheckSubmit {
  /**
   * 准入流水号
   */
  aplRefcode: number | string
  /**
   * 申请备注说明
   */
  applyRemark?: string
  /**
   * 指派核查主管，逗号拼接
   */
  checkSuperior?: string
  /**
   * 指派核查人，逗号拼接（多选多）
   */
  checkUsers: string
  /**
   * 交易对手流水号
   */
  dtcRefcode: number | string
}
export interface CheckCount {
  /**
   * 已核查
   */
  checkedCount: number
  /**
   * 待核查
   */
  waitCheckCount: number
}
export interface FintAplChkVoList {
  /**
   * 准入流水号
   */
  aplRefcode: number
  /**
   * 发起时间
   */
  applyDate: Date
  /**
   * 核查状态[1=待核查/2=已核查]
   */
  checkStatus: string
  /**
   * 交易对手名称
   */
  counterpartyName: string
  /**
   * 交易对手流水号
   */
  dtcRefcode: number
  /**
   * 企业名称
   */
  orgname: string
  /**
   * 流水号
   */
  refcode: number
}
export interface QueryVerifyInfo {
  /**
   * 准入流水号，业务准入菜单必穿
   */
  aplRefcode?: number | string
  /**
   * 核查流水号，核查企业信息菜单必穿
   */
  refcode?: number | string
}
export interface FintAplChkVo {
  /**
   * 发起时间
   */
  applyDate: ''
  /**
   * 申请备注说明
   */
  applyRemark?: string
  /**
   * 核查时间
   */
  checkDate: string
  /**
   * 核查企业信息
   */
  checkRemark?: string
  /**
   * 核查状态[1=待核查/2=已核查]
   */
  checkStatus: string
  /**
   * 交易对手名称
   */
  counterpartyName: string
  /**
   * 企业名称
   */
  orgname: string
  /**
   * 流水号
   */
  refcode: number | string
  /**
   * 核查用户名
   */
  checkUsername?: string
  /**
   * 核查意见流水号
   */
  remarkRefcode: number | string
  /**
   * 指派核查主管
   */
  checkSuperior?: string
  /**
   * 指派核查用户
   */
  checkUsers: string
  /**
   * 有权审批标记，1=有权审批
   */
  operationFlag?: string
}
export interface SubmitData {
  /**
   * 核查企业信息
   */
  checkRemark: string
  /**
   * 核查后类型[1=提交核查/2=补充核查]，两种状态均会校验对应状态
   */
  checkType: string
  /**
   * 流水号
   */
  refcode: number | string
}
export interface QueryVerifyHistory {
  /**
   * 排除查询流水号，传核查企业信息流水号
   */
  excludeRemarkRefcodeList?: number[] | string[]
  /**
   * 交易对手全名
   */
  orgname: string
  /**
   * 查询类型，1=全数据（默认）/2=有权查询数据
   */
  queryType?: string
}
export interface RemarkList {
  /**
   * 核查时间
   */
  checkDate: Date
  /**
   * 核查备注
   */
  checkRemark: string
  /**
   * 核查人
   */
  checkUsername: string
  /**
   * 核查结果流水号
   */
  remarkRefcode: number
}

export interface HisCheckList {
  /**
   * 发起时间
   */
  applyDate: Date
  /**
   * 申请备注说明
   */
  applyRemark?: string
  /**
   * 核查申请人
   */
  applyUsername: string
  /**
   * 交易对手名称
   */
  counterpartyName: string
  /**
   * 核查申请流水号
   */
  refcode: number
  remarkList: RemarkList[]
}
export interface CheckStatus {
  /**
   * 核查状态，0=无在途核查/1=存在在途核查记录
   */
  checkStatus: string
}
