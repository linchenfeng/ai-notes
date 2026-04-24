<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 10:31:10
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-04 17:12:45
 * @Description  : 业务查询-基本信息
-->
<template>
  <view class="basicInfo">
    <ty-info-card>
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="业务产品" :value="getProduceType" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="卖方基本信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="卖方名称" :value="props.self.orgname" />
          <u-cell title="卖方所在国" :value="props.self.orgctyDesc" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="买方及贸易信息">
      <template #subtitle>
        <view v-if="showCheck && vm.hisCheckList && vm.hisCheckList.length === 0" class="inviteWrite" @click.stop="checkCompanyInfo">
          <text class="name">发起核查</text>
        </view>
        <view v-if="type === 'audit' && vm.hisCheckList && vm.hisCheckList.length" class="inviteWrite" @click.stop="viewHistory">
          <text class="name">核查历程</text>
        </view>
      </template>
      <!--   当只有一个买方时平铺展开 -->
      <view v-if="props.self.fintAplDtcVoList.length === 1">
        <view v-for="(item, i) in props.self.fintAplDtcVoList" :key="i" class="card-cell-group">
          <u-cell-group>
            <u-cell title="买方名称" :value="item.counterpartyName" />
            <u-cell title="买方所在国" :value="item.ctyDesc" />
            <u-cell title="交易商品" :value="item.productName" />
            <u-cell
              v-if="props.self.productType && props.self.productType.includes('物流')"
              title="买方是否有物流管理系统"
              :value="getValueByKey(item.logisticsSystemFlag, 'yesNo')"
            />
            <u-cell
              v-if="props.self.productType && props.self.productType.includes('物流')"
              title="买卖双方运单对账方式"
              :value="item.waybillVerifyDesc"
            />
            <u-cell
              v-if="props.self.productType && props.self.productType.includes('物流')"
              title="是否公开招投标项目"
              :value="getValueByKey(item.publicBiddingFlag, 'yesNo')"
            />
            <u-cell
              title="账期起算日"
              :value="item.tenorStartType === '5' ? item.tenorStartDesc : getValueByKey(item.tenorStartType, 'tenorStartType')"
            />
            <u-cell title="账期(天)" :value="item.tenor" />
            <u-cell title="币种" :value="getValueByKey(item.ccyid, 'applyCcyid') ? getValueByKey(item.ccyid, 'applyCcyid') : item.ccyid" />
            <u-cell title="年度交易金额(万元)">
              <template #value>
                <text class="u-cell__value">
                  <text v-if="item.ccyid && getValueByKey(item.ccyid, 'applyCcyid')" class="applyCcyid">
                    {{ item.ccyid }}
                  </text>
                  <text>{{ moneyFormat(item.annualTurnover as number) }}</text>
                </text>
              </template>
            </u-cell>
            <u-cell title="未来年度交易金额(万元)" :value="moneyFormat(item.futureAnnualTurnover as number)">
              <template #value>
                <text class="u-cell__value">
                  <text v-if="item.ccyid && getValueByKey(item.ccyid, 'applyCcyid')" class="applyCcyid">
                    {{ item.ccyid }}
                  </text>
                  <text>{{ moneyFormat(item.futureAnnualTurnover as number) }}</text>
                </text>
              </template>
            </u-cell>
            <u-cell title="合作年限" :value="item.transactionYears" />
            <u-cell title="项目来源" :value="item.projectSource" />
            <!-- 店铺信息 国内电商才展示 -->
            <ShopFinanceInfoDetail
              v-if="props.self.bizScene === '1' && props.self.productType === '国内电商' && isNotEmpty(item.storeInformation)"
              :form-str="item.storeInformation"
              :ccyid="item.ccyid"
            ></ShopFinanceInfoDetail>
            <u-cell v-if="item.remark" title="备注说明" class="vertical-cell">
              <template #value>
                <view class="cell-value">{{ item.remark }}</view>
              </template>
            </u-cell>
          </u-cell-group>
        </view>
      </view>

      <view v-else>
        <!-- 多个买方列表展示 -->
        <view v-for="(item, i) in props.self.fintAplDtcVoList" :key="i" class="buyer-swipe" @click="editBuyer(i)">
          <view class="buyerList-item">
            <view v-if="type === 'audit'" class="orgname">
              <text class="title">{{ `买方${Number(i) + 1}` }}</text>
              {{ `：${item.counterpartyName}` }}
            </view>
            <view v-else class="orgname">{{ item.counterpartyName }}</view>

            <up-icon name="arrow-right" color="#999999"></up-icon>
          </view>
        </view>
      </view>
    </ty-info-card>
    <!-- 核查企业弹窗 -->
    <check-org-pop
      v-if="showPopup"
      :refcode="refcode"
      :dtc-refcode="props.self.fintAplDtcVoList[0].refcode"
      :orgname="queryVerifyHistory.orgname"
      @cancel="showPopup = false"
      @confirm="confirmCheck"
    />
  </view>
</template>

