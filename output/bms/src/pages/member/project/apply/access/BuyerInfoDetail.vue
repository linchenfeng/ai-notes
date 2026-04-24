<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 10:31:10
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-09 15:06:13
 * @Description  : 项目-业务查询-基本信息 /member/project/apply/access/detail/buyerInfo
-->
<template>
  <NavBar />
  <view class="basicInfo">
    <ty-info-card :show-line="false" :title="productType.includes('国内电商') && bizScene === '1' ? '贸易信息' : ''">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="买方名称" :value="vm.buyerItem.counterpartyName" />
          <u-cell title="买方所在国" :value="vm.buyerItem.ctyDesc" />
          <u-cell title="交易商品" :value="vm.buyerItem.productName" />
          <u-cell
            v-if="productType.includes('物流')"
            title="买方是否有物流管理系统"
            :value="getValueByKey(vm.buyerItem.logisticsSystemFlag, 'yesNo')"
          />
          <u-cell v-if="productType.includes('物流')" title="买卖双方运单对账方式" :value="vm.buyerItem.waybillVerifyDesc" />
          <u-cell v-if="productType.includes('物流')" title="是否公开招投标项目" :value="getValueByKey(vm.buyerItem.publicBiddingFlag, 'yesNo')" />
          <u-cell
            title="账期起算日"
            :value="vm.buyerItem.tenorStartType === '5' ? vm.buyerItem.tenorStartDesc : getValueByKey(vm.buyerItem.tenorStartType, 'tenorStartType')"
          />
          <u-cell title="账期(天)" :value="vm.buyerItem.tenor" />
          <u-cell
            title="币种"
            :value="getValueByKey(vm.buyerItem.ccyid, 'applyCcyid') ? getValueByKey(vm.buyerItem.ccyid, 'applyCcyid') : vm.buyerItem.ccyid"
          />
          <u-cell title="年度交易金额(万元)">
            <template #value>
              <text class="u-cell__value">
                <text v-if="vm.buyerItem.ccyid && getValueByKey(vm.buyerItem.ccyid, 'applyCcyid')" class="applyCcyid">
                  {{ vm.buyerItem.ccyid }}
                </text>
                <text>{{ moneyFormat(vm.buyerItem.annualTurnover as number) }}</text>
              </text>
            </template>
          </u-cell>
          <u-cell title="未来年度交易金额(万元)" :value="moneyFormat(vm.buyerItem.futureAnnualTurnover as number)">
            <template #value>
              <text class="u-cell__value">
                <text v-if="vm.buyerItem.ccyid && getValueByKey(vm.buyerItem.ccyid, 'applyCcyid')" class="applyCcyid">
                  {{ vm.buyerItem.ccyid }}
                </text>
                <text>{{ moneyFormat(vm.buyerItem.futureAnnualTurnover as number) }}</text>
              </text>
            </template>
          </u-cell>
          <u-cell title="合作年限" :value="vm.buyerItem.transactionYears" />
          <u-cell title="项目来源" :value="vm.buyerItem.projectSource" />
          <ShopFinanceInfoDetail
            v-if="productType.includes('国内电商') && bizScene === '1'"
            :form-str="vm.buyerItem.storeInformation"
            :ccyid="vm.buyerItem.ccyid"
          ></ShopFinanceInfoDetail>
          <u-cell v-if="!isEmpty(vm.buyerItem.remark)" title="备注说明" class="vertical-cell">
            <template #value>
              <text class="cell-value">{{ vm.buyerItem.remark }}</text>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { moneyFormat } from '@/utils/format'
import { getValueByKey } from '@/utils/constant'
import { getStorage } from '@/utils/storages'
import { FintAplDtcVoList } from '@/interfaces/member/project/apply/businessApply'
import { useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import { isEmpty } from '@/utils/validate'
import ShopFinanceInfoDetail from './components/shopFinanceInfo/Detail.vue'
const route = useRoute()
let productType = ref('') //业务产品
let bizScene = ref('') // 业务大类
let index = -1
const buyerItem: FintAplDtcVoList = {
  refcode: '',
  counterpartyRefcode: 0,
  counterpartyName: '',
  ctyid: '',
  ctyDesc: '',
  productName: '',
  logisticsSystemFlag: '',
  waybillVerifyType: '',
  waybillVerifyDesc: '',
  publicBiddingFlag: '',
  tenorStartType: '',
  tenorStartDesc: '',
  tenor: '',
  ccyid: '',
  ccyidDesc: '',
  annualTurnover: '',
  futureAnnualTurnover: '',
  transactionYears: '',
  projectSource: '',
  supplementStatus: '',
  remark: '',
  storeInformation: ''
}
let fintAplDtcVoList: FintAplDtcVoList[] = []
let vm = reactive({
  buyerItem: buyerItem,
  fintAplDtcVoList: fintAplDtcVoList
})
onMounted(() => {
  if (getStorage('application-fintAplDtcVoList')) {
    vm.fintAplDtcVoList = getStorage('application-fintAplDtcVoList') as FintAplDtcVoList[]
  }
  if (route.value.params) {
    productType.value = decodeBase64(route.value.params.productType)
    bizScene.value = decodeBase64(route.value.params.bizScene)
    const indexStr = decodeBase64(route.value.params.index) // 获取索引值
    index = Number(indexStr)
    if (index !== -1) {
      vm.buyerItem = vm.fintAplDtcVoList[index]
    }
  }
})
</script>

<style lang="scss" scoped>
.applyCcyid {
  margin-right: 10rpx;
}
</style>
