/*
 * @Author       : may.ruan
 * @Date         : 2022-10-26 15:30:54
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-09 16:03:38
 * @Description  : 权限管理
 */

import { removeStorage } from '@/utils/storages'
import { useUserLoginInfoStore } from '@/store/user/userLoginInfo'
import { useFunidstore } from '@/store/user/funid'
import { storeToRefs } from 'pinia'
import { useFileCenterTokenStore } from '@/store/fileCenter/token'
/**
 * @Author: may.ruan
 * @Date: 2022-10-26 16:08:56
 * @param {string} funid 权限id
 * @return {boolean} 返回是否有权限
 * @description: 根据权限id判断用户是否有权限
 */
export function getHasPermissionsById(funid: string) {
  const userStore = useFunidstore()
  if (!funid) {
    return false
  }
  const values = funid.split(',')
  const funids = userStore.funids
  return values.some(item => funids && funids.split(',').includes(item))
}
/**
 * @Author: may.ruan
 * @Date: 2022-10-27 13:40:00
 * @return {void}
 * @description: 登出清空权限(打标记不再自动登录)
 */
export function logOut(): void {
  const loginStore = useUserLoginInfoStore()
  const userStore = useFunidstore()
  const { userLoginInfo } = storeToRefs(loginStore)
  const fileCenterStore = useFileCenterTokenStore()
  // 退出登录清空token
  fileCenterStore.clearFileCenterToken()
  if (userLoginInfo.value) {
    const { setUserLoginInfo } = loginStore
    userLoginInfo.value.voluntarilyFlag = false
    setUserLoginInfo(userLoginInfo.value)
  }
  const { setFunids } = userStore
  setFunids('')
  removeStorage('funids')
  removeStorage('token')
  removeStorage('activeValue')
}
