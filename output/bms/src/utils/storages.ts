/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 14:27:51
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-13 10:55:21
 * @Description  : 管理本地Storage数据
 */
import { encrypt, decrypt } from './crypto'

// Storage前缀
const storagePrefix = `bms-web-uniapp-`
/**
 * @Author: may.ruan
 * @Date: 2022-11-21 14:44:50
 * @param {string} key local键名
 * @return {unknown} 返回对象或字符
 * @description: 通过键名获取缓存值
 */
export function getStorage(key: string): unknown {
  const localStorageKey = encrypt(`${storagePrefix}-${key}`)
  try {
    const value = uni.getStorageSync(localStorageKey)
    if (value) {
      return JSON.parse(decrypt(value))
    }
  } catch (e) {
    // 降级处理：尝试使用 localStorage
    try {
      const value = localStorage.getItem(localStorageKey)
      if (value) {
        return JSON.parse(decrypt(value))
      }
    } catch (localStorageError) {
      // eslint-disable-next-line no-console
      console.error(localStorageError)
    }
  }
}

/**
 * @Author: may.ruan
 * @Date: 2022-11-21 14:47:57
 * @param {string} key local键名
 * @param {unknown} value local值
 * @description: 保存数据到缓存中
 */
export function setStorage(key: string, value: unknown): void {
  const localStorageKey = encrypt(`${storagePrefix}-${key}`)
  try {
    uni.setStorageSync(localStorageKey, encrypt(JSON.stringify(value)))
  } catch (e) {
    // 降级处理：尝试使用 localStorage
    try {
      localStorage.setItem(localStorageKey, encrypt(JSON.stringify(value)))
    } catch (localStorageError) {
      // eslint-disable-next-line no-console
      console.error(localStorageError)
    }
  }
}

/**
 * @Author: may.ruan
 * @Date: 2022-11-21 14:50:10
 * @param {string} key local键名
 * @description: 通过键名删除缓存
 */
export function removeStorage(key: string): void {
  const localStorageKey = encrypt(`${storagePrefix}-${key}`)
  try {
    uni.removeStorageSync(localStorageKey)
  } catch (e) {
    // 降级处理：尝试使用 localStorage
    try {
      localStorage.removeItem(localStorageKey)
    } catch (localStorageError) {
      // eslint-disable-next-line no-console
      console.error(localStorageError)
    }
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-10
 * @param {string} key session键名
 * @return {unknown} 返回对象或字符
 * @description: 通过键名获取session缓存值
 */
export function getSession(key: string): unknown {
  const sessionStorageKey = encrypt(`${storagePrefix}-${key}`)
  try {
    const value = sessionStorage.getItem(sessionStorageKey)
    if (value) {
      return JSON.parse(decrypt(value))
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-10
 * @param {string} key session键名
 * @param {unknown} value session值
 * @description: 保存数据到session缓存中
 */
export function setSession(key: string, value: unknown): void {
  const sessionStorageKey = encrypt(`${storagePrefix}-${key}`)
  try {
    sessionStorage.setItem(sessionStorageKey, encrypt(JSON.stringify(value)))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

/**
 * @Author: Longcan.Yang
 * @Date: 2025-10-10
 * @param {string} key session键名
 * @description: 通过键名删除session缓存
 */
export function removeSession(key: string): void {
  const sessionStorageKey = encrypt(`${storagePrefix}-${key}`)
  try {
    sessionStorage.removeItem(sessionStorageKey)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
