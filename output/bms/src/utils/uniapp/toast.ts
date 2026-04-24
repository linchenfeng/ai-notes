/*
 * @Author       : may.ruan
 * @Date         : 2023-08-11 10:39:51
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-04 16:06:45
 * @Description  : toast提示框
 */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * @Author: may.ruan
 * @Date: 2023-08-11 10:25:39
 * @param {string} content 提示的内容
 * @param {Function} confirmFun 用户点击了确定按钮
 * @param {Function} cancelFun 用户点击了取消
 * @param {*} title 提示的标题,默认：温馨提示，可不传
 * @description: 显示模态对话框
 */

export function showModal(content: string, options = {}) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '温馨提示',
      content: content,
      ...options,
      success(res) {
        if (res.confirm) {
          resolve(res)
        } else if (res.cancel) {
          reject()
        }
      }
    })
  })
}
/**
 * @Author: may.ruan
 * @Date: 2023-08-11 09:46:37
 * @description: 隐藏消息提示框
 */
export function hideToast() {
  uni.hideToast()
}
/**
 * @Author: may.ruan
 * @Date: 2023-08-11 09:25:39
 * @param {string} title 提示的内容
 * @param {*} duration 提示的延迟时间,0则不会关闭
 * @description: 显示消息提示框
 */
export function showToast(title: string, cb?: Function, duration = 4000) {
  hideToast()
  uni.showToast({
    title, // 提示的内容，长度与 icon 取值有关。
    icon: 'none', // 图标，添加图标后，只能显示7个汉字，所以默认都不加
    // mask: true, // 显示透明蒙层，防止触摸穿透
    duration // 提示的延迟时间，单位毫秒
  })
  if (cb) {
    setTimeout(() => {
      cb()
    }, duration / 2)
  }
}

/**
 * @Author: may.ruan
 * @Date: 2023-02-09 18:04:49
 * @description: 关闭 loading 提示框
 */
export function hideLoading() {
  uni.hideLoading()
}

/**
 * @Author: may.ruan
 * @Date: 2023-02-09 18:03:47
 * @param {*} title 提示的内容
 * @description: 显示 loading 提示框
 */
export function showLoading(title = '加载中...', mask = true) {
  hideLoading()
  uni.showLoading({
    title,
    mask
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-01-09 11:01:26
 * @param {*} options
 * @return {*} 返回Promise对象
 * @description: 创建loading实例
 */
export function webLoading(text?: string, options = {}) {
  try {
    // 配置参数
    return import('@/static/libary/webloading').then(() => {
      // eslint-disable-next-line no-extra-parens
      return (window as any).initLoading({
        extendClass: 'vteam-loading',
        type: 'mini',
        text: text || '加载中...',
        themeColor: '#fff',
        bgColor: '#111111b3',
        ...options
      })
    })
  } catch (error) {
    throw error
  }
}
