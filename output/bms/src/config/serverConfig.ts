/*
 * @Author       : may.ruan
 * @Date         : 2022-09-30 10:08:43
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-31 10:48:48
 * @Description  : 系统配置
 */
import { getPlatform } from '@/utils/uniapp'

export default {
  /**
   * api 前缀地址
   */
  API_BASE_URL: getPlatform() === 'H5' ? '/api-sme' : import.meta.env.VITE_APP_API_URL + '/api-sme',
  /**
   * api请求超时时间，单位（毫秒）
   */
  API_TIME_OUT: 60 * 1000,
  /**
   * 是/否加密
   */
  ENCRYPT: true,
  /**
   * aes key
   */
  AES_KEY: 'bWFsbHB3ZA==WNST',
  /**
   * aes IV
   */
  AES_IV: '1234567890123456'
}
