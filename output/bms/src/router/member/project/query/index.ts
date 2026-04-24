/*
 * @Author       : Charon.Lin
 * @Date         : 2025-10-20 11:16:23
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-19 15:33:22
 * @Description  :
 */
import application from './application' // 申请书
import buyerQuota from './buyerQuota' // 买方额度
import dataInsight from './dataInsight' // 数据洞察
import lending from './lending' // 贷中
import meeting from './meeting' // 上会
import access from './access' // 贷前
import special from './special' // 特批
import warning from './warning' // 预警
import preLoan from './preLoan'
import freeze from './freeze' // 额度冻结/解冻查询
import loanApply from './loanApply' // 融资申请查询
import business from './business' // 业务洞察
import performance from './performance' // 业绩过程
import customer from './customer' // 客户盘点
import loan from './loan' // 放款信息
import overdue from './overdue' // 逾期信息
export default [
  ...application,
  ...buyerQuota,
  ...dataInsight,
  ...lending,
  ...meeting,
  ...access,
  ...special,
  ...warning,
  ...preLoan,
  ...freeze,
  ...loanApply,
  ...business,
  ...performance,
  ...customer,
  ...loan,
  ...overdue
]
