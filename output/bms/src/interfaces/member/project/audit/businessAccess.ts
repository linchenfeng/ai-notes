/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:54:16
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-08 13:54:32
 * @Description  : 业务准入
 */
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:09:04
 * @description: 业务准入列表
 */
export interface FintAplMList {
  /**
   * 年度交易金额（元），number(16,4)
   */
  annualTurnover: number
  /**
   * 币种
   */
  ccyid: string
  /**
   * 买方名称
   */
  counterpartyNames: string
  /**
   * 买方数量
   */
  counterpartyCount: number
  /**
   * 买方所在国
   */
  ctyid: string
  /**
   * 业务申请编号
   */
  financingNo: string
  /**
   * 未来年度交易金额（元），number(16,4)
   */
  futureAnnualTurnover?: number
  /**
   * 状态，[1=待准入/2=准入退回/3=已准入/4=已拒绝]
   */
  intLoanStatus: string
  /**
   * 卖方所在国
   */
  orgctyid: string
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 交易品
   */
  productName: string
  /**
   * 已申请状态[1=已申请/2=已提问/3=已回复]
   */
  applyStatus: string
  /**
   * 项目来源
   */
  projectSource: string
  /**
   * 流水号
   */
  refcode: number
  /**
   * 账期（天）
   */
  tenor?: number

  /**
   * 申请日期
   */
  applyDate: string
  /**
   * 申请书填报状态，[0=待填报/1=已填报/2=暂不填报]
   */
  fillingStatus: string
  /**
   * 是否有条件准入[1=是]，申请状态为3=已准入时，返回
   */
  conditionFlag: string
  /**
   * 条件说明，有条件准入时返回
   */
  conditionRemark: string
  /**
   * 业务主管名称
   */
  superiorName: string
  /**
   * 客户经理名称
   */
  userName: string
  /**
   * 卖方所在国描述
   */
  orgctyDesc: string
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:10:05
 * @description: 业务准入列表
 */
export interface FintAplMListData {
  fintAplMList: FintAplMList[]
}

export interface FintAplMVo {
  /**
   * 状态 1：审核中 2：打回补充 3审核通过 4审核未通过
   */
  intLoanStatus: string
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
  annualTurnover: number
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
  futureAnnualTurnover: number
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
  tenor: number
}

export interface FintAplM {
  fintAplMVo: FintAplMVo
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-26 14:04:13
 * @description: 回答列表
 */
export interface AnswerList {
  /**
   * 答复人名称
   */
  answerUser: string
  /**
   * 答复
   */
  answers: string
  /**
   * 答复时间
   */
  answerTime: Date
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-26 14:04:29
 * @description: 问题及回答列表
 */
export interface QaListItem {
  /**
   * 答复列表
   */
  answerList: AnswerList[]
  /**
   * 业务申请流水号
   */
  aplRefcode: number
  /**
   * 提问人名称
   */
  questionUser: string
  /**
   * 问题
   */
  questions: string
  /**
   * 提问时间
   */
  questionTime: Date
  /**
   * 问题流水号
   */
  refcode: number
}

export interface QaListData {
  /**
   * 问答列表
   */
  qaList: QaListItem[]
}

export interface DataCount {
  /**
   * 已申请笔数
   */
  applyCount: number
  /**
   * 已准入笔数
   */
  passCount: number
  /**
   * 待准入笔数
   */
  processCount: number
  /**
   * 待受理笔数
   */
  processAcceptCount: number
  /**
   * 已提问笔数
   */
  quizCount: number
  /**
   * 已拒绝笔数
   */
  rejectCount: number
  /**
   * 已回复笔数
   */
  replyCount: number
  /**
   * 全部笔数
   */
  totalCount: number
  /**
   * 已暂缓笔数
   */
  postponeCount: number
}
export interface AccessCount {
  /**
   * 已申请总数，待审核待准入
   */
  applyCount: number
  /**
   * 已准入总数
   */
  passCount: number
  /**
   * 已提问总数
   */
  quizCount: number
  /**
   * 已拒绝总数
   */
  refuseCount: number
  /**
   * 已回复总数
   */
  replyCount: number
  /**
   * 已提交总数，已审核待准入
   */
  submitCount: number
  /**
   * 暂缓存总数
   */
  postponeCount: number
}
export interface ApproveList {
  /**
   * 审批层级
   */
  handleNodeLevel: number | string
  /**
   * 审批备注
   */
  handleReason: string
  /**
   * 审批状态，A=拒绝/C=通过
   */
  handleResult: string
  /**
   * 审批时间
   */
  handleTime: string
  /**
   * 审批人
   */
  nodeOperatorName: string
}
export interface BaseAplHistoryList {
  /**
   * 买方名称
   */
  counterpartyNames: string
  /**
   * 买方国家
   */
  ctyDesc: string
  /**
   * 节点状态
   */
  nodeStatus: string
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 流水号
   */
  refcode: number
}
export interface QueryBaseAplHistoryList {
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 卖方流水号，如果存在优先使用判断
   */
  orgRefcode?: number | string
  /**
   * 过滤数据业务编号
   */
  financingNo: string
}
