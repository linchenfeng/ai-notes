/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 13:11:21
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-11-24 09:24:22
 * @Description  : 预警解除申请 interface
 */

// 预警解除申请列表数量
export interface WarningCount {
  /**
   * 待处理笔数
   */
  processCount: number
  /**
   * 已退回笔数
   */
  returnedCount: number
  /**
   * 待提交笔数
   */
  saveCount: number
}

/**
 * 预警申请列表项
 */
export interface WarningListItem {
  /**
   * 申请日期
   */
  applyDate: string
  /**
   * 申请编号
   */
  applyNo: string
  /**
   * 申请状态，申请状态[0=保存/1=审批中/2=已退回/3=已通过/4=已拒绝/9=待处理]
   */
  applyStatus: string

  /**
   * 客户经理
   */
  clmUserName: string
  /**
   * 统一社会信用代码
   */
  monitorObjectId: string
  /**
   * 客户名称
   */
  customerName: string
  /**
   * 业务主管
   */
  managerUserName: string
  /**
   * 监控对象
   */
  monitorObjectName: string
  /**
   * 监控对象类型，1=授信主体/2=共借人/3=担保企业/4=担保个人/5=店铺/6=其他
   */
  monitorObjectType: string
  /**
   * 申请流水号
   */
  refcode: number
  /**
   * 解除原因
   */
  remark: string
  /**
   * 任务流水号
   */
  taskRefcode?: number
  /**
   * 风险等级，1=Ⅰ级/2=Ⅱ级/3=Ⅲ级
   */
  warningLevel: string
  /**
   * 预警规则
   */
  ruleName: string
  /**
   * 预警日期
   */
  warningTriggerTime: string
}

/**
 * 附件API
 */
export interface WarningApxInfo {
  /**
   * 附件流水号
   */
  apxRefcode: number
  // /**
  //  * 文件名称
  //  */
  // fileName: string
  // /**
  //  * 文件上传唯一编号
  //  */
  // fileUuid: string
  /**
   * 文件资源唯一编号，文件唯一标识
   */
  resourceUuid: string
}
/**
 * 企业风险信息
 */
export interface QccList {
  /**
   * 变动后内容
   */
  afterValue: string
  /**
   * 变动前内容
   */
  beforeValue: string
  /**
   * 风险级别名称 （企查查定义）
   */
  categoryName: string
  /**
   * 变动内容
   */
  changeContent: string
  /**
   * 变动日期
   */
  changeDate: string
  /**
   * 变动方式名称
   */
  changeWayName: string
  /**
   * 统一社会信用代码
   */
  companyCreditCode?: string
  /**
   * 主分类名称
   */
  mainTypeName: string
  /**
   * 企业名称
   */
  orgname: string
  /**
   * 数据获取时间
   */
  pushDate: string
  /**
   * 子分类名称
   */
  typeName: string
}

// 预警解除信息
export interface WarningAppInfo {
  /**
   * 申请状态，申请状态[0=保存/1=审批中/2=已退回/3=已通过/4=已拒绝/9=待处理]
   */
  applyStatus: string
  /**
   * 申请时间
   */
  applyDate: string
  /**
   * 业务申请编号，保存后有值
   */
  applyNo: string
  /**
   * 申请附件列表
   */
  apxList: WarningApxInfo[]
  /**
   * 企业风险信息
   */
  qccList: QccList[]
  /**
   * 客户经理
   */
  clmUserName: string
  /**
   * 统一社会信用代码
   */
  monitorObjectId: string
  /**
   * 客户名称
   */
  customerName: string
  /**
   * 业务主管
   */
  managerUserName: string
  /**
   * 监控对象
   */
  monitorObjectName: string
  /**
   * 监控对象类型，1=授信主体/2=共借人/3=担保企业/4=担保个人/5=店铺/6=其他
   */
  monitorObjectType: string
  /**
   * 监控对象企业类型[1=中国内地/3=中国香港/5=个人/9=海外地区]
   */
  monitorOrgType: string
  /**
   * 申请流水号
   */
  refcode?: number | string
  /**
   * 风控系统流水号
   */
  serialRefcode: number | string
  /**
   * 解除原因
   */
  remark: string
  /**
   * 风险等级，1=Ⅰ级/2=Ⅱ级/3=Ⅲ级
   */
  warningLevel: string
  /**
   * 预警规则
   */
  ruleName: string
  /**
   * 预警日期
   */
  warningTriggerTime: string
  /**
   *下次预警日期[预警解除钱是否触发规则为4时需要给该字段]
   */
  warningNextLogicTime?: string
  /**
   * 预警解除钱是否触发规则[0=无/1=继续触发/2=不再触发直至预警解除/3=x天内不再触发/4=指定下一次预警时间（等于 4 时 申请提交需要选择下次预警时间）]
   */
  warningNextLogic: string
  /**
   * 申请人id
   */
  applyUser?: string

  /**
   * 申请人名称
   */
  applyUserName?: string,
  /**
   * 发起平台[1=BMS/2=RMS/99=通用]默认传1=BMS
   */
  bizTypes?: string
}

/**
 * 当前任务节点信息
 */
export interface FlowNodeVo {
  /**
   * 审批类型，用于区分审批和批注操作，见枚举值定义
   */
  examineType: string
  /**
   * 节点顺序
   */
  nodeLevel: string
  /**
   * 节点模式，A=角色（未实现）/B=用户/C=业务主管
   */
  nodeMode: string
  /**
   * 节点通过逻辑，O=OR/A=AND（未实现）
   */
  nodePassLogic: string
}

/**
 * 特批申请信息
 *
 * WarningAppInfo
 */
export interface CuWarningAppInfo {
  /**
   * 申请状态，申请状态[0=保存/1=审批中/2=已退回/3=已通过/4=已拒绝/9=待处理]
   */
  applyStatus: string
  /**
   * 申请时间
   */
  applyDate: string
  /**
   * 客户经理
   */
  clmUserName: string
  /**
   * 统一社会信用代码
   */
  monitorObjectId: string
  /**
   * 客户名称
   */
  customerName: string
  /**
   * 业务主管
   */
  managerUserName: string
  /**
   * 监控对象
   */
  monitorObjectName: string
  /**
   * 监控对象类型，1=授信主体/2=共借人/3=担保企业/4=担保个人/5=店铺/6=其他
   */
  monitorObjectType: string
  /**
   * 申请流水号
   */
  refcode: number
  /**
   * 解除原因
   */
  remark: string
  /**
   * 任务流水号
   */
  taskRefcode?: number
  /**
   * 风险等级，1=Ⅰ级/2=Ⅱ级/3=Ⅲ级
   */
  warningLevel: string
  /**
   * 预警规则
   */
  ruleName: string
  /**
   * 预警日期
   */
  warningTriggerTime: string
}

/**
 * 响应体
 */
export interface GetWarningAppInfo {
  /**
   * 申请附件列表
   */
  apxList: WarningApxInfo[]
  /**
   * 当前任务节点信息
   */
  flowNodeVo: FlowNodeVo
  /**
   * 无申请数据，无数据时返回1，有数据时无此属性
   */
  nodata?: string
  /**
   * 企业风险信息
   */
  qccList: QccList[]
  /**
   * 预警解除申请信息
   */
  warningVo: CuWarningAppInfo
}
