/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:54:16
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-16 13:56:05
 * @Description  : 业务申请接口
 */
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 14:35:47
 * @description:
 */
export interface InternationList {
  /**
   * 交易流水号
   */
  refcode: number
  /**
   * 交易对手名称
   */
  counterpartyName: string
  /**
   * 融资企业名称
   */
  orgname
  /**
   * 业务申请编号
   */
  financingNo: string
  /**
   * 交易对手所在国
   */
  ctyid: string
  /**
   * 交易对手所在国描述
   */
  ctyDesc
  /**
   * 目前账款余额
   */
  accountBanlance: string
  /**
   * 账期
   */
  tenor: string

  /**
   * 申请日期
   */
  createDate: string

  /**
   * 状态 1：审核中 2：打回补充 3审核通过 4审核未通过
   */
  intLoanStatus: string

  /**
   * 币种
   */
  ccyid: string
}
export interface InternationBusiness {
  /**
   * 列表数据
   */
  fintAplMList: Array<InternationList>
}
export interface FintAplDtcVoList {
  /**
   * 年交易额（万元）
   */
  annualTurnover: number | string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 币种描述
   */
  ccyidDesc: string
  /**
   * 交易对手名称
   */
  counterpartyName: string
  /**
   * 交易对手流水号，临时保存后可能存在
   */
  counterpartyRefcode?: number
  /**
   * 交易对手所在国
   */
  ctyid: string
  /**
   * 买方所在国描述
   */
  ctyDesc: string
  /**
   * 未来年度交易额（万元）
   */
  futureAnnualTurnover: number | string
  /**
   * 是否有物流管理系统[0=否/1=是]，新增 物流必填
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
   * 公开招投标项目[0=否/1=是]，新增 物流必填
   */
  publicBiddingFlag: string
  /**
   * 交易对手流水号，临时保存后存在
   */
  refcode?: number | string
  /**
   * 账期（天）
   */
  tenor: number | string
  /**
   * 账期起算日描述
   */
  tenorStartDesc: string
  /**
   * 账期起算日[1=提单日/2=发票日/3=货物到港日/4=买方收货日/5=其他]
   */
  tenorStartType: string
  /**
   * 账期起算日(页面显示)
   */
  tenorStartTypeDesc?: string
  /**
   * 交易年限（年）
   */
  transactionYears: string
  /**
   * 运单对账方式描述（其他方式必填），新增 物流必填
   */
  waybillVerifyDesc: string
  /**
   * 运单对账方式[1=系统/2=邮件/9=其他]，新增 物流必填
   */
  waybillVerifyType?: string
  /**
   * 填写状态，0=未填写/ 1=已填写
   */
  supplementStatus: string
  /**
   * 备注
   */
  remark?: string
  /**
   * 店铺信息
   */
  storeInformation: string
}
export interface BatchAplList {
  /**
   * 待准入状态，1=已申请/2=已提问/3=已回复
   */
  applyStatus: string
  /**
   * 交易对手名称
   */
  counterpartyNames: string
  /**
   * 交易对手国家
   */
  ctyDesc: string
  /**
   * 状态，31=有条件准入
   */
  intLoanStatus: string
  /**
   * 流水号
   */
  refcode: number
}
export interface FintAplMVo {
  /**
   * 退回/拒绝原因
   */
  approveRemark?: string
  /**
   * 状态 1：审核中 2：打回补充 3审核通过 4审核未通过
   */
  intLoanStatus: string

  /**
   * 客户类型 1.认证客户、2.注册客户、3.潜在客户
   */
  customType: string
  /**
   *  已申请状态[1=已申请/2=已提问/3=已回复]
   */
  applyStatus: string
  /**
   * 退回原因
   */
  returnReason: string
  /**
   * 拒绝原因
   */
  rejectReason: string
  /**
   * 年度交易金额（元），number(16,4)
   */
  annualTurnover: number | string
  /**
   * 主管名称
   */
  superiorName: string
  /**
   * 主管userid
   */
  superior: string
  /**
   * 申请人
   */
  userName: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 币种描述
   */
  ccyidDesc: string
  /**
   * 买方名称
   */
  counterpartyName: string
  /**
   * 买方所在国
   */
  ctyid: string
  /**
   * 买方所在国描述
   */
  ctyDesc: string
  /**
   * 业务申请编号
   */
  financingNo?: string
  /**
   * 未来年度交易金额（元），number(16,4)
   */
  futureAnnualTurnover: number | string
  /**
   * 卖方所在国
   */
  orgctyid: string
  /**
   * 卖方所在国描述
   */
  orgctyDesc: string
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 交易商品
   */
  productName: string
  /**
   * 项目来源
   */
  projectSource: string
  /**
   * 账期（天）
   */
  tenor: number | string
  /**
   * 申请日期
   */
  applyDate: string
  /**
   * 查阅标记[0=未查阅/1=已查阅]
   */
  referFlag: string

  /**
   * 业务申请流水号
   */
  refcode?: number

