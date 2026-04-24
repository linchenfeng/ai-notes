export interface DocumentReviewList {
  /**
   * 业务大类，[1=国内业务/2=国际业务/3=跨境电商]
   */
  bizScene: string
  /**
   * 准入买方家数
   */
  count: number
  /**
   * 申请编号
   */
  dqscNo: string
  /**
   * 复核状态[ 12=待复核/13=复核退回/19=复核通过]
   */
  examineStatus: string
  /**
   * 卖方国家描述
   */
  orgctyDesc: string
  /**
   * 卖方国家代码
   */
  orgctyid: string
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 产品类型
   */
  productType: string
  /**
   * 资料流水号
   */
  refcode: number
}
export interface DocumentReviewCount {
  /**
   * 待复核总数
   */
  reviewCount: number
  /**
   * 已复核总数
   */
  reviewedCount: number
}
/**
 * 资料收集客户上传资料
 */
export interface TaxList {
  /**
   * 资料代号
   */
  fileCode: string
  /**
   * 资料描述
   */
  fileDesc: string
  /**
   * 文件名称
   */
  fileName: string
  /**
   * 文件存储uuid
   */
  fileUuid: string
  /**
   * 上传时间
   */
  uploadDate: string
  /**
   * 买方名称
   */
  counterpartyName?: string
}

export interface PeplenishFileList {
  /**
   * 文件存储UUID
   */
  fileUuid?: string
}
export interface DocumentReviewInfo {
  /**
   * 检查日期
   */
  reviewDate: string
  /**
   * 业务大类，[1=国内业务/2=国际业务/3=跨境电商]
   */
  bizScene?: string
  /**
   * 证照列表
   */
  certList?: TaxList[]
  /**
   * 申请编号
   */
  dqscNo: string
  /**
   * 资料检查状态，[1=收集中/2=审核中/3=已退回/8=已拒绝/9=已通过]
   */
  dqscStatus: string
  /**
   * 内审状态，[
   * 12=待复核/13=复核退回/19=复核通过/
   * 22=待审查/23=审查退回/28=审查拒绝/29=审查通过]
   */
  examineStatus: string
  /**
   * 卖方国家描述
   */
  orgctyDesc?: string
  /**
   * 卖方所在国
   */
  orgctyid?: string
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 核贷书信息
   */
  docFileUuidList?: PeplenishFileList[]
  /**
   * 补充资料信息
   */
  peplenishFileListx?: PeplenishFileList[]
  /**
   * 产品类型
   */
  productType?: string
  /**
   * 流水号
   */
  refcode: number | string
  /**
   * 资料检查审批意见
   */
  examineOpinion?: string
  /**
   * 资料复核审批意见
   */
  reviewOpinion?: string
  /**
   * 申请人主管名称
   */
  assistSuperiorUsers?: string
  /**
   * 财税列表
   */
  taxList?: TaxList[]
  /**
   * 交易历史记录
   */
  tradeHisList?: TaxList[]
  /**
   * 客户经理
   */
  superiorUserid?: string
  /**
   * 业务主管名称
   */
  superiorUsername: string
  /**
   * 客户经理名称
   */
  username: string
}
export interface DocumentReviewSubmitData {
  /**
   * 内审状态，[13=复核退回/19=复核通过]
   */
  examineStatus: string
  /**
   * 流水号
   */
  refcode: number | string
  /**
   * 复核意见
   */
  reviewOpinion?: string
}
export interface SearchData {
  /**
   * 复核状态[1=待复核/2=已复核]
   */
  examineStatus: string
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
export interface FileInfo {
  /**
   * 证照列表
   */
  certList: TaxList[]
  /**
   * 财税列表
   */
  taxList: TaxList[]
  /**
   * 交易历史记录
   */
  tradeHisList: TaxList[]
}
export interface GroupList {
  /**
   * 委员名称
   */
  memberName?: string
  /**
   * 委员审查意见
   */
  reviewRemark?: string
  /**
   * 审查时间
   */
  reviewTime?: string
}
export interface FintMemList {
  /**
   * 条件说明
   */
  conditionRemark?: string
  groupList: GroupList[]
}

export interface PreLoanExamineHistoryList {
  /**
   * 审批意见
   */
  approveRemark?: string
  /**
   * 审批人
   */
  approveUserName?: string
  fintMemList?: FintMemList[]
  /**
   * 审批时间
   */
  lastModDate: string
  /**
   * 审批节点
   */
  metStatus: string
  /**
   * 场景标记，1=标记复核撤回场景
   */
  operationScene?: string
}

export interface ExamineHistoryListObj {
  /**
   * 贷前审查历程列表
   */
  preLoanExamineHistoryList: PreLoanExamineHistoryList[]
}
