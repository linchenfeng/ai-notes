/*
 * @Author       : may.ruan
 * @Date         : 2022-12-02 17:08:48
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-05 13:26:50
 * @Description  : 校验工具类
 */

/**
 * @Author: may.ruan
 * @Date: 2022-12-02 17:11:28
 * @param {string} mobile 手机号码
 * @return {*} 返回格式是否
 * @description: 检查手机号码格式
 */
export function checkMobile(mobile: string): boolean {
  if (!mobile) {
    return false
  }
  const mobileReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/
  if (!mobileReg.test(mobile)) {
    return false
  }
  return true
}
/**
 * @Author: may.ruan
 * @Date: 2022-12-05 13:59:39
 * @param {string} email 电子邮件
 * @return {*} 返回格式是否
 * @description: 检查电子邮件格式
 */
export function checkEmail(email: string): boolean {
  if (!email) {
    return false
  }
  const emailReg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
  if (!emailReg.test(email)) {
    return false
  }
  return true
}
/**
 * @Author: may.ruan
 * @Date: 2022-12-05 14:00:05
 * @param {string} pwd 密码
 * @return {*} 返回格式是否
 * @description: 检查密码格式（密码包含字母、数字、且长度8-20位）
 */
export function checkPassword(pwd: string): boolean {
  if (!pwd) {
    return false
  }

  /* const passwordReg =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~!@#￥$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#%……&*（）——\-+={}|《》？：“”【】、；‘'，。、＋－]).{8,20}$/ */

  // const passwordReg = /((?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*\$\.]))[a-z\d#@!~%^&*\$\.]{8,20}/i
  const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
  if (!passwordReg.test(pwd)) {
    return false
  }
  return true
}

/**
 * @Author: may.ruan
 * @Date: 2022-12-13 14:00:05
 * @param {string} value 身份证号
 * @return {*} 返回格式是否
 * @description: 检查身份证号码格式
 */
export function checkIDCard(value: string): boolean {
  const aCity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    81: '香港',
    82: '澳门',
    83: '台湾',
    91: '国外'
  }
  let iSum = 0
  let sId = value

  if (!/^\d{17}(\d|x)$/i.test(sId)) {
    return false
  }
  sId = sId.replace(/x$/i, 'a')
  // 非法地区
  if (aCity[parseInt(sId.substr(0, 2), 10)] === null) {
    return false
  }
  const sBirthday = sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) + '-' + Number(sId.substr(12, 2))
  const d = new Date(sBirthday.replace(/-/g, '/'))
  // 非法生日
  if (sBirthday !== d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()) {
    return false
  }
  for (let i = 17; i >= 0; i--) {
    const pow = Math.pow(2, i) % 11
    iSum += pow * parseInt(sId.charAt(17 - i), 11)
  }
  if (iSum % 11 !== 1) {
    return false
  }
  return true
}

/**
 * @Author: may.ruan
 * @Date: 2025-01-08 09:56:42
 * @param value - 需要判断的值，可以是任意类型
 * @returns {boolean} 如果值为空返回 true，否则返回 false
 * @description：支持检查以下类型:
 * - null、undefined、空字符串返回 true
 * - 字符串: 去除首尾空格后长度为 0 返回 true
 * - 数字: NaN 返回 true
 * - 数组: 长度为 0 返回 true
 * - 日期: 无效日期返回 true
 * - 对象: 没有自身属性返回 true
 * - 其他情况: 值为假返回 true
 */
export function isEmpty(value: unknown): boolean {
  // eslint-disable-next-line no-undefined
  if (value === null || value === undefined || value === '') {
    return true
  }
  if (typeof value === 'string') {
    return value.trim().length === 0
  }
  if (typeof value === 'number') {
    return isNaN(value)
  }
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      // 判断空数组
      return value.length === 0
    }
    // 判断无效日期或为空日期
    if (value instanceof Date) {
      return isNaN(value.getTime())
    }
    // 判断空对象
    return Object.keys(value).length === 0
  }
  return !value
}

/**
 * @Author: zezhou.xiong
 * @Date: 2025-01-16 09:49:13
 * @param {*} value 要检查的值，可以是任意类型
 * @return {*} 如果值为空，则返回 true；否则返回 false。
 * @description: 检查给定值是否非空
 */
export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value)
}
//校验字符串是否只包含英文字母||英文字符串||数字
export function checkStringIsEn(value: string): boolean {
  if (!value) {
    return false
  }
  const regex = /^[a-zA-Z0-9`~!@#$%^&*()_\-+=\[\]{}|;:'",.<>?\/\\ ]+$/
  return regex.test(value)
}
//找出所有非英文字母||英文字符串||数字的字符
export function findInvalidChars(value: string): string {
  if (!value) {
    return ''
  }
  // 定义正则表达式规则
  const regex = /^[a-zA-Z0-9`~!@#$%^&*()_\-+=\[\]{}|;:'",.<>?\/\\ ]+$/
  // 拆分字符串为单个字符并处理
  const formattedParts = value.split('').map(char => {
    // 检查字符是否符合正则规则
    if (regex.test(char)) {
      return `<span>${char}</span>`
    }
    return `<span class="error">${char}</span>`
  })
  // 组合所有部分并返回
  return `<span>${formattedParts.join('')}</span>`
}
/**
 * 仅在逗号前后都是字母、中文或数字时进行分割
 * 兼容 iOS 设备，使用字符遍历实现
 * @param input - 要分割的字符串
 * @returns 分割后的字符串数组
 */
export function splitByKeywords(input: string, keywords = '||'): string[] {
  // 处理空输入
  if (isEmpty(input)) {
    return []
  }
  return input.split(keywords)
}
