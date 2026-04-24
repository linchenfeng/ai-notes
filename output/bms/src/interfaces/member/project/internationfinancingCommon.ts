/*
 * @Author       : Charon.Lin
 * @Date         : 2025-09-05 14:33:01
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-23 11:39:12
 * @Description  : 国际业务公共接口interface
 */
export interface BuyerList {
  /**
   * 准入流水号
   */
  aplRefcode: string
  /**
   * 交易对手地址（英文）
   */
  address?: string
  /**
   * 年交易额（万元）
   */
  annualTurnover: number | string
  /**
   * 当前应收账款余额(万元)
   */
  buyerAccountBalance: string
  /**
   * 详细地址(英文)
   */
  buyerAddressEn?: string
  /**
   * 币种
   */
  buyerCcyDesc?: string
  /**
   * 公司注册编号
   */
  buyerCompanyRegistrationNo?: string
  /**
   * 买方所在国
   */
  buyerCtyDesc?: string
  /**
   * 当前在手订单金额（万元)
   */
  buyerCurrentOrderAmt: string
  /**
   * 与买方之间有无禁止债权转让的约定，0=否/1=是
   */
  buyerDebtTransferFlag: string
  /**
   * 公司联系邮箱
   */
  buyerEmail?: string
  /**
   * 买方全称 （英文）
   */
  buyerEnglishName?: string
  /**
   * 最早交易年份
   */
  buyerFirstTransactionYear?: string
  /**
   * 联系人姓名
   */
  buyerLinkman?: string
  /**
   * 联系人手机号/通讯工具号
   */
  buyerLinkmanMobilePhone?: string
  /**
   * 联系人职务
   */
  buyerLinkmanPosition?: string
  /**
   * 公司联系电话/分机
   */
  buyerMobilePhone?: string
  /**
   * 当前是否有逾期，0=否/1=是
   */
  buyerOverdueFlag: string
  /**
   * 支付方式，1={O/A}/2=其他
   */
  buyerPayType: string
  /**
   * 支付方式
   */
  buyerPayTypeDesc?: string
  /**
   * 账期
   */
  buyerTenor: string
  /**
   * 账期起算日，1=提单日/2=发票日/3=货物到港日/4=买方收货日/5=其他
   */
  buyerTenorStartType: string
  /**
   * 交易商品名称
   */
  buyerTradeName?: string
  /**
   * 币种描述
   */
  ccyDesc?: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 交易对手名称
   */
  counterpartyName: string
  /**
   * 交易对手流水号
   */
  counterpartyRefcode?: number
  /**
   * 国家名称
   */
  ctyDesc: string
  /**
   * 交易对手所在国
   */
  ctyid: string
  /**
   * 买方申请状态，1=已准入/2=已填报申请书
   */
  dctApplyLoanStatus: string
  /**
   * 未来年度交易额（万元）
   */
  futureAnnualTurnover: number | string
  /**
   * 是否有物流管理系统[0=否/1=是]，物流必填
   */
  logisticsSystemFlag: string
  /**
   * 交易产品
   */
  productName: string
  /**
   * 项目来源
   */
  projectSource: string
  /**
   * 公开招投标项目[0=否/1=是]，物流必填
   */
  publicBiddingFlag: string
  /**
   * 流水号
   */
  refcode: number | string
  /**
   * 备注
   */
  remark?: string
  /**
   * 数据补充状态[0=待补充/1=已补充]
   */
  supplementStatus?: string
  /**
   * 账期（天）
   */
  tenor: number | string
  /**
   * 账期起算日描述
   */
  tenorStartDesc?: string
  /**
   * 账期起算日[1=提单日/2=发票日/3=货物到港日/4=买方收货日/5=其他]
   */
  tenorStartType: string
  /**
   * 交易年限（年）
   */
  transactionYears: string
  /**
   * 运单对账方式描述，物流必填
   */
  waybillVerifyDesc?: string
  /**
   * 运单对账方式[1=系统/2=邮件/9=其他]，物流必填
   */
  waybillVerifyType?: string
  /**
   * 申请书说明
   */
  buyerDescribe?: string
  /**
   * 逾期说明
   */
  buyerOverdueRemark?: string
  /**
   * 币种
   */
  buyerCcyid: string
  /**
   * 买方额度流水号
   */
  clRefcode?: string
}
export interface QuerySuperiorInfo {
  /**
   * 流水号
   */
  refcode: number | string
  /**
   * 协销主管
   */
  assistSuperior?: string
}
export interface AssistSuperiorList {
  /**
   * 人员Userid
   */
  cddUserid: string
  /**
   * 协销主管名称
   */
  userName: string
}
export interface CreditUsersInfo {
  /**
   * 征信展示标记，0=协销主管不等于征信主管/1=协销主管等于征信主管
   */
  creditFlag: string
  /**
   * 征信主管，逗号拼接
   */
  creditSuperiors: string
  /**
   * 征信人员列表
   */
  creditUsersList: AssistSuperiorList[]
}
