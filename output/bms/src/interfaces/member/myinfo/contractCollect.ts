/*
 * @Author       : longcan.Yang
 * @Date         : 2023-01-12 09:50:20
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-02-20 09:27:01
 * @Description  : 签约信息收集接口数据
 */

export interface FconMakMVo {
  /**
   * 合同制作表流水号
   */
  refcode: number
  /**
   * 融资企业名称
   */
  orgname: string
  /**
   * 核贷书编号
   */
  creditNo: string
  /**
   *  合同制作状态
   */
  makeStatus: string
  /**
   *  摘要
   */
  summary: string
  /**
   *  签约信息收集状态[1=待补充信息/2=签约信息待确认/3=签约信息退回/4=已完成]
   */
  contractInfoStatus: string
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-12 10:08:21
 * @return {*}
 * @description: 获取需补充信息列表接口返回
 */
export interface FconMakMVoList {
  /**
   *  接口返回的列表
   */
  fconMakMVoList: Array<FconMakMVo>
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-12 09:51:17
 * @return {*}
 * @description: 融资企业智能识别接口返回
 */
export interface AccountInfo {
  /**
   * 开户行
   */
  account: string
  /**
   * 账号
   */
  bank: string
  /**
   * 银行地址
   */
  bankAddress: string
  /**
   * 行号
   */
  bankNo: string
  /**
   * 币种
   */
  ccyId: string
  /**
   * 联系地址
   */
  contactAddress: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 传真
   */
  fax: string
  /**
   * 邮政编码
   */
  postcode: string
  /**
   * 国际银行代号
   */
  swiftNo: string
  /**
   * 电话
   */
  tel: string
  /**
   * 户名
   */
  user: string
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-10 09:44:39
 * @return {*}
 * @description: 交易对手基本信息
 */
export interface FconDtcMListObj {
  /**
   * 统一社会信用代码
   */
  buyerCreditCode: string
  /**
   * 买方企业名称
   */
  buyerName: string
  /**
   * 联系地址
   */
  contactAddress: string
  /**
   * 传真
   */
  fax: string
  /**
   * 联系人名称
   */
  linkman: string
  /**
   * 联系邮箱
   */
  linkmanEmail: string
  /**
   * 联系电话
   */
  linkmanPhone: string
  /**
   * 交易对手表流水号
   */
  refcode: number
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 10:05:34
 * @return {*}
 * @description: 查询连带保证人(企业)信息列表
 */
export interface GuarantorEnterpriseInfo {
  /**
   * 连带保证公司/保证人流水号
   */
  refcode: number
  /**
   * 银行（公司）帐号
   */
  guaAccountNo: string
  /**
   * 连带保证人身份证地址
   */
  guaAddress: string
  /**
   * （公司）开户行
   */
  guaBankName: string
  /**
   * 联系地址
   */
  guaCompanyAddress: string
  /**
   * 经营地址
   */
  guaCompanyBusAddress: string
  /**
   * 联系邮箱
   */
  guaCompanyEmail: string
  /**
   * 联系人名称
   */
  guaCompanyLinkman: string
  /**
   * 联系电话
   */
  guaCompanyTel: string
  /**
   * 连带保证人身份证号
   */
  guaIdNo: string
  /**
   * 连带保证人（公司）名称
   */
  guaName: string
  /**
   * 连带保证人电话
   */
  guaTel: string
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-22 18:56:58
 * @return {*}
 * @description:  融资企业贸易阶段联系人信息
 */
export interface LoanOrgTransferLinkInfo {
  /**
   * 联系邮箱
   */
  tradeEmail: string
  /**
   * 姓名
   */
  tradePerson: string
  /**
   * 联系电话
   */
  tradeTel: string
  /**
   * 微信号
   */
  tradeWechatNo: string
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-20 15:04:42
 * @description: 实际买方信息
 */
export interface ActualBuyerInfo {
  /**
   * 联系地址
   */
  actualContactAddress: string
  /**
   * 统一社会信用代码
   */
  actualCreditCode: string
  /**
   * 传真
   */
  actualFax: string
  /**
   * 联系人名称
   */
  actualLinkman: string
  /**
   * 联系邮箱
   */
  actualLinkmanEmail: string
  /**
   * 联系电话
   */
  actualLinkmanPhone: string
  /**
   * 买方企业名称
   */
  actualName: string
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-20 15:05:24
 * @return {*}
 * @description: 指定交易人信息集合
 */
export interface AssignTraderInfoList {
  /**
   * 微信号
   */
  guaCompanyWechat: string
  /**
   * 指定交易人表流水号
   */
  refcode: number
  /**
   * 联系邮箱
   */
  tradePersonEmail: string
  /**
   * 身份证号
   */
  tradePerspnId: string
  /**
   * 姓名
   */
  tradePersonName: string
  /**
   * 联系电话
   */
  tradePerspnTel: string
  /**
   * 交易人类型[1=收货人/2=验货人/3=结算人/4=其他]
   */
  tradePersonType: string
  /**
   * 交易人类型描述
   */
  tradePersonText: string
  /**
   * 联系邮箱
   */
  tradePerspnEmail: string
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-20 15:05:40
 * @description: 供应链业务 开票信息
 */
export interface BillingInfo {
  /**
   * 账号
   */
  accountNo: string
  /**
   * 地址
   */
  address: string
  /**
   * 开户行
   */
  bankName: string
  /**
   * 公司名称
   */
  orgname: string
  /**
   * 开票信息表流水号
   */
  refcode: number
  /**
   * 纳税人识别号
   */
  taxpayerIdentificationNumber: string
  /**
   * 电话
   */
  tel: string
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-20 15:06:12
 * @description: 买方中标通知及合同模版信息
 */
export interface ContractFileList {
  /**
   * 文件名称
   */
  fileName: string
  /**
   * 文件上传方式[1=BMS/2=运营端]
   */
  fileUploadMethod: string
  /**
   * 文件资源唯一标识
   */
  resourceUuid: string
  /**
   * 合同制作附件表流水号
   */
  refcode: number
  /**
   * 备注
   */
  remark: string
  /**
   * 文件类型
   */
  suffixalType: string
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-22 18:57:26
 * @description: 供应链 & 供应链+保理   买方企业信息
 */
export interface FconScmVo {
  /**
   * 实际买方信息
   */
  actualBuyerInfo: ActualBuyerInfo
  /**
   * 指定交易人信息集合
   */
  assignTraderInfoList: AssignTraderInfoList[]
  /**
   * 开票信息
   */
  billingInfo: BillingInfo
  /**
   * 买方中标通知及合同模版
   */
  contractFileList: ContractFileList[]
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-10 09:39:55
 * @return {*}
 * @description: 签约信息收集接口返回数据
 */
export interface GatherInfo {
  /**
   * 合同制作流水号
   */
  refcode: number
  /**
   * 是否校验标识【0=校验/1=不校验】
   */
  verifySign: number
  /**
   * 收款账户名称
   */
  accountName: string
  /**
   * 收款银行账号
   */
  accountNo: string
  /**
   * 银行地址
   */
  bankAddress: string
  /**
   * 收款账户开户行
   */
  bankName: string
  /**
   * 业务类型
   */
  bussType: number
  /**
   * 币种
   */
  ccyid: string
  /**
   * 收款账户开户行行号
   */
  cnapsCode: string
  /**
   * 地址
   */
  contactAddress: string
  /**
   * 邮箱
   */
  contactEmail: string
  /**
   * 传真
   */
  fax: string
  /**
   * 融资企业法定代表人
   */
  legalPerson: string
  /**
   * 融资企业名称
   */
  orgname: string
  /**
   * 邮政编码
   */
  postcode: string

