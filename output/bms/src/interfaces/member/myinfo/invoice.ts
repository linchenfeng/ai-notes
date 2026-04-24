/*
 * @Author       : Charon.Lin
 * @Date         : 2026-02-10 14:12:52
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-13 16:11:26
 * @Description  :
 */
export interface ListCount {
  /**
   * 开票中
   */
  ingCount: number
  /**
   * 已开票
   */
  passedCount: number
  /**
   * 已拒绝
   */
  refuseCount: number
  /**
   * 已退回
   */
  returnCount: number
  /**
   * 待提交
   */
  waitCount: number
}
export interface InvoiceList {
  /**
   * 申请书编号，历史关联就有
   */
  applyNo?: string
  /**
   * 申请编号
   */
  appNo: string
  /**
   * 申请开票名称
   */
  appOrgName: string
  /**
   * 开票申请状态，0=拒绝开票/1=开票主体确认中/2=开具发票中/3=发票复核中/10=已保存/11=开票审核中/12=审核退回/4=完成开票
   */
  appStatus: string
  /**
   * 开票类型，2=征信费
   */
  billType: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 确认状态，0=无需确认/1=待开票确认/2=开票确认中/3=开票确认退回/4=作废重开/9=开票已确认
   */
  confirmStatus: string
  /**
   * 开票金额
   */
  generateAmt: number
  /**
   * 流水号
   */
  refcode: number
  /**
   * 展示状态，字典项fgaiAppStatus
   */
  showStatus: string
  /**
   * 开票类型，2=征信费
   */
  generateType: string
}
export interface FgaiAppVo {
  /**
   * 开票企业税号
   */
  appCreditCode: string
  /**
   * 开票申请日期
   */
  appDate: string
  /**
   * 申请书编号
   */
  applyNo?: string
  /**
   * 申请人
   */
  applyOrgname: string
  /**
   * 申请人流水号
   */
  applyOrgRefcode?: number
  /**
   * 申请编号
   */
  appNo: string
  /**
   * 开票企业名称
   */
  appOrgName: string
  /**
   * 申请流水号
   */
  appOrgRefcode?: number
  /**
   * 申请备注说明
   */
  appRemark?: string
  /**
   * 开票状态，0=拒绝开票/1=开票主体确认中/2=开具发票中/3=发票复核中/10=已保存/11=开票审核中/12=审核退回/4=完成开票
   */
  appStatus: string
  /**
   * 退回原因，12=审核退回
   */
  returnRemark?: string
  /**
   * 金融机构，开票主体
   */
  bankrollOrgName: string
  /**
   * 发票类型，1=普票/2=专票
   */
  billType: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 币种描述
   */
  ccyidDesc: string
  /**
   * 确认状态，0=无需确认/1=待开票确认/2=开票确认中/3=开票确认退回/4=作废重开/9=开票已确认
   */
  confirmStatus: string
  /**
   * 开票电子邮箱，开票企业邮箱
   */
  email: string
  /**
   * 开票金额
   */
  generateAmt: number | string
  /**
   * 开票类型，2=征信费
   */
  generateType: string
  /**
   * 流水号
   */
  refcode: number | string
  /**
   * 拒绝原因，0=拒绝开票
   */
  refuseRemark?: string
  /**
   * 发票审核意见
   */
  auditRemark?: string
  /**
   * 提交标记，0=保存/1=提交
   */
  submitFlag?: string
  /**
   * 收款账户流水号，【待定】
   */
  bankrollAccRefcode?: number | string
  /**
   * 操作人，1=客户经理/2=客户
   */
  operatorType: string
  /**
   * 角标状态，字典项fgaiAppStatus
   */
  showStatus: string
  /**
   * 申请书流水号，关联上才有
   */
  appRefcode?: number
  /**
   * 发票uuid
   */
  fileUuids?: string
}
export interface FintAppList {
  /**
   * 业务大类
   */
  bizScene: string
  /**
   * 准入买方数
   */
  count: string
  /**
   * 买方所在国
   */
  ctyDesc: string
  /**
   * 企业名称
   */
  orgname: string
  /**
   * 产品类型
   */
  productType: string
  /**
   * 流水号
   */
  refcode: number
  /**
   * 业务主管名称
   */
  superiorName: string
  /**
   * 发票状态，10=待提交/11=开票中/4=已开票
   */
  tabStatus: string
  /**
   * 客户经理名称
   */
  userName: string
  /**
   * 申请发票流水号，自动开票申请流水号
   */
  invRefcode: number
}
export interface ReserveListCount {
  /**
   * 开票中
   */
  ingCount: number
  /**
   * 已开票
   */
  passedCount: number
  /**
   * 待开票
   */
  waitCount: number
}
export interface FactoringListFactoringList {
  /**
   * 分行号，国外保理商有值
   */
  bankBranchCode?: string
  /**
   * 行号（RTGS代码），国外保理商有值
   */
  bankRtgsCode?: string
  /**
   * 开票币种，国内发票默认人民币
   */
  billCcyid: string
  /**
   * 开票币种，国内发票默认人民币
   */
  ccyidDesc: string
  /**
   * 大额行号，国内保理商
   */
  cnapsCode?: string
  /**
   * 保理商账号
   */
  factoringAccountNo: string
  /**
   * 保理商开户行
   */
  factoringBank: string
  /**
   * 受款银行地址，国外保理商有值
   */
  factoringBankAddress?: string
  /**
   * 承作保理商开户行英文名称，国外保理商有值
   */
  factoringBankEn?: string
  /**
   * 保理商户名
   */
  factoringMerchant: string
  /**
   * 保理商名称
   */
  factoringName: string
  /**
   * 受款银行SWIFT CODE，国外保理商有值
   */
  factoringSwiftCode?: string
  /**
   * 发票种类，0=国内发票/1=国际发票
   */
  invoiceType: string
  /**
   * 保理商流水号
   */
  refcode: number
}

export interface FactoringList {
  factoringList: FactoringListFactoringList[]
  /**
   * 保理商名称
   */
  factoringName: string
}
export interface OrgnameList {
  /**
   * 卖方名称
   */
  orgname: string
}
export interface QueryFbpaAccList {
  /**
   * 账户流水号，如果传流水号则返回列表一条数据
   */
  bankrollAccRefcode?: string
}
export interface FbpaAcc {
  /**
   * 户名
   */
  accountName: string
  /**
   * 账户
   */
  accountNo: string
  /**
   * 开户行
   */
  bankName: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 币种描述
   */
  ccyidDesc: string
  /**
   * 快照流水号
   */
  snapshotRefcode: number | string
}
export interface FgaiAppList {
  /**
   * 开票时间
   */
  appDate: Date
  /**
   * 发票编号
   */
  appNo: string
  /**
   * 开票主体名称
   */
  appOrgName: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 金额
   */
  generateAmt: number
  /**
   * 发票流水号
   */
  refcode: number
  /**
   * 选中标记，1=已选中
   */
  checked?: string
  /**
   * 税号
   */
  appCreditCode: string
  /**
   * 开票类型
   */
  billType: string
  /**
   * 发票种类，0=国内发票/1=国际发票
   */
  invoiceType: string
}
export interface BindFgaiAppList {
  /**
   * 发票编号
   */
  appNo: string
  /**
   * 发票流水号
   */
  refcode: string | number
}
export interface BindInvoice {
  /**
   * 申请书编号
   */
  applyNo: string
  /**
   * 选中发票列表
   */
  fgaiAppList: BindFgaiAppList[]
}
