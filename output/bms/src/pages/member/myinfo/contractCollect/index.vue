<!--
 * @Author       : longcan.Yang
 * @Date         : 2023-01-04 16:30:50
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-04 09:28:21
 * @Description  :/member/myinfo/contractCollect 签约信息收集列表页面
-->
<template>
  <NavBar />
  <view class="bigBox">
    <uni-list v-if="vm.fconMakMVoList && vm.fconMakMVoList.length" v-model:loading="loading">
      <uni-list-item v-for="item in vm.fconMakMVoList" :key="item.refcode" class="list-item" @tap="addInformation(item)">
        <view class="container">
          <view class="main">
            <view class="companyName">{{ item.orgname }}</view>
            <view class="number">
              <view class="label">
                <i class="iconfont-bms-colorful bms-color-shujutongji"></i>
                核贷书编号：
              </view>
              <view class="numberValue ellipsis">{{ item.creditNo }}</view>
              <view class="button" :class="'type' + item.contractInfoStatus">{{ item.contractInfoStatus === '1' ? '待补充' : '已退回' }}</view>
            </view>
            <view class="abstract">
              <text class="identify">摘要</text>
              <text class="label">{{ item.contractInfoStatus === '1' ? '待补充：' : '退回原因：' }}</text>
              <text class="summary">{{ item.summary }}</text>
            </view>
          </view>

          <view class="line"></view>
        </view>
      </uni-list-item>
      <view v-if="finished" class="list-is-finished">已经到底了</view>
    </uni-list>
    <!-- <u-empty v-else :image="empty" :image-size="[164, 130]" description="暂无数据" /> -->
    <u-empty v-else mode="data" :icon="empty" :text="'暂无数据'" width="300" height="244"></u-empty>
  </view>
</template>
<script lang="ts">
export default {
  name: 'MyinfoContractCollect'
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import empty from '@/assets/empty/empty.png'
import { encodeBase64 } from '@/utils/crypto'
import apiSignInfo from '@/api/member/api.signInfo'
import { FconMakMVo } from '@/interfaces/member/myinfo/contractCollect'
import { useRouter } from '@/uni-simple-router'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import { removeStorage } from '@/utils/storages'
let loading = ref(false)
let finished = ref(false)
let totalCount = 0
const router = useRouter()
const search = {
  pageNum: 1,
  pageSize: 10
}
const vm = reactive({
  fconMakMVoList: Array<FconMakMVo>()
})
const findMakingContractPage = (): void => {
  apiSignInfo.findMakingContractPage(search).then(res => {
    if (res.data.fconMakMVoList && res.data.fconMakMVoList.length) {
      vm.fconMakMVoList.push(...res.data.fconMakMVoList)
    }
    totalCount = Number(res.totalCount)
    loading.value = false
    if (vm.fconMakMVoList.length === totalCount && totalCount > 0) {
      finished.value = true
    }
  })
}
// onMounted(() => {
//   findMakingContractPage()
// })

onShow(() => {
  search.pageNum = 1
  vm.fconMakMVoList = []
  findMakingContractPage()
})
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:45:08
 * @description: 下拉刷新
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount / search.pageSize)) {
    loading.value = true
    search.pageNum++
    findMakingContractPage()
  }
})
const addInformation = (item): void => {
  removeStorage('loanOrgInfo')
  removeStorage('loanOrgTransferLinkInfo')
  removeStorage('fconScmVo')
  removeStorage('buyerInfoList')
  removeStorage('suretyEnterpriseList')
  removeStorage('suretyPersonList')
  router.push(`/member/myinfo/contractCollect/collectInfo/${encodeBase64(item.refcode)}`)
}
</script>

<style lang="scss" scoped>
.bigBox {
  padding-bottom: 20rpx;
  .line {
    margin-top: 20rpx;
    width: 100%;
    height: 20rpx;
    background: #f6f6f6;
  }
  .list-item {
    &:last-of-type {
      .line {
        height: 2rpx;
      }
    }
  }
  .container {
    .main {
      padding: 30rpx 20rpx 20rpx 20rpx;
    }
    .label {
      color: $remark-color;
    }
    .companyName {
      font-size: 30rpx;
      font-weight: bold;
    }
    .number {
      display: flex;
      align-items: baseline;
      font-size: 28rpx;
      margin-top: 30rpx;
      // display: flex;
      // justify-content: center;
      .type1 {
        @include mixin-status(0);
      }
      .type3 {
        @include mixin-status(9);
      }
      .numberValue {
        width: 45%;
      }
      .button {
        margin-left: auto;
        background-color: #fff;
      }
      .icon-shujutongji {
        vertical-align: bottom;
        font-size: 36rpx;
        opacity: 0.4;
      }
    }
    .abstract {
      margin-top: 40rpx;
      font-size: 28rpx;
      .identify {
        margin-right: 14rpx;
        padding: 8rpx;
        font-size: 24rpx;
        background-color: #e4f2fd;
        color: #1a89f2;
        border-radius: 5rpx;
      }
      .summary {
        line-height: 44rpx;
        word-break: break-all;
        & :first-child {
          word-break: break-all;
        }
      }
    }
  }
}
</style>
