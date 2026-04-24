/* eslint-disable  */
/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 13:14:23
 * @LastEditors  : may.ruan
 * @LastEditTime : 2022-10-25 11:08:45
 * @Description  : 为.vue做ts解析适配。解析：https://www.cnblogs.com/eret9616/p/11308470.html
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
