/*
 * @Author       : may.ruan
 * @Date         : 2022-10-17 15:30:06
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-12-05 15:02:31
 * @Description  : 定义公共接口
 */

/*
 * api响应数据接口
 */
export interface ResponseData<T> {
  data: T
  readonly code: number
  readonly msg: string
  readonly totalCount?: number
}
/**
 * 字典项
 */
export interface Constant {
  /**
   * 字典项属性名key
   */
  readonly key: string
  /**
   * 字典项属性值value
   */
  readonly value: string
}
