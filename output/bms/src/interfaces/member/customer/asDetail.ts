/*
 * @Author       : ran.zhu
 * @Date         : 2022-10-14 17:33:09
 * @LastEditors  : longcan.Yang
 * @LastEditTime : 2022-10-31 18:01:27
 * @Description  : 资产统计详情数据
 */

interface ASFastArpMVoList {
  /**
   * 客户名称名称
   */
  orgname

  /**
   * 交易对手名称
   */
  payOrgname: string
  /**
   * 单据金额
   */
  payAmt: number

  /**
   * 单据编号
   */
  arpNo: string

  /**
   * 单据日期
   */
  drawDate: string
}
export interface ASDetailModel {
  /**
   * 列表数据
   */
  fastArpMVoList: Array<ASFastArpMVoList>
}
