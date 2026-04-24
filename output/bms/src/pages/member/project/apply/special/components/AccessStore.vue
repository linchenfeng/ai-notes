<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-01 11:15:46
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-28 14:38:15
 * @Description  : 特批申请准入店铺
-->
<template>
  <ty-info-card title="本次申请准入店铺">
    <template #subtitle>
      <span class="history" @click="toAccessStore">
        {{ props.identity === 'apply' || (props.examineType && props.examineType === 'C') ? '选择待准入店铺' : '查看不准入原因' }}
      </span>
    </template>
    <view class="shop-item-box">
      <view v-for="item in vm.selectList" :key="item.sellingPartnerId" class="shopItem">
        <view class="shopName">{{ item.shopName }}</view>
        <view>店铺ID：{{ item.sellingPartnerId }}</view>
        <view>店铺所在国家：{{ item.shopCountryStr }}</view>
        <!-- {{ i + 1 + '.  ' + item.shopName + '，' + item.sellingPartnerId + '，' + '站点：' + item.shopCountryStr }} -->
      </view>
    </view>
  </ty-info-card>
</template>

<script setup lang="ts">
import { useRouter } from '@/uni-simple-router'
import { onShow } from '@dcloudio/uni-app'
import { getStorage, setStorage } from '@/utils/storages'
import { SaveSpecialVo, ShopList } from '@/interfaces/member/project/apply/specialApproval'
import type { PropType } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
import { encodeBase64 } from '@/utils/crypto'
const props = defineProps({
  self: {
    type: Object as PropType<SaveSpecialVo>,
    default: () => ({})
  },
  // 【apply=申请/audit=审批/query=查询】
  identity: {
    type: String,
    default: ''
  },
  // 审批类型【A=审批/B=批注/C=确认】
  examineType: {
    type: String,
    default: ''
  }
})
let firstEnter = true
const router = useRouter()
type SelectList = {
  shopName: string
  sellingPartnerId: string
  shopCountryStr: string
}
let selectList: SelectList[] = []
let shopList: ShopList[] = []
const vm = reactive({
  selectList, // 展示选中的店铺数据
  shopList // 原始选中的店铺数据
})
const toAccessStore = () => {
  if (!props.self.orgname) {
    showToast('请选择卖方名称')
    return
  }
  // 客户经理申请/审批确认
  // eslint-disable-next-line no-extra-parens
  if (props.identity === 'apply' || (props.examineType && props.examineType === 'C')) {
    router.push(
      `/member/project/apply/special/shopSelect/${encodeBase64(props.self.orgname)}/${encodeBase64(props.identity)}/${encodeBase64(
        props.self.refcode || -1
      )}`
    )
  } else {
    // 查详情
    router.push(`/member/project/apply/special/shopDetail/${encodeBase64(props.self.refcode || -1)}`)
  }
}
// 组装回显数据
const packageData = (list: ShopList[]) => {
  vm.selectList = []
  if (list && list.length) {
    list.forEach(item => {
      let shopCountryList: string[] = []
      if (item.floaShopSubMList && item.floaShopSubMList.length) {
        item.floaShopSubMList.forEach(subItem => {
          shopCountryList.push(subItem.shopCountry || '')
        })
      }
      vm.selectList.push({
        shopName: item.shopName || '',
        sellingPartnerId: item.sellingPartnerId || '',
        shopCountryStr: shopCountryList.join('、')
      })
    })
  }
}
const getShopList = () => {
  return vm.shopList
}
onShow(() => {
  // 首次进入清空选中数据
  if (firstEnter) {
    setStorage('shop-select-list', '')
    firstEnter = false
  }
  const storageData = getStorage('shop-select-list')
  if (storageData) {
    // 确保 storageData 是字符串再解析
    const parsedData = JSON.parse(storageData as string) as ShopList[]
    if (parsedData.length) {
      packageData(parsedData)
      vm.shopList = parsedData
    }
  }
})
onMounted(() => {
  // 回显已选中的店铺
  packageData(props.self.shopList)
  vm.shopList = props.self.shopList
  if (props.self.shopList && props.self.shopList.length) {
    setStorage('shop-select-list', JSON.stringify(props.self.shopList))
  }
})
defineExpose({ getShopList })
</script>

<style lang="scss" scoped>
.shop-item-box {
  padding-bottom: 10rpx;
  .shopItem {
    line-height: 44rpx;
    margin-bottom: 14rpx;
    background-color: #ffffff;
    // border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    border-radius: 12rpx;
    padding: 14rpx;
    .shopName {
      color: #333333;
      font-weight: bold;
    }
  }
}
.history {
  font-size: 26rpx;
  color: $primary;
  font-weight: normal;
  flex: 1;
  text-align: right;
}
</style>
