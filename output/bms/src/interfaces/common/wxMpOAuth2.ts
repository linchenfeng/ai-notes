/*
 * @Author       : oscar.yu
 * @Date         : 2023-1-16 09:12:09
 * @LastEditors: oscar.yu
 * @LastEditTime: 2023-01-16 19:27:10
 * @Description  : 微信公众号授权控制类
 */

/**
 * @Author: oscar.yu
 * @Date: 2022-10-13 10:08:29
 * @return {*}
 * @description: 微信公众号网页授权跳转页面
 */
export interface AuthorizeUrl {
  /**
   * 微信公众号网页授权跳转页面
   */
  authorizeUrl: string
}
/**
 * @Author: oscar.yu
 * @Date: 2022-10-13 10:08:29
 * @return {*}
 * @description: 微信公众号网页授权跳转页面
 */
export interface AccessToken {
  /**
   * 微信用户openId
   */
  openId: string
  /**
   * 微信用户昵称
   */
  nickname: string
}
export interface Signinfo {
  /**
   * 公众号唯一标识
   */
  appId: string
  /**
   * 生成签名的随机串
   */
  nonceStr: string
  /**
   * 签名
   */
  signature: string
  /**
   * 时间戳
   */
  timestamp: string
}
