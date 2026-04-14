<!--
 * @Author       : may.ruan
 * @Date         : 2024-12-23 14:42:30
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-02-06 11:20:48
 * @Description  : table列设置组件
-->
<template>
  <div class="table-filter-trigger-container">
    <el-popover popper-class="table-filter-bar-popover" placement="bottom" :append-to-body="true" trigger="click">
      <div class="setting-icon" slot="reference">
        <i class="iconfont ty-icon-shezhiicon" />
      </div>
      <div class="table-filter-bar">
        <div class="lable">{{ i18n$t('列设置') }}</div>
        <el-checkbox-group v-model="selectedColumns" @change="filterColumn(selectedColumns)">
          <el-checkbox v-for="column in columns" :label="column.label" :key="column.id" :name="column.label" style="display: block; margin-right: 0">
            {{ i18n$t(column.label) }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-popover>
  </div>
</template>

<script>
import i18n from '@/i18n'
export default {
  data() {
    return {
      columns: [],
      selectedColumns: []
    }
  },
  props: {
    vTable: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    columns(newVal, oldVal) {
      const newAddItem = newVal.filter(item => !oldVal.some(oldItem => oldItem.label === item.label))
      this.selectedColumns = [
        ...this.selectedColumns.filter(i => newVal.some(n => n.label === i)), // 过滤掉之前选中但是新的表格中不存在的列
        ...newAddItem.map(i => i.label)
      ]
    }
  },
  mounted() {
    this.getColumns()
  },
  methods: {
    getColumns() {
      this.columns = this.vTable.store.states._columns
        .filter(column => !this.isFilterWhiteType(column) && this.resolveLabel(column))
        .map(col => {
          return {
            ...col,
            label: this.resolveLabel(col) // 某些 column 可能没有设置 label，例如 type 为 index、selection 这种，这里需要处理一下，否则过滤组件内该项展示为空
          }
        })
      return this.columns
    },
    async filterColumn(column) {
      if (!column) {
        return
      }
      try {
        const origin = this.vTable.store.states._columns
        this.vTable.store.states._columns = origin.filter(col => this.isFilterWhiteType(col) || column.includes(this.resolveLabel(col)))
        this.vTable.store.updateColumns()
        this.vTable.store.states._columns = origin
        this.vTable.store.scheduleLayout()
        this.vTable.doLayout()
      } catch (error) {}
    },
    isFilterWhiteType(col) {
      // 扩展||默认类型并且label为空不参与过滤
      return (
        [
          'expand'
          // 'selection',
          // 'index'
        ].includes(col.type) ||
        (col.type === 'default' && col.label === '')
      )
    },
    resolveLabel(column) {
      return column.label || { selection: this.i18n$t('多选'), index: this.i18n$t('序号') }[column.type]
    },
    i18n$t(str) {
      return i18n.t(str)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-filter-trigger-container {
  position: absolute;
  right: 5px;
  top: 9px;
  cursor: pointer;
  z-index: 2;
  .setting-icon {
    line-height: normal;
    // margin-right: 10px;
    background-color: #e9f3ff;
    i {
      color: #666;
      font-size: 12px !important;
    }
  }
}
</style>
<style lang="scss">
.table-filter-bar-popover {
  padding: 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 2px 6px 1px rgba(0, 0, 0, 0.14);
  min-width: 150px;
  overflow-y: auto;
  max-height: 100%;

  .table-filter-bar {
    .lable {
      padding: 10px;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid rgb(221, 221, 221);
    }
    .el-checkbox-group {
      padding: 5px 10px 0;
      .el-checkbox {
        padding: 5px 0;
      }
    }
  }
}
</style>
