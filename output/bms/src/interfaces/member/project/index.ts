/*
 * @Author       : jacky.cai
 * @Date         : 2022-10-13 16:22:12
 * @LastEditors  : jacky.cai
 * @LastEditTime : 2022-10-24 14:40:56
 * @Description  :项目列表 年 数目 bean
 */
export interface ProjectYearSumInfo {
  /**
   * 年度
   */
  year: string
  /**
   *笔数
   */
  countTotal: number
}

/*
 * @Author       : jacky.cai
 * @Date         : 2022-10-13 16:22:12
 * @LastEditors  : jacky.cai
 * @LastEditTime : 2022-10-24 14:37:14
 * @Description  :项目列表item
 */
export interface Project {
  /**
   * 客户流水号
   */
  refcode: number
  /**
   *客户名称
   */
  orgname: string
  /**
   *客户简称
   */
  abbreviation: string
  /**
   *交易对手名称
   */
  buyerName: string

  year?: string
  /**
   *界面上默认显示的笔数
   */
  total?: number
  /**
   *近三年数据
   */
  dateList: Array<ProjectYearSumInfo>
}

export interface ProjectProgressInfo {
  /**
   * 融资申请
   */
  financingTotal: number
  /**
   *运营审核
   */
  operationAuditTotal: number
  /**
   * 财务审核
   */
  financialAuditTotal: number
  /**
   * 财务放款
   */
  financialLoanTotal: number
}

/*
 * @Author       : jacky.cai
 * @Date         : 2022-10-13 16:22:12
 * @LastEditors  : jacky.cai
 * @LastEditTime : 2022-10-24 14:37:14
 * @Description  :项目列表
 */
export interface ProjectList {
  /**
   *项目列表
   */
  floaArpMVoList: Array<Project>
}
