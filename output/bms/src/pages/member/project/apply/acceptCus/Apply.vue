<!--
 * @Author       : xujie.yu
 * @Date         : 2025-04-21 09:48:07
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-06 15:30:22
 * @Description  : 项目-业务申请-受理客户申请 /member/project/apply/acceptCus/apply
-->
<template>
  <NavBar />
  <view class="businessApply-internation">
    <ty-info-card>
      <view class="topCell">
        <u-cell-group :border="false" :stop="true">
          <view class="item-title">
            <view class="item-title">
              <u-cell title="联系人" :value="submitInfo.linkman" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="联系电话" :value="submitInfo.linkmanphone" :border="false" />
            </view>
            <u-cell title="申请日期" :value="dateFormat(submitInfo.applyDate, 1)" :border="false" />
          </view>
        </u-cell-group>
      </view>
    </ty-info-card>

    <ty-info-card>
      <u-form label-width="35%">
        <view class="internation-info-group">
          <u-cell-group :border="false" :stop="true">
            <u-form-item label="业务产品" label-width="45%" required>
              <view class="unFocus" @click="productShowPicker = true">
                <u-input v-model="showProduceType" placeholder="请选择业务产品" />
              </view>
              <template #right>
                <up-icon name="arrow-down" @click="productShowPicker = true"></up-icon>
              </template>
            </u-form-item>
          </u-cell-group>
        </view>
      </u-form>
      <u-picker
        ref="productPickerRef"
        :show="productShowPicker"
        :columns="remoteData.productColumns"
        :default-index="defaultIndex"
        item-height="88"
        key-name="value"
        @change="changeHandler"
        @confirm="confirmProduct"
        @cancel="productShowPicker = false"
      />
    </ty-info-card>

    <ty-info-card title="卖方基本信息">
      <u-form label-width="30%">
        <view class="internation-info-group">
          <u-cell-group :border="false" :stop="true">
            <u-form-item label="卖方名称" required>
              <view class="unFocus">
                <u-input v-model="submitInfo.orgname" maxlength="90" placeholder="请选择卖方名称" />
              </view>
              <!--   国内业务固定为中国不让选择 -->
            </u-form-item>
            <u-form-item label="卖方所在国" required>
              <view class="unFocus">
                <u-input v-model="submitInfo.orgctyDesc" placeholder="请选择卖方所在国" />
              </view>
            </u-form-item>
          </u-cell-group>
        </view>
      </u-form>
    </ty-info-card>

    <ty-info-card title="买方及贸易信息">
      <template v-if="submitInfo.fintAplDtcVoList && submitInfo.fintAplDtcVoList.length === 0" #subtitle>
        <view class="inviteWrite" @click.stop="addorEditBuyerItem(-1)">
          <text class="iconfont invite icon-plustianjia"></text>
          <text class="name">添加</text>
        </view>
      </template>
      <view v-if="showBuyerInfo" class="buyerinfo-box">
        <view v-for="(item, index) in submitInfo.fintAplDtcVoList" :key="index" class="buyer-swipe" @click="addorEditBuyerItem(index)">
          <ty-swipe-action :index="index">
            <template #slide-right>
              <view class="slide-right" @click="delBuyerItem(index, $event)">
                <text class="iconfont del icon-shanchu"></text>
                <view>删除</view>
              </view>
            </template>
            <view class="buyerList-item">
              <view class="orgname">{{ item.counterpartyName }}</view>
              <view :class="`supplementStatus` + item.supplementStatus">
                {{ getValueByKey(item.supplementStatus, 'supplementStatus') }}
              </view>
              <up-icon name="arrow-right" color="#999999"></up-icon>
            </view>
          </ty-swipe-action>
        </view>
      </view>
    </ty-info-card>
    <view v-if="getHasPermissionsById('member:project:apply:acceptCus')" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="error" native-type="submit" @click="doRejectOrReturn('8')">拒绝</u-button>
        <u-button :loading="loading" block type="warning" native-type="submit" @click="doRejectOrReturn('7')">退回</u-button>
        <!-- <u-button :loading="loading" block type="success" native-type="submit" @click="doSave">保存</u-button> -->
        <u-button :loading="loading" block type="primary" native-type="submit" @click="doSubmit">提交</u-button>
      </view>
    </view>
    <u-modal
      :show="delBuyerFlag"
      title="温馨提示"
      confirm-text="确定"
      :show-cancel-button="true"
      class="accessModal"
      @confirm="confirmDelBuyerItem"
      @cancel="delBuyerFlag = false"
    >
      <view class="slot-content">
        <view>是否确认删除？</view>
      </view>
    </u-modal>
    <u-modal
      :show="dialogShow2"
      mode="center"
      :round="10"
      cancel-text="取消"
      confirm-text="确定"
      show-cancel-button
      show-confirm-button
      @cancel="dialogShow2 = false"
      @confirm="confirmRejectOrReturn"
    >
      <view class="slot-content">
        <view class="title">{{ rejectOrReturnType === '7' ? '确认退回' : '确认拒绝' }}</view>
        <view class="textarea-box">
          <u-textarea
            v-model="submitInfo.approveRemark"
            :confirm-type="null"
            height="125px"
            maxlength="200"
            :placeholder="rejectOrReturnType === '7' ? '请输入退回原因' : '请输入拒绝原因'"
            count
          ></u-textarea>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script lang="ts">
