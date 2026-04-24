<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-25 16:39:05
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-02 16:55:39
 * @Description  : 项目-业务审核-特批审批 /member/project/specialAudit/audit/:refcode
-->
<template>
  <NavBar />
  <view class="main">
    <up-sticky bg-color="#fff">
      <state-module
        v-if="vm.self.applyStatus"
        :state-name="stateName[vm.self.applyStatus]"
        :state-color="stateColor[vm.self.applyStatus]"
      ></state-module>
    </up-sticky>
    <view class="special-audit" :style="{ marginBottom: `${isTextareaFocused ? cardHeight : 0}px` }">
      <!-- 特批基本信息 -->
      <BasicInfo
        ref="basicRef"
        :self="vm.self"
        identity="audit"
        :examine-type="['1', '92', '93'].includes(taskType) ? vm.flowNodeVo.examineType : ''"
      ></BasicInfo>
      <QaList ref="qaListRef" :refcode="submitData.refcode"></QaList>
      <History></History>
      <ty-info-card v-if="['B'].includes(vm.flowNodeVo.examineType) && ['1', '92', '93'].includes(taskType)" title="概要说明">
        <!-- <u-form> -->
        <view class="content pre-wrap">
          <u-textarea
            ref="handleSummaryRef"
            v-model="handleSummary"
            :confirm-type="null"
            :disabled="['C'].includes(vm.flowNodeVo.examineType)"
            auto-height
            maxlength="1000"
            count
            class="inputValueClass"
            placeholder="请输入概要说明"
          ></u-textarea>
        </view>
        <!-- </u-form> -->
      </ty-info-card>
      <ty-info-card
        v-if="['1', '92', '93'].includes(taskType)"
        ref="approveRemarkCardRef"
        :class="{ 'fixed-bottom-card': isTextareaFocused }"
        title="审批意见"
      >
        <!-- <template #subtitle>
          <span class="history" @click="toHistory">审批历程</span>
        </template> -->
        <!-- <u-form> -->
        <view class="content pre-wrap">
          <u-textarea
            ref="conditionRemarkRef"
            v-model="conditionRemark"
            :confirm-type="null"
            auto-height
            maxlength="1000"
            count
            class="inputValueClass"
            placeholder="请输入审批意见"
            @focus="textfocus"
            @blur="textblur"
          ></u-textarea>
        </view>
        <!-- </u-form> -->
      </ty-info-card>
      <ty-info-card v-if="taskType === '94' && conditionRemark" title="审批意见">
        <view class="content pre-wrap">{{ conditionRemark }}</view>
      </ty-info-card>
      <view v-if="getHasPermissionsById('member:project:audit:special:audit') && ['1', '92', '93'].includes(taskType)" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <view v-if="['A', 'B', 'F'].includes(vm.flowNodeVo.examineType)" class="vteam-button" @click="onQuestion">
            <view class="vteam-button-icon">
              <text class="iconfont icon-tiwen1"></text>
            </view>
            <view class="vteam-button-text">{{ '提问' }}</view>
          </view>
          <!-- 审批展示拒绝和退回 -->
          <u-button
            v-if="['A', 'F'].includes(vm.flowNodeVo.examineType)"
            :loading="loading"
            block
            type="error"
            native-type="submit"
            @click="onRefuse"
          >
            {{ '拒绝' }}
          </u-button>
          <!-- 审批、批注时展示退回 -->
          <u-button
            v-if="['A', 'B', 'F'].includes(vm.flowNodeVo.examineType)"
            :loading="loading"
            block
            type="warning"
            native-type="submit"
            @click="onReturn"
          >
            {{ '退回' }}
          </u-button>
          <!--批注时展示退回 -->
          <u-button
            v-if="['B'].includes(vm.flowNodeVo.examineType) && vm.flowNodeVo.nextNodeRefcode !== -1"
            :loading="loading"
            block
            type="error"
            native-type="submit"
            @click="onAppeal"
          >
            {{ '拒案申诉' }}
          </u-button>
          <u-button
            v-if="['A', 'F'].includes(vm.flowNodeVo.examineType)"
            :loading="loading"
            block
            type="primary"
            class="submit"
            native-type="submit"
            @click="toSubmit"
          >
            {{ '通过' }}
          </u-button>
          <u-button
            v-if="['B', 'C'].includes(vm.flowNodeVo.examineType)"
            :loading="loading"
            block
            type="primary"
            class="submit"
            native-type="submit"
            @click="toSubmit"
          >
            {{ '提交' }}
          </u-button>
          <!-- <u-button
            v-if="['B'].includes(vm.self.examineType as string) && taskType === '94'"
            :loading="loading"
            block
            type="primary"
            class="submit"
            native-type="submit"
            @click="onWithdraw"
          >
            {{ '撤回' }}
          </u-button> -->
        </view>
      </view>
      <view
        v-if="getHasPermissionsById('member:project:audit:special:audit') && ['B'].includes(vm.self.examineType as string) && taskType === '94'"
        class="button-fixed-bottom"
      >
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="onWithdraw">
            {{ '撤回' }}
          </u-button>
        </view>
      </view>
    </view>
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
        <view v-if="modalType === '1'">是否确认拒绝？</view>
        <view v-else-if="modalType === '3'">是否确认退回？</view>
        <view v-else-if="modalType === '4'">是否确认撤回？</view>
      </view>
    </u-modal>
    <u-modal :show="showModal" :show-confirm-button="false" :round="10" class="u-modal-box">
      <view v-if="checkType === 'code'" class="modal-box">
        <view class="title">请输入验证码</view>
        <view class="text-box">
          已发送至+86
          <text class="mobilephone">{{ mobilephone }}</text>
          <text v-if="seconds" class="seconds">{{ seconds }}s后重新获取</text>
          <text v-else class="regain">重新获取</text>
        </view>
        <view class="code-box">
          <up-code-input
            v-model="verificationCode"
            border-color="#efeff0"
            :focus="true"
            :size="78"
            :font-size="48"
            @change="changeCode"
          ></up-code-input>
        </view>
        <view class="forget-code" @click="changeCheckType('password')">没有收到验证码？请输入预设密码>></view>
        <u-button class="submit" block type="primary" native-type="submit">确定</u-button>
        <view class="cancel" @click="showModal = false">取消</view>
      </view>
      <view v-if="checkType === 'password'" class="modal-box">
        <view class="title">请输入预设密码</view>
        <view class="code-box password">
          <u-input
            v-model="verificationCode"
            v-insert-clear:[verificationCode]="() => (verificationCode = '')"
            :focus="true"
            :type="showPasswordFlag ? '' : 'password'"
            border="bottom"
            maxlength="20"
            placeholder="请输入预设密码"
          >
            <template #suffix>
              <i v-if="!showPasswordFlag" class="icon-yincang iconfont" @click="changePassword"></i>
              <i v-if="showPasswordFlag" class="icon-Eyesopen iconfont" @click="changePassword"></i>
            </template>
          </u-input>
        </view>
        <!-- <view class="forget-code" @click="changeCheckType('code')">预设密码不正确？请输入短信验证码>></view> -->
        <u-button class="submit" block type="primary" native-type="submit" @click="onConfirmF">确定</u-button>
        <view class="cancel" @click="showModal = false">取消</view>
      </view>
    </u-modal>
    <ty-pop-text-area v-model:model-value="questions" :show-popup="showPopup" placeholder="请输入提问的内容" @close="showPopup = false">
      <template #btn>
        <u-button type="primary" :loading="loading" @click="submitQuestion()">发送</u-button>
      </template>
    </ty-pop-text-area>
  </view>
