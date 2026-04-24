/*
 * @Author       : Charon.Lin
 * @Date         : 2025-01-24 14:41:55
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-05-14 18:54:14
 * @Description  : 自定义组件
 */
import { App } from 'vue'
// 手动导入所有需要的组件
import bubblePopup from '../plugins/bubblePopup/index.vue'
import infoCard from '../plugins/infoCard/index.vue'
import tabs from '../plugins/tabs/index.vue'
import swipeAction from '../plugins/swipeAction/index.vue'
// import form from '../plugins/form/index.vue'
import textFolding from '../plugins/textFolding/index.vue'
import popTextArea from '../plugins/popTextArea/index.vue'
import tooltip from '../plugins/tooltip/index.vue'
// 这里需要根据实际情况添加更多的组件导入语句

// 存储所有手动导入的组件
const componentMap = {
  '../plugins/bubblePopup/index.vue': bubblePopup,
  '../plugins/infoCard/index.vue': infoCard,
  '../plugins/tabs/index.vue': tabs,
  '../plugins/swipeAction/index.vue': swipeAction,
  // '../plugins/form/index.vue': form,
  '../plugins/textFolding/index.vue': textFolding,
  '../plugins/popTextArea/index.vue': popTextArea,
  '../plugins/tooltip/index.vue': tooltip
  // 这里需要根据实际情况添加更多的组件映射
}

export function registerGlobalComponents(app: App) {
  for (const path in componentMap) {
    const componentConfig = { default: componentMap[path] }
    const parts = path.split('/')
    const componentNameList = parts.slice(parts.indexOf('plugins') + 1, -1)
    // 取最后一个componentNameList
    let componentName = componentNameList[componentNameList.length - 1]
    componentName = 'ty-' + componentName.replace(/([A-Z])/g, '-$1').toLowerCase()
    app.component(componentName, componentConfig.default)
  }
}
