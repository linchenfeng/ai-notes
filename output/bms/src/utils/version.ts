/*
 * @Author       : may.ruan
 * @Date         : 2024-11-15 10:00:42
 * @LastEditors  : may.ruan
 * @LastEditTime : 2024-12-24 10:02:24
 * @Description  : 版本管理
 */

import fs from 'fs'

// 本地版本号缓存 key
const storageKey = 'BMS-CURRENT-VERSION'

/**
 * @Author: may.ruan
 * @Date: 2024-11-15 11:04:11
 * @param {string} [path='static/verify.json'] - 服务器上JSON文件的路径，默认为'static/verify.json'。
 * @returns {Promise} - 返回一个Promise对象，成功时解析为JSON数据，失败时抛出错误。
 * @description: 获取版本号
 */
function get(path = 'static/verify.json') {
  // 服务器文件路径
  const url = `${window.location.origin}/${path}?timestamp=${new Date().getTime()}`
  // JS原生请求
  return new Promise((resolve, reject) => {
    // 创建 XMLHttpRequest 对象
    let xhr = null as unknown as XMLHttpRequest
    if (window.XMLHttpRequest) {
      // 现代主流浏览器的写法
      xhr = new XMLHttpRequest()
    } else {
      // IE浏览器的写法
      // eslint-disable-next-line no-undef
      xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    // 创建网络请求对象
    xhr.open('get', url, true)
    // 发送请求
    xhr.send()
    // 请求回调
    xhr.onreadystatechange = () => {
      // 连接成功
      if (xhr.status === 200) {
        // 请求成功
        if (xhr.readyState === 4) {
          // 返回
          resolve(JSON.parse(xhr.responseText))
        }
      } else {
        // 连接失败
        reject(new Error('获取失败'))
      }
    }
  })
}

/**
 * @Author: may.ruan
 * @Date: 2024-11-15 11:06:03
 * @param {string} version - 要检查的新版本号
 * @returns {boolean} 如果有新版本返回 true，否则返回 false
 * @description: 检查是否有新版本可用
 */
function isNewAvailable(version) {
  // 没值（不清楚是否为新版本，默认返回 false, 如果这种情况下需要刷新，可修改返回 true）
  if (!version) {
    return false
  }
  // 获取本地缓存的版本号
  const storageVersion = localStorage.getItem(storageKey)
  // 本地没有版本号，说明本机第一次加载，不算新版本
  if (!storageVersion || storageVersion === 'undefined') {
    return false
  }
  // 本地有版本号，进行对比
  return `${version}` !== `${storageVersion}`
}

// 刷新当前网页
function reload() {
  // 重新加载当前页面，强制浏览器重服务器获取当前页面资源
  window.location.reload()
}

/**
 * @Author: may.ruan
 * @Date: 2024-11-15 10:58:59
 * @param {string} [path='static/verify.json'] - 校验文件的路径
 * @param {number} [version=new Date().getTime()] - 校验文件的版本号，默认为当前时间戳
 * @param {function} [result] - 回调函数，用于返回操作结果
 * @description 在指定目录中创建校验文件校验文件，文件内容为版本号
 */
function create(path = 'src/static/verify.json', version = new Date().getTime(), result?) {
  // 在指定目录中添加校验文件
  fs.writeFile(path, JSON.stringify({ version }), err => {
    const isOK = Boolean(err)
    if (result) {
      result({ isOK })
    }
  })
}

/**
 * @Author: may.ruan
 * @Date: 2024-11-15 11:02:46
 * @param {string} [path='static/verify.json'] - 版本信息文件的路径，默认为'static/verify.json'
 * @param {boolean} [isReload=true] - 如果有新版本，是否重新从服务器加载页面数据，默认为true
 * @returns {Promise<{version: string, new: boolean}>} 返回一个Promise对象，包含版本号和是否有新版本的信息
 * @description: 获取并处理版本信息
 */
function getPro(path = 'static/verify.json', isReload = true) {
  return new Promise((resolve, reject) => {
    // 获取版本号
    get(path)
      .then(res => {
        type T = { version: string }
        // 服务器版本号
        const { version } = res as T
        // 检查是否有新版本
        const isNew = isNewAvailable(version)
        // 缓存版本号
        localStorage.setItem(storageKey, version)
        // 有新版本的话是否重新从服务器加载页面数据
        if (isNew && isReload) {
          reload()
        }
        // 返回
        resolve({ version: version, new: isNew })
      })
      .catch(err => {
        // 返回
        reject(err)
      })
  })
}

// 导出
export default {
  // 创建版本文件
  create,
  // 获取版本号
  get,
  // 获取版本号升级版
  getPro,
  // 检查是否有新版本
  isNewAvailable,
  // 刷新当前页面，强制浏览器重服务器获取当前页面资源
  reload
}
