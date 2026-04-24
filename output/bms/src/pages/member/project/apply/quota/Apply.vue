<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:45:24
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-20 11:06:11
 * @Description  : 项目-业务申请-申请买方额度 /member/project/apply/quota/apply
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <ty-info-card>
        <view class="card-cell-group">
          <u-cell-group>
            <u-cell title="业务产品" :value="getProduceType" />
          </u-cell-group>
        </view>
      </ty-info-card>
      <ty-info-card title="卖方信息">
        <u-form label-width="30%">
          <view class="internation-info-group">
            <u-cell-group>
              <u-form-item label="卖方名称" required>
                <view class="unFocus">
                  <u-input v-model="vm.submitInfo.orgname" maxlength="90" placeholder="请选择卖方名称" />
                </view>
              </u-form-item>
              <u-form-item label="卖方所在国" required>
                <view class="unFocus">
                  <u-input v-model="vm.submitInfo.ctyDesc" placeholder="请选择卖方所在国" />
                </view>
              </u-form-item>
            </u-cell-group>
          </view>
        </u-form>
      </ty-info-card>
      <ty-info-card title="买方及额度申请信息">
        <template #subtitle>
          <view class="inviteWrite" @click.stop="addBuyer">
            <text class="iconfont invite icon-plustianjia"></text>
            <text class="name">添加</text>
          </view>
        </template>
        <view v-if="showEdit">
          <view v-for="(item, i) in vm.submitInfo.buyerList" :key="i" class="buyer-swipe" @click="editBuyer(i)">
            <ty-swipe-action :index="i">
              <template #slide-right>
                <view class="slide-right" @click="onDeleteBuyer(i, item, $event)">
                  <text class="iconfont del icon-shanchu"></text>
                  <view>删除</view>
                </view>
              </template>
              <view class="buyerList-item">
                <view class="orgname">{{ item.aplOrgname }}</view>
                <view :class="`supplementStatus` + item.supplementStatus">
                  {{ getValueByKey(item.supplementStatus, 'supplementStatus') }}
                </view>
                <up-icon name="arrow-right" color="#999999"></up-icon>
              </view>
            </ty-swipe-action>
          </view>
        </view>
      </ty-info-card>
      <view v-if="getHasPermissionsById('member:project:apply:access')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button :loading="loading" block type="success" native-type="submit" @click="doSave">保存</u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onSubmit">提交</u-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { QuotaInfo, BuyerList } from '@/interfaces/member/project/apply/quota'
