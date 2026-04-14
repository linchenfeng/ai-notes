<!--
 * @Author       : may.ruan
 * @Date         : 2024-12-12 10:43:02
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-10-24 09:56:58
 * @Description  : 对el-table的封装
-->
<template>
  <!-- @header-dragend="handleHeaderDragEnd" :header-cell-style="handleHeaderCellStyle" -->
  <el-table
    ref="table"
    :data="internalTableData"
    :header-cell-class-name="handleCellClassName"
    :cell-class-name="handleCellClassName"
    :stripe="stripe"
    :border="border"
    :max-height="maxHeight"
    :empty-text="$t('暂无数据')"
    :fixed-count="fixedCount"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </el-table>
</template>
<script>
import TableFilterBar from './filterBar'
import Vue from 'vue'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import { throttle } from '@/utils/libs/throttle'
import $ from 'jquery'
export default {
  tagName: 'table',
  name: 'Table',
  props: {
    // 数据源
    data: {
      type: [Array, Object],
      default: () => ([])
    },
    // 是否展示边框(宽度可调整)
    border: {
      type: Boolean,
      default: true
    },
    // 是否展示斑马纹
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否展示列筛选栏：控制列栏位显示/隐藏
    showFilterBar: {
      type: Boolean,
      default: true
    },
    // 是否固定表头（一级列表页面生效，动态计算table高度）
    fixedHeader: {
      type: Boolean,
      default: false
    },
    // 表头固定个数
    fixedCount: {
      type: Number,
      default: 4
    }
  },
  provide() {
    return {
      getVTable: this.getTableRef
    }
  },
  data() {
    return {
      maxHeight: null // 表格最大高度
    }
  },
  computed: {
    // 是否固定表头,是返回true，否则返回false
    isFixedHeader() {
      return this.fixedHeader && this.$attrs['show-header'] !== false
    },
    internalTableData() {
      if (Array.isArray(this.data)) {
        return this.data
      } else if (this.data && typeof this.data === 'object') {
        // 如果是对象，尝试将其值转为数组
        return Object.values(this.data)
      }
      return []
    }
  },
  async mounted() {
    const entries = Object.entries(this.$refs.table)
    for (let [key, value] of entries) {
      if (!value || typeof value !== 'function') {
        continue
      }
      this[key] = value
    }
    const showHeader = this.$attrs['show-header'] // 是否显示表头
    if (showHeader !== false) {
      if (this.showFilterBar) {
        const FilterBarComponent = Vue.extend(TableFilterBar)
        const filterBar = new FilterBarComponent({
          propsData: {
            vTable: this.$refs.table
          }
        })
        const icon = document.createElement('div')
        this.$el.appendChild(icon)
        filterBar.$mount(icon)
      }
    }
    if (this.isFixedHeader) {
      this.addEvent()
    }
    this.$nextTick(() => this.$refs.table && this.$refs.table.doLayout())
    // this.restoreColumnWidths()
  },
  activated() {
    if (this.isFixedHeader) {
      this.addEvent()
    }
    // this.restoreColumnWidths()
  },
  methods: {
    // handleHeaderDragEnd(newWidth, oldWidth, column) {
    //   const columns = this.$refs.table.columns
    //   const columnIndex = columns.findIndex(col => col.property === column.property)
    //   if (columnIndex !== -1) {
    //     columns[columnIndex].minWidth = newWidth
    //     const columnsWidths = {}
    //     columns.forEach(col => {
    //       columnsWidths[col.property] = col.minWidth || col.width
    //     })
    //     this.setLocal(this.$route.name + '-tableColumnWidths', columnsWidths)
    //   }
    // },
    // restoreColumnWidths() {
    //   const savedWidths = this.getLocal(this.$route.name + '-tableColumnWidths')
    //   if (this.isNotEmpty(savedWidths)) {
    //     this.$refs.table.columns.forEach(column => {
    //       column.minWidth = savedWidths[column.property]
    //     })
    //   }
    // },
    // handleHeaderCellStyle({ column }) {
    //   const columns = this.$refs.table.columns
    //   const columnIndex = columns.findIndex(col => col.property === column.property)
    //   if (columnIndex !== -1 && columns[columnIndex].minWidth) {
    //     return { minWidth: `${columns[columnIndex].minWidth}px` }
    //   }
    //   return {}
    // },
    handleCellClassName({ row, column, rowIndex, columnIndex }) {
      // 获取当前列的对齐方式
      const currentAlign = column.align || 'is-left'
      // 获取前一列的对齐方式
      const prevColumn = this.$refs.table.columns[columnIndex - 1]
      const prevAlign = prevColumn ? prevColumn.align : null
      // 如果前一列居右，当前列居左，则设置左边距
      if (prevAlign === 'is-right' && currentAlign === 'is-left') {
        return 'table-cell-custom-spacing'
      }
      // 默认返回空class
      return ''
    },
    getMaxTableHeight(el = this.$el) {
      const body = el ? el.parentNode : el
      if (body && body.classList && body.classList.contains('vteam-container-full')) {
        const header = document.querySelector('.vteam-theme-header')
        const nextElementSibling = this.$el.nextElementSibling // 页面尾部
        const pageTopHeight = header.offsetHeight // 获取距顶部距离（用于展示菜单栏等信息）
        const pageFooter = body.querySelector('.vteam-container-full__footer') // 页面尾部
        const pageFooterHeight = pageFooter ? pageFooter.offsetHeight : 0 + nextElementSibling ? nextElementSibling.offsetHeight : 0 // 获取距底部距离（用于展示页码等信息）
        this.maxHeight = Math.max(body.scrollHeight, window.innerHeight, document.documentElement.scrollHeight) - pageTopHeight - pageFooterHeight
      } else {
        setTimeout(() => this.getMaxTableHeight(body), 50)
      }
    },
    /**
     * @Author: may.ruan
     * @Date: 2025-02-17 10:12:18
     * @description: 添加事件监听器以响应表格父容器的尺寸变化和滚动事件。
     */
    addEvent() {
      const parentNode = $(this.$el).parents('.vteam-container-full__body')[0]
      const toggleMenu = () => {
        try {
          const scrollTop = parentNode.scrollTop
          const header = document.querySelector('.vteam-theme-header')
          const tableBody = this.$el.querySelector('.el-table__body-wrapper')
          const isScrollY = tableBody.scrollHeight > tableBody.clientHeight
          if (scrollTop > header.offsetHeight && isScrollY) {
            // 向下滚动，隐藏菜单
            header.classList.add('hideTopMenu')
          } else {
            // 向上滚动，显示菜单
            header.classList.remove('hideTopMenu')
          }
          this.getMaxTableHeight()
        } catch (error) {}
      }
      toggleMenu()
      const fu = throttle(toggleMenu, 500)
      addResizeListener(parentNode, this.getMaxTableHeight)
      parentNode.addEventListener('scroll', fu)
      const removeEvent = () => {
        if (parentNode) {
          removeResizeListener(parentNode, this.getMaxTableHeight)
          parentNode.removeEventListener('scroll', fu)
          parentNode.scrollTop = 0
        }
        const header = document.querySelector('.vteam-theme-header')
        if (header) header.classList.remove('hideTopMenu')
      }
      this.$once('hook:deactivated', () => {
        removeEvent()
      })
      this.$once('hook:beforeDestroy', () => {
        removeEvent()
      })
    },
    // 提供获取表格实例的方法给子组件使用
    getTableRef() {
      return this.$refs.table
    }
  }
}
</script>
<style lang="scss">
.el-table table {
  .table-cell-custom-spacing {
    .cell {
      padding-left: 10px;
    }
  }
}
</style>
