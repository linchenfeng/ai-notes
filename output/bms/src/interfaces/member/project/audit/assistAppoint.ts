export interface AppointAssistList {
  /**
   * 指派状态，1=待指派协销/2=待指派征信/9=已指派
   */
  appointStatus: string
  /**
   * 业务大类，[1=国内业务/2=国际业务/3=跨境电商]
   */
  bizScene: string
  /**
   * 准入买方家数
   */
  counterpartyCount: number
  /**
   * 卖方国家描述
   */
  ctyDesc?: string
  /**
   * 卖方国家代码
   */
  orgctyid?: string
  /**
   * 卖方名称
   */
  orgname?: string
  /**
   * 产品类型
   */
  productType: string
  /**
   * 流水号
   */
  refcode: number | string
  /**
   * 状态，[1=待指派/4=已指派]
   */
  status: string
}
export interface AppointCount {
  /**
   * 已指派总数
   */
  assignedCount: number
  /**
   * 待指派总数
   */
  waitCount: number
}
export interface AppointInfo {
  /**
   * 准入流水号
   */
  aplRefcode?: number | string
  /**
   * 申请日期
   */
  applyDate?: string
  /**
   * 申请备注
   */
  applyRemark?: string
  /**
   * 指派日期
   */
  appointDate?: string
  /**
   * 指派状态[1=待指派协销/2=待指派征信/9=已指派]
   */
  appointStatus?: string
  /**
   * 协销主管
   */
  assistSuperior?: string
  /**
   * 协销人员
   */
  assistUsers?: string
  /**
   * 业务大类，[1=国内业务/2=国际业务/3=跨境电商]
   */
  bizScene?: string
  /**
   * 征信主管
   */
  creditSuperior?: string
  /**
   * 征信人员
   */
  creditUsers?: string
  /**
   * 业务申请编号
   */
  financingNo?: string
  /**
   * 卖方国家描述
   */
  ctyDesc: string
  /**
   * 卖方所在国
   */
  orgctyid?: string
  /**
   * 卖方名称
   */
  orgname?: string
  /**
   * 产品类型
   */
  productType?: string
  /**
   * 申请人主管名称
   */
  superiorUserid: string
  /**
   * 客户经理
   */
  clmUserName: string
}
export interface AppointSubmitData {
  /**
   * 协销主管
   */
  assistSuperior: string
  /**
   * 协销人员
   */
  assistUsers?: string
  /**
   * 征信主管
   */
  creditSuperior: string
  /**
   * 征信人员
   */
  creditUsers?: string
  /**
   * 流水号
   */
  refcode: number | string
}
export interface SearchData {
  /**
   * 指派状态，[1=待指派/2=已指派]
   */
  status: string
  /**
   * 卖方名称，模糊搜索
   */
  orgname: string
}
// 定义整个search对象的类型接口
export interface Search {
  data: SearchData
  pageNum: number
  pageSize: number
}
export interface ReAppointSubmitData {
  /**
   * 协销人员
   */
  assistUsers: string
  /**
   * 征信人员
   */
  creditUsers?: string
  /**
   * 流水号
   */
  refcode: number | string
}
export interface RejectData {
  /**
   * 协销流水号
   */
  refcode: number | string
  /**
   * 申请拒绝原因
   */
  refuseReason: string
  /**
   * 申请拒绝人员
   */
  refuseUser: string
}
