/*
 * @Author       : may.ruan
 * @Date         : 2023-03-30 13:44:27
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-03-30 13:45:07
 * @Description  : 计算公共类
 */

/**
 * @Author: may.ruan
 * @Date: 2022-10-19 15:38:12
 * @param {number} num 需四舍五入的数
 * @param {*} pos 保留小数点位数，默认2位
 * @return {number} 四舍五入后的数
 * @description: 保留数字的指定位数，四舍五入
 */
export function roundNum(num: number, pos = 2): number {
  const numArr: string[] = num.toString().split('.')
  if (numArr.length === 2) {
    // 获取小数位
    let ts: string = numArr[1]
    if (pos === 0) {
      // 整数
      if (Number(ts.charAt(0)) >= 5) {
        return parseInt(numArr[0]) + 1
      }
      return Number(numArr[0])
    }
    if (ts.length > pos) {
      if (Number(ts.charAt(pos)) >= 5) {
        const result = parseInt(ts.substring(0, pos)) + 1
        if (result.toString().length > pos) {
          return Number(parseInt(numArr[0]) + 1 + '.' + result.toString().substr(1))
        } else if (result.toString().length === pos) {
          return Number(numArr[0] + '.' + result)
        }
        let tss = ''
        for (let i = 0; i < pos - result.toString().length; i++) {
          tss = tss + '0'
        }
        return Number(numArr[0] + '.' + tss + result)
      }
      return Number(numArr[0] + '.' + ts.substring(0, pos))
    }
    while (ts.length < pos) {
      ts += '0'
    }
    return Number(numArr[0] + '.' + ts)
  }
  return num
}
/**
 * @Author: may.ruan
 * @Date: 2022-10-19 15:40:08
 * @param {*} arg1 数值
 * @param {*} operator 加减乘除运算符
 * @param {*} arg2 数值
 * @return {*} 计算后的结果值
 * @description: 解决小数计算精度丢失问题，将小数转换为整数，再进行计算（内部函数）
 */
export function arithmetic(arg1: number, operator: string, arg2: number): number {
  let r1 = 0
  let r2 = 0
  let mul = 0
  let size = 0
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  size = Math.max(r1, r2)
  switch (operator) {
    case '+':
    case '-':
      mul = size
      break
    case '*':
      mul = 2 * size
      break
    case '/':
      mul = 0
      break
    default:
      break
  }
  const num01 = '(' + (arg1 * Math.pow(10, size)).toFixed(0) + ')'
  const num02 = '(' + (arg2 * Math.pow(10, size)).toFixed(0) + ')'
  const Fn = Function
  const f1 = new Fn('return ' + num01 + operator + num02)()
  return f1 / Math.pow(10, mul)
}
/**
 * @Author: may.ruan
 * @Date: 2022-10-19 15:27:51
 * @param {array} argumentList 入参数组最后一位传：加减乘除运算符。 (1.1,...,33.5,+)
 * @return {number} 计算后的结果值
 * @description: 解决小数计算精度丢失问题，将小数转换为整数，再进行计算
 */
export function numMulti(...argumentList: any[]): number {
  let sum = argumentList[0]
  if (argumentList && argumentList.length > 2) {
    for (let i = 1; i < argumentList.length - 1; i++) {
      const operator = argumentList[argumentList.length - 1]
      sum = arithmetic(sum, operator, argumentList[i])
    }
  } else {
    return 0
  }
  return sum
}
