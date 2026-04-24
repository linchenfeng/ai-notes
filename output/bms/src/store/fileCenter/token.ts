/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-09 13:40:54
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-13 09:47:01
 * @Description  : 获取文件上传token，无感刷新
 */

import { defineStore } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/storages'
// import apiCommon from '@/api/common/api.common'
export const useFileCenterTokenStore = defineStore('fileCenterToken', () => {
  const fileCenterToken = ref(getStorage('fileCenterToken') || '')
  let refreshTimer: any = null
  /**
   * 设置 token 和过期时间
   */
  function setFileCenterToken(newToken: string) {
    fileCenterToken.value = newToken
    setStorage('fileCenterToken', newToken)
    // 设置定时刷新
    // eslint-disable-next-line no-use-before-define
    // setupAutoRefresh()
  }

  /**
   * 获取文件中心 token
   */
  async function getFileCenterToken() {
    try {
      const { default: apiCommon } = await import('@/api/common/api.common')
      const result = await apiCommon.getToken()
      const minIOTokenVo = result.data.minIOTokenVo
      setFileCenterToken(minIOTokenVo.accessToken)
      return minIOTokenVo.accessToken
    } catch (error) {
      throw error
    }
  }

  /**
   * 设置自动刷新定时器
   */
  // function setupAutoRefresh() {
  //   // 清除之前的定时器
  //   if (refreshTimer) {
  //     clearTimeout(refreshTimer)
  //     refreshTimer = null
  //   }
  //   // 10分钟后重新刷新token
  //   refreshTimer = setTimeout(async () => {
  //     try {
  //       getFileCenterToken()
  //     } catch (error) {
  //       // 如果刷新失败，1分钟后重试
  //       refreshTimer = setTimeout(() => {
  //         getFileCenterToken()
  //       }, 60 * 1000)
  //     }
  //   }, 10 * 60 * 1000)
  // }

  /**
   * 清除 token
   */
  function clearFileCenterToken() {
    fileCenterToken.value = ''
    removeStorage('fileCenterToken')
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  }

  return {
    fileCenterToken,
    setFileCenterToken,
    getFileCenterToken,
    clearFileCenterToken
  }
})
