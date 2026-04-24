/*
 * @Author       : may.ruan
 * @Date         : 2022-10-17 17:33:40
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-21 14:43:51
 * @Description  : 格式化公共方法 金额/日期/利率/银行卡等
 */
import dayjs from 'dayjs'
import { roundNum } from './math'
import { isEmpty } from './validate'
import { arithmetic } from '@/utils/math'
/**
 * @Author: may.ruan
 * @Date: 2022-10-19 16:05:11
 * @param {number} money 金额
 *  * @param {number} len 长度
 * @return {string} 格式化的金额，例：50,000.00
 * @description: 金额格式化
 */
export const moneyFormat = function (value: number | string, len = 2): string {
  // 处理len的边界情况：确保为非负整数
  const validLen = Math.max(0, Math.floor(Number(len) || 0))
  // 处理空值（如空字符串、仅空格的字符串等）
  if (isEmpty(value)) {
    const floatPart = validLen === 0 ? '' : '.' + Array(validLen).fill(0).join('')
    return '0' + floatPart
  }
  // 转换输入为数字，声明时直接初始化
  const numValue: number = typeof value === 'string' ? parseFloat(value.replace(/,/g, '').trim()) : value
  // 处理无效数字（转换失败或NaN）
  if (isNaN(numValue)) {
    const floatPart = validLen === 0 ? '' : '.' + Array(validLen).fill(0).join('')
    return '0' + floatPart
  }
  // 四舍五入保留有效小数位
  const roundedValue = roundNum(numValue, validLen)
  const [intPart, floatPartRaw] = roundedValue.toString().split('.')
  // 整数部分添加千位分隔符
  const intPartFormatted = intPart.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  // 处理小数部分
  let floatPart = ''
  if (validLen > 0) {
    const floatPartTruncated = (floatPartRaw || '').substring(0, validLen)
    const zeroFillCount = validLen - floatPartTruncated.length
    const zeroFill = zeroFillCount > 0 ? Array(zeroFillCount).fill(0).join('') : ''
    floatPart = `.${floatPartTruncated}${zeroFill}`
  }
  return intPartFormatted + floatPart
}
/**
 * 万元转化
 */
export const thousandMoneyFormat = function (val: number | string, len = 2): string {
  if (!isEmpty(val)) {
    return moneyFormat(arithmetic(Number(val), '/', 10000))
  }
  return moneyFormat(val, len)
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-17 17:45:18
 * @param {string | Date | number} date 日期（字符串、日期、时间戳）
 * @param {number} type 格式化的类型 1.YYYY-MM-DD、default.YYYY-MM-DD HH:mm:ss
 * @return {string} 格式化日期字符串
 * @description: 格式化日期格式，支持字符串、日期、时间戳
 */
export function dateFormat(date: string | Date | number, type = 1): string {
  if (!date) {
    return ''
  }
  switch (type) {
    case 1:
      return dayjs(date).format('YYYY-MM-DD')
    case 2:
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    default:
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
}
/**
 * @Author: may.ruan
 * @Date: 2022-10-17 17:48:55
 * @param {number} rate
 * @param {*} len
 * @return {number}
 * @description: 格式化利率
 */
export function rateFormat(rate: number, len = 4): number {
  if (!rate) {
    return 0
  }
  if (!isNaN(rate)) {
    if (Math.floor(rate) !== rate) {
      const str = rate.toString()
      const num = `${str.split('.')[0]}.${str.split('.')[1].slice(0, len)}`
      return Number(num)
    }
  }
  return rate
}
/**
 * @Author: may.ruan
 * @Date: 2022-10-19 16:09:50
 * @param {string} bank 银行号
 * @return {string} 格式化银行卡号
 * @description: 格式化银行卡号,(4位一个空格) 如：5423 2342 1623 2142
 */
export function bankCardFormat(bank: string): string {
  if (bank) {
    return bank.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  return bank
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-19 16:10:27
 * @param {string} mobile 手机号码
 * @return {string} 脱敏后手机号码
 * @description: 手机号码中间4位加****
 */
export function encryptMobile(mobile: string): string {
  const str = mobile.toString()
  if (!str) {
    return ''
  }
  if (str.length !== 11) {
    return ''
  }
  return str.substr(0, 3) + '****' + str.substr(7)
}

/**
 * @Author: FangFang.Wu
 * @Date: 2023-02-15 16:13:32
 * @param {object} data 待处理数据对象
 * @description: 去字符串两端空格
 */
export function trimFormat(data: object): object {
  for (const field in data) {
    if (typeof data[field] === 'string') {
      data[field] = data[field].trim()
    }
    if (typeof data[field] === 'object') {
      trimFormat(data[field])
    }
  }
  return data
}
