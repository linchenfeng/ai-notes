/*
 * @Author       : longcan.Yang
 * @Date         : 2022-10-12 22:42:11
 * @LastEditors  : longcan.Yang
 * @LastEditTime : 2022-10-24 17:32:42
 * @Description  :客户详情资产统计接口返回
 */

/**
 * @Author: longcan.Yang
 * @Date: 2022-10-13 10:08:29
 * @return {*}
 * @description: 近三年数据数组接口返回
 */
export interface DateList {
  /**
   * 年份
   */
  year: number
  /**
   * 笔数
   */
  countTotal: number
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-13 10:08:51
 * @return {*}
 * @description: 资产数据接口返回
 */
export interface FastArpList {
  /**
   * 资产类型
   */
  arpType: string

  /**
   * 近三年数据数组
   */
  dateList: Array<DateList>
  /**
   * 当前资产单据下拉icon的方向
   */
  showPicker?: boolean
  /**
   * 当前资产展示的年份
   */
  selectYear?: number
  /**
   * 当前资产展示的笔数
   */
  selectCount?: number
}

export interface AssetStatistics {
  /**
   * 资产数据信息
   */
  fastArpMVoList: Array<FastArpList>
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-13 10:37:39
 * @return {*}
 * @description: 时间选择器数组
 */
export interface State {
  /**
   * 时间选择器数组
   */
  columns: Array<string>
}
