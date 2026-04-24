/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 11:35:59
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-08-14 13:52:09
 * @Description  : 初始化minxin
 */
import apiCommon from '@/api/common/api.common'
import { useSystemConfigstore } from '@/store/systemConfig'
import { isEmpty } from '@/utils/validate'
import apiAuthz from '@/api/common/api.authz'
import { getStorage } from '@/utils/storages'
import { useFunidstore } from '@/store/user/funid'
/**
 * @Author: may.ruan
 * @Date: 2022-12-22 10:41:35
 * @param {Function} cb 回调函数
 * @description: 获取系统配置
 */
export function $getServerSystemConfig(cb?: Function) {
  const store = useSystemConfigstore()
  apiCommon.getServerSystemConfig().then(res => {
    const { setSystemConfig } = store
    setSystemConfig(res.data)
    if (cb) {
      cb()
    }
  })
}
/**
 * @Author: charon.lin
 * @Date: 2025-6-23 11:09:58
 * @description: 刷新用户权限
 */
export function $refreshFunids() {
  const token = getStorage('token')
  if (!isEmpty(token)) {
    // 返回 API 调用的 Promise
    return apiAuthz.getFunidList().then(res => {
      const userStore = useFunidstore()
      const { setFunids } = userStore
      setFunids(res.data.funids)
    })
  }
  // 未登录时返回 resolved Promise 保持接口一致性
  return Promise.resolve()
}
