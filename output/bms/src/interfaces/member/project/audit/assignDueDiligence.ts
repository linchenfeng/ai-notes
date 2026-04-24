/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-23 13:46:08
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-07 17:38:25
 * @Description  : 尽调指派相关API
 */

export interface DueDiligenceCount {
  /**
   * 已指派数量
   */
  assignCddCount: number
  /**
   * 已完成数量
   */
  finishCddCount: number
  /**
   * 全部数量
   */
  fintCddCount: number
}

export interface FintCddItem {
  /**
   * 完成尽调时间
   */
  completionDate: string
  /**
   * 指派状态，1=临时保存,2=已指派,9=已完成,4=取消指派
   */
  appointStatus: string
  /**
   * 指派人员
   */
  cddUserNames: string

  /**
   * 尽调编号
   */
  businessNo: string
  /**
   * 国家名称
   */
  ctyDesc: string
  /**
   * 企业全称
   */
  orgname: string
  /**
   * 尽调流水号
   */
  refcode: number
}

/**
 * @Author: Longcan.Yang
 * @Date: 2025-09-23 13:59:57
 * @description: 尽调指派分页
 */
export interface FintCddList {
  /**
   * 尽调数据集合
   */
  fintCddList: FintCddItem[]
}
// 指派尽调客户列表
export interface OrgnameList {
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 征信人员名称,默认带入尽调人员
   */
  creditUsers: string
}
// 可选尽调人员数组
export interface OptionalCddUserList {
  /**
   * 尽调人员ID
   */
  cddUserid: string
  /**
   * 尽调人员名称
   */
  cddUserName: string
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 是否参与尽调，0=未参与，1=已参与
   */
  joinCddFlag: string
  /**
   * 尽调人员流水号
   */
  refcode: number
  /**
   * 调查状态，1=待尽调,2=临时保存,3=尽调中,9=已完成
   */
  surveyStatus: string
}

export interface OrgHisTradeList {
  /**
   * 业务流水号
   */
  businessRefcode: number
  /**
   * 业务场景，1=业务准入/2=填报申请书
   */
  businessScene: string
  /**
   * 企业全称
   */
  orgname: string
}

/**
 * 企业信息
 */
export interface OrgInfo {
  /**
   * 是否允许再次尽调【0=不允许，1=允许】
   */
  againCddFlag: string
  /**
   * 征信人员
   */
  creditUsers: string
  /**
   * 协销人员
   */
  assistUsers: string
  /**
   * 发起时间
   */
  applyDate: string
  /**
   * 发起人
   */
  applyUser: string
  /**
   * 指派状态，1=临时保存,2=已指派,9=已完成,4=取消指派
   */
  appointStatus: string
  /**
   * 协销主管
   */
  assistSuperior: string
  /**
   * 尽调编号
   */
  businessNo: string
  /**
   * 主要经营范围
   */
  businessScope: string
  /**
   * 统一社会信用代码/注册号
   */
  companyCreditCode: string
  /**
   * 指派完成时间
   */
  completionDate: string
  /**
   * 国家名称
   */
  ctyDesc: string
  /**
   * 企业所在国家
   */
  ctyid: string
  /**
   * 尽调截至时间
   */
  endDate: string
  /**
   * 联系人名称
   */
  legalLinkman: string
  /**
   * 联系人电话
   */
  legalLinkmanPhone: string
  /**
   * 法人名称
   */
  legalPerson: string
  /**
   * 法人联系电话
   */
  legalPhone: string
  /**
   * 经营地址
   */
  operateAddress: string
  /**
   * 企业全称
   */
  orgname: string
  /**
   * 尽调流水号
   */
  refcode: number
  /**
   * 成立时间
   */
  regDate: string
  /**
   * 尽调任务要求
   */
  remark: string
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-09-23 13:57:48
 * @description: 指派尽调客户信息
 */
export interface DiligenceOrgInfo {
  /**
   * 可选协销人员
   */
  optionalCddUserList: OptionalCddUserList[]
  /**
   * 企业历史交易信息
   */
  orgHisTradeList: OrgHisTradeList[]
  /**
   * 企业信息
   */
  orgInfo: OrgInfo
}

export interface CddUserList {
  /**
   * 尽调人员ID
   */
  cddUserid: string
  /**
   * 尽调人员名称
   */
  cddUserName: string
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 定位纬度
   */
  positionLatitude: string
  /**
   * 定位位置
   */
  positionLocation: string
  /**
   * 定位经度
   */
  positionLongitude: string
  /**
   * 尽调人员流水号
   */
  refcode: number
  /**
   * 调查状态，1=待尽调,2=临时保存,3=尽调中,9=已完成
   */
  surveyStatus: string
  /**
   * 尽调结论
   */
  taskConclusion: string
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-09-23 13:58:12
 * @description: 提交客户尽调指派
 */
export interface AssignDiligenceInfo {
  refcode: number | string

