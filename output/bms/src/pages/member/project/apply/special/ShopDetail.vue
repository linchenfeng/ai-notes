<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-01 13:06:45
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-31 13:50:10
 * @Description  : 项目-业务申请-特批申请-店铺信息(审批、查询查看店铺信息) /member/project/apply/special/shopDetail/:refcode
-->

<template>
  <NavBar />
  <ty-info-card v-for="(item, i) in vm.shopList" :key="item.sellingPartnerId" :show-line="i !== 0">
    <view class="item-box">
      <view class="right-box">
        <view class="line-item">
          <view class="line-title">店铺名称</view>
          <view class="line-content">{{ item.shopName }}</view>
        </view>
        <view class="line-item">
          <view class="line-title">店铺ID</view>
          <view class="line-content">{{ item.sellingPartnerId }}</view>
        </view>
        <view class="child-box">
          <view v-for="(subItem, j) in item.floaShopSubMList" :key="j" class="child-item">
            <view class="child-right-box">
              <view class="line-item">
                <view class="line-title child-title">店铺所在国家</view>
                <view class="line-content">{{ subItem.shopCountry }}</view>
              </view>
              <view class="line-item">
                <view class="line-title child-title">不准入原因</view>
                <view class="line-content">
                  <!-- {{ subItem.notRatifyRemark }} -->
                  <view v-for="(remark, index) in subItem.notRatifyRemarkList" :key="index">
                    <view v-if="remark" class="remark">{{ `${index + 1}.` + remark }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </ty-info-card>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiSpecialApprovalQuery from '@/api/member/project/query/api.specialApprovalQuery'
import { useRoute } from '@/uni-simple-router'
import { ShopList } from '@/interfaces/member/project/apply/specialApproval'
import { decodeBase64 } from '@/utils/crypto'
const route = useRoute()
let refcode = ''

let shopList: ShopList[] = []
let vm = reactive({
  shopList: shopList
})

const getSpecialAppInfo = () => {
  const data = {
    refcode
  }
  apiSpecialApprovalQuery.getSpecialAppInfo(data).then(res => {
    if (res.data.saaVo && res.data.saaVo.shopList) {
      vm.shopList = res.data.saaVo.shopList
    }
    if (vm.shopList && vm.shopList.length) {
      vm.shopList.forEach(item => {
        if (item.floaShopSubMList && item.floaShopSubMList.length) {
          item.floaShopSubMList.forEach(countryItem => {
            if (countryItem.notRatifyRemark) {
              countryItem.notRatifyRemarkList = countryItem.notRatifyRemark.split(';')
            }
          })
        }
      })
    }
  })
}
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode)
    if (refcode) {
      getSpecialAppInfo() // 获取详情
    }
  }
})
</script>

<style lang="scss" scoped>
.title {
  padding: 40rpx 0 10rpx 30rpx;
  font-size: 32rpx;
}
.item-box {
  display: flex;

  .right-box {
    width: 100%;
    padding-bottom: 10rpx;
    .line-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 34rpx;
      line-height: 44rpx;
      .line-title {
        color: #666;
        flex: none;
        margin-right: 16rpx;
      }
      .line-content {
        word-break: break-all;
        .remark {
          margin-bottom: 6rpx;
        }
      }
    }
    .child-box {
      background: #f6fafd;
      border-radius: 5rpx;
      padding: 30rpx 20rpx 0;
      .child-item {
        display: flex;
        margin-bottom: 30rpx;
        border-bottom: 1rpx solid #e6e6e6;
        &:last-of-type {
          border-bottom: none;
        }
        .child-right-box {
          width: 100%;
          .line-item {
            justify-content: start;
            .child-title {
              width: 180rpx;
              margin-right: 10rpx;
              flex: none;
            }
          }
        }
      }
    }
  }
}
:deep(.u-checkbox-group) {
  flex-flow: row;
  .u-checkbox {
    margin: 0 8rpx 0 0;
    .u-icon__icon {
      font-size: 24rpx !important;
    }
  }
}

.button-fixed-bottom {
  .count-box {
    flex: none;
    font-size: 28rpx;
    min-width: 180rpx;
    color: #999;
    .error {
      color: $u-error;
      margin: 0 2rpx;
    }
  }
}
</style>