</template>

<script setup lang="ts">
import StateModule from '@/plugins/StateModule.vue'
import BasicInfo from './components/BasicInfo.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import NavBar from '@/layout/NavBar.vue'
import History from './History.vue'
import { SaveSpecialVo, FlowNodeVo, ShopList } from '@/interfaces/member/project/apply/specialApproval'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiSpecialApprovalAudit from '@/api/member/project/audit/api.specialApprovalAudit'
import apiSpecialApprovalQuery from '@/api/member/project/query/api.specialApprovalQuery'
import { /*  encodeBase64,  */ decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive, ref } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
import apiCommon from '@/api/common/api.common'
// import { onPageScroll } from '@dcloudio/uni-app'
// import { dateFormat } from '@/utils/format'
import QaList from './components/QaList.vue'
const router = useRouter()
let loading = ref(false)
const qaListRef = ref()
let showModalFlag = ref(false) // 展示提示框
let showPopup = ref(false) // 展示提问框
const basicRef = ref()
let modalType = ref('') // 弹窗类型【1=拒绝提示/2=提问/3=退回/4=撤回/5=通过(终审)】
let questions = ref('') // 提问的内容
let conditionRemark = ref('') // 审批意见
let handleSummary = ref('') // 审批意见
let disabledFlag = ref(false) // 审批说明
const route = useRoute()
let isTextareaFocused = ref(false)
let cardHeight = ref<number>(0) // 审批意见模块高度
const approveRemarkCardRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null // 新增：ResizeObserver实例

