/*
 * @Author       : longcan.Yang
 * @Date         : 2023-02-23 13:06:02
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-08-15 09:51:14
 * @Description  :客户经理存储在localStorage中的登录信息
 */

import { defineStore } from 'pinia'
import { UserLoginInfo } from '@/interfaces/common/userLoginInfo'
import { getStorage, setStorage, removeStorage } from '@/utils/storages'
export const useUserLoginInfoStore = defineStore('userLoginInfo', () => {
  const loaclUserLoginInfo = getStorage('userLoginInfo') as UserLoginInfo
  // 用户信息
  const userLoginInfo = ref<UserLoginInfo>({ ...loaclUserLoginInfo })
  /**
   * @Author: longcan.Yang
   * @Date: 2023-02-23 13:25:45
   * @param {UserLoginInfo} localLoginInfo
   * @return {*}
   * @description: 存储用户登录信息
   */
  function setUserLoginInfo(localLoginInfo: UserLoginInfo) {
    userLoginInfo.value = localLoginInfo
    setStorage('userLoginInfo', userLoginInfo.value)
  }
  /**
   * @Author: longcan.Yang
   * @Date: 2023-02-23 13:33:23
   * @return {*}
   * @description: 清空存储在localStorage中得登录账户信息
   */
  function clearUserLoginInfo() {
    userLoginInfo.value = {} as UserLoginInfo
    removeStorage('userLoginInfo')
  }
  return { userLoginInfo, setUserLoginInfo, clearUserLoginInfo }
})
