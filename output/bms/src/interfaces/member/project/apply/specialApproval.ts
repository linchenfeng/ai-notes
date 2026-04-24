/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-06 17:40:34
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2026-03-25 15:23:08
 * @Description  : 特批申请接口
 */
export interface SpecialAppCount {
  /**
   * 已退回笔数
   */
  returnedCount: number
  /**
   * 已保存笔数
   */
  saveCount: number
  /**
   * 待提交数据
   */
  submitCount: number
  /**
   * 已提交笔数
   */
  pendingCount: string
}

//特批申请列表
export interface SpecialItem {
  /**
   * 申请日期/保存日期
   */
  applyDate: string
  /**
   * 申请状态，【0=已保存/1=审批中/2=已退回/3=已通过/4=已拒绝】
   */
  applyStatus: string
  /**
   * 申请类型，【31=用户特批准入/32=店铺特批准入（授信前）/33=特批额度申请/34=区间额度非时间段开启/35=其他特批】
   */
  applyType: string
  /**
   * 业务大类，【1=国内业务/2=国际业务/3=跨境电商】
   */
  bizScene: string
  /**
   * 业务申请编号
   */
  financingNo: string
  /**
   * 企业名称，卖方
   */
  orgname: string
  /**
   * 产品类型，描述
   */
  productType: string
  /**
   * 申请流水号
   */
  refcode: number
}

// 获取用户信息(主管替换)
export interface LoginUser {
  /**
   * 创建日期
   */
  createDate: string
  /**
   * 部门
   */
  department: string
  /**
   * 更新日期
   */
  lastModDate: string
  /**
   * 性别
   */
  sex: string
  /**
   * 上级主管代号
   */
  superior: string
  /**
   * 上级主管
   */
  superiorName: string
  /**
   * 用户代号
   */
  userid: string
  /**
   * 用户名称
   */
  userName: string
}

export interface AplList {
  /**
   * 业务类型
   */
  bizTypes: string
  bizScene: string
}

// 产品类型列表项
export interface ProductType {
  /**
   * 产品类型列表
   */
  aplList: AplList[]
  /**
   * 业务场景，1=国内业务/2=国际业务/3=跨境电商
   */
  bizScene: string
}
// 融资利率集合
interface LoaCcyRateList {
  /**
   * 流水号
   */
  refcode: number
  /**
   * 币种
   */
  ccyid: string
  /**
   * 融资利率
   */
  loaRate: number
}
/**
 * OrgCreditInfo
 */
export interface OrgCreditInfo {
  /**
   * 授信币种
   */
  ccyid: string
  /**
   * 授信币种描述
   */
  ccydesc: string
  /**
   * 综合额度
   */
  compreAmt: number
  /**
   * 授信产品，见枚举值定义
   */
  creditApplyProduct: string
  /**
   * 产品名称
   */
  productName: string
  /**
   * 融资余额
   */
  financingBalance: number
  /**
   * 融资利率
   */
  loanRate: number
  /**
   * 特批额度
   */
  specialAmt: number
  /**
   * 区间额度
   */
  temporaryAmt: number
  /**
   * 总额度
   */
  totalAmt: number
  /**
   * 核贷类型
   */
  loanType: string
  /**
   * 融资利率集合
   */
  loaCcyRateList: LoaCcyRateList[]
}

// 客户信息列表项,返回申请准入企业+OA企业
export interface OrgListItem {
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
  /**
   * 授信列表，目前取第一笔展示
   */
  orgLocList?: OrgCreditInfo[]

  /**
   * 担保人，多个使用中文顿号分隔
   */
  guarantor?: string
  /**
   * 共借人
   */
  jointBorrower?: string
  /**
   * 法定代表人
   */
  legalPerson?: string
}

// 文件列表
export interface ApxList {
  /**
   * 文件流水号
   */
  apxRefcode: number
  /**
   * 文件resourceUuid
   */
  resourceUuid: string
}

// 特批查询统计数据
export interface SpecialQueryCount {
  /**
   * 审批中笔数
   */
  auditCount: number
  /**
   * 已通过笔数
   */
  passCount: number
  /**
   * 已拒绝笔数
   */
  rejectCount: number
  /**
   * 已退回笔数
   */
  returnedCount: number
  /**
   * 全部笔数
   */
  totalCount: number
}

