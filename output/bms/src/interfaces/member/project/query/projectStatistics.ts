/*
 * @Author       : longcan.Yang
 * @Date         : 2022-10-14 10:28:47
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-15 13:56:23
 * @Description  : 我的客户项目统计信息接口返回
 */

/**
 * @Author: longcan.Yang
 * @Date: 2022-10-17 15:29:16
 * @return {*}
 * @description: 项目信息列表
 */
export interface InfoVoList {
  /**
   * 交易对手流水号
   */
  cpRefcode: number
  /**
   * 交易对手名称
   */
  buyerName: string
  /**
   * 融资申请日
   */
  applyDate: string
  /**
   * 笔数
   */
  countTotal: number
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-17 15:35:41
 * @return {*}
 * @description:接口返回数据，项目统计列表和更多项目列表共用
 */
export interface ProjectInfo {
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 项目总计
   */
  projectCountTotal: number
  /**
   * 融资余额总计
   */
  financingAmtTotal: number

  /**
   * 放款金额总计
   */
  loanAmtTotal: number
  /**
   * 已还金额总计
   */
  repayAmtTotal: number
  /**
   * 列表
   */
  floaArpMVoList: Array<InfoVoList>
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-17 15:43:05
 * @return {*}
 * @description: 客户项目详情list数据
 */
export interface DetailList {
  /**
   * 融资流水号
   */
  refcode: number
  /**
   * 融资申请编号
   */
  loanNo: string
  /**
   * 当前融资是否展开
   */
  unfoldFlag?: boolean
  /**
   * 审批状态[1=融资申请/2=运营审核/3=财务审核/4=财务放款]
   */
  approveStatus: string
  /**
   * 申请融资金额（元）
   */
  applyAmt: number
  /**
   * 应收账款转让总金额（元）
   */
  ttlInvoiceAmt: number
  /**
   * 融资金额（元)
   */
  loanAmt: number
  /**
   * 实际放款日
   */
  loanDate: Date
  /**
   * 交易币种
   */
  ccyid: string
  /**
   * 计息天数（天）
   */
  loanDays: number
  /**
   * 利息金额（元）
   */
  intAmt: number
  /**
   * 费用金额（元）
   */
  feeAmt: number
  /**
   * 实际划款金额（元）
   */
  actualLoanAmt: number
  /**
   * 融资到期日
   */
  loanEndDate: string
  /**
   * 融资来源[1=专案融资/2=保付单融资]
   */
  loanSource: string

  /**
   * 融资余额（元）
   */
  financingAmt: number
  /**
   * 还款金额（元）
   */
  totalRepayAmt: number
  /**
   * 还款状态[0=未还清/1=已还清]
   */
  repayStatus: string
  /**
   * 融资状态[1=受理中,2=打回补充,3=受理拒绝,9=放款成功,10=流程结束]
   */
  loanStatus: string
  /**
   * 备注，如果融资返回状态为拒绝，则备注拒绝原因
   */
  remark?: string
}

/**
 * @Author: longcan.Yang
 * @Date: 2022-10-17 15:42:13
 * @return {*}
 * @description: 客户项目详情接口返回
 */
export interface ProjectDetailVo {
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 交易对手名称
   */
  buyerName
  /**
   * 融资申请日
   */
  applyDate
  /**
   * 笔数
   */
  countTotal

  /**
   * 客户项目列表
   */
  floaArpMVoList: Array<DetailList>
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-19 09:36:05
 * @return {*}
 * @description: 我的项目/项目信息页面列表数据
 */
export interface TradeList {
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 交易对手名称
   */
  buyerName: string
  /**
   * 融资流水号
   */
  refcode: number
  /**
   * 融资申请编号
   */
  loanNo: string
  /**
   * 融资申请日
   */
  applyDate: string
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-19 09:36:48
 * @return {*}
 * @description: 我的项目/项目信息接口返回
 */
export interface MyProjectDetail {
  /**
   * 项目列表
   */
  floaArpMVoList: Array<TradeList>
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-19 10:49:22
 * @return {*}
 * @description: 获取项目明细接口返回
 */
export interface FloaArpMVo {
  /**
   * 实际划款金额（元）
   */
  actualLoanAmt: number
  /**
   * 申请融资金额（元））
   */
  applyAmt: number
  /**
   * 融资申请日
   */
  applyDate: string
  /**
   * 审批状态，审批状态[1=融资申请/2=运营审核/3=财务审核/4=财务放款]
   */
  approveStatus: string
  /**
   * 交易对手名称，多个,分隔
   */
  buyerName: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 费用金额（元）
   */
  feeAmt: number
  /**
   * 融资余额
   */
  financingAmt: number
  /**
   * 利息金额（元）
   */
  intAmt: number
  /**
   * 融资金额（元），收款/付款创建日期【单据日期】
   */
  loanAmt: number
  /**
   * 实际放款日
   */
  loanDate: string
  /**
   * 计息天数（天）
   */
  loanDays: number
  /**
   * 融资到期日
   */
  loanEndDate: string
  /**
   * 融资申请编号
   */
  loanNo: string
  /**
   * 融资来源[1=专案融资/2=保付单融资]，融资来源[1=专案融资/2=保付单融资]
   */
  loanSource: string
  /**
   * 融资申请日
   */
  loanStartDate?: string
  /**
   * 企业名称
   */
  orgname: string
  /**
   * 流水号
   */
  refcode?: number
  /**
   * 还款状态[0=未还清/1=已还清]
   */
  repayStatus: string
  /**
   * 还款金额
   */
  totalRepayAmt: number
  /**
   * 应收账款转让总金额（元）
   */
  ttlInvoiceAmt: number
  /**
   * 融资状态[1=受理中,2=打回补充,3=受理拒绝,9=放款成功,10=流程结束]
   */
  loanStatus: string
  /**
   * 备注，如果融资返回状态为拒绝，则备注拒绝原因
   */
  remark?: string
}
/**
 * @Author: MingChun.Cheng
 * @Date: 2022-10-17 14:15:22
 * @return {*}
 * @description: 获取项目额度概况
 */
export interface QuotaOverviewInfo {
  /**
   * 当前可使用余额
   */
  availableCLAmt: number
  /**
   * 总额度上限
   */
  clAmt: number
  /**
   * 已使用额度
   */
  usedClAmt: number
  /**
   * 额度到期日
   */
  expiryDate: string
  /**
   * 额度到期天数
   */
  expiryDay: string
  /**
   * 额度状态[0=未生效/1=生效中/2=已到期/3=冻结]
   */
  clStatus: string
  /**
   * 币种[RMB=人民币/USD=美元/EUR=欧元/HKD=港币/CHF=瑞士法郎]
   */
  ccyid: string
}
