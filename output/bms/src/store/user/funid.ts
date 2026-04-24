import { defineStore } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/storages'
export const useFunidstore = defineStore('funids', () => {
  // 用户权限ID
  const funids = ref(getStorage('funids') as string)
  /**
   * @Author: may.ruan
   * @Date: 2022-11-21 09:40:29
   * @param {funids} funids 企业用户权限ID
   * @description:设置企业用户权限ID
   */
  function setFunids(funidList: string) {
    funids.value = funidList
    setStorage('funids', funids.value)
  }
  /**
   * @Author: may.ruan
   * @Date: 2022-12-02 14:49:28
   * @description: 清空用户权限ID
   */
  function clearFunids() {
    funids.value = ''
    removeStorage('funids')
  }
  return { funids, setFunids, clearFunids }
})
