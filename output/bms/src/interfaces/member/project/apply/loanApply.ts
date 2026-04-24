export interface LoanApplyCount {
  /**
   * 待提交
   */
  saveCount: number
  /**
   * 已提交
   */
  submitCount: number
}
export interface SearchData {
  /**
   * 查询状态，0=待提交/1=已提交
   */
  loanStatus: string
  /**
   * 客户名称，模糊搜索
   */
  orgname?: string
}
// 定义整个search对象的类型接口
export interface Search {
  data: SearchData
  pageNum: number
  pageSize: number
}
export interface FintLoaList {
  /**
   * 申请日期
   */
  applyDate: Date
  /**
   * 业务编号
   */
  businessNo: string
  /**
   * 授信产品（可多选），1=天e贸/2=天e贷
   */
  creditProducts?: string
  /**
   * 融资状态，0=已保存/1=审核中/2=已退回/3=已拒绝/4=已撤回/9=已审核
   */
  loanStatus: string
  /**
   * 客户名称，临时保存不强制填写
   */
  orgname?: string
  /**
   * 流水号
   */
  refcode: number
}
export interface GuaList {
  /**
   * 担保人名称
   */
  guarantor: string
  /**
   * 担保人身份类型，1=法人/2=妻子/3=其他
   */
  guarantorType?: string
  /**
   * 担保人身份类型描述
   */
  guarantorTypeDesc?: string
  /**
   * 担保说明，其他类型必填
   */
  remark?: string
}
/**
 * 若提交后多数参数必传
 */
export interface FintLoaVo {
  /**
   * 申请日期，【未传递流水号自动初始化】
   */
  applyDate: string
  /**
   * 申请备注说明
   */
  applyRemark?: string
  /**
   * 客户经理，【未传递流水号自动初始化】
   */
  applyUser: string
  /**
   * 客户经理名称，【未传递流水号自动初始化】
   */
  applyUsername: string
  /**
   * 业务大类，3=跨境电商（前端不传后端默认）
   */
  bizScene?: string
  /**
   * 共借人法人名称
   */
  borrowerLegalPerson?: string
  /**
   * 共借人名称
   */
  borrowerPerson?: string
  /**
   * 过桥对手方
   */
  bridgeCounterparty?: string
  /**
   * 是否需要过桥[0=否/1=是]
   */
  bridgeLoanFlag?: string
  /**
   * 过桥类型[1=单锁过桥/2=双锁过桥]
   */
  bridgeLoanType?: string
  /**
   * 字符渠道名称，第三方获取
   */
  channelName?: string
  /**
   * 用户编号
   */
  companyCreditCode?: string
  /**
   * 授信产品[1=天e贸/2=天e贷]，可多选（逗号拼接）
   */
  creditProducts?: string
  guaList: GuaList[]
  /**
   * 法人名称
   */
  legalPerson?: string
  /**
   * 币种
   */
  loanCcyid?: string
  /**
   * 币种描述
   */
  loanCcyidDesc?: string
  /**
   * 月利率%，天e贸必填
   */
  loanMonthRate?: number | string
  /**
   * 年利率%，天e贷必填
   */
  loanYearRate?: number | string
  /**
   * 客户名称
   */
  orgname?: string
  /**
   * 产品类型
   */
  productType?: string
  /**
   * 预估额度说明
   */
  quotaRemark?: string
  /**
   * 流水号，保存后存在
   */
  refcode: string
  /**
   * 业务主管，【未传递流水号自动初始化】
   */
  superiorUserid: string
  /**
   * 业务主管名称，【未传递流水号自动初始化】
   */
  superiorUsername: string
  /**
   * 融资状态，[0=已保存/1=审核中/2=已退回/3=已拒绝/4=已撤回/9=已审核]
   */
  loanStatus: string
  /**
   * 审批意见，最新一笔审批记录（撤回/退回）
   */
  handleReason?: string
  /**
   * 审批人，最新一笔审批记录（撤回/退回）
   */
  handleUsername?: string
  /**
   * 当前审批层级
   */
  currentOperatorLevel?: string
  /**
   * 审批标记，1=当前用户有权审批
   */
  approverFlag?: string
}
export interface AplList {
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
  aplList: AplList[]
  /**
   * 业务大类，3=跨境
   */
  bizScene: string
}
export interface ChannelNameList {
  /**
   * 支付渠道
   */
  channelNameList?: string[]
}
