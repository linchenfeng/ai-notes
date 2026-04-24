export interface StatusCount {
  /**
   * 总数
   */
  count: number
  /**
   * 开立中
   */
  ingCount: number
  /**
   * 已开立
   */
  openedCount: number
  /**
   * 不可开立
   */
  unopenedCount: number
}
export interface ClList {
  /**
   * 申请金额
   */
  applyAmt: number
  /**
   * 额度币种
   */
  applyCcyid: string
  /**
   * 业务编号
   */
  applyNo: string
  /**
   * 真实状态，[
   * 01=待申请/
   * 11=待受理/
   * 21=待审核/22=不可开立（内部）/
   * 31=审批单待后补/32=审批单处理中/33=审批单复核拒绝/
   * 97=不可开立（外部）/98=已开立（内部）/99=已开立（外部）]
   */
  applyStatus: string
  /**
   * 买方名称
   */
  buyerOrgname: string
  /**
   * 最终状态，0=开立中/97=不可开立/99=已开立
   */
  finalStatus: string
  /**
   * 额度申请流水号
   */
  refcode: number
  /**
   * 业务主管名称
   */
  superiorName: string
  /**
   * 客户经理名称
   */
  userName: string
}
export interface HistoryOrgClList {
  /**
   * 受理说明
   */
  acceptRemark?: string
  /**
   * 情况说明
   */
  applyRemark?: string
  /**
   * 申请状态
   */
  applyStatus: string
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
  reviewDate: string
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
 * 报价信息
 */
export interface FintAppQuotaVo {
  /**
   * 报价申请日期
   */
  applyDate: Date
  /**
   * 报价时间
   */
  quotaDate?: Date
  /**
   * 报价手续费（%）
   */
  quotaRate?: number
  /**
   * 报价备注
   */
  quotaRemark?: string
  /**
   * 报价状态，1=待报价/2=已报价
   */
  quotaStatus: string
  /**
   * 报价流水号
   */
  refcode: number
}
export interface QuotaInfo {
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
  applyDate: string
  /**
   * 申请书流水号，申请书信息
   */
  applyNo: string
  /**
   * 情况说明
   */
  applyRemark?: string
  /**
   * 额度申请状态，仅状态 = 21 时可以审核
   */
  applyStatus: string
  /**
   * 买方名称
   */
  buyerOrgname: string
  /**
   * 核准金额
   */
  checkAmt?: number
  /**
   * 核准币种
   */
  checkCcyid?: number
  /**
   * 买方企业注册号
   */
  companyRegistrationNo: string
  /**
   * 买方所在国
   */
  ctyDesc: string
  /**
   * 映射状态，0=开立中/99=已开立/2=97不可开立
   */
  finalStatus?: string
  /**
   * 报价信息
   */
  fintAppQuotaVo?: FintAppQuotaVo
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
   * 业务主管
   */
  superiorName: string
  /**
   * 客户经理
   */
  userName: string

  /**
   * 业务场景 1=国内业务/2=国际业务
   */
  bizScene: string
  /**
   * 卖方名称
   */

  orgname: string
  /**
   * 卖方所在国
   */
  orgCtyDesc: string
}
