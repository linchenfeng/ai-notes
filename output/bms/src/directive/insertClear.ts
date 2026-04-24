/*
 * @Author       : Charon.Lin
 * @Date         : 2025-01-13 10:18:28
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-02-08 13:24:21
 * @Description  : 自定义插入clear指令
 */
import { Directive } from 'vue'
import { createVNode, render } from 'vue'

// 创建清除图标及相关操作的函数
const creatClear = (el, binding) => {
  // 查找具有类名 u-input__content 的元素
  const inputContent = el.querySelector('.u-input__content__field-wrapper')
  if (inputContent) {
    const iconFontBox = createVNode(
      'text',
      {
        class: 'iconfont icon-guanbi2',
        style: {
          marginRight: '5px',
          display: 'none'
        },
        // 点击事件处理函数
        onClick: event => {
          // 如果绑定的值是一个函数，触发该函数并传递事件对象
          if (typeof binding.value === 'function') {
            binding.value(event)
          }
        }
      },
      null
    )
    // 将 iconFontBox 插入到 inputContent 的末尾
    const container = document.createElement('div')
    render(iconFontBox, container)
    inputContent.appendChild(container.firstChild)
  }
  // 查找u-search__content 的元素
  const searchContent = el.querySelector('.u-search__content')
  if (searchContent) {
    const iconFontBox = createVNode(
      'text',
      {
        class: 'iconfont icon-guanbi2',
        style: {
          marginRight: '5px',
          display: 'none'
        },
        // 点击事件处理函数
        onClick: event => {
          // 如果绑定的值是一个函数，触发该函数并传递事件对象
          if (typeof binding.value === 'function') {
            binding.value(event)
          }
        }
      },
      null
    )
    // 将 iconFontBox 插入到 inputContent 的末尾
    const container = document.createElement('div')
    render(iconFontBox, container)
    searchContent.appendChild(container.firstChild)
  }
}

const insertClear: Directive = {
  // 元素挂载时调用的钩子函数
  mounted(el, binding) {
    // 调用 creatClear 函数进行初始化操作
    creatClear(el, binding)
    // 可以添加自定义指令的其他逻辑
  },
  // 元素更新时调用的钩子函数
  updated(el, binding) {
    // 根据 binding.arg 的值确定是否显示清除图标，将 '0' 也视为显示
    const showClear = binding.arg || binding.arg === '0'
    // 查找具有类名 u-input__content__field-wrapper 的元素
    const inputContent = el.querySelector('.u-input__content__field-wrapper')
    if (inputContent) {
      // 查找具有类名 icon-guanbi2 的元素
      const iconFontBox = inputContent.querySelector('.icon-guanbi2')
      if (iconFontBox) {
        // 根据 showClear 的值设置 iconFontBox 的显示或隐藏
        if (showClear) {
          iconFontBox.style.display = 'flex'
          iconFontBox.style.alignItems = 'center'
        } else {
          iconFontBox.style.display = 'none'
        }
      }
    }
    const searchContent = el.querySelector('.u-search__content')
    if (searchContent) {
      // 查找具有类名 icon-guanbi2 的元素
      const iconFontBox = searchContent.querySelector('.icon-guanbi2')
      if (iconFontBox) {
        // 根据 showClear 的值设置 iconFontBox 的显示或隐藏
        if (showClear) {
          iconFontBox.style.display = 'flex'
          iconFontBox.style.alignItems = 'center'
        } else {
          iconFontBox.style.display = 'none'
        }
      }
    }
    // 可以添加自定义指令的更新逻辑
  },
  // 元素卸载时调用的钩子函数
  unmounted() {
    // 可以添加自定义指令的卸载逻辑
  }
}

export default insertClear