export default {
  name: 'ProjectApplyAcceptCusApply'
}
</script>

<script setup lang="ts">
import { dateFormat } from '@/utils/format'
import { getValueByKey } from '@/utils/constant'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { useRoute, useRouter } from '@/uni-simple-router'
import { getStorage, removeStorage, setStorage } from '@/utils/storages'
import { isEmpty } from '@/utils/validate'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { onShow } from '@dcloudio/uni-app'
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
import type { FintAplDtcVoList, FintAplMVo, ProductTypeList } from '@/interfaces/member/project/apply/businessApply'
// 组件
import NavBar from '@/layout/NavBar.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const productPickerRef = ref()
/**
 * 业务产品选择弹窗的默认选中下标
 */
const defaultIndex = ref([0, 0])
/**
 * 业务产品选择弹窗
 */
const productShowPicker = ref(false)
/**
 * 买方贸易信息显隐
 */
const showBuyerInfo = ref(true)
/**
 * 删除买方信息弹窗flag
 */
const delBuyerFlag = ref(false)
/**
 * 删除买方信息索引
 */
const delIndex = ref(0)
/**
 * 获取路由参数refcode
 */
let refcode = decodeBase64(route.value.params.refcode) === '-1' ? '' : decodeBase64(route.value.params.refcode)
/**
 * 提交信息对象
 */
const submitInfo = ref<FintAplMVo>({
  intLoanStatus: '',
  returnReason: '',
  rejectReason: '',
  annualTurnover: '',
  ccyid: '',
  counterpartyName: '',
  ctyid: '',
  ccyidDesc: '',
  futureAnnualTurnover: '',
  orgctyid: '',
  orgname: '',
  productName: '',
  projectSource: '',
  tenor: '',
  ctyDesc: '',
  orgctyDesc: '',
  superiorName: '',
  superior: '',
  userName: '',
  applyStatus: '',
  referFlag: '',
  applyDate: '',
  tenorStartType: '',
  tenorStartDesc: '',
  transactionYears: '',
  productType: '',
  isSubmit: '',
  bizScene: '',
  fintAplDtcVoList: []
})
/**
 * 页面展示业务产品类型
 */
const showProduceType = computed(() => {
  const bizScene = getValueByKey(submitInfo.value.bizScene as string, 'intBizScene')
  return bizScene ? `${bizScene}-${submitInfo.value.productType}` : submitInfo.value.productType
})
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取准入详情
 */
const getOverseasBusinessInfo = () => {
  apiBusinessApply.getOverseasBusinessInfo(refcode).then(res => {
    submitInfo.value = { ...res.data }
  })
}
/**
 * 远程数据字典项集合
 */
const remoteData = reactive({
  // 业务产品数据
  productTypeList: new Array<ProductTypeList>(),
  // 业务产品字典项
  productColumns: new Array<any>()
})

/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 14:48:38
 * @return {*}
 * @description: 获取业务产品数据并处理数据为字典项
 */
const getProductTypeList = () => {
  apiBusinessApply.getProductTypeList().then(res => {
    if (res.data.productTypeList && res.data.productTypeList.length) {
      remoteData.productTypeList = res.data.productTypeList
      // 处理业务产品字典项
      const parentList = remoteData.productTypeList.map(item => ({ key: item.bizScene, value: getValueByKey(item.bizScene, 'intBizScene') }))
      let parentIndex = remoteData.productTypeList.findIndex(item => item.bizScene === submitInfo.value.bizScene)
      parentIndex = parentIndex === -1 ? 0 : parentIndex
      const sonList = remoteData.productTypeList[parentIndex].aplList.map(item => ({ key: item.bizScene, value: item.bizTypes }))
      let sonIndex = remoteData.productTypeList[parentIndex].aplList.findIndex(item => item.bizTypes === submitInfo.value.productType)
      sonIndex = sonIndex === -1 ? 0 : sonIndex
      remoteData.productColumns = [parentList, sonList] // 业务产品列表
      defaultIndex.value = [parentIndex, sonIndex]
    }
  })
}

