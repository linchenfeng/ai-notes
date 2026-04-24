/*
 * @Author       : may.ruan
 * @Date         : 2023-08-11 13:55:47
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-12-19 17:37:55
 * @Description  : uniapp相关方法
 */
/**
 * @Author: may.ruan
 * @Date: 2023-08-11 11:28:06
 * @return {*} https://uniapp.dcloud.net.cn/tutorial/platform.html
 * @description: 获取当前运行环境平台
 */
type Platfrom = 'H5' | 'MP-WEIXIN'
export function getPlatform() {
  let platForm = ''
  // #ifdef H5
  platForm = 'H5'
  // #endif
  // // #ifdef MP-WEIXIN
  platForm = 'MP-WEIXIN' // 微信小程序
  // #endif
  return platForm as Platfrom
}

/**
 * @Author: may.ruan
 * @Date: 2023-08-15 13:05:22
 * @param {string} url 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
 * @description: 关闭当前页面，跳转到应用内的某个页面(路径跳转)
 */
export function redirectTo(url: string): void {
  uni.redirectTo({
    url
  })
}
/**
 * @Author: may.ruan
 * @Date: 2023-11-03 16:18:57
 * @param {string} url 需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'，如果跳转的页面路径是 tabBar 页面则不能带参数
 * @description: 关闭所有页面，打开到应用内的某个页面。
 */
export function reLaunch(url: string): void {
  uni.reLaunch({
    url
  })
}
