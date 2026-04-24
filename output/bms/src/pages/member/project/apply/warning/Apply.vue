<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-09 13:10:50
 * @LastEditors  : xujie.yu
 * @LastEditTime : 2025-12-15 16:33:34
 * @Description  : 项目-业务申请-预警解除申请 /member/project/apply/warning/apply
-->

<template>
  <NavBar />
  <view>
    <view class="warning-approval">
      <!-- 新增申请不展示 -->
      <up-sticky v-if="vm.submitInfo.applyStatus && vm.submitInfo.applyStatus !== '9'">
        <state-module :state-name="stateName[vm.submitInfo.applyStatus]" :state-color="stateColor[vm.submitInfo.applyStatus]"></state-module>
      </up-sticky>
      <view v-if="vm.submitInfo.applyStatus && vm.submitInfo.applyStatus !== '9'" class="top-box"></view>
      <ty-info-card :show-line="false">
        <view class="topCell">
          <u-cell-group :border="false" :stop="true">
            <view class="item-title">
              <u-cell title="客户经理" :value="vm.submitInfo.clmUserName" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="业务主管" :value="vm.submitInfo.managerUserName" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="申请人" :value="vm.submitInfo.applyUserName || userLoginInfo.userName" :border="false" />
            </view>
          </u-cell-group>
        </view>
      </ty-info-card>
      <ty-info-card title="基本信息">
        <view class="topCell">
          <u-cell-group :border="false" :stop="true">
            <view class="item-title">
              <u-cell title="客户名称" :value="vm.submitInfo.customerName" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="监控对象类型" :value="getValueByKey(vm.submitInfo.monitorObjectType, 'monitorObjectType')" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="监控对象" :value="vm.submitInfo.monitorObjectName" :border="false" />
            </view>
            <view class="item-title">
              <u-cell :title="getMonitorIdDesc()" :value="vm.submitInfo.monitorObjectId" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="预警规则" :value="vm.submitInfo.ruleName" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="风险等级" :value="getValueByKey(vm.submitInfo.warningLevel, 'warningLevel')" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="预警日期" :value="dateFormat(vm.submitInfo.warningTriggerTime)" :border="false" />
            </view>
          </u-cell-group>
        </view>
      </ty-info-card>
      <!-- 企业风险信息 -->
      <BusinessRisk v-if="vm.submitInfo.qccList && vm.submitInfo.qccList.length" :self="vm.submitInfo"></BusinessRisk>
      <ty-info-card title="预警解除信息">
        <u-form label-width="35%">
          <view class="relieve">
            <text class="required">*</text>
            <text>解除原因</text>
          </view>
          <view class="content pre-wrap">
            <u-textarea
              v-model="vm.submitInfo.remark"
              :confirm-type="null"
              auto-height
              maxlength="1000"
              count
              class="inputValueClass"
              placeholder="请输入解除原因"
            ></u-textarea>
          </view>
          <u-form-item v-if="vm.submitInfo.warningNextLogic === '4'" label="下次预警日期" label-width="45%" required>
            <view class="unFocus" @click="showSelectRegDate">
              <u-input v-model="vm.submitInfo.warningNextLogicTime" placeholder="请选择下次预警日期" />
            </view>
          </u-form-item>
          <!-- </u-form-item> -->
        </u-form>
      </ty-info-card>
      <ty-info-card title="附件">
        <view>
          <Uploader
            accept=".jpg,.jpeg,.png,.pdf,.gif,.doc,.docx,.xls,.xlsx,.zip,.rar"
            :max-size="10"
            :max-count="5"
            remark-text="文件支持图片、WORD、EXCEL、PDF、ZIP、RAR格式，大小不超过10MB"
            :res-uuid-vo="{ fileList: vm.submitInfo.apxList }"
            @upload-success="uploadSuccess"
            @upload-remove="uploadRemove"
          ></Uploader>
        </view>
      </ty-info-card>
      <!-- 退回状态展示审批历程 -->
      <History v-if="isReturnFlag"></History>
      <view v-if="getHasPermissionsById('member:project:apply:warning')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button
            v-if="vm.submitInfo.applyStatus && ['0', '2'].includes(vm.submitInfo.applyStatus)"
            :loading="loading"
            block
            type="error"
            native-type="submit"
            @click="onDelete"
          >
            删除
          </u-button>
          <u-button v-if="vm.submitInfo.applyStatus !== '2'" :loading="loading" block type="success" native-type="submit" @click="doSave">
            保存
          </u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onSubmit">提交</u-button>
        </view>
      </view>

      <u-modal
        :show="showModalFlag"
        title="温馨提示"
        confirm-text="确定"
        show-cancel-button="true"
        class="accessModal"
        @confirm="onConfirmDel"
        @cancel="showModalFlag = false"
      >
        <view class="slot-content">
          <view>请确认是否删除？</view>
        </view>
      </u-modal>
    </view>
    <u-datetime-picker
      ref="datePicker"
      v-model="temApplyDate"
      :show="showDatePicker"
      mode="date"
      item-height="88"
      :min-date="date.minDate"
      title="下次预警日期"
      @cancel="showDatePicker = false"
      @confirm="doDateConfirm"
    />
  </view>