  /**
   * 账期起算日[1=提单日/2=发票日/3=货物到港日/4=买方收货日/5=其他]
   */
  tenorStartType: string
  /**
   * 账期起算日描述
   */
  tenorStartDesc: string
  /**
   * 交易年限
   */
  transactionYears: number | string
  /**
   * 是否有条件准入[1=是]，申请状态为3=已准入时，返回
   */
  conditionFlag?: string
  /**
   * 条件说明，有条件准入时返回
   */
  conditionRemark?: string
  /**
   * 产品类型，调用接口获取清单
   */
  productType: string
  /**
   * 交易对手清单
   */
  fintAplDtcVoList: FintAplDtcVoList[]
  /**
   * 提交标记，0=临时保存/1=提交准入
   */
  isSubmit?: string
  /**
   * 是否最终审批节点，0=否/1=是（若为最终审核则显示条件准入按钮）
   */
  finalApproval?: string
  /**
   * 业务场景
   */
  bizScene?: string
  /**
   * 是否拥有答复权限，（0：不拥有，1：拥有）
   */
  answerFlag?: string
  /**
   * 联系人手机号

   */
  linkman?: string
  /**
   * 联系人手机号

   */
  linkmanphone?: string
  /**
   * 当前审批层级
   */
  approveLevel?: number
  /**
   * 第一节点操作时间，仅第一准入人操作后存在
   */
  oneLevelApproveDate?: string
  /**
   * 第一节点操作人，仅第一准入人操作后存在
   */
  oneLevelUserName?: string

  /**
   * 卖方企业流水号
   */
  orgRefcode?: number

  /**
   * 入驻邀请状态[1=待邀请/2=已邀请]
   */
  entryInvitationStatus?: string
  /**
   * 同批次准入申请，如仅存在一笔则返回空
   */
  batchAplList?: BatchAplList[]
  /**
   * 审批标记，1=登陆人有权审批
   */
  approvalFlag?: string
  /**
   * 操作层级，当前用户参与审批的节点层级，为0代表未参与审批
   */
  operationLevel?: number
  /**
   * 暂缓原因
   */
  postponeRemark?: string
  /**
   * 审批类型[A=普通审批/B=批注/F=终审/C=确认]
   */
  examineType?: string
}

export interface FintAplM {
  fintAplM: FintAplMVo
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 11:09:50
 * @return {*}
 * @description: 已关联买卖方国家信息列表
 */
export interface OrgList {
  /**
   * 国家描述
   */
  ctyDesc: string
  /**
   * 国别代号
   */
  orgctyid: string
  /**
   * 买卖方名称
   */
  orgname: string
}

export interface OrgListData {
  /**
   * 国别列表
   */
  orgList: OrgList[]
}
// Picker 选择器字典项数组
export interface OrgListPicker {
  [index: number]: Array<OrgList>
}
export interface OaOrgList {
  /**
   * 国家描述，OA企业为空
   */
  ctyDesc: string
  /**
   * 国别代号，OA企业为空
   */
  orgctyid: string
  /**
   * 企业名称
   */
  orgname: string
}
export interface InternationBackRequest {
  /**
   * 删除标记，1=删除（删除撤回二选一）
   */
  delFlag?: string
  /**
   * 业务申请编号
   */
  financingNo: string
  /**
   * 状态，5=撤回（删除撤回二选一）
   */
  intLoanStatus?: string
  /**
   * 流水号
   */
  refcode: number
}
export interface listOaRequest {
  /**
   * 企业列表
   */
  orgList: OaOrgList[]
}
export interface AplList {
  /**
   * 申请日期/保存日期
   */
  applyDate: Date
  /**
   * 交易对手数量，买方
   */
  counterpartyCount: number
  /**
   * 交易对手名称，逗号拼接，买方
   */
  counterpartyNames: string
  /**
   * 业务申请编号
   */
  financingNo: string
  /**
   *
   * 真实准入状态，状态[0=保存/1=待准入/2=已退回/3=已准入/4=已拒绝/5=已撤回/11=一级待准入/12=一级准入退回/14=一级准入拒绝/21=二级待准入/22=二级准入退回/24=二级准入拒绝]
   */
  intLoanStatus: string
  /**
   * 融资企业名称，卖方
   */
  orgname: string
  /**
   * 准入流水号
   */
  refcode: number
}
export interface AplListRequest {
  /**
   * 申请准入列表
   */
  aplList: AplList[]
}
export interface BizType {
  /**
   * 业务类型
   */
  bizTypes: string
  /**
   * 业务场景，1=国内业务/2=国际业务/3=跨境电商
   */
  bizScene: string
}
export interface ProductTypeList {
  /**
   * 业务场景，1=国内业务/2=国际业务/3=跨境电商
   */
  bizScene: string
  /**
   * 产品类型
   */
  aplList: BizType[]
}
export interface ProductTypeListRequest {
  /**
   * 企业列表
   */
  productTypeList: ProductTypeList[]
}
export interface DataCount {
  /**
   * 待准入总数
   */
  approvalCount: number
  /**
   * 已保存总数
   */
  saveCount: number
  /**
   * 已暂缓总数
   */
  postponeCount
}

// 业务准入历程
export interface HistoryListItem {
  /**
   * 操作时间
   */
  approveDate: Date
  /**
   * 操作层级，仅准入审批需要控制
   */
  approveLevel?: number
  /**
   * 审批信息
   */
  approveRemark?: string
  /**
   * 操作人
   */
  approveUser: string
  /**
   *
   * 审批状态或节点，1=准入提交/3=准入通过/4=准入拒绝/5=申请人撤回/6=提交受理（易鲁通）/7=受理退回/8=受理拒绝/9=已暂缓/10=解除暂缓/63=受理通过（封装状态）/A=审批拒绝/B=审批退回/C=审批通过/D=批注/E=确认/F=终审通过
   */
  intLoanStatus: string
  /**
   * 企业名称
   */
  orgname?: string
  /**
   * 上次卖方企业名，仅准入提交时并且本次提交卖方变更时存在
   */
  historyOrgname?: string
  /**
   * 自动审批标记，仅节点状态为字母时存在
   */
  automaticFlag?: string
}
