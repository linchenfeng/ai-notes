<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-14 14:56:42
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-17 09:28:55
 * @Description  : 项目-业务申请-补充买方信息 /member/project/apply/quota/buyerInfo
-->
<template>
  <NavBar />

  <view class="application-BuyerInfo">
    <u-form label-width="43%">
      <ty-info-card :show-line="false" title="买方信息">
        <u-form-item label="买方名称" required>
          <view class="unFocus" @click="showBuyer">
            <u-input v-model="vm.buyerItem.aplOrgname" maxlength="90" :readonly="index === -1 ? false : true" placeholder="请选择买方名称" />
          </view>
          <template v-if="index === -1" #right>
            <up-icon name="arrow-right" @click="showBuyer"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="统一社会信用代码/\n公司注册编号\n(Company Registration No)" label-width="55%" required>
          <u-input
            v-model="vm.buyerItem.companyRegistrationNo"
            maxlength="35"
            placeholder="请输入统一社会信用代码/公司注册编号(Company Registration No)"
          />
        </u-form-item>
        <u-form-item label="所在国" required>
          <view class="unFocus">
            <u-input v-model="vm.buyerItem.ctyDesc" placeholder="请选择买方所在国" />
          </view>
        </u-form-item>
        <u-form-item label="详细地址" label-width="50%" required>
          <u-input v-model="vm.buyerItem.addressEn" maxlength="35" placeholder="请输入详细地址" />
        </u-form-item>
      </ty-info-card>
      <ty-info-card title="额度申请信息">
        <u-form-item label="币种" label-width="50%" required>
          <view class="ccyid">
            <text>{{ getValueByKey(vm.buyerItem.applyCcyid, 'applyCcyid') }}</text>
          </view>
        </u-form-item>
        <u-form-item label="额度申请金额(万元)" label-width="50%" required>
          <view class="ccyid">
            <text>{{ vm.buyerItem.applyCcyid }}</text>
          </view>
          <InputNumber ref="checkAmtRef" v-model:number="vm.buyerItem.applyAmt" placeholder="请输入额度申请金额" maxlength="11"></InputNumber>
        </u-form-item>
        <u-form-item label="备注说明" label-width="55%"></u-form-item>
        <view class="content pre-wrap">
          <u-textarea
            v-model="vm.buyerItem.applyRemark"
            :confirm-type="null"
            auto-height
            maxlength="300"
            count
            class="inputValueClass"
            placeholder="若有其他说明请备注"
          ></u-textarea>
        </view>
      </ty-info-card>
    </u-form>
  </view>
  <view class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <u-button :loading="loading" block type="error" native-type="submit" @click="onDelete">删除</u-button>
      <u-button :loading="loading" block type="primary" native-type="submit" @click="onSubmit">确认</u-button>
    </view>
  </view>
  <!-- 买方信息 -->
  <u-popup :show="showSelectBuyer" mode="center">
    <OrgList
      type="list"
      title="买方信息"
      id-key="aplFinancingNo"
      name-key="aplOrgname"
      :data="findBuyerData.list"
      :search-fun="findAplBuyerPage"
      @back="closeOrg"
      @click-fun="clickOrgFun"
    ></OrgList>
  </u-popup>
  <u-modal
    :show="showModalFlag"
    title="温馨提示"
    confirm-text="确定"
    :show-cancel-button="true"
    class="accessModal"
    @confirm="onConfirm"
    @cancel="showModalFlag = false"
  >
    <view class="slot-content">
      <view>是否确认删除？</view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { BuyerList, SelectBuyerList } from '@/interfaces/member/project/apply/quota'
