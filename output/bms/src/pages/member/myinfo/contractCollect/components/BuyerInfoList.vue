<!--
 * @Author       : LongCan.Yang
 * @Date         : 2023-11-23 18:52:19
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 18:18:58
 * @Description  : 签约信息收集-买方企业信息
-->

<template>
  <view>
    <ty-info-card v-if="[3, 4].includes(props.bussType) || (vm.buyerInfoList && vm.buyerInfoList.length)" title="买方企业基本信息">
      <template #subtitle>
        <view class="u-cell__title-text">
          <span class="error">(请完善信息)</span>
        </view>
      </template>
      <view v-if="[3, 4].includes(props.bussType)" class="counterParty" @click="addFconScmVo()">
        <view class="orgName">{{ vm.fconScmVo.actualBuyerInfo.actualName }}</view>
        <view class="creditCode flex">
          <view class="flexNone">
            <text class="iconfont-bms-colorful bms-color-shujutongji"></text>
            <text>统一社会信用代码：</text>
          </view>
          <view class="default-color ellipsis">{{ vm.fconScmVo.actualBuyerInfo.actualCreditCode }}</view>
        </view>
        <view class="personName flex">
          <view class="flexNone">
            <text class="iconfont-bms-colorful bms-color-liangzheng"></text>
            <text>联系人名称：</text>
          </view>
          <view class="default-color ellipsis">{{ vm.fconScmVo.actualBuyerInfo.actualLinkman }}</view>
        </view>
        <view class="information ellipsis">
          <text class="iconfont-bms-colorful bms-color-shoujichongzhi"></text>
          <text>联系人电话：</text>
          <text class="default-color">{{ vm.fconScmVo.actualBuyerInfo.actualLinkmanPhone }}</text>
        </view>
      </view>
      <view v-else>
        <view v-for="item in vm.buyerInfoList" :key="item.refcode" class="counterParty" @click="addInfo(item)">
          <view class="orgName">{{ item.buyerName }}</view>
          <view class="creditCode flex">
            <view class="flexNone">
              <text class="iconfont-bms-colorful bms-color-shujutongji"></text>
              <text>{{ props.bussType === 5 ? '企业登记证件号/注册编号：' : '统一社会信用代码：' }}</text>
            </view>
            <view class="default-color ellipsis">{{ item.buyerCreditCode }}</view>
          </view>
          <view class="personName flex" :class="props.bussType === 5 ? 'information' : ''">
            <view class="flexNone">
              <text class="iconfont-bms-colorful bms-color-liangzheng"></text>
              <text>联系人名称：</text>
            </view>
            <view class="default-color ellipsis">{{ item.linkman }}</view>
          </view>
          <view v-if="props.bussType !== 5" class="information ellipsis">
            <text class="iconfont-bms-colorful bms-color-shoujichongzhi"></text>
            <text>联系人电话：</text>
            <text class="default-color">{{ item.linkmanPhone }}</text>
          </view>
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
import { FconScmVo, FconDtcMListObj } from '@/interfaces/member/myinfo/contractCollect'
import apiSignInfo from '@/api/member/api.signInfo'
import { setStorage, getStorage } from '@/utils/storages'
import { useRouter, onBeforeRouteLeave } from '@/uni-simple-router'
import { onShow } from '@dcloudio/uni-app'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
// const route = useRoute()
const router = useRouter()
let mountedGetData = true // 判断是否需要在mounted钩子获取最新数据，避免bussType未传入onshow回调就已完成
// 查询供应链&供应链+保理实际买方信息
const fconScmVo: FconScmVo = {
  actualBuyerInfo: {
    actualContactAddress: '',
    actualCreditCode: '',
    actualFax: '',
    actualLinkman: '',
    actualLinkmanEmail: '',
    actualLinkmanPhone: '',
    actualName: ''
  },
  billingInfo: {
    accountNo: '',
    address: '',
    bankName: '',
    orgname: '',
    refcode: 0,
    taxpayerIdentificationNumber: '',
    tel: ''
  },
  assignTraderInfoList: [],
  contractFileList: []
}
const buyerInfoList = [] as Array<FconDtcMListObj>
const vm = reactive({
  fconScmVo: fconScmVo,
  buyerInfoList: buyerInfoList
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
 * @description: 非供应链补充买方企业
 */
const addInfo = (item: FconDtcMListObj) => {
  if (props.verifySign === 0) {
    router.push(`/member/myinfo/contractCollect/counterParty/${encodeBase64(item.refcode)}/${encodeBase64(props.bussType)}`)
  } else {
    router.push(`/finFirmCollect/counterParty/${encodeBase64(item.refcode)}/${encodeBase64(props.bussType)}`)
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-24 10:02:35
 * @return {*}
 * @description: 供应链 & 供应链+保理 补充实际买方企业信息
 */
const addFconScmVo = () => {
  if (props.verifySign === 0) {
    router.push(`/member/myinfo/contractCollect/actualBuyerInfo`)
  } else {
    router.push(`/finFirmCollect/actualBuyerInfo`)
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 10:21:34
 * @return {*}
 * @description: 查询供应链实际买方信息
 */
const getSupplyActualBuyerInfo = () => {
  apiSignInfo.getSupplyActualBuyerInfo({ refcode: props.refcode }).then(res => {
    vm.fconScmVo = res.data
    if (!vm.fconScmVo.assignTraderInfoList || !vm.fconScmVo.assignTraderInfoList.length) {
      vm.fconScmVo.assignTraderInfoList = [
        {
          guaCompanyWechat: '',
          refcode: 0,
          tradePersonEmail: '',
          tradePerspnId: '',
          tradePersonName: '',
          tradePerspnTel: '',
          tradePersonType: '',
          tradePersonText: '',
          tradePerspnEmail: ''
        }
      ]
    } else {
      // 退回修改配置tradePersonText
      vm.fconScmVo.assignTraderInfoList.forEach(item => {
        item.tradePersonText = getValueByKey(item.tradePersonType, 'transactionType')
      })
    }
    if (!vm.fconScmVo.billingInfo) {
      vm.fconScmVo.billingInfo = {
        accountNo: '',
        address: '',
        bankName: '',
        orgname: vm.fconScmVo.actualBuyerInfo.actualName,
        refcode: 0,
        taxpayerIdentificationNumber: '',
        tel: ''
      }
    }
    emit('initCollapse')
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 10:21:34
 * @return {*}
 * @description: 非供应链买方企业列表
 */
const getCounterpartyList = () => {
  apiSignInfo.getCounterpartyList({ refcode: props.refcode }).then(res => {
    vm.buyerInfoList = res.data.buyerInfoList
    emit('initCollapse')
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 19:21:10
 * @return {*}
 * @description: 返回所有数据
 */
const getData = () => {
  return vm
}
onShow(() => {
  // 供应链 & 供应链+保理
  if ([3, 4].includes(props.bussType)) {
    if (getStorage('fconScmVo')) {
      vm.fconScmVo = getStorage('fconScmVo') as FconScmVo
    } else {
      getSupplyActualBuyerInfo()
    }
    mountedGetData = false
  } else if ([1, 2, 5].includes(props.bussType)) {
    if (getStorage('buyerInfoList')) {
      vm.buyerInfoList = getStorage('buyerInfoList') as Array<FconDtcMListObj>
    } else {
      getCounterpartyList()
    }
    mountedGetData = false
  }
})
// 解决 小程序接口未请求完成bussType未返回，onShow钩子不会触发问题
onMounted(() => {
  if (mountedGetData) {
    // 供应链 & 供应链+保理
    if ([3, 4].includes(props.bussType)) {
      if (getStorage('fconScmVo')) {
        vm.fconScmVo = getStorage('fconScmVo') as FconScmVo
      } else {
        getSupplyActualBuyerInfo()
      }
    } else if ([1, 2, 5].includes(props.bussType)) {
      // 非供应链业务
      if (getStorage('buyerInfoList')) {
        vm.buyerInfoList = getStorage('buyerInfoList') as Array<FconDtcMListObj>
      } else {
        getCounterpartyList()
      }
    }
  }
})
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
    if ([3, 4].includes(props.bussType)) {
      vm.fconScmVo = Object.assign({}, vm.fconScmVo, vm.fconScmVo.actualBuyerInfo)
      setStorage('fconScmVo', vm.fconScmVo) // 供应链 & 供应链+保理业务 买方企业信息
    } else {
      setStorage('buyerInfoList', vm.buyerInfoList) // 非供应链业务 买方企业信息列表
    }
  }
})
// 暴露方法
defineExpose({
  getData,
  getCounterpartyList,
  getSupplyActualBuyerInfo
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
    color: #666;
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
.flexNone {
  color: #666;
  margin-bottom: 10rpx;
}
</style>
