/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-12 10:40:50
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-03-02 17:11:01
 * @Description  :填报申请书相关接口
 */

export interface FinanceCount {
  /**
   * 数据总数
   */
  count: number
  /**
   * 待确认总数
   */
  countConfirm: number
  /**
   * 待申请总数
   */
  countNot: number
  /**
   * 运营审核退回
   */
  countReturn: number
  /**
   * 待提交
   */
  countWait: number
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 10:42:18
 * @description: 待填报申请书列表
 */
export interface AppList {
  /**
   * 申请状态，1=临时保存/2=待确认
   */
  applyStatus: string
  /**
   * 准入买方家数，已去重
   */
  count: number
  /**
   * 卖方国家名称
   */
  ctyDesc: string
  /**
   * 卖方国家代码
   */
  ctyid: string
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 卖方企业流水号
   */
  orgRefcode?: number
  /**
   * 邀请状态，0=未邀请/1=已发送邀请
   */
  pushStatus?: string
  /**
   * 申请书流水号，临时保存或待确认时有值
   */
  refcode: number
  /**
   * 邀请已读状态,0=未读/1=已读
   */
  pushReadStatus: string
  /**
   * 业务大类[1=国内业务/2=国际业务/3=跨境电商]，历史数据个别混合业务可能不存在
   */
  bizScene: string
  /**
   * 产品类型，历史数据个别混合业务可能不存在
   */
  productType: string
}
/**
 * 报价信息
 */
export interface FintAppQuotaVo {
  /**
   * 报价时间
   */
  quotaDate: string
  /**
   * 报价手续费
   */
  quotaRate: number | string
  /**
   * 报价说明
   */
  quotaRemark: string
  /**
   * 报价状态
   */
  quotaStatus: string
  /**
   * 报价流水号
   */
  refcode: number | string
}
/**
 * 额度申请信息
 */
export interface FintAppClVo {
  /**
   * 额度申请金额
   */
  applyAmt: number
  /**
   * 额度申请币种
   */
  applyCcyid: string
  /**
   * 申请状态
   */
  applyStatus: string
  /**
   * 额度核准金额
   */
  checkAmt: number
  /**
   * 额度核准币种
   */
  checkCcyid: number
  /**
   * 流水号
   */
  refcode: number
}
export interface BuyerList {
  /**
   * 当前应收账款余额（元）
   */
  accountBalance: number | string
  /**
   * 填写状态，0=未填写/ 1=已填写
   */
  supplementStatus: string
  /**
   * 准入流水号
   */
  aplRefcode: number
  /**
   * 详细地址（英文）
   */
  addressEn: string