</template>
<script setup lang="ts">
import { dateFormat } from '@/utils/format'
import StateModule from '@/plugins/StateModule.vue'
import { WarningAppInfo } from '@/interfaces/member/project/apply/warningApproval'
import NavBar from '@/layout/NavBar.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import apiWarningApproval from '@/api/member/project/apply/api.warningApproval'
import apiWarningApprovalQuery from '@/api/member/project/query/api.warningApprovalQuery'
import { isEmpty } from '@/utils/validate'
import { decodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { useRouter, useRoute } from '@/uni-simple-router'
import History from '@/pages/member/project/audit/warning/History.vue'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import BusinessRisk from './components/BusinessRisk.vue'
import { useUserLoginInfoStore } from '@/store/user/userLoginInfo'
import { storeToRefs } from 'pinia'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
let isReturnFlag = ref(false) // 是否退回的数据
let showModalFlag = ref(false) //删除提示弹窗
let refcode: number | string = '-1' // 业务准入流水号【-1=新增/其他=修改】
let applyStatus = '' // 列表页传入的状态，用于判断queryFlag
let disabledFlag = ref(false) // 是否禁用按钮
let showDatePicker = ref(false) // 是否弹出日期选择器
let temApplyDate = ref('') // 时间选择器返回的数据，格式化后展示
const datePicker = ref()
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const date = {
  // 日期选择区间，仅供1900至今的数据
  minDate: tomorrow
}
const loginStore = useUserLoginInfoStore()
const { userLoginInfo } = storeToRefs(loginStore)
let submitInfo: WarningAppInfo = {
  applyNo: '',
  clmUserName: '',
  monitorObjectId: '',
  customerName: '',
  managerUserName: '',
  monitorObjectName: '',
  monitorObjectType: '',
  remark: '',
  warningLevel: '',
  ruleName: '',
  warningTriggerTime: '',
  applyStatus: '',
  apxList: [],
  qccList: [],
  monitorOrgType: '',
  applyDate: '',
  serialRefcode: '',
  warningNextLogicTime: '',
  warningNextLogic: '',
  applyUser: '',
  applyUserName: '',
  bizTypes:'1'
}

let vm = reactive({
  submitInfo: submitInfo // 提交信息
})
const stateName = {
  0: '已保存',
  2: '已退回'
}
const stateColor = {
  0: 'warning',
  2: 'warning'
}

/**
 * @Author: Mingchun.Cheng
 * @Date: 2025-08-07 09:40:47
 * @return {*}
 * @description: 弹出日期选择框
 */
const showSelectRegDate = () => {
  showDatePicker.value = true
  if (datePicker.value) {
    datePicker.value.innerValue = new Date()
  }
}
/**
 * @Author: Mingchun.Cheng
 * @Date: 2025-08-07 09:41:02
 * @param {*} value
 * @return {*}
 * @description: 选择日期
 */
const doDateConfirm = value => {
  if (dateFormat(value.value) === dateFormat(new Date().getTime())) {
    vm.submitInfo.warningNextLogicTime = dateFormat(tomorrow.getTime())
  } else {
    vm.submitInfo.warningNextLogicTime = dateFormat(value.value)
  }
  showDatePicker.value = false
}

/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取特批申请详情
 */
const getWarningAppInfo = (type?: string) => {
  //  queryFlag: '1' 表示需查询风控系统，'0' 表示不需要
  let queryFlag = applyStatus && applyStatus === '9' ? '1' : '0'
  if (type === 'save') {
    // 保存完再调详情queryFlag置0
    queryFlag = '0'
  }
  const data = {
    refcode,
    queryFlag: queryFlag // 是否为待处理数据列表查询标记(查询风控系统)
  }
  apiWarningApprovalQuery.getWarningAppInfo(data).then(res => {
    vm.submitInfo = res.data.warningVo as unknown as WarningAppInfo
    if (vm.submitInfo.warningNextLogicTime) {
      vm.submitInfo.warningNextLogicTime = dateFormat(vm.submitInfo.warningNextLogicTime)
    }
    vm.submitInfo.apxList = res.data.apxList || []
    vm.submitInfo.qccList = res.data.qccList || []
    isReturnFlag.value = vm.submitInfo.applyStatus === '2'
    if (vm.submitInfo.applyStatus === '9') {
      // 待处理进入时清空解除原因，避免删除、拒绝重新申请的数据
      vm.submitInfo.remark = ''
      vm.submitInfo.warningNextLogicTime = ''
    }
  })
}
const validData = () => {
  if (isEmpty(vm.submitInfo.remark)) {
    showToast('请输入解除原因')
    return false
  }
  if (vm.submitInfo.warningNextLogic === '4' && isEmpty(vm.submitInfo.warningNextLogicTime)) {
    showToast('请选择下次预警日期')
    return false
  }
  return true
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务提交
 */
const onSubmit = () => {
  if (!validData()) {
    return
  }
  loading.value = true
  if (vm.submitInfo.applyStatus === '9') {
    vm.submitInfo.serialRefcode = vm.submitInfo.refcode as string
    // 待处理状态临时保存删除refcode
    delete vm.submitInfo.refcode
  }
  vm.submitInfo.bizTypes = '1' // 发起平台[1=BMS/2=RMS/99=通用]默认传1=BMS
  apiWarningApproval.doSubmitWarningAppInfo(vm.submitInfo).then(
    () => {
      uni.redirectTo({
        url: '/member/project/apply/warning/success',
        success: () => {
          loading.value = false
        }
      })
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
 * @description: 临时保存
 */
const doSave = () => {
  if (!validData()) {
    return
  }
  loading.value = true
  if (vm.submitInfo.applyStatus === '9') {
    vm.submitInfo.serialRefcode = vm.submitInfo.refcode as string
    // 待处理状态临时保存删除refcode
    delete vm.submitInfo.refcode
  }
  apiWarningApproval.doSaveWarningAppInfo(vm.submitInfo).then(
    res => {
      refcode = res.data.refcode
      getWarningAppInfo('save')
      showToast('保存成功')
      loading.value = false
    },
    () => {
      loading.value = false
    }
  )
}
// 删除
const onConfirmDel = () => {
  // 删除成功按钮不允许点击
  if (disabledFlag.value) {
    return
  }
  disabledFlag.value = true
  loading.value = true
  const data = {
    refcode
  }
  apiWarningApproval.doRemoveWarningAppInfo(data).then(() => {
    showToast('删除成功')
    setTimeout(() => {
      router.back(1)
      disabledFlag.value = false
      loading.value = false
    }, 1500)
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:特批申请删除
 */
const onDelete = () => {
  showModalFlag.value = true
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-22 16:50:01
 * @return {*}
 * @description: 上传文件成功
 */
const uploadSuccess = data => {
  let item = {
    apxRefcode: data.refcode,
    resourceUuid: data.resourceUuid
  }
  vm.submitInfo.apxList.push(item)
}
// 删除数组
const uploadRemove = (fileList, fileKey, file) => {
  vm.submitInfo.apxList.forEach((item, i) => {
    if (item.resourceUuid === file.resourceUuid) {
      vm.submitInfo.apxList.splice(i, 1)
    }
  })
}
// 监控对象对应的唯一业务标识，根据监控对象类型及证件类型区分展示
const getMonitorIdDesc = () => {
  if (['1', '2'].includes(vm.submitInfo.monitorObjectType)) {
    if (vm.submitInfo.monitorOrgType === '1') {
      return '统一社会信用代码'
    } else if (['3', '9'].includes(vm.submitInfo.monitorOrgType)) {
      return '商业登记证号码'
    } else if (vm.submitInfo.monitorOrgType === '5') {
      return '证件号码'
    }
  } else if (vm.submitInfo.monitorObjectType === '4') {
    return '证件号码'
  } else if (vm.submitInfo.monitorObjectType === '5') {
    return '店铺ID'
  }
}
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode) === '-1' ? '' : decodeBase64(route.value.params.refcode)
    applyStatus = decodeBase64(route.value.params.applyStatus)
    if (refcode) {
      getWarningAppInfo() // 获取详情
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.relieve {
  color: #666;
  margin-bottom: 20rpx;
  .required {
    color: $u-error;
    margin-right: 2rpx;
  }
}
.warning-approval {
  // margin-top: -20rpx;
  .top-box {
    height: 60rpx;
  }
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
.u-textarea {
  min-height: 160rpx;
  // padding-bottom: 40rpx;
  // margin-bottom: 15px;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    .input-placeholder {
      font-size: 28rpx;
    }
  }
}
:deep(.remark-text) {
  margin-bottom: 30rpx;
}
</style>
