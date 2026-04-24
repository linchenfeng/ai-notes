/*
 * @Author       : may.ruan
 * @Date         : 2022-09-26 13:55:05
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-21 16:12:27
 * @Description  : 数据加解密（AES/Base64/MD5）
 */
import CryptoJS from 'crypto-js/crypto-js'
import { Base64 } from 'js-base64'
import jsmd5 from 'js-md5'
import serverConfig from '@/config/serverConfig'
import { getPlatform } from './uniapp'
/**
 * @Author: may.ruan
 * @Date: 2022-09-26 14:06:01
 * @param {string | number} word 需加密字符或字值
 * @return {string} 加密后的数据
 * @description: 使用aes加密
 */
export function encrypt(word: string | number): string {
  if (!word && word !== 0) {
    return ''
  }
  const key = CryptoJS.enc.Utf8.parse(serverConfig.AES_KEY)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: CryptoJS.enc.Utf8.parse(serverConfig.AES_IV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

/**
 * @Author: may.ruan
 * @Date: 2022-09-26 14:07:57
 * @param {string} word 需解密字符
 * @return {string} 解密后的数据
 * @description: aes解密
 */
export function decrypt(word: string): string {
  if (!word) {
    return ''
  }
  const key = CryptoJS.enc.Utf8.parse(serverConfig.AES_KEY)
  const base64 = CryptoJS.enc.Base64.parse(word)
  const src = CryptoJS.enc.Base64.stringify(base64)
  const decryptData = CryptoJS.AES.decrypt(src, key, {
    iv: CryptoJS.enc.Utf8.parse(serverConfig.AES_IV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decryptData.toString(CryptoJS.enc.Utf8)
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-11 11:07:47
 * @param {string | number} word 加密字符或数值
 * @return {*} 加密后的数据
 * @description: 先使用aes加密，再通过base64编码
 */
export function encodeBase64(word: string | number): string {
  if (!word && word !== 0) {
    return ''
  }
  return Base64.encode(encrypt(word))
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-11 11:07:36
 * @param {string} word  需解密字符
 * @return {*} 解密后的数据
 * @description: 先使用base64解码，再使用ase解密
 */
export function decodeBase64(word: string): string {
  if (!word) {
    return ''
  }
  return decrypt(Base64.decode(word))
}

/**
 * @Author: may.ruan
 * @Date: 2022-10-11 13:45:14
 * @param {string} word 需加解的字符
 * @return {*} md5加密后的数据
 * @description: md5加密
 */
export function md5(word: string | number): string {
  if (!word) {
    return ''
  }
  return jsmd5(word)
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-05-05 09:48:36
 * @param {string} name
 * @return {*}
 * @description: 获取路由传参
 */
export function getUrlParam(name: string) {
  if (getPlatform() !== 'H5') {
    return ''
  }
  // const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  // console.error(window.location.href)
  // const r = window.location.href.substr(1).match(reg)
  const regex = new RegExp(`${name}=([^=&]+)`)
  const result = regex.exec(window.location.href) // 执行正则表达式匹配
  if (result !== null) {
    return result[1]
  }
  return ''
}

/**
 * @Author: may.ruan
 * @Date: 2022-12-06 10:22:45
 * @param {string | number} word 加密字符或数值
 * @return {*} 加密后的数据
 * @description: base64编码
 */
export function encode64(word: string | number): string {
  if (!word && word !== 0) {
    return ''
  }
  return Base64.encode(word.toString())
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-12-15 15:12:50
 * @param {string} word
 * @return {*}
 * @description: base64解码
 */
export function decode64(word: string | number): string {
  if (!word && word !== 0) {
    return ''
  }
  return Base64.decode(word.toString())
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-04-16 16:10:28
 * @param {*} data data:base64图片格式字符串
 * @param {*} fileName 文件名称
 * @description: base64转文件流
 */
export function base64toFile(data: string, fileName: string) {
  const dataArr = data.split(',')
  const byteString = atob(dataArr[1])
  const options = {
    type: 'image/jpeg'
  }
  const u8Arr = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    u8Arr[i] = byteString.charCodeAt(i)
  }
  // const blob = new Blob([u8Arr], { type: options.type });
  // eslint-disable-next-line no-undef
  return new File([u8Arr], fileName + '.jpg', options as FilePropertyBag) //返回文件流
}