/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 14:53:52
 * @param {*} val
 * @return {*}
 * @description: 业务产品选择确认函数
 */
const confirmProduct = val => {
  submitInfo.value.bizScene = val.value[0].key
  submitInfo.value.productType = val.value[1].value
  // 业务产品选择物流是对买方信息对象字段清空
  if (submitInfo.value.productType.includes('物流')) {
    submitInfo.value.fintAplDtcVoList.forEach(item => {
      item.logisticsSystemFlag = ''
      item.waybillVerifyType = ''
      item.waybillVerifyDesc = ''
      item.publicBiddingFlag = ''
    })
  }
  //
  checkBuyerList()
  productShowPicker.value = false
}
/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 14:50:35
 * @param {*} e
 * @return {*}
 * @description: 业务产品父项改变处理对子项从新赋值
 */
const changeHandler = e => {
  const { columnIndex, index } = e
  if (columnIndex === 0) {
    const sonList = remoteData.productTypeList[index].aplList.map(item => ({ key: item.bizScene, value: item.bizTypes }))
    if (productPickerRef.value) {
      productPickerRef.value.setColumnValues(1, sonList)
    }
  }
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:50:02
 * @return {*}
 * @description: 校验买方信息选项是否填完
 */
const checkBuyerList = () => {
  submitInfo.value.fintAplDtcVoList.forEach(item => {
    let filloutFlag = true
    if (
      isEmpty(item.counterpartyName) ||
      isEmpty(item.ctyid) ||
      isEmpty(item.productName) ||
      // eslint-disable-next-line no-extra-parens
      (submitInfo.value.productType.includes('物流') &&
        (isEmpty(item.logisticsSystemFlag) ||
          isEmpty(item.waybillVerifyType) ||
          // eslint-disable-next-line no-extra-parens
          (item.waybillVerifyType === '9' && isEmpty(item.waybillVerifyDesc)) ||
          isEmpty(item.publicBiddingFlag))) ||
      isEmpty(item.tenorStartType) ||
      // eslint-disable-next-line no-extra-parens
      (item.tenorStartType === '5' && isEmpty(item.tenorStartDesc)) ||
      isEmpty(item.tenor) ||
      isEmpty(item.ccyid) ||
      isEmpty(item.annualTurnover) ||
      isEmpty(item.futureAnnualTurnover) ||
      isEmpty(item.transactionYears) ||
      isEmpty(item.projectSource)
    ) {
      filloutFlag = false
    }
    item.supplementStatus = filloutFlag ? '1' : '0'
  })
}

/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 16:35:16
 * @param {*} index -1 添加
 * @return {*}
 * @description: 添加或修改买方贸易信息
 */
const addorEditBuyerItem = index => {
  setStorage('application-fintAplDtcVoList', submitInfo.value.fintAplDtcVoList)
  const path = router.push(
    `/member/project/apply/acceptCus/buyerInfo/${encodeBase64(index)}/${encodeBase64(submitInfo.value.productType || '-1')}/${encodeBase64(
      submitInfo.value.bizScene as string
    )}`
  )
}

/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 16:35:48
 * @param {*} index
 * @param {*} event
 * @return {*}
 * @description: 删除买方贸易信息
 */
const delBuyerItem = (index, event: MouseEvent) => {
  event.stopPropagation()
  delIndex.value = index
  delBuyerFlag.value = true
}

/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 16:36:12
 * @return {*}
 * @description: dialog弹窗确认删除买方贸易信息
 */
const confirmDelBuyerItem = () => {
  submitInfo.value.fintAplDtcVoList.splice(delIndex.value, 1)
  showBuyerInfo.value = false
  nextTick(() => {
    showBuyerInfo.value = true
  })
  delIndex.value = 0
  delBuyerFlag.value = false
}

/**
 * 退回/拒绝弹窗
 */
const dialogShow2 = ref(false)
/**
 * 7-退回/8-拒绝 状态值
 */
const rejectOrReturnType = ref('7')
/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 16:49:05
 * @param {*} val
 * @return {*}
 * @description: 拒绝或退回
 */
const doRejectOrReturn = (val: string) => {
  dialogShow2.value = true
  rejectOrReturnType.value = val
}

/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 16:49:40
 * @return {*}
 * @description: 确认拒绝或退回
 */
const confirmRejectOrReturn = () => {
  if (isEmpty(submitInfo.value.approveRemark)) {
    showToast(rejectOrReturnType.value === '7' ? '请输入退回原因' : '请输入拒绝原因')
    return
  }
  const params = { ...submitInfo.value, isSubmit: '1', intLoanStatus: rejectOrReturnType.value }
  apiBusinessApply.doSubmitAcceptBusinessInfo(params).then(
    () => {
      showToast(rejectOrReturnType.value === '7' ? '退回成功' : '拒绝成功')
      setTimeout(() => {
        router.back(1)
      }, 1000)
    },
    () => {
      loading.value = false
    }
  )
}

/**
 * @Author: xujie.yu
 * @Date: 2025-04-22 16:55:05
 * @return {*}
 * @description: 提交函数
 */
const doSubmit = () => {
  if (isEmpty(submitInfo.value.productType)) {
    showToast('请选择业务产品')
    return
  }
  if (isEmpty(submitInfo.value.orgname)) {
    showToast('请选择卖方名称')
    return
  }
  if (isEmpty(submitInfo.value.orgctyid)) {
    showToast('请选择卖方所在国')
    return
  }
  // 买方列表校验
  if (submitInfo.value.fintAplDtcVoList.length === 0) {
    showToast('请添加买方及贸易信息')
    return
  }
  const pendingBuyer = submitInfo.value.fintAplDtcVoList.find(item => item.supplementStatus === '0')
  if (pendingBuyer) {
    showToast(`请补充${pendingBuyer.counterpartyName}的信息`)
    return
  }

  loading.value = true
  const data = { ...submitInfo.value, isSubmit: '1' }
  apiBusinessApply.doSubmitAcceptBusinessInfo(data).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
      }, 1000)
    },
    () => {
      loading.value = false
    }
  )
}