// let showFixed = ref(false)

const showModal = ref(false)
const checkType = ref('password')
/**
 * 被发送验证码的手机号
 */
const mobilephone = ref('')
/**
 * 秒数计时
 */
const seconds = ref(0)
/**
 * 验证码或密码
 */
const verificationCode = ref('')
/**
 * 验证码的uuid
 */
const uuid = ref('')
let showPasswordFlag = ref(false)

/**
 * 路由参数 1-待审批 92-以提问 93-已回复 94-已处理
 */
const taskType = decodeBase64(route.value.params.taskType) as string
const handleSummaryRef = ref()
const conditionRemarkRef = ref()

const stateName = {
  0: '已保存',
  1: '审批中',
  2: '已退回',
  3: '已通过',
  4: '已拒绝',
  5: '已撤回'
}
const stateColor = {
  0: 'primary',
  1: 'warning',
  2: 'warning',
  3: 'success',
  4: 'danger',
  5: 'warning'
}
const flowNodeVo: FlowNodeVo = {
  examineType: '',
  nodeMode: '',
  nodeLevel: '',
  nodePassLogic: '',
  nextNodeRefcode: ''
}
const self: SaveSpecialVo = {
  applyRemark: '',
  applyType: '',
  applyTypeDesc: '',
  apxList: [],
  bizScene: '',
  orgname: '',
  productType: '',
  applyDate: '',
  orgLocList: [],
  legalPerson: '',
  jointBorrower: '',
  guarantor: '',
  creditApplyProduct: '',
  buyerName: '',
  applySpecialAmt: 0,
  applyValidType: '',
  applyValidStartDate: '',
  applyValidPeriod: '',
  applyTemporaryAmt: 0,
  applyCcyid: '',
  handleSummary: '',
  applyValidTypeDesc: '',
  examineType: '',
  shopList: [],
  creditPlatform: '',
  creditPlatformDesc: '',
  cycleFlag: '',
  cycleFlagDesc: ''
}

interface SubmitData {
  refcode: number
  taskRefcode: number
  handleResult: string
  handleReason: string
  handleSummary: string
  examineType: string
  shopList: ShopList[]
}
// 提交的数据
const submitData: SubmitData = {
  refcode: Number(decodeBase64(route.value.params.refcode)), // 申请流水号
  taskRefcode: Number(decodeBase64(route.value.params.taskRefcode)), // 任务流水号
  handleResult: '', // 【A=拒绝/B=打回/C=通过/D=批注/E=确认/F=终审/G=撤回】
  handleReason: '', // 审批意见
  handleSummary: '', // 审批说明
  examineType: '',
  shopList: []
}

// 业务申请信息
let vm = reactive({
  self: self,
  flowNodeVo
})

/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-28 18:00:00
 * @param {*} index
 * @description: 设置验证码高亮边框
 */
