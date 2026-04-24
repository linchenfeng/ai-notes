<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-12-09 14:43:25
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-17 09:43:48
 * @Description  : 店铺及贸易信息详情
-->
<template>
  <view class="card-cell-group">
    <u-cell-group>
      <view class="title">用来融资的店铺信息</view>
      <!-- 自有店铺还是代运营 -->
      <u-cell title="运营模式" :value="formData.operationType" />
      <!-- 店铺经营时长 -->
      <u-cell title="经营年限" :value="formData.operationDuration" />
      <!-- 店铺月均回款(万元) -->
      <u-cell title="月均回款(万元)" :value="moneyFormat(formData.monthlyReceipts)">
        <template #value>
          <text class="u-cell__value">
            <text v-if="props.ccyid && getValueByKey(props.ccyid, 'applyCcyid')" class="applyCcyid">
              {{ props.ccyid }}
            </text>
            <text>{{ moneyFormat(formData.monthlyReceipts) }}</text>
          </text>
        </template>
      </u-cell>
      <!-- 主要SKU 库存周转天数 -->
      <u-cell title="主要SKU库存周转天数" :value="formData.inventoryTurnoverDays" />
      <!-- 主要仓库公司 -->
      <u-cell title="主要仓库公司" class="vertical-cell">
        <template #value>
          <text class="cell-value">{{ formData.mainWarehouseCompany }}</text>
        </template>
      </u-cell>

      <view class="title">融资信息</view>
      <!-- 店铺是否当前有其他未结清的融资 -->
      <u-cell title="是否当前有其他未结清的融资" :value="getValueByKey(formData.hasOtherFinancing, 'yesNo')" />

      <!-- 未结清融资的资金方（条件显示） -->
      <u-cell v-if="formData.hasOtherFinancing === '1'" title="未结清融资的资金方" class="vertical-cell">
        <template #value>
          <text class="cell-value">{{ formData.otherFinancingParty }}</text>
        </template>
      </u-cell>
      <!-- 融资币种 -->
      <u-cell title="融资币种" :value="formData.ccyDesc" />
      <!-- 未结清融资金额（条件显示） -->
      <u-cell v-if="formData.hasOtherFinancing === '1'" title="未结清融资金额(万元)">
        <template #value>
          <text class="u-cell__value">
            <text v-if="formData.ccyid" class="applyCcyid">
              {{ formData.ccyid }}
            </text>
            <text>{{ moneyFormat(formData.otherFinancingAmount) }}</text>
          </text>
        </template>
      </u-cell>

      <!-- 预期融资金额(万元) -->
      <u-cell title="预期融资金额(万元)" :value="moneyFormat(formData.expectedAmount)">
        <template #value>
          <text class="u-cell__value">
            <text v-if="formData.ccyid" class="applyCcyid">
              {{ formData.ccyid }}
            </text>
            <text>{{ moneyFormat(formData.expectedAmount) }}</text>
          </text>
        </template>
      </u-cell>

      <!-- 本次融资资金用途 -->
      <u-cell title="本次融资资金用途" class="vertical-cell">
        <template #value>
          <text class="cell-value">{{ formData.fundingPurpose }}</text>
        </template>
      </u-cell>
    </u-cell-group>
  </view>
</template>

<script setup lang="ts">
import { useShopFinance } from './useShopFinance'
import { moneyFormat } from '@/utils/format'
import { getValueByKey } from '@/utils/constant'
// 1. 仅定义必要Props：接收父组件传入的表单字符串
interface ShopFinanceProps {
  formStr: string
  ccyid: string
}
const props = withDefaults(defineProps<ShopFinanceProps>(), {
  formStr: '',
  ccyid: ''
})

// 2. 调用Hook仅获取展示所需数据
const { formData, parseFormStr } = useShopFinance()

// 3. 仅保留核心逻辑：监听formStr变化，解析为展示数据
watch(
  () => props.formStr,
  newVal => {
    parseFormStr(newVal)
  },
  { immediate: true }
)
</script>
<style lang="scss">
.title {
  font-size: 28rpx;
  font-weight: bold;
  text-align: left;
  color: #333333;
  position: relative;
  margin-bottom: 30rpx;
}
.applyCcyid {
  margin-right: 6rpx;
}
</style>
