<!--
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-07 11:03:12
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2023-12-28 14:52:46
 * @Description  : 预计回款信息反馈 /member/myinfo/paymentInfoFeedback
-->
<template>
  <NavBar />
  <!-- 预期利息预缴试算页面-->
  <view class="wap-paymentinfo-feedback">
    <uni-list v-if="vm.companyInfoList && vm.companyInfoList.length" v-model:loading="loading">
      <view v-for="item in vm.companyInfoList" :key="item.refcode" class="companyList" @click="viewDetail(item)">
        <u-cell-group :border="false">
          <view class="subtitle">
            <u-cell :title="item.orgname" :stop="false" />
          </view>
          <view class="item-title">
            <u-cell v-if="item.bussType === '9300'" :stop="false" title="供应链公司名称" :value="item.finalPayName" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="买方名称" :value="item.buyerName" :stop="false" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="业务产品" :value="getValueByKey(item.bussType, 'businessProductType')" :stop="false" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="业务合同号" :value="item.busscontNo" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="币种" :value="item.ccyid === 'RMB' ? '人民币' : getValueByKey(item.ccyid, 'ccyid')" :stop="false" :border="false" />
          </view>
          <view class="item-title red-color">
            <u-cell v-if="item.bussType === '9300'" title="未回款金额(元)" :value="moneyFormat(item.totalUnpaidAmt)" :stop="false" :border="false" />
          </view>
          <view class="item-title red-color">
            <u-cell title="融资余额(元)" :value="moneyFormat(item.totalOtstAmt)" :stop="false" :border="false" />
          </view>
        </u-cell-group>
        <view class="line"></view>
      </view>
      <view v-if="finished" class="list-is-finished">已经到底了</view>
    </uni-list>
    <!-- <van-empty v-else :image="empty" :image-size="[164, 130]" description="暂无数据" /> -->
    <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
  </view>
</template>
<script lang="ts">
export default {
  name: 'MyinfoPaymentInfoFeedback',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { moneyFormat } from '@/utils/format'
import empty from '@/assets/empty/empty.png'
import { PreRetrunAmtInfo } from '@/interfaces/member/myinfo/paymentInfoFeedback'
import apiPaymentInfoFeedback from '@/api/member/api.paymentInfoFeedback'
import { useRouter } from '@/uni-simple-router'
import { onReachBottom } from '@dcloudio/uni-app'
const loading = ref(false)
const finished = ref(false)
const router = useRouter()
// 定义数据
const vm = reactive({
  companyInfoList: Array<PreRetrunAmtInfo>()
})

let search = reactive({
  pageNum: 1, //页码
  pageSize: 10 // 每页条数
})
let totalCount = 0 //总条数
/**
 * @Author: MingChun.Cheng
 * @Date: 2022-10-12 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 获取预计回款信息反馈列表数据
 */
const findPaymentPage = (): void => {
  apiPaymentInfoFeedback.findPaymentPage(search).then(res => {
    if (res.data.fadlReconFcnMVoList && res.data.fadlReconFcnMVoList.length) {
      vm.companyInfoList.push(...res.data.fadlReconFcnMVoList)
    }
    totalCount = Number(res.totalCount)
    if (vm.companyInfoList.length === totalCount) {
      finished.value = true
    }
    loading.value = false
  })
}

onMounted(() => {
  findPaymentPage()
})

/**
 * @Author: MingChun.Cheng
 * @Date: 2022-09-07 09:47:40
 * @param {*} void
 * @return {*}
 * @description: 上滑加载更多数据
 */
onReachBottom(() => {
  loading.value = true
  if (search.pageNum < Math.ceil(totalCount / search.pageSize)) {
    search.pageNum++
    findPaymentPage()
  }
})
/**
 * @Author: MingChun.Cheng
 * @Date: 2022-09-07 09:47:40
 * @return {*}
 * @description: 点击跳转至详情页面(refcode:企业流水号)
 */
const viewDetail = item => {
  let refcode = encodeBase64(item.refcode)
  router.push(`/member/myinfo/paymentInfoFeedback/FeedBackDetail/${refcode}`)
}
</script>
<style lang="scss" scoped>
.line {
  margin-top: 20rpx;
  width: 100%;
  height: 20rpx;
  background: #f6f6f6;
}
.companyList {
  &:last-of-type {
    .line {
      height: 2rpx;
    }
  }
}
</style>
