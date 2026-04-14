<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-07-08 17:05:51
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-11-04 16:29:08
 * @Description  : 搜索栏位公共组件
-->

<template>
  <section>
    <div class="search-box queryForm" ref="queryFormRef" :style="{ height: showCount ? currentHeight + 'px' : 'auto' }">
      <div class="flex" ref="container">
        <ty-form ref="tyForm" :label-width="labelWidth || labelMaxWidth" :column="'auto'" :input-width="inputWidth" :model="currentModel" :inline="true">
          <el-form-item
            v-for="(item, i) in formItems"
            v-show="getShowFlag(item, i)"
            :key="i"
            :label="item.type !== 'button' ? item.label : ''"
            :prop="item.labelIsValue ? 'tem' + item.model : item.model"
            :class="[`${item.model || 'button'}Query`, item.class]"
            :required="item.required"
            :labelWidth="item.labelWidth || null"
            :inputWidth="getInputWidth(item)"
          >
            <!-- 自定义插槽 -->
            <template v-if="item.slotName">
              <slot :name="item.slotName"></slot>
            </template>
            <template v-else>
              <!-- 金额区间组 -->
              <div v-if="item.type === 'input-number-group'" class="input-number-group">
                <ty-input-number
                  v-model="currentModel[item.modelStart]"
                  :style="{ width: 'calc(50% - 5px)' }"
                  :placeholder="item.placeholderStart || $t('金额下限')"
                  @input="inputData(item)"
                ></ty-input-number>
                <div class="interval">~</div>
                <ty-input-number
                  v-model="currentModel[item.modelEnd]"
                  :style="{ width: 'calc(50% - 5px)' }"
                  :placeholder="item.placeholderEnd || $t('金额上限')"
                  @input="inputData(item)"
                ></ty-input-number>
              </div>
              <!--  下拉框 -->
              <div v-else-if="item.type === 'select'">
                <ty-select
                  v-if="item.type === 'select'"
                  :placeholder="getPlaceholder(item)"
                  :modelValue.sync="currentModel[item.labelIsValue ? 'tem' + item.model : item.model]"
                  :multiple="item.multiple"
                  :dataList="getDataList(item)"
                  :config="item.props"
                  :customValue="item.customValue || ''"
                  :customLabel="item.customLabel || ''"
                  :ref="`select-${item.model}`"
                />
              </div>
              <!-- 其他 -->
              <components
                v-else
                :is="item.type === 'input-number' ? 'ty-input-number' : `el-${item.type || 'input'}`"
                :ref="`input-${item.model}`"
                v-model="currentModel[item.labelIsValue ? 'tem' + item.model : item.model]"
                v-bind="{
                  ...createProps(item, i),
                  ...(item.props || {}),
                  ...(item.attrs || {})
                }"
                v-on="{ ...(item.events || {}) }"
                :placeholder="getPlaceholder(item)"
                @input="inputData(item)"
              >
                <template v-if="item.type === 'button'">
                  <i v-if="(item.props && item.props.type === 'text') || item.icon" class="iconfont" :class="item.icon || 'ty-icon-xiazai'"></i>
                  <span>{{ item.label }}</span>
                </template>
              </components>
            </template>
          </el-form-item>
          <el-form-item class="search-btn-wrap">
            <!-- 重置 -->
            <el-button class="reset-btn submit-btn" type="primary" v-blur plain @click="onReset">
              <i class="iconfont ty-icon-zhongzhi"></i>
            </el-button>
            <!-- 搜索 -->
            <el-button class="search-btn submit-btn" type="primary" v-blur @click="onSearch">
              <slot name="searchDesc">
                <i class="iconfont ty-icon-sousuo"></i>
              </slot>
            </el-button>
            <slot name="extraBtn"></slot>
          </el-form-item>
        </ty-form>
      </div>
    </div>
    <!-- 展开收起 -->
    <div v-if="showCount" class="collapse">
      <div class="collapseImg">
        <img :src="collapseImg" />
        <div class="collapse-text" @click="setcollapse">
          <span>{{ collapse ? $t('展开') : $t('收起') }}</span>
          <span>
            <i
              :class="{
                'el-icon-arrow-down': collapse,
                'el-icon-arrow-up': !collapse
              }"
            ></i>
          </span>
        </div>
      </div>
    </div>
    <div class="line" v-if="showLine"></div>
  </section>