import { OaOrgList } from '@/interfaces/member/project/apply/businessApply'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import apiCommon from '@/api/common/api.common'
import { CountryList } from '@/interfaces/common/common'
import { isEmpty } from '@/utils/validate'
import apiQuota from '@/api/member/project/apply/api.quota'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { setStorage } from '@/utils/storages'
import { useRouter, useRoute } from '@/uni-simple-router'
import { onShow } from '@dcloudio/uni-app'
import { getStorage, removeStorage } from '@/utils/storages'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
let holdName = ref('')
let showEdit = ref(true)
let aplRefcode: number | string = '-1' // 业务准入流水号
let appRefcode: number | string = '-1' // 卖方流水号临时保存后存在
const sellerList: OaOrgList[] = [] // 卖方国家列表
const countryList: CountryList[] = []
let submitInfo: QuotaInfo = {
  refcode: '',
  orgname: '',
  ctyid: '',
  ctyDesc: '',
  bizScene: '',
  productType: '',
  submitFlag: '',
  buyerList: []
}
let vm = reactive({
  submitInfo: submitInfo, // 提交信息
  countryList: countryList, // 所有国家信息
  sellerList: sellerList // 卖方国家列表
})
type ListType = {
  code: string
  text: string
  ctyFlag: string
}
let selectCountryList = reactive({
  data: Array<ListType>()
})
const getProduceType = computed(() => {
  const bizScene = getValueByKey(vm.submitInfo.bizScene as string, 'intBizScene')
  return bizScene ? `${bizScene}-${vm.submitInfo.productType}` : vm.submitInfo.productType
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 16:56:09
 * @param {*} val
 * @description: 分类选择组件查询方法
 */
const getCountryList = (val: string) => {
  holdName.value = val
  //citFlag  1=白名单/2=黑名单/-=全部
  const citFlag = '-'
  return new Promise<Array<ListType>>((resolve, reject) => {
    selectCountryList.data = []
    apiCommon.getCountryList(citFlag, val).then(
      res => {
        if (res.data.countryList && res.data.countryList.length) {
          res.data.countryList.forEach(item => {
            selectCountryList.data.push({
              code: item.ctyid,
              text: item.ctyDesc,
              ctyFlag: item.ctyFlag
            })
          })
        } else {
          selectCountryList.data = []
        }
        resolve(selectCountryList.data)
      },
      () => {
        reject(false)
      }
    )
  })
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取申请额度详情
 */
const getQuotaInfo = () => {
  apiQuota.getQuotaInfo({ aplRefcode, appRefcode }).then(res => {
    vm.submitInfo = res.data.quotaInfo
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务提交
 */
const onSubmit = () => {
  // 买方列表校验
  if (isEmpty(vm.submitInfo.ctyid)) {
    showToast('请选择买方所在国')
    return
  }
  if (isEmpty(vm.submitInfo.buyerList)) {
    showToast('请添加买方信息')
    return
  }
  if (vm.submitInfo.buyerList) {
    const pendingBuyer = vm.submitInfo.buyerList.find(item => item.supplementStatus === '0')
    if (pendingBuyer) {
      showToast(`请补充${pendingBuyer.aplOrgname}的信息`)
      return
    }
  }
  loading.value = true
  vm.submitInfo.submitFlag = '1'
  apiQuota.doSubmitApply(vm.submitInfo).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
      }, 1500)
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
 * @description: 申请买方额度暂存
 */
const doSave = (type?: string) => {
  vm.submitInfo.submitFlag = '0'
  if (isEmpty(vm.submitInfo.buyerList)) {
    showToast('请至少至少选择一个买方')
    return
  }
  loading.value = true
  apiQuota.doSubmitApply(vm.submitInfo).then(
    res => {
      appRefcode = res.data.refcode
      getQuotaInfo()
      if (type !== 'confirm') {
        showToast('保存成功')
      }
      showEdit.value = false
      nextTick(() => {
        showEdit.value = true
      })
      loading.value = false
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
 * @description: 获取业务产品
 */
// 添加买方信息
const addBuyer = () => {
  setStorage('quota-buyerlist', vm.submitInfo.buyerList)
  const path = `/member/project/apply/quota/buyerInfo/${encodeBase64(-1)}/${encodeBase64(vm.submitInfo.orgname)}/${encodeBase64(
    vm.submitInfo.productType
  )}
  )}`
  router.push(path)
}
// 修改买方信息
const editBuyer = index => {
  setStorage('quota-buyerlist', vm.submitInfo.buyerList)
  const path = `/member/project/apply/quota/buyerInfo/${encodeBase64(index)}/${encodeBase64(vm.submitInfo.orgname)}/${encodeBase64(
    vm.submitInfo.productType
  )}
  )}`
  router.push(path)
}
// 删除买方信息
const onDeleteBuyer = (index, item, event: MouseEvent) => {
  event.stopPropagation()
  if (vm.submitInfo.buyerList.length <= 1) {
    showToast('请至少保留一个买方')
    showEdit.value = false
    nextTick(() => {
      showEdit.value = true
    })
    return
  }
  if (isEmpty(item.refcode)) {
    vm.submitInfo.buyerList.splice(index, 1)
    showEdit.value = false
    nextTick(() => {
      showEdit.value = true
    })
  } else {
    apiQuota.doDeleteBuyer(item.refcode).then(() => {
      vm.submitInfo.buyerList.splice(index, 1)
      showEdit.value = false
      nextTick(() => {
        showEdit.value = true
      })
    })
  }
}
onMounted(() => {
  getCountryList('') // 获取国家列表
  if (route.value.params) {
    aplRefcode = decodeBase64(route.value.params.aplRefcode)
    appRefcode = route.value.params.appRefcode ? decodeBase64(route.value.params.appRefcode) : ''
    if (!isEmpty(aplRefcode)) {
      getQuotaInfo()
    }
  }
})
let firstEntryFlag = true
onShow(() => {
  if (firstEntryFlag) {
    removeStorage('quota-buyerlist')
    firstEntryFlag = false
  }
  if (getStorage('quota-buyerlist')) {
    vm.submitInfo.buyerList = getStorage('quota-buyerlist') as BuyerList[]
  }
  showEdit.value = false
  nextTick(() => {
    showEdit.value = true
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
.selectCountryClass {
  box-sizing: border-box;
  height: calc(100vh - 44px);
  overflow-y: hidden;
}
.buyer-swipe:last-child {
  margin-bottom: 20rpx;
}
.buyer-swipe {
  height: 100rpx;
  display: flex;
  align-items: center;
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
</style>
