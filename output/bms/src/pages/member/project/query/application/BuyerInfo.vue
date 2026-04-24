<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-18 17:04:28
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-19 16:31:43
 * @Description  : 项目-业务查询-填报申请书查询-买方信息详情 /member/project/query/application/buyerInfo
-->

<template>
  <NavBar />
  <view class="application-BuyerInfo">
    <ty-info-card title="买方基本信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="买方名称" :value="vm.buyerItem.aplOrgname" />
          <u-cell title="买方全称(英文)" :value="vm.buyerItem.orgname" />
          <u-cell title="买方所在国" :value="vm.buyerItem.ctyDesc" />
          <u-cell title="详细地址(英文)" :value="vm.buyerItem.addressEn" />
          <u-cell :title="'公司注册编号\n(Company Registration No)'" :value="vm.buyerItem.companyRegistrationNo" />
          <u-cell title="公司联系邮箱" :value="vm.buyerItem.email" />
          <u-cell title="公司联系电话/分机" :value="vm.buyerItem.mobilePhone" />
          <u-cell title="联系人姓名" :value="vm.buyerItem.linkman" />
          <u-cell title="联系人职务" :value="vm.buyerItem.linkmanPosition" />
          <u-cell title="联系人手机号/通讯工具号" :value="vm.buyerItem.linkmanMobilePhone" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="贸易基本信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="交易商品名称" :value="vm.buyerItem.tradeName" />
          <u-cell
            title="账期起算日"
            :value="vm.buyerItem.tenorStartType !== '5' ? getValueByKey(vm.buyerItem.tenorStartType, 'tenorStartType') : vm.buyerItem.tenorStartDesc"
          />
          <u-cell title="账期(天)" :value="vm.buyerItem.tenor"></u-cell>
          <u-cell title="最早交易年份" :value="vm.buyerItem.firstTransactionYear" />
          <u-cell title="币种" :value="vm.buyerItem.ccyidDesc" />
          <u-cell v-if="!isEmpty(vm.buyerItem.currentOrderAmt)" title="当前在手订单金额(万元)">
            <template #value>
              <text class="u-cell__value">
                <text v-if="vm.buyerItem.ccyid && getValueByKey(vm.buyerItem.ccyid, 'applyCcyid')" class="applyCcyid">
                  {{ vm.buyerItem.ccyid }}
                </text>
                <text>{{ moneyFormat(vm.buyerItem.currentOrderAmt as number) }}</text>
              </text>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(vm.buyerItem.accountBalance)" title="当前应收账款余额(万元)">
            <template #value>
              <text class="u-cell__value">
                <text v-if="vm.buyerItem.ccyid && getValueByKey(vm.buyerItem.ccyid, 'applyCcyid')" class="applyCcyid">
                  {{ vm.buyerItem.ccyid }}
                </text>
                <text>{{ moneyFormat(vm.buyerItem.accountBalance) }}</text>
              </text>
            </template>
          </u-cell>
          <u-cell
            title="支付方式"
            :value="vm.buyerItem.payType !== '2' ? getValueByKey(vm.buyerItem.payType, 'payType') : vm.buyerItem.payTypeDesc"
          />
          <u-cell title="当前是否有逾期" :value="getValueByKey(vm.buyerItem.overdueFlag, 'yesNo')" />
          <u-cell v-if="vm.buyerItem.overdueFlag === '1'" title="逾期说明" :value="vm.buyerItem.overdueRemark" />
          <u-cell title="与买方之间有无禁止债权转让的约定" :value="getValueByKey(vm.buyerItem.debtTransferFlag, 'haveOrNot')" />
          <u-cell v-if="!isEmpty(vm.buyerItem.remark)" title="备注说明(申请准入)" class="vertical-cell" :border="false">
            <template #value>
              <text class="cell-value">{{ vm.buyerItem.remark }}</text>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(vm.buyerItem.buyerDescribe)" title="备注说明(填报申请书)" class="vertical-cell">
            <template #value>
              <text class="cell-value">{{ vm.buyerItem.buyerDescribe }}</text>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card v-if="vm.buyerItem.fintAppClVo" title="额度申请信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="额度申请金额(万元)">
            <template #value>
              <view class="u-cell__value">
                <text class="ccyid">{{ vm.buyerItem.fintAppClVo.applyCcyid }}</text>
                <text>{{ moneyFormat(vm.buyerItem.fintAppClVo.applyAmt) }}</text>
              </view>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(vm.buyerItem.fintAppClVo.checkAmt)" title="额度核准金额(万元)">
            <template #value>
              <view class="u-cell__value">
                <text class="ccyid">{{ vm.buyerItem.fintAppClVo.checkCcyid }}</text>
                <text>{{ moneyFormat(vm.buyerItem.fintAppClVo.checkAmt as number) }}</text>
              </view>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card
      v-if="vm.buyerItem.fintAppQuotaVo && vm.buyerItem.fintAppQuotaVo.quotaStatus && vm.buyerItem.fintAppQuotaVo.quotaStatus === '2'"
      title="报价信息"
    >
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell v-if="!isEmpty(vm.buyerItem.fintAppQuotaVo.quotaRate)" title="手续费率(%)" :value="vm.buyerItem.fintAppQuotaVo.quotaRate" />
          <u-cell
            v-if="vm.buyerItem.fintAppQuotaVo.quotaDate"
            title="报价时间"
            :value="dateFormat(vm.buyerItem.fintAppQuotaVo.quotaDate, 2)"
          ></u-cell>
          <u-cell v-if="vm.buyerItem.fintAppQuotaVo.quotaRemark" title="备注说明" class="vertical-cell">
            <template #value>
              <view class="cell-value">
                <text>{{ vm.buyerItem.fintAppQuotaVo.quotaRemark }}</text>
              </view>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { BuyerList } from '@/interfaces/member/project/apply/fillingApplication'
