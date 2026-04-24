<!--
 * @Author       : MingChun
 * @Date         : 2023-09-06 14:45:58
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-03 16:00:11
 * @Description  : 预期利息预缴试算页面 member/myinfo/interestTrial
-->
<template>
  <NavBar />
  <!-- 预期利息预缴试算页面-->
  <view class="wap-interest-trial">
    <uni-list v-if="vm.companyInfoList && vm.companyInfoList.length" v-model:loading="loading">
      <view v-for="item in vm.companyInfoList" :key="item.refcode" class="companyList" @click="viewDetail(item)">
        <u-cell-group class="orgName">
          <view class="subtitle">
            <u-cell :title="item.orgname" :stop="false" />
          </view>
          <view class="item-title">
            <u-cell
              title="业务产品"
              :value="getValueByKey(item.bussType, 'businessProductType')"
              :border="false"
              :stop="false"
              title-class="describe"
              value-class="definiteData"
            />
          </view>
          <view class="item-title">
            <u-cell
              title="币种"
              :value="item.ccyid === 'RMB' ? '人民币' : getValueByKey(item.ccyid, 'ccyid')"
              :border="false"
              title-class="describe"
              :stop="false"
              value-class="definiteData"
            />
          </view>
          <view class="item-title">
            <u-cell title="融资笔数" :value="`${item.financingNum}笔`" :border="false" title-class="describe" value-class="definiteData" />
          </view>
          <view class="item-title">
            <u-cell
              title="融资总金额(元)"
              :value="moneyFormat(item.totalLoanAmt)"
              :border="false"
              :stop="false"
              title-class="describe"
              value-class="definiteData"
            />
          </view>
          <view class="item-title">
            <u-cell
              title="融资总余额(元)"
              :value="moneyFormat(item.totalOtstAmt)"
              :border="false"
              :stop="false"
              title-class="describe"
              value-class="definiteData"
            />
          </view>
        </u-cell-group>
        <view class="line"></view>
      </view>
      <view v-if="finished" class="list-is-finished">已经到底了</view>
    </uni-list>
    <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
  </view>
</template>
<script lang="ts">
export default {
  name: 'MyinfoInterestTrial',
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
import { InterestTrialInfo } from '@/interfaces/member/myinfo/interestTrial'
import apiInterestTrial from '@/api/member/api.interestTrial'
import { useRouter } from '@/uni-simple-router'
import { onReachBottom } from '@dcloudio/uni-app'
const loading = ref(false)
const finished = ref(false)
const router = useRouter()

// 定义数据
const vm = reactive({
  companyInfoList: Array<InterestTrialInfo>()
})
let search = reactive({
  pageNum: 1, //页码
  pageSize: 10 // 每页条数
})
let totalCount = 0 //总条数
/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 获取试算列表数据
 */
const findOverDuePage = (): void => {
  apiInterestTrial.findOverDuePage(search).then(res => {
    if (res.data.overDueList && res.data.overDueList.length) {
      vm.companyInfoList.push(...res.data.overDueList)
    }
    totalCount = Number(res.totalCount)
    if (vm.companyInfoList.length === totalCount) {
      finished.value = true
    }
    loading.value = false
  })
}

onMounted(() => {
  findOverDuePage()
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
    findOverDuePage()
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
  router.push(`/member/myinfo/interestTrial/detail/${refcode}`)
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