  /**
   * 是否允许再次尽调【0=不允许，1=允许】
   */
  againCddFlag?: string
  /**
   * 征信人员
   */
  creditUsers: string
  /**
   * 协销人员
   */
  assistUsers: string
  /**
   * 指派状态 1=临时保存,2=已指派,9=已完成,4=取消指派
   */
  appointStatus: string
  /**
   * 企业历史交易信息
   */
  orgHisTradeList?: OrgHisTradeList[]
  /**
   * 主要经营范围
   */
  businessScope?: string
  /**
   * 尽调协销人员集合
   */
  cddUserList?: { cddUserid: string }[]
  /**
   * 统一社会信用代码/注册号
   */
  companyCreditCode?: string
  /**
   * 企业所在国家
   */
  ctyid?: string
  /**
   * 企业所在国家描述
   */
  ctyDesc: string
  /**
   * 尽调截至时间
   */
  endDate?: string
  /**
   * 联系人名称
   */
  legalLinkman?: string
  /**
   * 联系人电话
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
   * 企业全称
   */
  orgname: string
  /**
   * 成立时间
   */
  regDate?: string
  /**
   * 尽调任务要求
   */
  remark?: string
  /**
   * 可选尽调人员
   */
  optionalCddUsers?: string
  /**
   * 可选协销人员
   */
  optionalCddUserList?: OptionalCddUserList[]
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-09-23 14:17:37
 * @description: 指派尽调详情查询
 */
export interface DueDiligenceInfo {
  /**
   * 已参与尽调人员
   */
  alreadyJoinCddUserList: OptionalCddUserList[]
  /**
   * 企业历史交易信息
   */
  orgHisTradeList: OrgHisTradeList[]
  /**
   * 企业信息
   */
  orgInfo: OrgInfo
}

/**
 * @Author: Longcan.Yang
 * @Date: 2025-09-23 14:23:28
 * @description: 尽调结果人员信息
 */
export interface ResponseCddUserList {
  /**
   * 尽调人员信息
   */
  cddUserList: CddUserList[]
}

export interface CddTagItem {
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 尽调人员流水号
   */
  cddUserRefcode: number
  /**
   * 是否公共标签，是=1/否=0(Default)
   */
  commonFlag: string
  /**
   * 是否拥有标签，是=1/否=0(Default)
   */
  ownFlag: string
  /**
   * 尽调标签流水号
   */
  refcode: number
  /**
   * 标签名称
   */
  tagName: string
  /**
   * 是否使用标签，是=1/否=0
   */
  useFlag?: string
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-09-23 14:25:59
 * @description: 尽调标签信息查询
 */
export interface CddTagList {
  /**
   * 尽调标签集合
   */
  cddTagList: CddTagItem[]
}

export interface CddApxList {
  /**
   * 文件时长
   */
  fileDuration: number
  /**
   * 文件名称
   */
  fileName: string
  /**
   * 文件类型，1=照片，2=视频，3=音频
   */
  fileType: string
  /**
   * 尽调材料流水号
   */
  refcode: number
  /**
   * 资料备注
   */
  remark: string
  /**
   * 文件UUID
   */
  resourceUuid: string
  /**
   * 附件上传时间
   */
  uploadDate: string
}
export interface FintCddApxList {
  /**
   * 尽调人员ID
   */
  cddUserid: string
  /**
   * 尽调人员名称
   */
  cddUserName: string
  /**
   * 尽调资料集合
   */
  cddApxList: CddApxList[]
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 尽调人员流水号
   */
  refcode: number
  /**
   * 调查状态，1=待尽调,2=临时保存,3=尽调中,9=已完成
   */
  surveyStatus: string
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-09-23 14:28:03
 * @description: 尽调结果查询尽调材料信息
 */
export interface DueDiligenceApx {
  /**
   * 尽调材料集合
   */
  fintCddApxList: FintCddApxList[]
}

export interface OptionalAssistUserItem {
  /**
   * 尽调人员ID
   */
  cddUserid: string
  /**
   * 尽调人员名称
   */
  cddUserName: string
  /**
   * 是否参与尽调，0=未参与，1=已参与
   */
  joinCddFlag: string
}

/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-09 16:28:20
 * @description: 尽调历程
 */
export interface FintCddHistory {
  /**
   * 尽调流水号
   */
  refcode: number
  /**
   * 尽调发起时间
   */
  applyDate: Date
  /**
   * 指派发起人名称
   */
  applyUserName: string
  /**
   * 尽调编号
   */
  businessNo: string
  /**
   * 尽调人员名称，（、拼接）
   */
  cddUserNames: string
  /**
   * 尽调完成时间
   */
  completionDate: Date
}