import { getConstant, getValueByKey } from '@/utils/constant'
import { decodeBase64 } from '@/utils/crypto'
import { getStorage } from '@/utils/storages'
import { useRoute } from '@/uni-simple-router'
import { moneyFormat, dateFormat } from '@/utils/format'
import { ConstantArray } from '@/interfaces/common/constant'
import { isEmpty } from '@/utils/validate'
// import { dateFormat } from '@/utils/format'
const route = useRoute()

const supplementStatusFlag = ref(false)
const refcode = Number(decodeBase64(route.value.params.refcode)) // 当前买方流水号
const columns: ConstantArray = [getConstant('applyCcyid').concat([{ key: 'qt', value: '其他' }])] // 币种
const buyerItem: BuyerList = {
  orgctyid: '',
  aplOrgname: '',
  orgname: '',
  ctyDesc: '',
  ccyidDesc: '',
  payTypeDesc: '',
  tenorStartType: '',
  tenorStartDesc: '',
  ccyid: '',
  supplementStatus: '',
  accountBalance: '',
  addressEn: '',
  appRefcode: 0,
  buyerRefcode: '',
  companyRegistrationNo: '',
  currentOrderAmt: '',
  debtTransferFlag: '',
  email: '',
  firstTransactionYear: '',
  linkman: '',
  linkmanMobilePhone: '',
  linkmanPosition: '',
  mobilePhone: '',
  overdueFlag: '',
  overdueRemark: '',
  payType: '',
  refcode: 0,
  tenor: '',
  tradeName: '',
  aplRefcode: 0,
  aplDtcRefcode: 0,
  aplFinancingNo: '',
  conditionFlag: '',
  conditionRemark: '',
  remark: '',
  fintAppQuotaVo: {
    quotaDate: '',
    quotaRate: '',
    quotaRemark: '',
    quotaStatus: '',
    refcode: ''
  }
}

let buyerList: BuyerList[] = []
let vm = reactive({
  buyerItem: buyerItem,
  buyerList: buyerList,
  columns: columns
})

onMounted(() => {
  vm.buyerList = getStorage('application-buyerInfo') as BuyerList[]
  vm.buyerList.forEach(item => {
    if (item.refcode === refcode) {
      vm.buyerItem = item
    }
    if (item.supplementStatus === '1') {
      supplementStatusFlag.value = true
    }
  })
})
</script>

<style lang="scss" scoped>
.application-BuyerInfo {
  padding: 0 0 30rpx 0;
  background: #fff;
  margin-top: -20rpx;
  .collapse-item-title {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
  }
  .otherCcyid {
    display: flex;
    align-items: center;
  }
  .applyCcyid {
    margin-right: 10rpx;
  }
}
.u-cell__value {
  text-align: right !important;
  flex: auto;
  color: #333;
  line-height: 36rpx;
  font-size: 28rpx;
  display: inline-block;
  .ccyid {
    margin-right: 7rpx;
  }
}
</style>