const setBorderColor = index => {
  let domList = document.querySelectorAll('.u-code-input__item')
  if (domList && domList.length) {
    domList.forEach((item, i) => {
      if (index === i) {
        item.classList.add('u-code-input__item--current')
      } else {
        item.classList.remove('u-code-input__item--current')
      }
    })
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-28 17:42:05
 * @description: 改变验证码
 */
const changeCode = val => {
  setBorderColor(val.length)
}

const changeCheckType = (type: string) => {
  checkType.value = type
  verificationCode.value = ''
}

const changePassword = () => {
  showPasswordFlag.value = !showPasswordFlag.value
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 17:44:57
 * @param {*} type 类型【A=拒绝/B=打回/C=通过/D=批注/E=确认/F=终审/G=撤回/J=拒案申诉】
 * @description: 提交数据
 */
const onSubmit = (type: string) => {
  submitData.handleResult = type
  submitData.handleReason = conditionRemark.value
  submitData.handleSummary = handleSummary.value
  submitData.shopList = vm.self.shopList
  submitData.examineType = vm.flowNodeVo.examineType
  let params = {}
  if (vm.flowNodeVo.examineType === 'F') {
    params = {
      ...submitData,
      uuid: uuid.value,
      verificationCode: verificationCode.value,
      //是否预设密码校验
      isCheckPassword: checkType.value === 'password' ? '1' : '0'
    }
  } else {
    params = { ...submitData }
  }
  loading.value = true
  apiSpecialApprovalAudit.doHandleSpecialApp(params).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
        disabledFlag.value = false
      }, 1500)
    },
    () => {
      loading.value = false
      disabledFlag.value = false
    }
  )
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取特批申请详情
 */