/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 准入暂存
 */
const doSave = (type?: string) => {
  submitInfo.value.isSubmit = '0'
  loading.value = true
  apiBusinessApply.doSubmitAcceptBusinessInfo(submitInfo.value).then(
    res => {
      refcode = String(res.data.refcode)
      getOverseasBusinessInfo()
      if (type !== 'confirm') {
        showToast('保存成功')
      }
      showBuyerInfo.value = false
      nextTick(() => {
        showBuyerInfo.value = true
      })
      loading.value = false
    },
    () => {
      loading.value = false
    }
  )
}

onMounted(() => {
  getProductTypeList()
  if (refcode) {
    getOverseasBusinessInfo()
  }
})

let firstEntryFlag = true
onShow(() => {
  if (firstEntryFlag) {
    removeStorage('application-fintAplDtcVoList')
    firstEntryFlag = false
  }
  if (getStorage('application-fintAplDtcVoList')) {
    submitInfo.value.fintAplDtcVoList = getStorage('application-fintAplDtcVoList') as FintAplDtcVoList[]
  }
  showBuyerInfo.value = false
  nextTick(() => {
    showBuyerInfo.value = true
  })
  // 从买方信息确认或删除回到页面暂存后刷新数据
  if (getStorage('enter-type') === 'confirm') {
    doSave('confirm')
    removeStorage('enter-type')
  }
})
</script>

<style lang="scss" scoped>
.businessApply-internation {
  margin-top: -20rpx;
  .internation-info-group,
  .topCell {
    :deep(.u-cell-group) {
      padding-top: 0;
      margin: 0;
      .iconfont,
      .u-icon__icon {
        color: $remark-color !important;
      }
      .u-form-item__body__right__content__slot {
        justify-content: flex-end;
      }
    }
  }
  .otherCcyid {
    display: flex;
    align-items: center;
  }
  .appointCcyid {
    margin-right: 6rpx;
  }
}

.buyerinfo-box {
  .buyer-swipe:last-child {
    margin-bottom: 20rpx;
  }
  .buyer-swipe {
    height: 100rpx;
    display: flex;
    align-items: center;
    border-bottom: solid 1rpx #dedede;
    user-select: none; /* 禁止文本选中 */
    -webkit-user-select: none; /* 兼容iOS */
    -moz-user-select: none; /* 兼容Firefox */
    .slide-right {
      width: 140rpx;
      height: 100rpx;
      background: $u-error;
      color: #fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .del {
        padding-bottom: 5rpx;
      }
    }
  }
  .buyerList-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    .orgname {
      width: 470rpx;
      color: $default-color;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .supplementStatus0 {
      color: $u-warning;
    }
    .supplementStatus1 {
      color: $u-success;
    }
  }
}
.slot-content {
  color: #646566;
  .title {
    margin-bottom: 30rpx;
  }
  :deep(.u-textarea) {
    padding: 18rpx 18rpx 32rpx;
    text-align: left;
  }
}
</style>