<script setup lang="ts">
import { setStorage } from '@/utils/storages'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter } from '@/uni-simple-router'
import { getValueByKey } from '@/utils/constant'
import { moneyFormat } from '@/utils/format'
import { isNotEmpty } from '@/utils/validate'
import apiCheck from '@/api/member/project/audit/api.check'
import { FintAplChkVo, QueryVerifyHistory, HisCheckList } from '@/interfaces/member/project/audit/check'
import CheckOrgPop from './CheckOrgPop.vue'
import ShopFinanceInfoDetail from '@/pages/member/project/apply/access/components/shopFinanceInfo/Detail.vue'
const router = useRouter()
const showPopup = ref(false) // 企业核查情况弹窗
let showCheck = ref(false) // 是否展示核查企业情况
let loading = ref(false)
const props = defineProps({
  self: {
    type: Object,
    default: () => ({})
  },
  // audit准入审核
  type: {
    type: String,
    default: ''
  },
  // 准入流水号
  refcode: {
    type: [String, Number],
    default: ''
  },
  // 任务类型
  taskType: {
    type: String,
    default: ''
  }
})
// 历程查询条件
let queryVerifyHistory = reactive<QueryVerifyHistory>({
  orgname: '',
  excludeRemarkRefcodeList: [],
  queryType: '1'
})
let fintAplChkVo: FintAplChkVo = {
  /**
   * 发起时间
   */
  applyDate: '',
  /**
   * 申请备注说明
   */
  applyRemark: '',
  /**
   * 核查时间
   */
  checkDate: '',
  /**
   * 核查企业信息
   */
  checkRemark: '',
  /**
   * 核查状态[1=待核查/2=已核查]
   */
  checkStatus: '',
  /**
   * 交易对手名称
   */
  counterpartyName: '',
  /**
   * 企业名称
   */
  orgname: '',
  /**
   * 流水号
   */
  refcode: '',
  /**
   * 核查用户名
   */
  checkUsername: '',
  /**
   * 核查意见流水号
   */
  remarkRefcode: '',
  checkUsers: ''
}
let hisCheckList: HisCheckList[] = []
let vm = reactive({
  fintAplChkVo: fintAplChkVo, // 最新核查详情
  hisCheckList: hisCheckList //核查历程
})
// 查看买方信息
const editBuyer = i => {
  setStorage('application-fintAplDtcVoList', props.self.fintAplDtcVoList)
  const path = `/member/project/apply/access/detail/buyerInfo/${encodeBase64(i)}/${encodeBase64(props.self.productType)}`
  router.push(path)
}
const getProduceType = computed(() => {
  const bizScene = getValueByKey(props.self.bizScene, 'intBizScene')
  return bizScene ? `${bizScene}-${props.self.productType}` : props.self.productType
})
// 获取最新核查人员
const getVerifyUserInfo = () => {
  apiCheck.getVerifyUserInfo(props.refcode).then(res => {
    showCheck.value = res.data.verifyUsers && res.data.verifyUsers.length ? true : false
  })
}
const checkCompanyInfo = () => {
  showPopup.value = true
}
//查询企业核查历程
const getOrgVerifyHistory = () => {
  if (props.self.fintAplDtcVoList && props.self.fintAplDtcVoList.length === 1) {
    const item = props.self.fintAplDtcVoList[0]
    queryVerifyHistory.orgname = item.counterpartyName
    loading.value = true
    apiCheck.getOrgVerifyHistory(queryVerifyHistory).then(
      res => {
        vm.hisCheckList = res.data.hisCheckList || []
        loading.value = false
      },
      () => {
        loading.value = false
      }
    )
  }
}
// 核查人员确认回调
const confirmCheck = () => {
  showPopup.value = false
  getOrgVerifyHistory()
}
// 跳转企业核查历程
const viewHistory = () => {
  if (props.self.fintAplDtcVoList && props.self.fintAplDtcVoList.length === 1) {
    const item = props.self.fintAplDtcVoList[0]
    router.push(
      `/member/project/audit/access/history/${encodeBase64(item.refcode)}/${encodeBase64(props.refcode)}/${encodeBase64(item.counterpartyName)}${
        vm.fintAplChkVo ? `/${encodeBase64(vm.fintAplChkVo.remarkRefcode)}` : ''
      }`
    )
  }
}

onMounted(() => {
  //待终审或终审审批完成或暂缓数据
  if (
    // eslint-disable-next-line no-extra-parens, prettier/prettier
    props.type === 'audit' &&
    // eslint-disable-next-line no-extra-parens
    ((props.self.examineType === 'F' && props.self.approvalFlag === '1') || Number(props.self.operationLevel) > 0)
  ) {
    // 核查历程
    getOrgVerifyHistory()
    // 待终审才查询核查人员
    if (['1', '2', '3', '10'].includes(props.taskType)) {
      getVerifyUserInfo()
    }
  }
})
</script>

<style lang="scss" scoped>
.topCell {
  padding-top: 70rpx;
  margin-bottom: 6rpx;
}
.applyCcyid {
  margin-right: 10rpx;
}
.cell-value {
  word-break: break-all;
}
.remark {
  min-height: 160rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
  }
}
.pop-content {
  max-height: 60vh;
  .check-content {
    margin-bottom: 30rpx;
    :deep(.u-checkbox__icon-wrap) {
      margin-right: 10rpx;
      width: 36rpx !important;
      height: 36rpx !important;
    }
    :deep(.u-checkbox-group) {
      width: 100%;
      .u-checkbox {
        margin: 0;
        align-items: center;
        height: 72rpx;
        line-height: 72rpx;
        .u-icon__icon {
          font-size: 24rpx !important;
        }
        .uicon-checkbox-mark {
          span {
            color: #fff;
          }
        }
        span {
          font-size: 28rpx;
          color: $sub-color;
        }
      }
    }
    .check-user {
      font-size: 28rpx;
      line-height: 46rpx;
      color: $sub-color;
    }
  }
}
.operate {
  padding: 20rpx 30rpx 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  .cancel {
    color: #909193;
  }
  .submit {
    color: #3c9cff;
  }
}
.review-content {
  min-height: 60rpx;
}
.review-item {
  margin-bottom: 30rpx;
  .review-name-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    margin-bottom: 5rpx;
    .reviewTime {
      font-size: 24rpx;
      color: $remark-color;
    }
  }
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  color: $sub-color;
  &.summaryRemark {
    color: #333;
    margin-top: 0;
  }
}
</style>
