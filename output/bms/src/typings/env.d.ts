/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 11:58:21
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2023-12-27 09:43:19
 * @Description  : 环境变量智能提示
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ROOTPATH: string
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_PROT: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  entryUrl: string
}