const getSpecialAppInfo = (type?) => {
  const data = {
    refcode: submitData.refcode
  }
  apiSpecialApprovalQuery.getSpecialAppInfo(data).then(res => {
    if (type) {
      if (res.data.nodata === '1') {
        showToast('当前特批申请已删除')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      if (!['1', '2'].includes(res.data.saaVo.applyStatus)) {
        showToast('当前特批申请状态已变更')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      if (type === 'onQuestion') {
        // 提问获取最新信息
        showPopup.value = true
      }
      if (type === 'onRefuse') {
        modalType.value = '1'
        if (vm.flowNodeVo.examineType !== 'F') {
          // 拒绝获取最新信息
          showModalFlag.value = true
        } else {
          verificationCode.value = ''
          showModal.value = true
        }
      }
      if (type === 'onReturn') {
        modalType.value = '3'
        if (vm.flowNodeVo.examineType !== 'F') {
          // 退回操作先获取最新信息
          showModalFlag.value = true
        } else {
          verificationCode.value = ''
          showModal.value = true
        }
      }
      if (type === 'onWithdraw') {
        // 撤回
        showModalFlag.value = true
        modalType.value = '4'
      }
      if (type === 'onSubmit') {
        if (vm.flowNodeVo.examineType !== 'F') {
          const submitTypeVo = { A: 'C', B: 'D', C: 'E', F: 'F' }
          onSubmit(submitTypeVo[vm.flowNodeVo.examineType])
        } else {
          modalType.value = '5'
          verificationCode.value = ''
          showModal.value = true
        }
      }
      if (type === 'onAppeal') {
        onSubmit('J')
      }
    } else {
      vm.self = res.data.saaVo as unknown as SaveSpecialVo
      vm.self.apxList = res.data.apxList
      vm.self.orgLocList = res.data.orgLocList
      vm.flowNodeVo = res.data.flowNodeVo
      // 当时批注节点时
      if (['B'].includes(vm.flowNodeVo.examineType)) {
        handleSummary.value = vm.self.handleSummary
      }
    }
  })
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 17:35:12
 * @description: 提问
 */
const onQuestion = () => {
  if (loading.value) {
    return
  }
  getSpecialAppInfo('onQuestion')
}
// 退回
const onReturn = () => {
  if (!conditionRemark.value) {
    scrollTo(0, 99999)
    showToast('请输入审批意见')
    if (conditionRemarkRef.value && conditionRemarkRef.value.$el) {
      const textarea = conditionRemarkRef.value.$el.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
      }
    }
    return
  }
  getSpecialAppInfo('onReturn')
}
// 拒绝
const onRefuse = () => {
  if (!conditionRemark.value) {
    scrollTo(0, 99999)
    showToast('请输入审批意见')
    if (conditionRemarkRef.value && conditionRemarkRef.value.$el) {
      const textarea = conditionRemarkRef.value.$el.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
      }
    }
    return
  }
  getSpecialAppInfo('onRefuse')
}
/**
 * @description: 特批申请撤回
 */
const onWithdraw = () => {
  getSpecialAppInfo('onWithdraw')
}
// 提交
const toSubmit = () => {
  if (loading.value) {
    return
  }
  if (vm.flowNodeVo.examineType === 'B' && !handleSummary.value) {
    scrollTo(0, 99999)
    showToast('请输入概要说明')
    if (handleSummaryRef.value && handleSummaryRef.value.$el) {
      const textarea = handleSummaryRef.value.$el.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
      }
    }
    return
  }
  if (basicRef.value) {
    // 获取最新的准入店铺信息
    vm.self.shopList = basicRef.value.getShopList() || []
  }
  if (['32', '36'].includes(vm.self.applyType) && !vm.self.shopList.length) {
    showToast('请选择待准入的店铺')
    return false
  }
  getSpecialAppInfo('onSubmit')
}
const onAppeal = () => {
  if (loading.value) {
    return
  }
  if (vm.flowNodeVo.examineType === 'B' && !handleSummary.value) {
    scrollTo(0, 99999)
    showToast('请输入概要说明')
    if (handleSummaryRef.value && handleSummaryRef.value.$el) {
      const textarea = handleSummaryRef.value.$el.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
      }
    }
    return
  }
  if (basicRef.value) {
    // 获取最新的准入店铺信息
    vm.self.shopList = basicRef.value.getShopList() || []
  }
  if (['32', '36'].includes(vm.self.applyType) && !vm.self.shopList.length) {
    showToast('请选择待准入的店铺')
    return false
  }
  getSpecialAppInfo('onAppeal')
}
const onConfirm = () => {
  // 操作成功按钮不允许点击
  if (disabledFlag.value) {
    return
  }
  disabledFlag.value = true
  if (modalType.value === '1') {
    // 拒绝
    onSubmit('A')
  } else if (modalType.value === '3') {
    // 退回
    onSubmit('B')
  } else if (modalType.value === '4') {
    // 撤回
    onSubmit('G')
  }
}
// 终审节点 退回和拒绝操作
const onConfirmF = () => {
  if (!verificationCode.value) {
    showToast('请输入预设密码')
    return
  }
  const data = { password: verificationCode.value }
  apiCommon.checkPassword(data).then(() => {
    if (disabledFlag.value) {
      return
    }
    disabledFlag.value = true
    if (modalType.value === '1') {
      // 拒绝
      onSubmit('A')
    } else if (modalType.value === '3') {
      // 退回
      onSubmit('B')
    } else if (modalType.value === '5') {
      // 终审
      onSubmit('F')
    }
  })
}
// 提问提交
const submitQuestion = () => {
  if (!questions.value) {
    showToast('请输入提问的内容')
    return
  }
  // 提问
  const data = {
    saaRefcode: Number(decodeBase64(route.value.params.refcode)),
    questions: questions.value
  }
  loading.value = true
  apiSpecialApprovalAudit.doQuiz(data).then(
    () => {
      showToast('提问成功')
      loading.value = false
      showPopup.value = false
      questions.value = ''
      if (qaListRef.value) {
        qaListRef.value.findQuizPage()
      }
    },
    () => {
      loading.value = false
    }
  )
}
const textfocus = () => {
  isTextareaFocused.value = true
  scrollTo(0, 99999)
}
const textblur = () => {
  isTextareaFocused.value = false
}
// 新增：初始化监听
const initResizeObserver = () => {
  // 销毁已有实例
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  // 确保元素存在
  const getTargetElement = () => {
    if (!approveRemarkCardRef.value) {
      return null
    }
    // 若ref绑定的是Vue组件，需获取其根DOM元素（$el）
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return approveRemarkCardRef.value.$el || approveRemarkCardRef.value
  }
  const target = getTargetElement()
  if (!target) {
    return
  }

  // 创建监听实例
  resizeObserver = new ResizeObserver(entries => {
    const entry = entries[0]
    if (entry) {
      cardHeight.value = Math.round(entry.contentRect.height)
    }
  })

  // 开始监听
  resizeObserver.observe(target)
}
onMounted(() => {
  getSpecialAppInfo()
  nextTick(() => {
    // 双重确认元素存在
    if (approveRemarkCardRef.value) {
      initResizeObserver()
    } else {
      // 延迟重试（防止元素渲染延迟）
      setTimeout(() => {
        nextTick(initResizeObserver)
      }, 300)
    }
  })
})
// onPageScroll(e => {
//   if (e.scrollTop >= 10) {
//     showFixed.value = true
//   } else {
//     showFixed.value = false
//   }
// })
</script>