  /**
   * 申请书流水号
   */
  appRefcode: number
  /**
   * 买方企业流水号
   */
  buyerRefcode: number | string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 币种描述
   */
  ccyidDesc: string
  /**
   * 账期起算日
   */
  tenorStartType: string
  /**
   * 账期起算日描述
   */
  tenorStartDesc: string
  /**
   * 公司注册编号
   */
  companyRegistrationNo: string
  /**
   * 当前在手订单金额（元）
   */
  currentOrderAmt: number | string
  /**
   * 与买方之间有无禁止债权转让的约定，0=否/ 1=是
   */
  debtTransferFlag: string
  /**
   * 公司联系邮箱
   */
  email: string
  /**
   * 最早交易年份，yyyy
   */
  firstTransactionYear: string
  /**
   * 联系人姓名
   */
  linkman: string
  /**
   * 公司联系人手机号/ 通信工具号
   */
  linkmanMobilePhone: string
  /**
   * 联系人职务
   */
  linkmanPosition: string
  /**
   * 联系人电话
   */
  mobilePhone: string
  /**
   * 买方国家编码，若同买方多比国家数据，取最早的一笔准入国家
   */
  orgctyid: string
  /**
   * 买方国家描述
   */
  ctyDesc: string
  /**
   * 买方名称
   */
  aplOrgname: string
  /**
   * 买方名称(英文)
   */
  orgname: string
  /**
   * 当前是否有逾期，0=否/ 1=是
   */
  overdueFlag: string
  /**
   * 逾期说明
   */
  overdueRemark: string
  /**
   * 支付方式，1={O/ A}/ 2=其他
   */
  payType: string
  /**
   * 支付方式描述
   */
  payTypeDesc: string
  /**
   * 流水号，临时保存后有值
   */
  refcode: number | null
  /**
   * 账期（天）
   */
  tenor: number | string
  /**
   * 交易商品
   */
  tradeName: string
  /**
   * 准入申请业务交易对手流水号
   */
  aplDtcRefcode: number
  /**
   * 准入业务申请编号
   */
  aplFinancingNo: string
  /**
   * 是否有条件准入[1=是]
   */
  conditionFlag: string
  /**
   * 有条件准入说明
   */
  conditionRemark: string
  /**
   * 准入买方备注
   */
  remark?: string
  /**
   * 报价信息
   */
  fintAppQuotaVo?: FintAppQuotaVo
  /**
   * 申请书说明
   */
  buyerDescribe?: string
  /**
   * 额度开立状态
   */
  clStatus?: string
  /**
   * 字典项展示状态，9899=已开立/2297=不可开立
   */
  finalClStatus?: string
  /**
   * 额度申请信息
   */
  fintAppClVo?: FintAppClVo
}

/**
 * 申请书信息，临时保存或确认流程有数据
 */
export interface FintAppM {
  /**
   * 承作保理商账号（USD）
   */
  factoringUsdAccountNo: string
  /**
   * 承作保理商开户行英文名称
   */
  factoringBankEn: string
  /**
   * 银行地址
   */
  factoringBankAddress: string
  /**
   * 银行SWIFT CODE
   */
  factoringSwiftCode: string
  /**
   * 行号（RTGS代码）
   */
  bankRtgsCode: string
  /**
   * 分行号
   */
  bankBranchCode: string
  /**
   * 发票种类 0=国内发票/1=国际发票
   */
  invoiceType: string
  /**
   * 开票币种 国内发票默认人民币
   */
  billCcyid: string
  /**
   * 标准折扣描述
   */
  discountDesc: string
  /**
   * 标准折扣
   */
  discount: number | string
  /**
   * 付款方式【1=先付/2=后付】
   */
  creditPaymentType: string
  /**
   * 付款方式描述
   */
  creditPaymentTypeDesc: string
  /**
   * 统一社会信用代码来源[0=手动维护/1=企业表或ECI查询（默认）]
   */
  applyOrgSource?: string
  /**
   * 运营退回的时间
   */
  examineDate: string
  /**
   * 操作人【1=客户经理/ 2=客户】
   */
  operator: string
  /**
   * 企业验证状态 【0=否/1=是】
   */
  applyOrgStatus: string
  /**
   * 收款账户开户行，默认带入
   */
  accountBank?: string
  /**
   * 收款账户户名，默认带入
   */
  accountName?: string
  /**
   * 收款账户账号，默认带入
   */
  accountNo?: string
  /**
   * 收款账户流水号，默认带入
   */
  accountRefcode?: number
  /**
   * 申请书编号
   */
  applyNo?: string
  /**
   * 申请状态，1=待申请（临时保存）/ 2=待确认/ 3=确认退回/ 4=待到账确认(已申请)/ 5=待审核/ 6=审核拒绝/ 7=审核退回/ 9=审核通过
   */
  applyStatus: string
  /**
   * 开票企业税号，默认带入
   */
  billDutyParagraph?: string
  /**
   * 开票企业邮箱
   */
  billEmail?: string
  /**
   * 是否开票，0=否/ 1=是
   */
  billFlag: string
  /**
   * 开票企业名称，默认带入
   */
  billOrgname?: string
  /**
   * 开票类型，1=普票/ 2=专票
   */
  billType: string
  /**
   * 主要经营范围
   */
  businessScope?: string
  /**
   * 申请人统一社会信用代码
   */
  companyCreditCode?: string
  /**
   * 客户经理确认时间
   */
  confirmDate?: string
  /**
   * 客户经理确认备注，退回说明
   */
  confirmRemark?: string
  /**
   * 保理商账号，默认带入
   */
  factoringAccountNo?: string
  /**
   * 保理商开户行，默认带入
   */
  factoringBank?: string
  /**
   * 保理商户名，默认带入
   */
  factoringMerchant?: string
  /**
   * 保理商名称，默认带入
   */
  factoringName?: string
  /**
   * 保理商流水号，默认带入
   */
  factoringRefcode?: number | string
  /**
   * 法人通讯工具号码
   */
  legalCommNo?: string
  /**
   * 法人联系人名称
   */
  legalLinkman?: string
  /**
   * 法人联系人通讯工具号码
   */
  legalLinkmanCommNo?: string
  /**
   * 法人联系人电话
   */
  legalLinkmanPhone?: string
  /**
   * 法人名称
   */
  legalPerson?: string
  /**
   * 法人联系电话
   */
  legalPhone?: string
  /**
   * 经营地址
   */
  operateAddress?: string
  /**
   * 申请人企业全称
   */
  orgname?: string
  /**
   * 申请人企业流水号
   */
  orgRefcode?: number
  /**
   * 缴纳征信费，1=常规/ 2=低折扣/ 3=标准折扣 / 9=豁免
   */
  payCreditType: string
  /**
   * 缴纳征信费描述
   */
  payCreditTypeDesc?: string
  /**
   * 邀请状态，0=未邀请/ 1=已发送邀请
   */
  pushStatus?: string
  /**
   * 流水号
   */
  refcode?: number | string
  /**
   * 成立时间
   */
  regDate: string
  /**
   * 拒绝原因
   */
  examineRemark: string
  /**
   * 客户提交的时间
   */
  customerSubmitDate?: string
  /**
   * 国家编码
   */
  ctyid: string
  /**
   * 国家描述
   */
  ctyDesc: string
  /**
   * 业务主管名称
   */
  superiorName: string
  /**
   * 客户经理名称
   */
  userName: string
  /**
   * 申请时间
   */
  applyDate: string
  /**
   * 承作保理商账号（HKD），新增，国外保理商有值
   */
  factoringHkdAccountNo: string
  /**
   * 业务大类[1=国内业务/2=国际业务/3=跨境电商]，历史数据个别混合业务可能不存在
   */
  bizScene: string
  /**
   * 产品类型，历史数据个别混合业务可能不存在
   */
  productType: string
  /**
   * 到账确认退回意见
   */
  accountConfirmRemark?: string
  /**
   * 缴费币种
   */
  paymentCcyid: string
  /**
   * 缴费币种
   */
  ccyidDesc: string
  /**
   * 发票流水号，先开关联发票流水号
   */
  invRefcode?: number
  /**
   * 备注
   */
  remark?: string
}

export interface FintApxList {
  /**
   * 文件流水号
   */
  refcode: number
  /**
   * 文件名
   */
  fileName: string
  /**
   * 文件类型【1=征信费银行回单/ 2=主管审批证明/9=声明截图】
   */
  fileType: string
  /**
   * 文件后缀类型
   */
  suffixalType: string
  /**
   * fileUuid
   */
  fileUuid: string
  /**
   * 备注
   */
  remark?: string
  /**
   * resourceUuid
   */
  resourceUuid: string
}
/**
 * 有条件准入买方集合
 */
export interface ConditionBuyerList {
  /**
   * 有条件准入说明
   */
  conditionRemark: string
  /**
   * 买方名称
   */
  orgname: string
  /**
   * 买方名称中文
   */
  aplOrgname: string
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 10:54:34
 * @description: 申请书详情
 */
export interface ApplicationInfo {
  /**
   * 卖方对应累计准入买方数（已去重）
   */
  totalBuyerCount: number
  /**
   * 客户经理名称
   */
  userName: string
  /**
   * 买方列表，必存在，如果未填写会自动带入买方名和买方国家编码
   */
  buyerList: BuyerList[]
  /**
   * 申请书信息，临时保存或确认流程有数据
   */
  fintAppM: FintAppM
  /**
   * 申请文件，临时保存或确认流程有数据
   */
  fintApxList: FintApxList[]
  /**
   * 有条件准入买方集合
   */
  conditionBuyerList: ConditionBuyerList[]
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 10:55:57
 * @description: 申请企业信息
 */
export interface ApplyOrgInfo {
  /**
   * 经营范围
   */
  businessScope?: string
  /**
   * 统一社会信用代码
   */
  companyCreditCode: string
  /**
   * 法人名称
   */
  legalPerson?: string
  /**
   * 企业名
   */
  orgname: string
  /**
   * 成立时间
   */
  regDate?: string
  /**
   * 地址代号
   */
  inarea: string
  /**
   * 详细地址
   */
  address: string
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 11:01:09
 * @description: 提交申请书信息
 */
export interface SubmitData {
  /**
   * 收款账户开户行
   */
  accountBank?: string
  /**
   * 收款账户户名
   */
  accountName?: string
  /**
   * 收款账户账号
   */
  accountNo?: string
  /**
   * 收款账户流水号
   */
  accountRefcode?: number
  /**
   * 开票企业税号
   */
  billDutyParagraph?: string
  /**
   * 开票企业邮箱
   */
  billEmail?: string
  /**
   * 是否开票，0=否/ 1=是
   */
  billFlag?: string
  /**
   * 开票企业名称
   */
  billOrgname?: string
  /**
   * 开票类型，1=普票/ 2=专票
   */
  billType?: string
  /**
   * 主要经营范围
   */
  businessScope?: string
  /**
   * 买方列表
   */
  buyerList?: BuyerList[]
  /**
   * 申请人统一社会信用代码
   */
  companyCreditCode?: string
  /**
   * 申请人国家
   */
  ctyid?: string
  /**
   * 保理商账号
   */
  factoringAccountNo?: string
  /**
   * 保理商开户行
   */
  factoringBank?: string
  /**
   * 保理商户名
   */
  factoringMerchant?: string
  /**
   * 保理商名称
   */
  factoringName?: string
  /**
   * 保理商流水号
   */
  factoringRefcode?: number
  /**
   * 申请文件
   */
  fintApxList?: FintApxList[]
  /**
   * 法人通讯工具号码
   */
  legalCommNo?: string
  /**
   * 法人联系人名称
   */
  legalLinkman?: string
  /**
   * 法人联系人通讯工具号码
   */
  legalLinkmanCommNo?: string
  /**
   * 法人联系人电话
   */
  legalLinkmanPhone?: string
  /**
   * 法人名称
   */
  legalPerson?: string
  /**
   * 法人联系电话
   */
  legalPhone?: string
  /**
   * 经营地址
   */
  operateAddress?: string
  /**
   * 操作人，1=客户经理/ 2=客户
   */
  operator?: string
  /**
   * 申请人企业全称
   */
  orgname?: string
  /**
   * 申请人企业流水号
   */
  orgRefcode?: number
  /**
   * 缴纳征信费，1=常规/ 2=低折扣/ 9=豁免
   */
  payCreditType?: string
  /**
   * 流水号
   */
  refcode?: number
  /**
   * 成立时间
   */
  regDate?: Date
}
export interface ShareDataObj {
  /**
   * 卖方企业名称
   */
  orgname: string
  /**
   * 申请书编号
   */
  refcode: string
  /**
   * 操作人
   */
  operator: string
  /**
   * 申请人国家
   */
  ctyid: string
  /**
   * 分享的时间戳
   */
  shareTime: number
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-18 14:30:51
 * @description: 申请书申请总数
 */
export interface ApplicationCount {
  /**
   * 数据总数
   */
  count: number
  /**
   * 已申请
   */
  countApply: number
  /**
   * 已通过
   */
  countPass: number
  /**
   * 已拒绝
   */
  countRefuse: number
  /**
   * 退回数
   */
  countReturn: number
}

// 申请书申请列表
export interface ApplicationList {
  /**
   * 申请书编号
   */
  applyNo: string
  /**
   * 申请状态，5=已申请/6=拒绝/9=通过
   */
  applyStatus: string
  /**
   * 买方数
   */
  count: number
  /**
   * 卖方国家名
   */
  ctyDesc: string
  /**
   * 卖方国家编码
   */
  ctyid: string
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 申请书流水号
   */
  refocde: number
  /**
   * 业务主管名称
   */
  superiorName: string
  /**
   * 客户经理名称
   */
  userName: string
  /**
   * 业务大类[1=国内业务/2=国际业务/3=跨境电商]，历史数据个别混合业务可能不存在
   */
  bizScene: string
  /**
   * 产品类型，历史数据个别混合业务可能不存在
   */
  productType: string
  /**
   * 买方名称
   */
  buyerOrgname: string
}

// 保理商信息
export interface FactoringItem {
  /**
   * 收款账户开户行
   */
  accountBank?: string
  /**
   * 收款账户户名
   */
  accountName?: string
  /**
   * 收款账户账号
   */
  accountNo?: string
  /**
   * 收款账户流水号
   */
  accountRefcode: number
  /**
   * 保理商账号
   */
  factoringAccountNo?: string
  /**
   * 保理商开户行
   */
  factoringBank?: string
  /**
   * 保理商户名
   */
  factoringMerchant?: string
  /**
   * 保理商名称
   */
  factoringName: string
  /**
   * 保理商流水号
   */
  refcode: number
  /**
   * 发票种类 0=国内发票/1=国际发票
   */
  invoiceType: string
  /**
   * 开票币种 国内发票默认人民币
   */
  billCcyid: string
  /**
   * 承作保理商账号（USD）
   */
  factoringUsdAccountNo: string
  /**
   * 承作保理商开户行英文名称
   */
  factoringBankEn: string
  /**
   * 银行地址
   */
  factoringBankAddress: string
  /**
   * 银行SWIFT CODE
   */
  factoringSwiftCode: string
  /**
   * 行号（RTGS代码）
   */
  bankRtgsCode: string
  /**
   * 分行号
   */
  bankBranchCode: string
  /**
   * 承作保理商账号（HKD），新增，国外保理商有值
   */
  factoringHkdAccountNo: string
}

/**
 * 保理商集合
 */
export interface FactoringList {
  /**
   * 保理商集合
   */
  factoringList: FactoringItem[]
}
/**
 * 贷前查询业务汇总
 */
export interface BusinessData {
  /**
   * 已准入数
   */
  aplCount: number
  /**
   * 申请书通过数
   */
  appCount: number
  /**
   * 资料检查通过数，目前为0
   */
  dataCount: number
  /**
   * 过会数
   */
  metCount: number
  /**
   * 已开买方额度
   */
  quotaCount: number
}
export interface ApplicationBuyer {
  /**
   * 申请书买方总数
   */
  count: number
  /**
   * 买方流水号
   */
  refcodeList: number[]
}
// 可选择买方列表
export interface FindBuyerItem {
  /**
   * 买方名称
   */
  counterpartyName: string
  /**
   * 买方国家名
   */
  ctyDesc: string
  /**
   * 买方国家代码
   */
  ctyid: string
  /**
   * 业务申请编号
   */
  financingNo?: string
  /**
   * 交易产品
   */
  productName: string
  /**
   * 买方流水号
   */
  refcode: number
  /**
   * 账期（天）
   */
  tenor: number
  /**
   * 账期起算日描述
   */
  tenorStartDesc: string
  /**
   * 账期起算日[1=提单日/2=发票日/3=货物到港日/4=买方收货日/5=其他]
   */
  tenorStartType: string
  /**
   * 准入申请业务交易对手流水号
   */
  aplDtcRefcode: number
  /**
   * 交易对手业务子编号
   */
  subFinancingNo?: string
  /**
   * 是否有条件准入[1=是]
   */
  conditionFlag: string
  /**
   * 有条件准入说明
   */
  conditionRemark: string
  /**
   * 准入买方备注
   */
  remark?: string
}
export interface FindBuyerList {
  /**
   * 保理商集合
   */
  appList: FindBuyerItem[]
}
