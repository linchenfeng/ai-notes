/*
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-07 10:37:54
 * @LastEditors  : MingChun.Cheng
 * @LastEditTime : 2023-10-09 14:18:38
 * @Description  : 逾期利息预缴试算接口类型
 */
/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 逾期利息预缴试算
 */
export interface InterestTrialInfo {
  /**
   * 客户融资流水号
   */
  refcode: number
  /**
   * 融资企业名称
   */
  orgname: string
  /**
   * 业务产品(1000=国内保理-回购/1100=国内保理-买断/9000=反向保理-确权-回购/9100=反向保理-确权-买断/9200=反向保理-对账-买断/9300=供应链保理-回购/ 9400=保付单-买断)
   */
  bussType: string
  /**
   * 币种(RMB=人民币/USD=美元/EUR=欧元/HKD=港币/CHF=瑞士法郎)
   */
  ccyid: string
  /**
   * 融资笔数
   */
  financingNum: number
  /**
   * 融资总金额
   */
  totalLoanAmt: number
  /**
   * 融资总余额
   */
  totalOtstAmt: number
  /**
   * 应付逾期利息总额
   */
  totalOverdueAmt: number
  /**
   * 已预缴逾期利息总额
   */
  totalPrepaidAmt: number
}
/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @return {*}
 * @description: 预期利息预缴试算页面返回的数据
 */
export interface OverDueList {
  /**
   * 我的客户列表返回的数据
   */
  overDueList: Array<InterestTrialInfo>
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @return {*}
 * @description: 融资信息
 */
export interface OevrDueInfo {
  /**
   * 融资申请编号
   */
  loanNo: string
  /**
   * 业务合同号
   */
  busscontNo: string
  /**
   * 融资到期日
   */
  loanDueDate: string
  /**
   * 融资余额
   */
  otstAmt: number
  /**
   * 已预缴逾期利息
   */
  prepaidAmt: number
  /**
   *已预缴逾期利息截止日
   */
  prepaidDate: number
  /**
   * 逾期利息计算截止日
   */
  prepaidDueDate: string
  /**
   * 到截止日应付逾期利息
   */
  dueDatePrepaidAmt: number
  /**
   * 到截止日需预缴逾期利息
   */
  requirePerAmt: number
  /**
   * 本次预缴逾期利息
   */
  nowAdPrepaidAmt: number
  /**
   * 融资申请编号（页面显示该值）
   */
  duebillnum: string
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 逾期利息预缴试算详情
 */
export interface InterestTrialDetail {
  /**
   * 融资企业名称
   */
  orgname: string
  /**
   * 业务产品(1000=国内保理-回购/1100=国内保理-买断/9000=反向保理-确权-回购/9100=反向保理-确权-买断/9200=反向保理-对账-买断/9300=供应链保理-回购/ 9400=保付单-买断)
   */
  bussType: string
  /**
   * 币种(RMB=人民币/USD=美元/EUR=欧元/HKD=港币/CHF=瑞士法郎)
   */
  ccyid: string
  /**
   * 融资笔数
   */
  financingNum: number
  /**
   * 融资总金额
   */
  totalLoanAmt: number
  /**
   * 融资总余额
   */
  totalOtstAmt: number
  /**
   * 已预缴逾期利息总额
   */
  totalPrepaidAmt: number
  /**
   * 应收逾期利息总额
   */
  totalOverdueAmt: number
  /**
   * 尚欠逾期利息总额
   */
  totalOwePrepaidAmt: number
  /**
   * 到截止日需预缴逾期利息总额
   */
  totalrequirePerAmt: number
  /**
   * 融资信息集合
   */
  fadlLoaInfoMVoList: Array<OevrDueInfo>
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 逾期利息预缴试算详情
 */
export interface FadlCusLoaMVo {
  fadlCusLoaMVo: InterestTrialDetail
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 逾期利息预缴结果
 */
export interface InterestTrialResult {
  /**
   * 到截止日需预缴逾期利息总和
   */
  totalRequirePerAmt: number
  /**
   * 融资信息集合
   */
  loanList: Array<OevrDueInfo>
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:41:25
 * @description: 发送客户返回结果
 */
export interface SendResult {
  /**
   * 发送客户返回结果[1=成功/0=失败]
   */
  result: string
}
