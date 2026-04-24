/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 13:11:21
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-16 13:49:53
 * @Description  : 项目-业务审核-额度审核interface
 */
export interface ClListItem {
  /**
   * 申请金额
   */
  applyAmt: number
  /**
   * 额度币种
   */
  applyCcyid: string
  /**
   * 申请书编号，申请书信息
   */
  applyNo: string
  /**
   * 申请状态
   */
  applyStatus: string
  /**
   * 买方名称
   */
  buyerOrgname: string
  /**
   * 所在国
   */
  ctyDesc: string
  /**
   * 字典项展示状态，0=开立中/97=不可开立/99=已开立
   */
  finalStatus: string
  /**
   * 额度申请流水号，查询待申请时为申请流水号，查询已申请为审核历程流水号
   */
  refcode: number
}
export interface QuotaAuditCount {
  /**
   * 总数
   */
  count: number
  /**
   * 已开立
   */
  openedCount: number
  /**
   * 待开立
   */
  waitCount: number
}
export interface HistoryOrgClList {
  /**
   * 受理说明
   */
  acceptRemark?: string
  /**
   * 申请金额
   */
  applyAmt: number
  /**
   * 申请币种
   */
  applyCcyid: string
  /**
   * 情况说明
   */
  applyRemark?: string
  /**
   * 申请状态
   */
  applyStatus: string
  /**
   * 核准金额，开立中不存在
   */
  checkAmt?: number
  /**
   * 最终状态，0=开立中/97=不可开立/99=已开立【由后端转换】
   */
  finalStatus: string
  /**
   * 最后操作时间
   */
  lastModDate: string
  /**
   * 额度申请流水号
   */
  refcode: number
  /**
   * 审核说明
   */
  reviewRemark?: string
}
/**
 * 审核结果，当前数据最近一次审核结果
 */
export interface ReviewResultVo {
  /**
   * 审核结果状态，22=内部不可开立/98=内部已开立
   */
  applyStatus: string
  /**
   * 审核时间
   */
  reviewDate: ''
  /**
   * 审核说明
   */
  reviewRemark: string
  /**
   * 审核操作人
   */
  reviewUserid: string
}
/**
 * 历史受理结果
 */
export interface AcceptResultVo {
  /**
   * 受理时间
   */
  acceptDate: string
  /**
   * 受理说明
   */
  acceptRemark: string
  /**
   * 受理操作人
   */
  acceptUserName: string
}
export interface QuotaInfo {
  /**
   * 受理时间
   */
  acceptDate?: string
  /**
   * 受理人
   */
  acceptUserName?: string
  /**
   * 历史受理结果
   */
  acceptResultVo?: AcceptResultVo
  /**
   * 额度申请状态，仅状态 = 21 时可以审核
   */
  applyStatus: string
  /**
   * 受理备注
   */
  acceptRemark?: string
  /**
   * 买方详细地址
   */
  address?: string
  /**
   * 额度币种
   */
  applyAmt: number
  /**
   * 申请金额
   */
  applyCcyid: string
  /**
   * 申请日期
   */
  applyDate: ''
  /**
   * 申请书流水号，申请书信息
   */
  applyNo: string
  /**
   * 情况说明
   */
  applyRemark?: string
  /**
   * 买方名称
   */
  buyerOrgname: string
  /**
   * 买方企业注册号
   */
  companyRegistrationNo: string
  /**
   * 买方所在国
   */
  ctyDesc: string
  /**
   * 历史买方额度开立
   */
  historyOrgClList?: HistoryOrgClList[]
  /**
   * 额度申请流水号
   */
  refcode: number
  /**
   * 审核说明
   */
  reviewRemark?: string
  /**
   * 审核结果，当前数据最近一次审核结果
   */
  reviewResultVo?: ReviewResultVo
  /**
   * 核准金额
   */
  checkAmt: number
  /**
   * 字典项展示状态，0=开立中/97=不可开立/99=已开立
   */
  finalStatus?: string
  /**
   * 业务大类，区分业务场景 》 1=国内业务/2=国际业务
   */
  bizScene: string
  /**
   * 审核时间
   */
  reviewDate?: string
}
export interface WaitAuditCount {
  /**
   * 待审核数量
   */
  clCount: number
  /**
   * 待报价数量
   */
  quotaCount: number
}
export interface QuotaSubmit {
  /**
   * 额度申请状态，98=内部已开立/22=内部不可开立
   */
  applyStatus: string
  /**
   * 额度申请流水号
   */
  refcode: number
  /**
   * 审批备注
   */
  reviewRemark?: string
  /**
   * 核准金额
   */
  checkAmt: string
}
