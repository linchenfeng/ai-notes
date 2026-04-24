/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-10 16:53:39
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-04 14:11:31
 * @Description  : 现场尽调interface
 */
// 现场尽调列表
export interface FintCddList {
  /**
   * 尽调人员尽调完成时间
   */
  userCompletionDate: string
  /**
   * 尽调编号
   */
  businessNo: string
  /**
   * 尽调人员流水号
   */
  cddUserRefcode: number
  /**
   * 指派人员
   */
  cddUserNames: string
  /**
   * 国家名称
   */
  ctyDesc: string
  /**
   * 尽调截至时间
   */
  endDate: string
  /**
   * 企业全称
   */
  orgname: string
  /**
   * 尽调流水号
   */
  refcode: number
  /**
   * 调查状态，1=待尽调,2=临时保存,3=尽调中,9=已完成
   */
  surveyStatus: string
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-10 16:56:05
 * @description: 现场尽调tab数量
 */
export interface DiligenceCount {
  /**
   * 已完成数量
   */
  finishCddCount: number
  /**
   * 待尽调数量
   */
  waitCddCount: number
  /**
   * 待提交数量
   */
  waitSubmitCddCount: number
}

/**
 * 企业信息
 */
export interface OrgInfo {
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
   * 尽调编号
   */
  businessNo: string
  /**
   * 主要经营范围
   */
  businessScope: string
  /**
   * 尽调主管
   */
  cddSuperior: string
  /**
   * 尽调主管名称
   */
  cddSuperiorName: string
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
   * 可选尽调人员
   */
  optionalCddUsers: string
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
 * @Author: Longcan.Yang
 * @Date: 2025-10-10 16:57:37
 * @description: 现场尽调客户信息详情
 */
export interface CustomerInfo {
  /**
   * 企业历史交易信息
   */
  orgHisTradeList: OrgHisTradeList[]
  /**
   * 企业信息
   */
  orgInfo: OrgInfo
}

export interface CddApxList {
  checked?: string[]
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 尽调标签流水号
   */
  cddTagRefcode: number
  /**
   * 尽调人员流水号
   */
  cddUserRefcode: number
  /**
   * 文件时长(毫秒)
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
   * 备注
   */
  remark: string
  /**
   * 文件UUID，hash值
   */
  resourceUuid: string
  /**
   * 附件上传时间
   */
  uploadDate: string
}

export interface CddUserApxList {
  /**
   * 尽调材料集合
   */
  cddApxList: CddApxList[]
  /**
   * 文件类型，1=照片，2=视频，3=音频
   */
  fileType: string
}

export interface CddInfo {
  /**
   * 指派状态，1=临时保存,2=已指派,9=已完成,4=取消指派
   */
  appointStatus?: string
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 用户尽调附件集合
   */
  cddUserApxList: CddUserApxList[]
  /**
   * 尽调人员
   */
  cddUserid: string
  /**
   * 尽调人员名称
   */
  cddUserName: string
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
 * @Date: 2025-10-10 16:59:10
 * @description: 用户现场尽调详情接口
 */
export interface UserCddInfo {
  userCddInfo: CddInfo
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-10 17:03:42
 * @description: 现场尽调保存
 */
export interface SaveCddInfo {
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 尽调人员
   */
  cddUserid: string
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
   * 尽调用户流水号
   */
  refcode: number
  /**
   * 尽调结论
   */
  taskConclusion: string
}

export interface CddUserApxsList {
  /**
   * 尽调材料集合
   */
  cddApxList: CddApxList[]
  /**
   * 尽调材料上传时间，yyyy-MM-dd
   */
  uploadDate: string
  /**
   * 是否全选
   */
  checkedAll: string[]
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-10 17:07:28
 * @description: 现场尽调信息更多查询
 */
export interface CddApxInfo {
  /**
   * 尽调流水号
   */
  cddRefcode: string
  /**
   * 用户尽调材料集合
   */
  cddUserApxList: CddUserApxsList[]
  /**
   * 尽调人员
   */
  cddUserid: string
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
 * @Date: 2025-10-10 17:09:19
 * @description: 查询用户全部尽调材料信息
 */
export interface FintCddApxList {
  /**
   * 尽调材料集合
   */
  cddApxList: CddApxList[]
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 尽调人员
   */
  cddUserid: string
  /**
   * 尽调人员名称
   */
  cddUserName: string
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
 * @Date: 2025-10-10 17:11:28
 * @description: 尽调材料添加标签
 */
export interface AddCddTag {
  /**
   * 尽调材料流水号集合
   */
  cddApxRefcodeList: number[]
  /**
   * 尽调标签流水号
   */
  cddTagRefcode: number
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-10 17:13:17
 * @description: 尽调材料保存
 */
export interface doSaveCddApx {
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 尽调人员流水号
   */
  cddUserRefcode: number
  /**
   * 文件时长(毫秒)
   */
  fileDuration: string
  /**
   * 文件名称
   */
  fileName: string
  /**
   * 文件后缀
   */
  fileSuffix: string
  /**
   * 文件类型，1=照片，2=视频，3=音频
   */
  fileType: string
  /**
   * 备注
   */
  remark: string
  /**
   * 文件UUID，hash值
   */
  resourceUuid: string
  /**
   * 附件上传时间
   */
  uploadDate: string
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-10 17:23:59
 * @description: 新增标签
 */
export interface SaveCddTag {
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 尽调人员流水号
   */
  cddUserRefcode: number
  /**
   * 标签名称
   */
  tagName: string
}
