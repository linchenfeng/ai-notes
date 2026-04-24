/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-29 10:43:26
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 14:14:04
 * @Description  : 项目申请路由
 */
import acceptCus from './acceptCus' // 受理客户申请
import access from './access' // 申请准入
import application from './application' // 填报申请书
import special from './special' // 特批
import warning from './warning'
import quota from './quota' //申请买方额度
import assist from './assist' //申请协销/征信
import siteDueDiligence from './siteDueDiligence' // 现场尽调
import loanApply from './loanApply' // 申请融资
export default [...acceptCus, ...access, ...application, ...special, ...warning, ...quota, ...assist, ...siteDueDiligence, ...loanApply]
