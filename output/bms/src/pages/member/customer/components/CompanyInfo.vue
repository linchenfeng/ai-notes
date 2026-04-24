<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-09 15:19:54
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-18 13:58:16
 * @Description  : 我的客户 /member/customer/components/CompanyInfo
-->
<template>
  <view class="companyInfoBox">
    <view class="companyName ellipsis">{{ props.companyInfo.orgname }}</view>
    <view class="companyContent">
      <text class="identification mgr-10">
        <text class="customTypePng"><cover-image :src="typePngVo[props.companyInfo.customType]" alt="客户类型" /></text>
        <text class="describe">{{ getValueByKey(props.companyInfo.customType, 'customerType') }}</text>
      </text>
      <text v-if="props.companyInfo.managementScale" class="companyType mgr-10">
        {{ props.companyInfo.managementScale }}
      </text>
      <text v-if="props.companyInfo.oaIndustry" class="companyDomain">
        {{ props.companyInfo.oaIndustry }}
      </text>
    </view>
    <text
      v-if="props.showInvited && props.companyInfo.customType === '3'"
      class="invitationStatus"
      :class="{ invited: props.companyInfo.entryInvitationStatus === '2' }"
    >
      {{ getValueByKey(props.companyInfo.entryInvitationStatus, 'entryInvitationStatus') }}
    </text>
    <view v-if="isNotEmpty(props.companyInfo.registOrgname) && props.source === 'detail'" class="ellipsis resgist">
      注册名称：{{ props.companyInfo.registOrgname }}
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'CompanyInfo'
}
</script>
<script lang="ts" setup>
import { PropType } from 'vue'
import { CustomerInfo } from '@/interfaces/member/customer'
import { getValueByKey } from '@/utils/constant'
import qianzai from '@/assets/member/customer/customerqianzai.png'
import renzhen from '@/assets/member/customer/customerrenzhen.png'
import zhuce from '@/assets/member/customer/customerzhuce.png'
import { isNotEmpty } from '@/utils/validate'
const props = defineProps({
  /**
   * 客户信息
   */
  companyInfo: {
    type: Object as PropType<CustomerInfo>,
    required: true
  },
  /**
   * 是否展示入驻邀请状态
   */
  showInvited: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    default: ''
  }
})
let typePngVo = reactive({
  '1': renzhen,
  '2': zhuce,
  '3': qianzai
})
</script>
<style lang="scss" scoped>
.companyInfoBox {
  position: relative;
  padding: 40rpx 20rpx 20rpx 20rpx;
  border-bottom: 1rpx solid $border-color;
  box-sizing: border-box;
  .companyName {
    font-size: 32rpx;
    margin-bottom: 20rpx;
  }
  .companyContent {
    // display: flex;
    font-size: 24rpx;
    .mgr-10 {
      margin-right: 20rpx;
    }
    .companyType,
    .companyDomain {
      padding: 12rpx 10rpx;
      text-align: center;
      border-radius: 5rpx;
      background-color: #e0f3f7;
      color: $primary;
    }
    .identification {
      padding: 10rpx 10rpx;
      text-align: center;
      border-radius: 5rpx;
      display: inline-block;
      color: $success;
      background-color: #fff;
      border: solid 1rpx $success;
      .customTypePng {
        display: inline-block;
        margin: -3rpx 10rpx 0 0;
        cover-image {
          width: 23rpx;
          height: 23rpx;
          vertical-align: middle;
        }
      }
      .describe {
        display: inline-block;
      }
    }
    .companyType,
    .companyDomain {
      line-height: 68rpx;
    }
  }
  .invitationStatus {
    position: absolute;
    right: -30rpx;
    top: 0;
    width: 100rpx;
    height: 50rpx;
    line-height: 50rpx;
    border-bottom-left-radius: 15rpx;
    background-color: $warning;
    font-size: 24rpx;
    color: #fff;
    text-align: center;
    &.invited {
      background-color: $success;
    }
  }
}
.resgist {
  margin-top: 20rpx;
  font-size: 32rpx;
}
</style>
