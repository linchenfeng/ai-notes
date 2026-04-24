/*
 * @Author       : Charon.Lin
 * @Date         : 2025-01-13 10:12:12
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-01-13 10:55:33
 * @Description  :自定义指令
 */
import { App } from 'vue'

export function registerDirectives(app: App) {
  const modules = import.meta.globEager('./**/*.ts')

  Object.keys(modules).forEach(fileName => {
    if (fileName === './index.ts') {
      return
    } // 忽略 index.ts 文件
    let directiveName = fileName.replace(/^\.\/(.*)\.\w+$/, '$1') // 提取指令名称
    const directive = modules[fileName].default
    if (typeof directive === 'object' && directive.mounted && directive.updated) {
      // 确保导出的是一个有效的指令
      directiveName = directiveName.replace(/([A-Z])/g, '-$1').toLowerCase()
      app.directive(directiveName, directive)
    }
  })
}
