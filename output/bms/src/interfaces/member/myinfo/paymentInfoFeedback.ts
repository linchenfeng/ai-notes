/*
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-07 10:37:54
 * @LastEditors  : MingChun.Cheng
 * @LastEditTime : 2023-10-11 16:07:44
 * @Description  : 预计回款信息反馈
 */

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 预计回款信息反馈
 */
export interface PreRetrunAmtInfo {
  /**
   * 融资信息流水号
   */
  refcode: number
  /**
   * 融资企业名称
   */
  orgname: string
  /**
   * 交易对手名称
   */
  buyerName: string
  /**
   * 最终付款人
   */
  finalPayName: string
  /**
   * 业务产品
   */
  bussType: string
  /**
   * 业务合同号
   */
  busscontNo: string
  /**
   * 币种(RMB=人民币/USD=美元/EUR=欧元/HKD=港币/CHF=瑞士法郎)
   */
  ccyid: string
  /**
   * 未回款金额
   */
  totalUnpaidAmt: number
  /**
   * 融资余额
   */
  totalOtstAmt: number
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 预计回款信息反馈列表
 */
export interface PreRetrunAmtList {
  /**
   * 预计回款信息反馈集合
   */
  fadlReconFcnMVoList: Array<PreRetrunAmtInfo>
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 融资企业逾期明细
 */
export interface OevrDueInfo {
  /**
   * 融资申请编号
   */
  loanNo: string
  /**
   * 融资申请金额
   */
  applymt: number
  /**
   * 融资金额
   */
  loanAmt: number
  /**
   * 融资到期日
   */
  loanDueDate: string
  /**
   * 融资余额
   */
  otstAmt: number
  /**
   * 已预缴逾期利息截至日
   */
  prepaidDate: string
  /**
   * 逾期天数
   */
  overdueDay: number
  /**
   * 已回款金额
   */
  actualAmt: number
  /**
   * 业务融资申请编号
   */
  duebillnum: string
  /**
   * 融资申请金额
   */
  applyAmt: number
  /**
   * 应收账款金额
   */
  accountsAmt: number
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 预计回款信息反馈列表详情
 */
export interface FadlRemindMVo {
  /**
   * 融资企业名称
   */
  orgname: string
  /**
   * 交易对手名称
   */
  buyerName: string
  /**
   * 业务合同号
   */
  busscontNo: string
  /**
   * 最终付款人
   */
  finalPayName: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 业务产品
   */
  bussType: string
  /**
   * 未回款金额
   */
  totalUnpaidAmt: number
  /**
   * 融资余额
   */
  totalOtstAmt: number
  /**
   * 实际买方对账回款明显数量
   */
  paidNum: number
  /**
   * 融资企业融资逾期明显数量
   */
  overDueNum: number
  /**
   * 唯一标识
   */
  bybRefcode: number
  /**
   * 融资到期日
   */
  loanDueDate: string
  /**
   *与融资企业沟通预计回款应回款日
   */
  repaymentDate: string
  /**
   * 融资企业逾期明细集合
   */
  overDueList: Array<OevrDueInfo>
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 预计回款信息反馈详情
 */
export interface FadlRemindMVoDetail {
  fadlRemindMVo: FadlRemindMVo
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 回款阶段信息
 */
export interface RepaymentInfo {
  /**
   * 对账编号
   */
  reconciliationNo: string
  /**
   * 应回款日
   */
  repaymentDate: string
  /**
   * 回款比例
   */
  repaymentPcnt: number
  /**
   * 应回款金额
   */
  repaymentAmt: number
  /**
   * 已回款金额
   */
  payAmt: number
  /**
   * 未回款金额
   */
  unpaidAmt: number
}
/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 实际买方对账回款明细
 */

export interface ReconDayInfo {
  /**
   * 对账日
   */
  reconciliationDate: string
  /**
   * 对账开始日
   */
  reconciliationStartDay: string
  /**
   * 对账结束日
   */
  reconciliationEndDay: string
  /**
   * 对账金额
   */
  reconciliationAmt: number
  /**
   * 回款阶段集合
   */
  repaymentList: Array<RepaymentInfo>
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 实际买方对账回款明细列表
 */
export interface ReconDayList {
  /**
   * 实际买方对账回款明显
   */
  reconDataList: Array<ReconDayInfo>
}
