<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:45:24
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-18 21:21:48
 * @Description  : 店铺及贸易信息编辑组件
-->
<template>
  <view>
    <view class="title">用来融资的店铺信息</view>
    <!-- 自有店铺还是代运营 -->
    <u-form-item label="运营模式" required label-width="43%">
      <view class="radio-group">
        <u-button
          v-for="(obj, index) in operateOptions"
          :key="index"
          class="check-button"
          :class="{ active: formData.operationType && formData.operationType.includes(obj.key) }"
          round
          size="mini"
          @click="formData.operationType = obj.key"
        >
          {{ obj.value }}
        </u-button>
      </view>
    </u-form-item>
    <!-- 店铺经营时长 -->
    <u-form-item label="经营年限" required label-width="50%">
      <u-input v-model="formData.operationDuration" maxlength="100" placeholder="请输入经营年限" />
    </u-form-item>

    <!-- 店铺月均回款 -->
    <u-form-item label="月均回款(万元)" required label-width="50%">
      <view v-if="props.ccyid && getValueByKey(props.ccyid, 'applyCcyid')" class="appointCcyid">
        <text>{{ props.ccyid }}</text>
      </view>
      <InputNumber v-model:number="formData.monthlyReceipts" placeholder="请输入月均回款" maxlength="15" />
    </u-form-item>

    <!-- 主要SKU 库存周转天数 -->
    <u-form-item label="主要SKU库存周转天数" required label-width="50%">
      <u-input v-model="formData.inventoryTurnoverDays" maxlength="100" placeholder="请输入主要SKU库存周转天数" />
    </u-form-item>

    <!-- 主要仓库公司 -->
    <u-form-item label="主要仓库公司" required label-width="43%"></u-form-item>
    <u-textarea
      v-model="formData.mainWarehouseCompany"
      :confirm-type="null"
      maxlength="100"
      placeholder-style="font-size: 28rpx;"
      class="inputValueClass"
      count
      auto-height
      placeholder="请输入主要仓库公司"
    ></u-textarea>
    <view class="title">融资信息</view>
    <!-- 店铺是否当前有其他未结清的融资 -->
    <u-form-item label="是否当前有其他未结清的融资" required label-width="62%">
      <view class="radio-group">
        <u-button
          v-for="obj in yesNoOptions"
          :key="obj.key"
          class="check-button"
          :class="{ active: formData.hasOtherFinancing === obj.key }"
          round
          size="mini"
          @click="formData.hasOtherFinancing = obj.key"
        >
          {{ obj.value }}
        </u-button>
      </view>
    </u-form-item>
    <!-- 未结清融资的资金方 -->
    <u-form-item v-if="formData.hasOtherFinancing === '1'" label="未结清融资的资金方" required label-width="43%"></u-form-item>
    <u-textarea
      v-if="formData.hasOtherFinancing === '1'"
      v-model="formData.otherFinancingParty"
      :confirm-type="null"
      maxlength="100"
      placeholder-style="font-size: 28rpx;"
      class="inputValueClass"
      count
      auto-height
      placeholder="请输入未结清融资的资金方"
    ></u-textarea>
    <!-- 融资币种 -->
    <u-form-item label="融资币种" required label-width="43%">
      <view class="unFocus" @click="selectFinanceCcy()">
        <u-input v-model="formData.ccyDesc" placeholder="请选择融资币种" />
      </view>
      <template #right>
        <up-icon name="arrow-down" @click="selectFinanceCcy()" />
      </template>
    </u-form-item>
    <!-- 未结清融资金额 -->
    <u-form-item v-if="formData.hasOtherFinancing === '1'" label="未结清融资金额(万元)" required label-width="50%">
      <view v-if="formData.ccyid" class="appointCcyid">
        <text>{{ formData.ccyid }}</text>
      </view>
      <InputNumber v-model:number="formData.otherFinancingAmount" placeholder="请输入未结清融资金额" maxlength="100" />
    </u-form-item>
    <!-- 预期融资金额 -->
    <u-form-item label="预期融资金额(万元)" required label-width="50%">
      <view v-if="formData.ccyid" class="appointCcyid">
        <text>{{ formData.ccyid }}</text>
      </view>
      <InputNumber v-model:number="formData.expectedAmount" placeholder="请输入预期融资金额" maxlength="15" @change="checkAmountPositive" />
    </u-form-item>

    <!-- 本次融资资金用途 -->
    <u-form-item label="本次融资资金用途" required label-width="43%"></u-form-item>
    <u-textarea
      v-model="formData.fundingPurpose"
      :confirm-type="null"
      maxlength="100"
      placeholder-style="font-size: 28rpx;"
      class="inputValueClass"
      count
      auto-height
      placeholder="请输入本次融资资金用途"
    ></u-textarea>
    <!-- 融资币种选择器 -->
    <u-picker
      :show="showCcyPicker"
      :columns="financeCcyColumns"
      item-height="88"
      key-name="value"
      :default-index="ccyDefaultIndex"
      @confirm="confirmFinanceCcy"
      @cancel="showCcyPicker = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults } from 'vue'
import InputNumber from '@/plugins/InputNumber.vue'
import { useShopFinance } from './useShopFinance'
import { getValueByKey } from '@/utils/constant'
// 1. 定义u-picker组件的返回值类型
interface UPickerConfirmResult<T = { key: string; value: string }> {
  value: T[] // 选择器返回的列数据数组
  index: number[] // 选择的索引数组
}

// 3. 定义币种选项类型（与getConstant('applyCcyid')返回结构对齐）
type CcyOption = {
  key: string // 币种编码（如CNY）
  value: string // 币种名称（如人民币）
}

// 4. 定义Props
interface ShopFinanceProps {
  formStr: string
  ccyid: string
}
const props = withDefaults(defineProps<ShopFinanceProps>(), {
  formStr: '',
  ccyid: ''
})
const formStrRef = ref(props.formStr)
// 5. 使用核心Hook
const {
  formData,
  yesNoOptions,
  financeCcyColumns,
  operateOptions,
  validateForm,
  getSubmitStr,
  checkAmountPositive,
  resetForm,
  updateField,
  parseFormStr
} = useShopFinance(ref(formStrRef))
// 7. 监听props.formStr变化，同步到formStrRef并触发解析
watch(
  () => props.formStr,
  newVal => {
    formStrRef.value = newVal
    parseFormStr(newVal) // 主动触发Hook的解析方法
  },
  { immediate: true }
)
// 6. UI交互相关状态
const showCcyPicker = ref(false)
const ccyDefaultIndex = ref([0])

// 9. 选择融资币种（精准类型）
const selectFinanceCcy = () => {
  showCcyPicker.value = true
}
const confirmFinanceCcy = (value: UPickerConfirmResult<CcyOption>) => {
  formData.ccyid = value.value[0].key
  formData.ccyDesc = value.value[0].value
  showCcyPicker.value = false
}
// 暴露给父组件的方法
defineExpose({
  validateForm,
  getSubmitStr,
  resetForm,
  updateField,
  formData
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 28rpx;
  font-weight: bold;
  text-align: left;
  color: #333333;
  position: relative;
  margin-bottom: 30rpx;
}
.appointCcyid {
  margin-right: 6rpx;
}
.inputValueClass {
  position: relative;
  top: -20rpx;
  min-height: 40rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 40rpx !important;
    font-size: 28rpx;
  }
}
</style>