/**
 * SaaApxInfo
 */
export interface SaaApxInfo {
  /**
   * 附件流水号
   */
  apxRefcode: number
  /**
   * 文件名称
   */
  fileName: string
  /**
   * 文件上传唯一编号
   */
  fileUuid: string
  /**
   * 文件资源唯一编号，文件唯一标识
   */
  resourceUuid: string
}

/**
 * 当前任务节点信息
 */
export interface FlowNodeVo {
  /**
   * 审批类型，用于区分审批和批注操作，【A=审批/B=批注/C=确认】
   */
  examineType: string
  /**
   * 节点模式，【A=角色（未实现）/B=用户/C=业务主管】
   */
  nodeMode: string
  /**
   * 当前审批层级
   */
  nodeLevel: string
  /**
   * 节点通过逻辑，【O=OR/A=AND(未实现)】
   */
  nodePassLogic: string
  /**
   * 下一节点主键
   */
  nextNodeRefcode: string | number
}
/**
 * 站点列表
 */
export interface ShopSubList {
  /**
   * 不准入原因
   */
  notRatifyRemark: string
  /**
   * 不准入原因拆分数组
   */
  notRatifyRemarkList?: string[]
  /**
   * 店铺所在国家
   */
  shopCountry: string
  /**
   * 是否选中
   */
  checked?: string[]
}
/**
 * 店铺信息
 */
export interface ShopList {
  /**
   * SellerID
   */
  sellingPartnerId: string
  /**
   * 店铺名称
   */
  shopName: string
  /**
   * 是否选中
   */
  checked?: string[]
  /**
   * 站点集合
   */
  floaShopSubMList: ShopSubList[]
}

/**
 * 特批申请信息
 *
 * SaaVo
 */
export interface SaaVo {
  /**
   * 申请日期/保存日期
   */
  applyDate: Date
  /**
   * 申请理由
   */
  applyRemark: string
  /**
   * 申请状态，【0=已保存/1=审批中/2=已退回/3=已通过/4=已拒绝】
   */
  applyStatus: string
  /**
   * 申请类型，【31=用户特批准入/32=店铺特批准入（授信前）/33=特批额度申请/34=区间额度非时间段开启/35=其他特批】
   */
  applyType: string
  /**
   * 申请类型描述
   */
  applyTypeDesc: string
  /**
   * 申请人代号，对应客户经理
   */
  applyUser: string
  /**
   * 业务大类，【1=国内业务/2=国际业务/3=跨境电商】
   */
  bizScene: string
  /**
   * 业务申请编号
   */
  financingNo: string
  /**
   * 企业名称，卖方
   */
  orgname: string
  /**
   * 产品类型，描述
   */
  productType: string
  /**
   * 申请流水号
   */
  refcode: number
  /**
   * 审批状态，【1=待审批/2=已退回】
   */
  reviewStatus?: string
  /**
   * 上级主管，对应名称
   */
  superiorName: string
  /**
   * 上级主管代号
   */
  superiorUserid: string
  /**
   * 任务流水号
   */
  taskRefcode?: number
  /**
   * 客户经理名称
   */
  userName: string
  /**
   * 已选中的店铺列表
   */
  shopList: ShopList[]
}

/**
 * 响应体
 */
export interface SpecialAppInfo {
  /**
   * 无数据时返回1，有数据时无此属性
   */
  nodata?: string
  /**
   * 申请附件列表
   */
  apxList: SaaApxInfo[]
  /**
   * 当前任务节点信息
   */
  flowNodeVo: FlowNodeVo
  /**
   * 特批申请信息
   */
  saaVo: SaaVo
  /**
   * 授信列表
   */
  orgLocList: OrgCreditInfo[]
}

/**
 * 授信列表
 */
export interface ClListElement {
  /**
   * 授信币种
   */
  ccyid: string
  /**
   * 综合额度
   */
  compreAmt: number
  /**
   * 授信产品，见枚举值定义
   */
  creditApplyProduct: string
  /**
   * 融资余额
   */
  financingBalance: number
  /**
   * 融资利率
   */
  loanRate: number
  /**
   * 特批额度
   */
  specialAmt: number
  /**
   * 区间额度
   */
  temporaryAmt: number
  /**
   * 总额度
   */
  totalAmt: number
}

