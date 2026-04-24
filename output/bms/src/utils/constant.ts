/*
 * @Author       : may.ruan
 * @Date         : 2022-10-17 14:26:51
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-04 13:54:08
 * @Description  : 字典项处理
 */
import constantData from '@/config/constant'
import distpickerData from '@/config/distpicker.data'
import { Constant } from '@/interfaces/root'
// 定义字典项默认值
const defaultConstant: Constant = {
  key: '',
  value: ''
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-17 15:38:27
 * @param {string} constant 字典项名
 * @return {Array} 字典List
 * @description: 根据字典项名获取字典数据对象
 */
export function getConstant(constant: string): Array<Constant> {
  if (!constant) {
    return []
  }
  return constantData[constant] || []
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-17 16:16:34
 * @param {string} key 字典项属性名Key
 * @param {string} constant 字典项名
 * @return {object} 字典项对象
 * @description: 根据字典项属性名获取字典项对象
 */
export function getConstantByKey(key: string, constant: string): Constant {
  if (!constant || !key) {
    return defaultConstant
  }
  return getConstant(constant).find(item => {
    return item.key === key
  }) as Constant
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-17 16:17:26
 * @param {string} key 字典项属性名Key
 * @param {string} constant 字典项名
 * @return {string} 字典项属性值
 * @description: 根据字典项属性名和字典项名获取字典项属性值
 */
export function getValueByKey(key: string | undefined, constant: string): string {
  if (!constant || !key) {
    return ''
  }
  const values: string[] = []
  getConstant(constant).forEach(item => {
    if (key.split(',').includes(item.key)) {
      values.push(item.value)
    }
  })
  return values.join(',')
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-18 16:31:46
 * @param {string} code 省市区编号
 * @param {number} type 返回类型：1.省市区、2.省市、3.市区、4.省、5.市、6.区
 * @return {string} 省市区
 * @description: 根据编号及类型返回省市区
 */
export function getInareaByCode(code: string, type = 1): string {
  if (!code || code.length !== 6) {
    return ''
  }
  const DISTRICTS = distpickerData['86']
  const codeList = ['110000', '120000', '500000', '310000'] // 直辖市
  const province = code.slice(0, 2) + '0000' // 省
  const city = code.slice(0, 4) + '00' // 市
  let inarea: string[] = []
  // 省
  if (DISTRICTS[province]) {
    inarea.push(DISTRICTS[province])
  }
  // 市
  if (distpickerData[province][city]) {
    if (!codeList.includes(province)) {
      inarea.push(distpickerData[province][city])
    } else {
      inarea.push(DISTRICTS[province])
    }
  }
  // 区
  if (distpickerData[city] && distpickerData[city][code]) {
    inarea.push(distpickerData[city][code])
  }
  //排除直辖市
  if (codeList.includes(province)) {
    inarea = inarea.slice(1)
  }
  switch (type) {
    //省市区
    case 1:
      break
    //省市
    case 2:
      inarea = inarea.slice(0, 2)
      break
    //市区
    case 3:
      inarea = inarea.slice(inarea.length - 2)
      break
    //省
    case 4:
      inarea = inarea.slice(0, 1)
      break
    //市
    case 5:
      inarea = inarea.slice(inarea.length - 2, inarea.length - 1)
      break
    // 区
    case 6:
      inarea = inarea.slice(inarea.length - 1)
      break
    default:
      break
  }
  return inarea.join('')
}