<style lang="scss" scoped>
.main {
  background: #f6f6f6;
  padding: 0;
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.content .u-textarea {
  min-height: 160rpx;
  max-height: 320rpx;
  // padding-bottom: 40rpx;
  // margin-bottom: 30rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    max-height: 320rpx !important;
    .uni-textarea-wrapper {
      max-height: 320rpx !important;
    }
    .uni-textarea-textarea {
      overflow-y: scroll !important;
    }
    .input-placeholder {
      font-size: 28rpx;
    }
  }
}
.special-audit {
  background: #f6f6f6;
  padding: 0;
  .history {
    margin-left: auto;
    font-size: 24rpx;
    color: $primary;
    font-weight: normal;
  }
  .button-fixed-bottom {
    .vteam-button {
      padding: 0 30rpx;
      color: $default-color;
      .vteam-button-text {
        font-weight: bold;
      }
    }
    .u-button--error {
      width: 360rpx;
      background-color: #ef4142;
      border-color: #ef4142;
      // color: #fe0101;
    }
    .u-button--warning {
      width: 360rpx;
    }
  }
}
:deep(.accessModal) {
  .slot-content {
    .fieldBox {
      border: 1rpx solid #d5d5d5;
      background-color: rgb(252, 252, 252);
      text-align: right;
      padding-bottom: 10rpx;
      .u-textarea {
        text-align: left;
        padding: 20rpx;
        height: 280rpx;
        background: #fcfcfc;
        border: none;
        .u-textarea__field {
          height: auto !important;
        }
        .uni-textarea-placeholder {
          font-size: 28rpx;
          line-height: 38rpx;
          color: $remark-color;
          word-break: break-all;
        }
      }
    }
  }
}

.submit {
  background: #3197ea;
  color: #fff;
  border-color: #3197ea;
}
.u-modal-box {
  :deep(.u-modal__content) {
    padding-bottom: 0px;
  }
  .modal-box {
    width: 100%;
    .title {
      width: 100%;
      font-size: 36rpx;
      font-weight: bold;
      text-align: center;
    }
    .text-box {
      margin: 34rpx auto 46rpx;
      font-size: 26rpx;
      text-align: center;
      .mobilephone {
        margin-left: 6rpx;
      }
      .seconds {
        margin-left: 10rpx;
        color: #c9cacc;
      }
      .regain {
        color: $primary;
        margin-left: 10rpx;
      }
    }
    .code-box {
      display: flex;
      justify-content: center;
      margin-bottom: 40rpx;
      margin-top: 31px;
      :deep(.u-code-input__item) {
        background-color: #f8f9ff;
        border-radius: 14rpx;
        &.u-code-input__item--current {
          border-color: #138bec !important;
        }
      }
    }
    .u-button {
      height: 88rpx;
      background: #138bec, #ffffff;
      border-radius: 15rpx;
      font-size: 32rpx;
    }
    .submit {
      margin-top: 40rpx;
    }
    .cancel {
      margin-top: 10rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      color: $sub-color;
      font-size: 32rpx;
    }
  }
}
.fixed-bottom-card {
  position: fixed;
  bottom: 60px;
  z-index: 99999;
}
</style>