import apiCommon from '@/api/common/api.common'
import { useRoute, useRouter } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import { isEmpty } from '@/utils/validate'
import { setStorage, getStorage } from '@/utils/storages'
import { showToast } from '@/utils/uniapp/toast'
import apiQuota from '@/api/member/project/apply/api.quota'
import OrgList from '@/pages/member/project/apply/application/components/OrgList.vue'
import InputNumber from '@/plugins/InputNumber.vue'
import { getValueByKey } from '@/utils/constant'
import apiFillingApplication from '@/api/member/project/apply/api.fillingApplication'
const route = useRoute()
const router = useRouter()
let index = -1
let orgname = '' // 卖方名称
let productType = '' // 业务产品
const loading = ref(false)
let holdName = ref('')
let showModalFlag = ref(false) // 拒绝弹窗
let checkWhiteList = ref(false)
const showSelectBuyer = ref(false) //是否显示买方列表页面
type ListType = {
  code: string
  text: string
  ctyFlag: string
}
let selectCountryList = reactive({
  data: Array<ListType>()
})
const buyerItem: BuyerList = {
  refcode: '',
  buyerBusinessNo: '',
  buyerRefcode: '',
  aplOrgname: '',
  orgctyid: '',
  ctyDesc: '',
  addressEn: '',
  applyAmt: '',
  applyCcyid: 'CNY',
  applyRemark: '',
  supplementStatus: '',
  aplFinancingNo: ''
}
// 可选择买方列表
let FindBuyer: SelectBuyerList[] = []
let findBuyerData = reactive({
  list: FindBuyer
})
let buyerList: BuyerList[] = []
let vm = reactive({
  buyerItem: buyerItem, //当前买方信息
  buyerList: buyerList //当前买方列表
})
const showBuyer = () => {
  if (index === -1) {
    showSelectBuyer.value = true
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 16:56:09
 * @param {*} val isCheckWhiteList是否查询全部国家【true=是/false=否】
 * @description: 分类选择组件查询方法
 */
const getCountryList = (val: string, isCheckWhiteList: boolean) => {
  holdName.value = val
  checkWhiteList.value = isCheckWhiteList
  //citFlag  1=白名单/2=黑名单/-=全部
  const citFlag = isCheckWhiteList ? '1' : '-'
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
const closeOrg = () => {
  showSelectBuyer.value = false
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 16:47:36
 * @description: 获取企业信息
 */
const getApplyOrgInfo = () => {
  apiFillingApplication.getApplyOrgInfo(vm.buyerItem.aplOrgname, '2').then(res => {
    vm.buyerItem.companyRegistrationNo = res.data.companyCreditCode
    vm.buyerItem.addressEn = res.data.address
  })
}
//选择买方名称回显
const clickOrgFun = (data: SelectBuyerList) => {
  vm.buyerItem.ctyDesc = data.ctyDesc
  vm.buyerItem.orgctyid = data.orgctyid
  vm.buyerItem.aplOrgname = data.aplOrgname
  vm.buyerItem.addressEn = data.address
  vm.buyerItem.companyRegistrationNo = data.companyRegistrationNo
  vm.buyerItem.buyerRefcode = data.buyerRefcode
  vm.buyerItem.aplFinancingNo = data.aplFinancingNo
  getApplyOrgInfo()
  showSelectBuyer.value = false
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:07:08
 * @description: 买方信息确定
 */
const onSubmit = () => {
  if (isEmpty(vm.buyerItem.aplOrgname)) {
    showToast('请选择买方名称')
    return
  }
  if (!isEmpty(vm.buyerItem.applyAmt) && Number(vm.buyerItem.applyAmt) <= 0) {
    showToast('额度申请金额需大于0')
    return
  }
  let filloutFlag = true
  if (
    isEmpty(vm.buyerItem.aplOrgname) ||
    isEmpty(vm.buyerItem.companyRegistrationNo) ||
    isEmpty(vm.buyerItem.orgctyid) ||
    isEmpty(vm.buyerItem.addressEn) ||
    isEmpty(vm.buyerItem.applyAmt) ||
    Number(vm.buyerItem.applyAmt) === 0
  ) {
    filloutFlag = false
  }
  if (filloutFlag) {
    vm.buyerItem.supplementStatus = '1'
  } else {
    vm.buyerItem.supplementStatus = '0'
  }
  if (index === -1) {
    vm.buyerList.push(vm.buyerItem)
  } else {
    vm.buyerList[index] = vm.buyerItem
  }
  setStorage('quota-buyerlist', vm.buyerList)
  setStorage('enter-type', 'confirm')
  router.back(1)
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:07:08
 * @description: 买方信息删除
 */
const onDelete = () => {
  //新增时未填写过买方信息或修改时只有一个买方信息
  // eslint-disable-next-line no-extra-parens
  if ((index === -1 && vm.buyerList.length === 0) || (index !== 1 && vm.buyerList.length <= 1)) {
    showToast('请至少保留一个买方')
    return
  }
  showModalFlag.value = true
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:07:08
 * @description: 买方信息删除确认
 */
const onConfirm = () => {
  if (!isEmpty(vm.buyerItem.refcode)) {
    loading.value = true
    apiQuota.doDeleteBuyer(vm.buyerItem.refcode).then(
      () => {
        vm.buyerList.splice(index, 1)
        setStorage('quota-buyerlist', vm.buyerList)
        setStorage('enter-type', 'confirm')
        showToast('删除成功')
        router.back(1)
        loading.value = false
      },
      () => {
        loading.value = false
      }
    )
  } else {
    //异常情况，买方信息已添加但未关联refcode
    if (index !== -1) {
      vm.buyerList.splice(index, 1)
    }
    setStorage('quota-buyerlist', vm.buyerList)
    setStorage('enter-type', 'confirm')
    showToast('删除成功')
    router.back(1)
  }
}
const findAplBuyerPage = (val: string) => {
  const data = { fullOrgname: orgname, aplOrgname: val, productType }
  return new Promise((resolve, reject) => {
    findBuyerData.list = []
    apiQuota.getBuyerList(data).then(
      res => {
        findBuyerData.list = res.data.buyerList
        resolve(res.data.buyerList)
      },
      () => {
        reject(false)
      }
    )
  })
}
onMounted(() => {
  if (getStorage('quota-buyerlist')) {
    vm.buyerList = getStorage('quota-buyerlist') as BuyerList[]
  }
  if (route.value.params) {
    const indexStr = decodeBase64(route.value.params.index) // 获取索引值
    orgname = decodeBase64(route.value.params.orgname)
    productType = decodeBase64(route.value.params.productType)
    index = Number(indexStr)
    if (index !== -1) {
      vm.buyerItem = vm.buyerList[index]
    }
  }
  findAplBuyerPage('')
  getCountryList('', false) // 获取国家列表
})
</script>
<style lang="scss" scoped>
.application-BuyerInfo {
  :deep(.u-icon__icon) {
    color: $remark-color !important;
  }
  .internation-info-group {
    :deep(.u-cell-group) {
      padding-top: 0;
      margin: 0;
    }
  }
  .collapse-item-title {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    .inviteWrite {
      background-color: #e4f2fd;
      border-color: #e4f2fd;
      color: #138bec;
      padding: 8rpx 20rpx;
      border-radius: 6rpx;
      font-weight: normal;
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
.inviteWrite {
  color: #fff;
  font-size: 14px;
}
.guide-group {
  z-index: 10072;
  .guide-arrows {
    position: fixed;
    z-index: 10072;
    width: 117rpx;
    height: 101rpx;
    top: 8rpx;
    right: 66rpx;
  }
  .guide-tip {
    position: fixed;
    z-index: 10072;
    width: 382rpx;
    height: 70rpx;
    top: 86rpx;
    right: 43rpx;
  }
  .guide-know {
    position: fixed;
    z-index: 10072;
    width: 194rpx;
    height: 78rpx;
    top: 600rpx;
    right: 290rpx;
  }
}
:deep(.u-form-item__body__right__content__slot) {
  justify-content: end;
}
.icon-qiyechaxun {
  color: #999;
}
.inputValueClass {
  min-height: 160rpx;
  position: relative;
  top: -20rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
  }
}
.ccyid {
  text-align: right;
  font-size: 28rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  color: $sub-color;
  padding-bottom: 30rpx;
  &.summaryRemark {
    color: #333;
    margin-top: 0;
  }
}
</style>