/**
 * 店铺信息
 */
export interface ShopInfo {
  /**
   * 店铺信息列表，选择申请类型为“店铺特批准入（授信前）”及“店铺特批准入（授信后）时才展示
   */
  shopList: ShopList[]
}

// 特批申请信息(提交/保存)
export interface SaveSpecialVo {
  /**
   * 是否循环
   */
  cycleFlag: string
  /**
   * 是否循环描述
   */
  cycleFlagDesc: string
  /**
   * 授权平台 1-亚马逊 2-沃尔玛
   */
  creditPlatform: string
  /**
   * 授权平台描述
   */
  creditPlatformDesc: string
  /**
   * 审批状态
   */
  examineType?: string
  /**
   * 本次申请区间额度
   */
  applyTemporaryAmt: string | number
  /**
   * 本次申请额度币种
   */
  applyCcyid: string
  /**
   * 申请理由
   */
  applyRemark: string
  /**
   * 申请类型，【31=用户特批准入/32=店铺特批准入（授信前）/33=特批额度申请/34=区间额度非时间段开启/35=其他特批/36=店铺特批准入（授信后）】
   */
  applyType: string
  /**
   * 申请描述
   */
  applyTypeDesc: string
  /**
   * 申请附件列表
   */
  apxList: ApxList[]
  /**
   * 业务大类，【1=国内业务/2=国际业务/3=跨境电商】
   */
  bizScene: string
  /**
   * 业务申请编号，保存后有值
   */
  financingNo?: string
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 客户流水号，临时保存后可能存在
   */
  orgRefcode?: number
  /**
   * 产品类型，调用接口获取清单
   */
  productType: string
  /**
   * 申请流水号，保存后有值
   */
  refcode?: number
  /**
   * 申请状态 【0=已保存/1=审批中/2=已退回/3=已通过/4=已拒绝】
   */
  applyStatus?: string
  /**
   * 上级主管代号
   */
  superior?: string
  /**
   * 上级主管
   */
  superiorName?: string
  /**
   * 用户名称
   */
  userName?: string
  /**
   * 国家代号
   */
  orgctyid?: string
  /**
   * 国家描述
   */
  orgctyDesc?: string
  /**
   * 申请日期
   */
  applyDate: string
  /**
   * 法定代表人
   */
  legalPerson: string
  /**
   * 共借人
   */
  jointBorrower: string
  /**
   * 担保人,多个使用中文顿号分隔
   */
  guarantor: string
  /**
   * 授信列表
   */
  orgLocList: OrgCreditInfo[]
  /**
   * 店铺信息列表，选择申请类型为“店铺特批准入（授信前）”及“店铺特批准入（授信后）时才展示
   */
  shopList: ShopList[]
  /**
   * 授信产品
   */
  creditApplyProduct: string
  creditApplyProductDesc?: string
  /**
   * 买方名称
   */
  buyerName: string
  /**
   * 本次申请特批额度
   */
  applySpecialAmt: number | string
  /**
   * 本次申请额度生效日类型[1:审批通过日/2:具体的日期]
   */
  applyValidType: string
  /**
   * 本次申请额度生效日描述
   */
  applyValidTypeDesc: string
  /**
   * 本次申请额度生效日
   */
  applyValidStartDate: string
  /**
   * 本次申请额度有效期（天）
   */
  applyValidPeriod: string
  /**
   *概要说明
   */
  handleSummary: string
}

/**
 * 买方对象
 */
export interface BuyerInfo {
  /**
   * 亚马逊
   */
  PLATFORM_AMAZON_NAME: string
  /**
   * 亚马逊平台及亚马逊平台实际消费者
   */
  PLATFORM_AMAZON_NAME_BUYER: string
  /**
   * 沃尔玛
   */
  PLATFORM_WAL_MART_NAME: string
  /**
   * 沃尔玛平台及沃尔玛平台实际消费者
   */
  PLATFORM_WAL_MART_NAME_BUYER: string
}
