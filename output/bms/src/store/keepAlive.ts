/*
 * @Author       : may.ruan
 * @Date         : 2022-10-27 13:32:32
 * @LastEditors  : may.ruan
 * @LastEditTime : 2022-10-27 15:41:54
 * @Description  : 存储需缓存的页面
 */
import { defineStore } from 'pinia'
export const useKeepAliveStore = defineStore('keepAlives', () => {
  const keepAlives = ref<string[]>([])
  /**
   * @Author: may.ruan
   * @Date: 2022-10-27 15:32:10
   * @param {*} routerName 路由name
   * @description: 添加需缓存的路由页面
   */
  function keepAlivePush(routerName) {
    keepAlives.value.push(routerName)
    keepAlives.value = Array.from(new Set(keepAlives.value))
  }
  /**
   * @Author: may.ruan
   * @Date: 2022-10-27 15:32:51
   * @param {*} routerName 路由name
   * @description: 通过路由name删除页面的缓存设置
   */
  function keepAliveRemove(routerName) {
    keepAlives.value = keepAlives.value.filter(item => {
      return item !== routerName
    })
  }
  /**
   * @Author: may.ruan
   * @Date: 2022-10-27 15:33:30
   * @description: 清空页面缓存设置
   */
  function keepAliveClean() {
    keepAlives.value = []
  }
  return { keepAlives, keepAlivePush, keepAliveRemove, keepAliveClean }
})
