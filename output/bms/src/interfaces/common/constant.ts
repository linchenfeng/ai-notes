/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 11:23:20
 * @LastEditors  : longcan.Yang
 * @LastEditTime : 2023-08-29 09:27:46
 * @Description  : 字典项接口类
 */
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
// Picker 选择器字典项数组
export interface ConstantArray {
  [index: number]: Array<Constant>
}
