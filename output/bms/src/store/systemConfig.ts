/*
 * @Author       : may.ruan
 * @Date         : 2023-03-27 09:33:06
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-01-02 10:56:14
 * @Description  : 系统配置
 */
import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storages'
import { SystemConfig } from '@/interfaces/common/common'
export const useSystemConfigstore = defineStore('systemConfig', () => {
  const sessionSystemConfig = getStorage('systemConfig') as SystemConfig
  const systemConfig = ref<SystemConfig>({
    ...sessionSystemConfig
  })
  /**
   * @Author: may.ruan
   * @Date: 2023-03-27 09:33:07
   * @param {SystemConfig} systemInfo 系统配置信息
   * @description: 设置系统配置信息
   */
  function setSystemConfig(systemInfo: SystemConfig) {
    if (import.meta.env.DEV) {
      systemInfo.P_WX_OPEN = '0' // 关闭微信公众号授权
    }
    systemConfig.value = systemInfo
    setStorage('systemConfig', systemConfig.value)
  }

  return { systemConfig, setSystemConfig }
})
