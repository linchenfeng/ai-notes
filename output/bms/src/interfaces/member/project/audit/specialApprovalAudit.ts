/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-06 17:40:34
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:55:31
 * @Description  : 特批申请审批接口
 */

// 特批申请审批统计数据
export interface SpecialAuditCount {
  /**
   * 待审批笔数
   */
  auditCount: number
  /**
   * 已退回笔数
   */
  returnedCount: number
  /**
   * 已提问笔数
   */
  quizCount: number
  /**
   * 已回复笔数
   */
  replyCount: number
  /**
   * 已处理笔数
   */
  pendingCount: number
}

export interface SaaListItem {
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
  reviewStatus: string
  /**
   * 上级主管代号
   */
  superior: string
  /**
   * 上级主管，对应名称
   */
  superiorName: string
  /**
   * 任务流水号
   */
  taskRefcode: number
  /**
   * 客户经理名称
   */
  userName: string
  /**
   * 当前审批人
   */
  currApprover: string
}

// 审批历程
export interface HistoryList {
  /**
   * 审批意见
   */
  handleReason?: string
  /**
   * 处理结果，【A=拒绝/B=打回/C=通过/D=批注】
   */
  handleResult: string
  /**
   * 审批时间
   */
  handleTime: string
  /**
   * 操作人代号
   */
  handleUserid: string
  /**
   * 操作人名称
   */
  nodeOperatorName: string
  /**
   * 审批描述
   */
  handleDesc: string
  /**
   * 是否自动审批标记【1=自动/0=非自动】
   */
  automaticFlag: string
}

/**
 * AnswerInfo
 */
export interface AnswerInfo {
  /**
   * 答复
   */
  answers: string
  /**
   * 答复时间
   */
  answerTime: Date
  /**
   * 答复人名称
   */
  answerUser: string
  /**
   * 提问流水号
   */
  qusRefcode: number
  /**
   * 流水号
   */
  refcode: number
}
/**
 * 问答列表项
 */
export interface QaListItem {
  /**
   * 答复列表，正向排序
   */
  answerList: AnswerInfo[]
  /**
   * 业务申请流水号
   */
  aplRefcode: number
  /**
   * 问题
   */
  questions: string
  /**
   * 提问时间
   */
  questionTime: Date
  /**
   * 提问人名称
   */
  questionUser: string
  /**
   * 问题流水号
   */
  refcode: number
  /**
   * 特批申请流水号
   */
  saaRefcode: number
}
