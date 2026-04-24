<!--
 * @Author       : LongCan.Yang
 * @Date         : 2023-11-23 18:52:19
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 18:21:00
 * @Description  : 签约信息收集-连带保证人信息
-->

<template>
  <view>
    <ty-info-card v-if="vm.suretyPersonList && vm.suretyPersonList.length" title="连带保证人信息">
      <template #subtitle>
        <view class="u-cell__title-text">
          <span class="error">(请完善信息)</span>
        </view>
      </template>
      <view v-for="item in vm.suretyPersonList" :key="item.refcode" class="counterParty" @click="addInfo(item)">
        <view class="orgName">{{ item.guaName }}</view>
        <view class="creditCode">
          <view class="ellipsis telephone">
            <text class="iconfont-bms-colorful bms-color-shoujichongzhi"></text>
            <text>电话：</text>
            <text class="default-color">{{ item.guaTel }}</text>
          </view>
          <view class="ellipsis identityNo">
            <text class="iconfont-bms-colorful bms-color-zhengjian"></text>
            <text>身份证号：</text>
            <text class="default-color">{{ item.guaIdNo }}</text>
          </view>
        </view>
        <view class="information flex">
          <view class="flexNone">
            <text class="iconfont-bms-colorful bms-color-dingwei"></text>
            <text>地址：</text>
          </view>
          <view class="default-color ellipsis">{{ item.guaAddress }}</view>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>
<script lang="ts">
export default {
  name: 'OrgLinkInfo'
}
</script>
<script setup lang="ts">
import { GuarantorEnterpriseInfo } from '@/interfaces/member/myinfo/contractCollect'
import apiSignInfo from '@/api/member/api.signInfo'
import { setStorage, getStorage } from '@/utils/storages'
import { useRouter, onBeforeRouteLeave } from '@/uni-simple-router'
import { onShow } from '@dcloudio/uni-app'
import { encodeBase64 } from '@/utils/crypto'
// const route = useRoute()
const router = useRouter()
const suretyPersonList = [] as Array<GuarantorEnterpriseInfo>
const vm = reactive({
  suretyPersonList: suretyPersonList
})
const emit = defineEmits(['initCollapse'])
const props = defineProps({
  /**
   * 合同制作流水号
   */
  refcode: {
    type: Number,
    default: 0,
    required: true
  },
  /**
   * 业务大类[1=国内保理/2=反向保理/3=供应链+保理/4=供应链/5=国际保理]
   */
  bussType: {
    type: Number,
    default: 0,
    required: true
  },
  /**
   * 是否校验标识【0=客户经理，校验/1=融资企业，不校验】
   */
  verifySign: {
    type: Number,
    default: 0,
    required: true
  }
})
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-09 15:22:24
 * @param {*} void
 * @return {*}
 * @description: 补充信息
 */
const addInfo = (item: GuarantorEnterpriseInfo) => {
  if (props.verifySign === 0) {
    router.push(`/member/myinfo/contractCollect/suretyPerson/${encodeBase64(item.refcode)}`)
  } else {
    router.push(`/finFirmCollect/suretyPerson/${encodeBase64(item.refcode)}`)
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 10:21:34
 * @return {*}
 * @description: 查询连带保证人企业信息列表
 */
const getsuretyPersonList = () => {
  let data = {
    refcode: props.refcode,
    guaType: '2'
  }
  apiSignInfo.getGuarantorInfo(data).then(res => {
    vm.suretyPersonList = res.data.guarantorEnterpriseList
    emit('initCollapse')
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-24 15:09:51
 * @return {*}
 * @description: 前往子页面补录信息，缓存数据
 */
onBeforeRouteLeave((to, from) => {
  if (
    to.name === 'MyinfoContractCollectCounterParty' ||
    to.name === 'MyinfoContractCollectSuretyEnterprise' ||
    to.name === 'MyinfoContractCollectSuretyPerson' ||
    to.name === 'MyinfoContractCollectActualBuyerInfo' ||
    to.name === 'FinFirmCollectCounterParty' ||
    to.name === 'FinFirmCollectSuretyEnterprise' ||
    to.name === 'FinFirmCollectSuretyPerson' ||
    to.name === 'FinFirmCollectActualBuyerInfo'
  ) {
    setStorage('suretyPersonList', vm.suretyPersonList)
  }
})
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 19:21:10
 * @return {*}
 * @description: 返回所有数据
 */
const getData = () => {
  return vm.suretyPersonList
}
onShow(() => {
  if (getStorage('suretyPersonList')) {
    vm.suretyPersonList = getStorage('suretyPersonList') as Array<GuarantorEnterpriseInfo>
  } else {
    getsuretyPersonList()
  }
})
// 暴露方法
defineExpose({
  getData,
  getsuretyPersonList
})
</script>

<style lang="scss" scoped>
.counterParty {
  border-bottom: 1rpx solid #ededed;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  .orgName {
    font-size: 28rpx;
    font-weight: 400;
    color: $default-color;
  }
  .creditCode {
    // display: flex;
    margin-top: 25rpx;
  }
  .accountNumber,
  .openingBank {
    // margin-top: 8rpx;
    color: $default-color;
  }
  .default-color {
    color: $default-color;
  }
  .information {
    margin-top: 10rpx;
    margin-bottom: 30rpx;
  }
  .identityNo,
  .personName {
    margin-top: 10rpx;
  }
  .iconfont-bms-colorful {
    // opacity: 0.4;
    vertical-align: bottom;
    font-size: 36rpx;
    margin-right: 10rpx;
  }
}
</style>