</template>
<script>
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

export default {
  tagName: 'queryForm',
  data() {
    return {
      collapseImg: require('@/assets/images/queryForm/collapse.png'),
      collapse: false, // 【true=收起/false=展开】
      // isProduction: process.env.NODE_ENV === 'production', // 是否生产环境
      currentModel: {},
      currentHeight: '' // 当前容器高度
    }
  },

  props: {
    /**
     * 搜索表单接口入参对象,若设置默认值必传;不传则自动将formItems的model值绑定为value，父组件调用search方法需接收currentModel对象
     */
    searchModel: {
      type: Object,
      required: false,
      default: () => {}
    },
    /**
     * 搜索表单项
     * 配置项如下：
     * label 筛选label||按钮名称
     * type: 表单筛选类型，默认input，可选值：input、select、date-picker、radio-group、button、input-number、input-number-group
     * model: 表单筛选绑定字段，按钮可不传，其他必传
     * modelStart?: 开始时间筛选绑定字段
     * modelEnd?:  结束时间筛选绑定字段
     * dateType?:日期选择器的类型，不传默认daterange,若有传值date、month、year则直接绑定model，无需设置起始值
     * constantKey?:字典项key，下拉，单选可传
     * dataList?: 自定义下拉、单选数据源
     * customLabel?:自定义 下拉、单选 显示字段
     * customValue?:自定义下拉、单选值字段
     * excludeValue?:下拉排除值，数组
     * placeholder?:自定义引导语，默认：请输入/请选择+label
     * placeholderStart?: 开始时间 引导语,默认：开始日期
     * placeholderEnd?: 结束时间 引导语，默认：结束日期
     * funids?: 按钮限控制
     * hide? 是否隐藏
     * emitName? 自定义回调方法，当前数据改变时调用自定义方法
     * class?:给el-form-item添加自定义class
     * isCustomAll? 自定义全部
     * icon?:文本按钮icon,如下载模板
     * required?:是否展示红心必填
     * labelWidth?: 单项label宽度
     * inputWidth?: 单项输入框宽度
     * events?: 按钮事件对象，如导出 events: { click: this.doExportMyPayableOrder }
     * props?: 自定义传入属性对象，如按钮类型 例：props: { type: 'success' };下拉可搜索 例：props: { filterable: true }
     * slotName? 插槽名称
     */
    formItems: {
      type: Array,
      required: true
    },
    showLine: {
      type: Boolean,
      default: true
    },
    // 表单label宽度
    labelWidth: {
      type: String,
      default: null
    },
    // 输入框宽度
    inputWidth: {
      type: String,
      default: '100%'
    },
    // 默认展示个数,传值则代表折叠功能
    showCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    labelMaxWidth() {
      const labelWidths = this.formItems
        .map(item => {
          if (item.hide !== true && item.label) {
            return (
              Array.from(item.label).reduce((len, char) => {
                return len + (char.charCodeAt(0) > 255 ? 1 : 0.5)
              }, 0) + (item.required ? 1 : 0)
            )
          }
        })
        .filter(item => item !== undefined)
      const maxLable = Math.max(...labelWidths)
      const fontSize = 12
      return labelWidths.length > 4 ? (maxLable + 1) * fontSize + 'px' : null
    }
  },
  beforeMount() {
    this.currentModel = this.searchModel || {}
    this.formItems.forEach((item, i) => {
      // 避免未传入searchModel对象或searchModel对象缺少字段
      switch (item.type) {
        case 'button':
        case 'slot':
          break
        case 'select':
          if (!this.currentModel[item.model]) {
            this.$set(this.currentModel, item.model, '')
          }
          if (item.customLabel && item.customValue && item.customLabel === item.customValue && !(item.props && item.props.filterable)) {
            this.$set(item, 'labelIsValue', true)
          }
          if (item.labelIsValue) {
            // 当下拉框为labelIsValue模式，绑定临时字段
            this.$set(this.currentModel, 'tem' + item.model, this.$t('全部'))
          }
          break
        case 'date-picker':
          if (!item.model) {
            this.$set(this.formItems[i], 'model', `${item.modelStart}List`)
          }
          if (!item.dateType || item.dateType.includes('range')) {
            // 日期区间
            this.$set(this.currentModel, item.model, this.currentModel[item.modelStart] ? [this.currentModel[item.modelStart], this.currentModel[item.modelEnd]] : [])
          }
          break
        case 'input-number-group':
          this.$set(this.formItems[i], 'model', `${item.modelStart}List`)
          break
        default:
          if (!this.currentModel[item.model]) {
            this.$set(this.currentModel, item.model, '')
          }
          break
      }
    })
    if (this.showCount) {
      // 默认折叠
      this.collapse = true
    }
  },

  mounted() {
    if (this.showCount) {
      // 需要展开/折叠时才监听加动画
      addResizeListener(this.$el, this.updateHeight)
    }
  },

  beforeDestroy() {
    if (this.$el && this.updateHeight) removeResizeListener(this.$el, this.updateHeight)
  },
  methods: {
    // 切换展开/折叠
    setcollapse() {
      this.collapse = !this.collapse
      this.updateHeight('1')
    },
    // 展开收起动画逻辑，type=1时，开启动画
    updateHeight(type) {
      const container = this.$refs.container
      const queryFormRef = this.$refs.queryFormRef
      if (container && queryFormRef) {
        queryFormRef.style.overflow = 'hidden'
        this.$nextTick(() => {
          if (type === '1') {
            queryFormRef.style.transition = 'height 0.3s ease'
          } else {
            queryFormRef.style.transition = 'height 0s ease'
          }
          this.currentHeight = container.scrollHeight
        })
      }
    },

    // 自定义回调方法
    inputData(item) {
      if (this.$listeners[item.emitName]) {
        this.$emit(item.emitName, this.currentModel)
      }
      if (item.type === 'date-picker' && (!item.dateType || item.dateType.includes('range'))) {
        // 改变时间立马同步 start/end数据，避免缓存导致搜索异常
        let dateList = this.currentModel[item.model]
        if (dateList && dateList.length) {
          this.currentModel[item.modelStart] = dateList[0]
          this.currentModel[item.modelEnd] = dateList[1]
        } else {
          this.currentModel[item.modelStart] = ''
          this.currentModel[item.modelEnd] = ''
        }
      }
    },
    /**
     * @Author: LongCan.Yang
     * @Date: 2024-07-19 17:14:46
     * @description: 设置搜索数据
     */
    setSearchData(type) {
      this.formItems.forEach(item => {
        if (item.type === 'date-picker' && (!item.dateType || item.dateType.includes('range'))) {
          let dateList = this.currentModel[item.model]
          if (dateList && dateList.length) {
            this.currentModel[item.modelStart] = dateList[0]
            this.currentModel[item.modelEnd] = dateList[1]
          } else {
            this.currentModel[item.modelStart] = ''
            this.currentModel[item.modelEnd] = ''
          }
        } else if (item.type === 'select' && item.labelIsValue) {
          if (this.currentModel['tem' + item.model] === this.$t('全部')) {
            this.currentModel[item.model] = ''
          } else {
            this.currentModel[item.model] = this.currentModel['tem' + item.model]
          }
        }
        if (type === 'reset' && item.type === 'input-number-group') {
          // 重置金额区间
          this.currentModel[item.modelStart] = ''
          this.currentModel[item.modelEnd] = ''
        }
      })
    },
    /**
     * @Author: LongCan.Yang
     * @Date: 2024-07-18 10:58:39
     * @description: 搜索
     */
    onSearch() {
      // 先校验必填
      this.$refs.tyForm.tyValidate(vaild => {
        if (vaild) {
          this.setSearchData()
          this.$emit('search', this.currentModel)
        }
      })
    },
    /**
     * @Author: LongCan.Yang
     * @Date: 2024-07-09 17:37:48
     * @description: 重置搜索项
     */
    onReset(e) {
      if (this.$refs.tyForm) {
        this.$refs.tyForm.resetFields() // 重置表单
        // 下拉框重置时,如果存在"全部"选项,则选中"全部"
        this.formItems.forEach(item => {
          if (item.type === 'select' && item.multiple) {
            const refName = `select-${item.model}`
            if (Array.isArray(this.$refs[refName]) && this.$refs[refName].length > 0) {
              this.$nextTick(() => {
                this.$refs[refName][0].handleClear()
              })
            }
          }
        })
        if (this.currentModel.pageNum) {
          // 返回第一页
          this.currentModel.pageNum = 1
        }
        this.setSearchData('reset')
        if (this.$listeners['onReset']) {
          this.$emit('onReset', this.currentModel) // 在自定义重置方法
        } else {
          this.$emit('search', this.currentModel)
        }
      }
      if (e && e.target) {
        let target = e.target
        if (target.nodeName === 'SPAN') {
          target = e.target.parentNode
        }
        target.blur()
      }
    },
    // 设置输入框宽度
    getInputWidth(item) {
      // 单项宽度
      if (item.inputWidth) {
        return item.inputWidth
      }
      // 表单统一宽度
      if (this.inputWidth && this.inputWidth !== '100%') {
        return this.inputWidth
      }
      const defaultInputWidth = Number(this.inputWidth) || 180 // 默认宽度
      // 均未传值，使用默认值
      // switch (
      //   item.type
      //   // case 'input':
      //   //   // return '165px'
      //   //   return '180px'
      //   // case 'select':
      //   //   return '125px'
      //   // case 'input-number':
      //   //   return defaultInputWidth / 2 - 5 + 'px'
      //   // case 'date-picker':
      //   //   return '220px'
      // ) {
      // }
      return defaultInputWidth + 'px'
    },
    // 是否展示表单项
    getShowFlag(item, i) {
      // 根据条件判断是否显示当前表单项:1.权限控制 2.隐藏 3.插槽
      const isItemVisible = item => {
        return (!item.funids || this.getPermissionsByCode(item.funids)) && !item.hide && (!item.slotName || this.$slots[item.slotName])
      }
      if (this.collapse && this.showCount) {
        // 可见项数量
        let visibleCount = 0
        for (let j = 0; j <= i; j++) {
          const current = this.formItems[j]
          if (isItemVisible(current)) {
            visibleCount++
          }
        }
        // 收起状态下仅展示指定数量的表单项
        return isItemVisible(item) && visibleCount <= this.showCount
      } else {
        return isItemVisible(item)
      }
    },
    /**
     * @Author: Longcan.Yang
     * @Date: 2024-09-05 16:50:53
     * @param {*} item
     * @description: 设置描述语
     */
    getPlaceholder(item) {
      let placeholder = '' // 占位符
      if (item.placeholder) {
        placeholder = item.placeholder
      } else {
        placeholder = (item.type === 'input' ? this.$t('请输入') : this.$t('请选择')) + item.label
      }
      return placeholder
    },

    /**
     * @Author: LongCan.Yang
     * @Date: 2024-07-09 17:23:56
     * @param {*} item 数据对象
     * @description: 创建props传值等
     */
    createProps(item, i) {
      if (item.type === 'button') {
        return
      }
      const defaultProps = {
        clearable: true
      }
      switch (item.type) {
        case 'date-picker':
          return {
            type: item.dateType || 'daterange',
            'value-format': item.valueFormat || 'yyyy-MM-dd',
            'start-placeholder': item.placeholderStart || this.$t('开始日期'),
            'end-placeholder': item.placeholderEnd || this.$t('结束日期'),
            ...defaultProps
          }
        // case 'select':
        //   if (item.labelIsValue) {
        //     return {
        //       clearable: true,
        //       value: this.currentModel['tem' + item.model] // 若下拉框
        //     }
        //   }
        //   return defaultProps
        default:
          return defaultProps
      }
    },
    // 获取下拉自定义数组
    getDataList(item) {
      let dataList = item.dataList || [] // 下拉，单选数组，可自定义，有constantKey则用字典项
      if (item.constantKey) {
        // 字典项
        let arr = this.getConstant(item.constantKey)
        if (arr && arr.length) {
          dataList = arr
        }
        if (item.excludeValue) {
          // 过滤掉排除项
          dataList = dataList.filter(obj => !item.excludeValue.includes(obj.key))
        }
        // 不传入自定义【全部】
        if (!item.isCustomAll) {
          dataList = [{ key: '', value: this.$t('全部') }].concat(dataList)
        }
      } else if (!item.isCustomAll) {
        //  不传入自定义【全部】
        let newItem = {
          [item.customValue || 'key']: '',
          [item.customLabel || 'value']: this.$t('全部')
        }
        dataList = [newItem].concat(dataList)
      }
      return dataList
    },
    // 下拉框选项props
    getOptionProps(item, subItem) {
      let props = {}
      if (item.constantKey) {
        // 字典项
        props = {
          label: subItem.value,
          value: item.labelIsValue ? subItem.value : subItem.key
        }
      } else {
        // 自定义数据源
        props = {
          label: subItem[item.customLabel],
          value: subItem[item.customValue]
        }
      }
      return props
    },
    /**
     * @Author: may.ruan
     * @Date: 2025-03-25 09:35:05
     * @param {string} model - 表单项的模型名称
     * @param {string} attribute - 要更新的属性名称
     * @param {*} newVal - 新属性值
     * @param {boolean} [isClear=true] - 隐藏时是否清除表单项的值，默认为true
     * @description: 更新表单项的方法
     */
    updateFormItem(model, attribute, newVal, isClear = true) {
      // 查找表单项数组中模型名称包含model的元素索引
      const index = this.formItems.findIndex(item => [item.model, item.modelStart, item.modelEnd].includes(model))
      // 使用this.$set方法更新该元素的指定属性值为newVal
      if (index > -1) {
        const item = this.formItems[index]
        this.$set(item, attribute, newVal)
        if (item.hide && isClear) {
          // 隐藏栏位 && 需要清除值
          if (['date-picker', 'input-number-group'].includes(item.type) && item.modelStart && item.modelEnd) {
            this.currentModel[item.modelStart] = ''
            this.currentModel[item.modelEnd] = ''
            if (item.model) {
              this.currentModel[item.model] = []
            }
          } else if (item.model) {
            this.currentModel[item.model] = ''
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.queryForm {
  width: 100%;
  display: flex;
  align-items: flex-start;
  .flex {
    width: 100%;
  }
  ::v-deep .el-form {
    width: 100%;
    display: inline;
    .el-form-item {
      margin-right: 7px;
      margin-bottom: 12px;

      .input-number-group {
        display: flex;
        .interval {
          width: 10px;
        }
      }
      &.search-btn-wrap {
        margin-right: -8px;
        padding-top: 1px;
      }
      &:first-of-type {
        .el-button {
          margin-left: 0;
        }
      }
      .el-form-item__label {
        color: $default-color;
        box-sizing: content-box;
        padding-right: 0px;
        box-sizing: content-box;
      }
      .el-form-item__content {
        padding-left: 7px;
      }
      .el-button {
        margin-left: 8px;
        // margin-bottom: 18px;
        // margin-right: 5px;
        &.el-button--text {
          margin-top: -2px;
        }
        .search-desc {
          padding: 0 10px;
        }
      }
      .submit-btn {
        padding: 0;
        height: $btn-height;
        min-width: $btn-height;
        i {
          font-size: 14px;
        }
        &.reset-btn {
          margin: 0 6px 0 3px;
        }
        &.search-btn {
          margin-left: 0;

          // margin-bottom: 18px;
        }
      }
      .el-form-item__error {
        display: none;
      }
      .el-date-editor {
        &.el-range-editor.el-input__inner.el-date-editor--daterange input,
        &.el-range-editor.el-input__inner.el-date-editor--monthrange input {
          width: 45%;
        }
        .el-range-separator {
          padding: 0;
        }
        .el-range__close-icon {
          width: 15px;
          line-height: $btn-height;
        }
        .el-range__icon {
          display: none;
        }
      }
    }
  }
}

.collapse {
  padding: 6px 0 10px;
  // margin-top: -2px;
  .collapseImg {
    width: 100%;

    position: relative;
    img {
      width: 100%;
      height: 20px;
    }
    .collapse-text {
      position: absolute;
      // left: 538px;
      left: calc(50% - 30px);
      line-height: 20px;
      bottom: 2px;
      width: 70px;
      text-align: center;
      color: $sub-color;
      cursor: pointer;
    }
  }
}
.line {
  width: calc(100% + 30px);
  margin-left: -15px;
  height: 12px;
  background: #dce6f4;
  margin-bottom: 10px;
}
</style>