  /**
   * 融资企业注册地址
   */
  registeredAddress: string

  /**
   * 银行国际代码
   */
  swiftNo: string
  /**
   * 电话
   */
  tel: string
  /**
   * 联系邮箱
   */
  tradeEmail: string
  /**
   * 联系人名称
   */
  tradePerson: string
  /**
   * 联系电话
   */
  tradeTel: string
  /**
   * 微信
   */
  tradeWechatNo: string
  /**
   *  融资企业贸易阶段联系人信息
   */
  loanOrgTransferLinkInfo: LoanOrgTransferLinkInfo
  /**
   * 买方企业信息列表  非供应链
   */
  fconDtcMList: Array<FconDtcMListObj>
  /**
   * 买方企业信息 供应链&供应链+保理
   */
  fconScmVo: FconScmVo
  /**
   * 连带保证公司信息列表
   */
  suretyEnterpriseList: Array<GuarantorEnterpriseInfo>
  /**
   * 连带保证人信息列表
   */
  suretyPersonList: Array<GuarantorEnterpriseInfo>
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-12 13:59:24
 * @return {*}
 * @description: 获取待签约信息收集数据
 */
export interface FconMakInfo {
  fconMakMVo: GatherInfo
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-12 14:01:27
 * @return {*}
 * @description:校验提交信息数据是否变更
 */
export interface ValidateInfo {
  /**
   * 数据是否变更[0=否/1=是(数据已变更)]
   */
  result: string
  /**
   * 提示消息
   */
  tipInfo: string
}
export interface ContractStatus {
  /**
   * 补录信息状态
   */
  appModStatus: string
  /**
   * 更新状态
   */
  changeIdentity: number
  /**
   * 签约信息收集状态[1=待补充信息/2=签约信息待确认/3=签约信息退回/4=已完成]
   */
  contractInfoStatus: string
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-10-20 13:18:26
 * @return {*}
 * @description: 我的列表获取试算和反馈的信息条数
 */
export interface SipaBurMVoInfo {
  /**
   * 预计反馈信息条数
   */
  expectedPaymentPieces: number
  /**
   * 逾期利息预缴试算
   */
  overduePrepaymentPieces: number
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 09:17:34
 * @return {*}
 * @description:  融资企业基本信息
 */
export interface LoanOrgInfo {
  /**
   * 收款账户名称
   */
  accountName: string
  /**
   * 收款银行账号
   */
  accountNo: string
  /**
   * 签约信息收集方式【0=客户经理/1=融资企业】
   */
  verifySign: number
  /**
   * 银行地址，国际保理业务，账户币种非人民币时展示
   */
  bankAddress: string
  /**
   * 收款账户开户行
   */
  bankName: string
  /**
   * 账户币种，国际保理业务，账户币种非人民币时展示
   */
  ccyid: string
  /**
   * 收款账户开户行行号
   */
  cnapsCode: string
  /**
   * 联系地址
   */
  contactAddress: string
  /**
   * 联系邮箱
   */
  contactEmail: string
  /**
   * 传真
   */
  fax: string
  /**
   * 法定代表人
   */
  legalPerson: string
  /**
   * 融资企业名称
   */
  orgname: string
  /**
   * 邮政编码
   */
  postcode: string
  /**
   * 合同制作表流水号
   */
  refcode: number
  /**
   * 注册地址
   */
  registeredAddress: string
  /**
   * 收款账户开户行行号，国际保理业务，账户币种非人民币时，此处栏位展示
   */
  swiftNo: string
  /**
   * 联系电话
   */
  tel: string
  /**
   * 客户经理名称
   */
  managerMc: string
  /**
   * 应收账款转让金额
   */
  // transferAmt: number
  /**
   * 应收账款转让方式[1=全部转让/2=部分转让]
   */
  // transferType: string
  /**
   * 应收账款转让方式描述
   */
  ccyidText: string
  /**
   * 退回原因
   */
  signConfirmOption: string
  /**
   * 签约信息收集状态[1=待补充信息/2=签约信息待确认/3=签约信息退回/4=已完成]
   */
  contractInfoStatus: string
  /**
   * 业务大类[1=国内保理/2=反向保理/3=供应链+保理/4=供应链/5=国际保理]
   */
  bussType: number
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 09:58:12
 * @description: 文本识别连带保证公司信息
 */
export interface JointInfo {
  /**
   * 公司账号
   */
  jointAccount: string
  /**
   * 公司开户行
   */
  jointBank: string
  /**
   * 经营地址
   */
  jointBusinessAddress: string
  /**
   * 联系地址
   */
  jointContactAccount: string
  /**
   * 联系邮箱
   */
  jointEmail: string
  /**
   * 联系电话
   */
  jointTel: string
  /**
   * 联系人名称
   */
  jointUsername: string
}
export interface CollectPathObj {
  /**
   * 合同制作流水号
   */
  refcode: number
  /**
   * 收集类型【0=客户经理/1=融资企业】
   */
  verifySign: number
  /**
   * 分享的时间
   */
  shareTime: number
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-22 09:46:01
 * @return {*}
 * @description: 开票信息文本识别相应参数
 */
export interface RecBillingInfo {
  /**
   * 账号
   */
  taxpayerAccount: string
  /**
   * 地址
   */
  taxpayerAddress: string
  /**
   * 开户行
   */
  taxpayerBank: string
  /**
   * 纳税人识别号
   */
  taxpayerIdentificationCode: string
  /**
   * 电话
   */
  taxpayerTel: string
}
