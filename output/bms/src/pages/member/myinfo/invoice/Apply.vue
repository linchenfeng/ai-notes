<!--
 * @Author       : Charon.Lin
 * @Date         : 2026-02-11 14:04:19
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-19 16:33:26
 * @Description  : 项目-我的-开票管理-开具发票-开票申请 /member/myinfo/invoice/apply
-->

<template>
  <NavBar />
  <view class="main">
    <up-sticky bg-color="#fff">
      <state-module
        v-if="isNotEmpty(vm.self.showStatus)"
        :state-name="getValueByKey(vm.self.showStatus, 'fgaiAppStatus')"
        :state-color="stateColor[vm.self.showStatus]"
      ></state-module>
    </up-sticky>
    <view v-if="vm.self.appStatus === '0' && isNotEmpty(vm.self.refuseRemark)" class="returnReason">
      <view>
        <text>拒绝原因：</text>
        <text class="reasonValue">
          {{ vm.self.refuseRemark }}
        </text>
      </view>
    </view>
    <view v-if="(vm.self.appStatus === '12' || vm.self.confirmStatus === '3') && isNotEmpty(vm.self.returnRemark)" class="returnReason">
      <view>
        <text>退回原因：</text>
        <text class="reasonValue">
          {{ vm.self.returnRemark }}
        </text>
      </view>
    </view>
    <!-- 补开票基本信息 -->
    <!-- <base-info v-if="isNotEmpty(vm.self.applyNo)" :self="vm.self" /> -->
    <!-- 先开票基本信息 -->
    <ty-info-card title="基本信息" :show-line="false">
      <u-form label-width="40%">
        <u-form-item label="开票主体名称" required>
          <view class="input-box unFocus" @click="showSelectType()">
            <u-input v-model="vm.self.bankrollOrgName" placeholder="请选择开票主体名称" />
          </view>
          <template #right>
            <up-icon name="arrow-down" @click="showSelectType()"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="申请人全称(卖方)" required>
          <view class="unFocus input-box" @click="selectName()">
            <u-input v-model="vm.self.applyOrgname" maxlength="90" placeholder="请选择申请人全称(卖方)" />
          </view>
          <template #right>
            <up-icon name="arrow-right" @click="selectName()"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="开票申请日期" label-width="50%">
          <view class="generate-type">{{ vm.self.appDate ? dateFormat(vm.self.appDate, 1) : currentDate }}</view>
        </u-form-item>
      </u-form>
    </ty-info-card>
    <!-- 收款账户信息 -->
    <ty-info-card title="收款账户信息">
      <view class="tip-box">
        <view class="text2">若境外付款人打款，建议选择VTEAM FINANCIAL SERVICE LIMITED</view>
      </view>
      <u-form label-width="40%">
        <u-form-item label="收款企业名称" required>
          <view class="unFocus input-box">
            <u-input v-model="vm.self.bankrollOrgName" maxlength="20" placeholder="请输入收款企业名称" />
          </view>
        </u-form-item>
        <u-form-item label="缴费币种" label-width="50%" required>
          <view class="unFocus" @click="selectPicker('1')">
            <u-input v-model="vm.factoringCcyidItem.ccyidDesc" placeholder="请选择缴费币种" />
          </view>
          <template #right>
            <up-icon name="arrow-down" @click="selectPicker('1')"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="户名" required>
          <view class="unFocus input-box">
            <u-input v-model="vm.factoringCcyidItem.factoringMerchant" maxlength="20" placeholder="请输入户名" />
          </view>
        </u-form-item>
        <u-form-item label="账号">
          <view class="unFocus input-box">
            <u-input v-model="vm.factoringCcyidItem.factoringAccountNo" maxlength="20" placeholder="请输入账号" />
          </view>
        </u-form-item>
        <u-form-item label="开户行">
          <view class="unFocus input-box">
            <u-input v-model="vm.factoringCcyidItem.factoringBank" maxlength="20" placeholder="请输入开户行" />
          </view>
        </u-form-item>
      </u-form>
    </ty-info-card>
    <ty-info-card title="开票信息">
      <!-- 待补充信息状态才允许分享 -->
      <template v-if="isEmpty(vm.self.applyNo) && (isEmpty(vm.self.appStatus) || vm.self.appStatus === '10')" #subtitle>
        <view class="inviteWrite" @click.stop="inviteWrite">
          <text class="iconfont invite icon-yaoqing"></text>
          <text class="name">邀请申请人填写</text>
        </view>
      </template>

      <u-form label-width="50%">
        <!-- 国内展示发票类型 -->
        <u-form-item v-if="vm.factoringCcyidItem.invoiceType !== '1'" label="发票类型" label-width="45%" required>
          <view class="radio-group">
            <u-button
              v-for="obj in getConstant('billType')"
              :key="obj.key"
              class="check-button"
              :class="{ active: vm.self.billType === obj.key }"
              round
              size="mini"
              @click="handlezzAction(obj.key)"
            >
              {{ obj.value }}
            </u-button>
          </view>
        </u-form-item>
        <u-form-item label="开票类型" label-width="50%">
          <view class="generate-type">征信费</view>
        </u-form-item>

        <u-form-item label="开票币种" label-width="50%" required>
          <view class="unFocus">
            <u-input v-model="vm.self.ccyidDesc" placeholder="请选择开票币种" />
          </view>
        </u-form-item>
        <u-form-item :label="`申请开票金额(元)`" label-width="45%" required>
          <InputNumber v-model:number="vm.self.generateAmt" placeholder="请输入申请开票金额(元)" maxlength="15"></InputNumber>
        </u-form-item>
        <u-form-item label="开票企业名称" required>
          <u-input v-model="vm.self.appOrgName" maxlength="100" placeholder="请输入开票企业名称" />
        </u-form-item>
        <u-form-item v-if="vm.factoringCcyidItem.invoiceType !== '1'" label="开票企业税号" required>
          <u-input v-model="vm.self.appCreditCode" maxlength="30" placeholder="请输入开票企业税号" />
        </u-form-item>
        <u-form-item label="开票企业邮箱" required>
          <u-input v-model="vm.self.email" maxlength="120" placeholder="请输入开票企业邮箱" />
        </u-form-item>
        <u-form-item label="备注说明"></u-form-item>
        <u-textarea
          v-model="vm.self.appRemark"
          :confirm-type="null"
          maxlength="300"
          placeholder-style="font-size: 28rpx;"
          class="inputValueClass"
          count
          auto-height
          placeholder="请输入备注说明"
        ></u-textarea>
      </u-form>
    </ty-info-card>
    <u-picker
      :show="showSelectPicker"
      :columns="vm.columns"
      item-height="88"
      key-name="value"
      :default-index="defaultIndex"
      @confirm="doSelectConfirm"
      @cancel="showSelectPicker = false"
    />
    <view v-if="getHasPermissionsById('member:myinfo:invoice')" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="success" native-type="submit" @click="doSave">保存</u-button>
        <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="doSubmitInfo()">提交</u-button>
      </view>
    </view>
    <u-picker
      v-if="showPicker"
      :show="showPicker"
      :columns="vm.columns"
      item-height="88"
      key-name="value"
      :default-index="defaultIndex"
      @confirm="doConfirm"
      @cancel="showPicker = false"
    />
    <u-popup :show="showSelectOrg" mode="center">
      <OrgList
        type="list"
        title="卖方信息"
        id-key="orgctyid"
        name-key="orgname"
        :data="vm.sellerList"
        :search-fun="getAplOrgnameList"
        @back="closeOrg"
        @click-fun="clickOrgFun"
      ></OrgList>
    </u-popup>
    <view v-if="isGuideFlag" class="guide-group">
      <cover-image class="guide-arrows" src="@/assets/member/myinfo/collect/guide-arrows.png" alt="指引" />
      <cover-image class="guide-tip" src="@/assets/member/myinfo/collect/guide-tip.png" alt="提示" />
      <cover-image class="guide-know" src="@/assets/member/myinfo/collect/guide-know.png" alt="知道了" @click="isGuideFlag = false" />
    </view>
    <u-overlay :show="isGuideFlag" @click="isGuideFlag = false"></u-overlay>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { FgaiAppVo, FactoringList, OrgnameList, QueryFbpaAccList, FactoringListFactoringList } from '@/interfaces/member/myinfo/invoice'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { getHasPermissionsById } from '@/utils/permissions'
import { Constant, ConstantArray } from '@/interfaces/common/constant'
import { showToast } from '@/utils/uniapp/toast'
import OrgList from '@/pages/member/project/apply/access/components/OrgList.vue'
import { isNotEmpty, isEmpty, checkEmail } from '@/utils/validate'
import { getConstant } from '@/utils/constant'
import InputNumber from '@/plugins/InputNumber.vue'
import StateModule from '@/plugins/StateModule.vue'
import { getValueByKey } from '@/utils/constant'
import { getPlatform } from '@/utils/uniapp'
import { doWxConfig } from '@/utils/weixin/wxConfig'
import wx from 'jweixin-1.6.0'
import { dateFormat } from '@/utils/format'
import dayjs from 'dayjs'
// 状态颜色映射
const stateColor = {
  '0': 'error',
  '10': 'warning',
  '11': 'warning',
  '12': 'warning',
  '13': 'warning',
  '4': 'success'
}
// 响应式状态管理
let loading = ref(false) // 加载状态
const route = useRoute() // 路由实例
const router = useRouter() // 路由器实例

// 解析路由参数中的refcode
let refcode = decodeBase64(route.value.params.refcode)
let opType = decodeBase64(route.value.params.type) // apply:正常申请，reApply:重新申请

// 表单数据初始化
const self: FgaiAppVo = {
  generateAmt: ''
} as FgaiAppVo

// 数据集合初始化
const factoringList: FactoringList[] = [] // 保理商列表
const columns: ConstantArray = [] // 选择器数据
const sellerList: OrgnameList[] = [] // 卖方列表
const factoringCcyidList: FactoringListFactoringList[] = [] // 保理商币种列表
const factoringCcyidItem: FactoringListFactoringList = {} as FactoringListFactoringList
// 业务申请信息状态管理
let vm = reactive({
  self: self, // 表单数据
  factoringList: factoringList, // 保理商集合
  columns: columns, // 选择器数据集合
  sellerList: sellerList, // 卖方列表
  factoringCcyidList: factoringCcyidList, // 保理商币种列表
  factoringCcyidItem: factoringCcyidItem // 保理商币种项
})

// 征信非账户信息查询条件
let queryFbpaAccList = reactive<QueryFbpaAccList>({
  bankrollAccRefcode: '' // 账户引用码
})

// 获取当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY-MM-DD')
})
/**
 * 获取征信费账户信息
 * 功能：根据查询条件获取征信费账户列表，并自动选择唯一账户
 */
const getCreditAccountInfo = () => {
  apiInvoice.getCreditAccountInfo(queryFbpaAccList).then(res => {
    // 如果只有一个账户，自动选中
    if (res.data.factoringList && res.data.factoringList.length === 1) {
      vm.factoringCcyidItem = res.data.factoringList[0]
      vm.self.bankrollAccRefcode = res.data.factoringList[0].refcode
      vm.self.ccyid = res.data.factoringList[0].billCcyid
      vm.self.ccyidDesc = res.data.factoringList[0].ccyidDesc
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-27 11:19:15
 * @return {*}type 【0=展示分享/1=禁止分享】
 * @description: 分享给融资企业
 */
const doShareInfo = (type: number) => {
  const shareData = {
    refcode: vm.self.refcode,
    generateAmt: vm.self.generateAmt,
    shareTime: new Date().getTime()
  }
  // H5端分享
  if (getPlatform() === 'H5') {
    // #ifdef H5
    const jsApiList = ['updateAppMessageShareData', 'hideMenuItems', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'showMenuItems']
    // 要展示的菜单项
    doWxConfig(jsApiList).then(() => {
      // 仅待补充信息能分享朋友
      if (type === 0) {
        wx.hideAllNonBaseMenuItem()
        wx.showMenuItems({ menuList: ['menuItem:share:appMessage'] })
        // 解决PC端分享链接title、描述不生效
        wx.onMenuShareAppMessage({
          title: '开票信息补充', // 分享标题
          desc: '邀请您填写开票信息', // 分享描述
          link: `${window.location.origin}/invoice?data=${encodeBase64(JSON.stringify(shareData))}`, // 分享链接
          imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
        })
        wx.updateAppMessageShareData({
          title: '开票信息补充', // 分享标题
          desc: '邀请您填写开票信息', // 分享描述
          link: `${window.location.origin}/invoice?data=${encodeBase64(JSON.stringify(shareData))}`, // 分享链接
          imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
        })
      } else {
        wx.hideAllNonBaseMenuItem()
      }
    })
    // #endif
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取发票详情
 */
const getInvoiceDetail = () => {
  apiInvoice.getInvoiceDetail(refcode).then(res => {
    vm.self = res.data.fgaiAppVo
    vm.self.generateAmt = vm.self.generateAmt === 0 ? '' : vm.self.generateAmt
    // 如果存在账户引用码，获取对应的账户信息
    if (isNotEmpty(vm.self.bankrollAccRefcode)) {
      queryFbpaAccList.bankrollAccRefcode = vm.self.bankrollAccRefcode as string
      getCreditAccountInfo()
    }
    if (isNotEmpty(vm.self.ccyid) && (isEmpty(vm.self.appStatus) || vm.self.appStatus === '10')) {
      doShareInfo(0) // 待补充信息状态才允许分享
    } else {
      doShareInfo(1) // 其他状态禁止分享
    }
  })
}
// 选择器相关状态
let showPicker = ref(false) // 是否显示选择器
let defaultIndex = ref([0]) // 默认选中第一个

/**
 * 显示保理商选择器
 * 功能：构建保理商选择器数据并显示
 */
const showSelectType = () => {
  let temList: Constant[] = []
  // 构建保理商选择数据
  vm.factoringList.forEach(item => {
    let obj = { key: item.factoringName, value: item.factoringName }
    temList.push(obj)
  })
  vm.columns = [temList]
  showPicker.value = true
}

/**
 * 确认选择保理商
 * 功能：处理保理商选择结果，更新表单数据并获取对应账户信息
 */
const doConfirm = value => {
  // 查找选中的保理商
  vm.factoringList.forEach(item => {
    if (String(item.factoringName) === value.value[0].value) {
      vm.self.bankrollOrgName = item.factoringName
    }
  })
  vm.factoringCcyidList = vm.factoringList.find(item => item.factoringName === value.value[0].value)?.factoringList || []
  if (vm.factoringCcyidList && vm.factoringCcyidList.length === 1) {
    vm.factoringCcyidItem = vm.factoringCcyidList[0]
    vm.self.ccyidDesc = vm.factoringCcyidItem.ccyidDesc
    vm.self.ccyid = vm.factoringCcyidItem.billCcyid
    vm.self.bankrollAccRefcode = vm.factoringCcyidItem.refcode
  } else {
    vm.factoringCcyidItem = {} as FactoringListFactoringList
  }
  showPicker.value = false
}
// 卖方信息选择相关状态
let orgName = ref('') // 搜索关键词
let showSelectOrg = ref(false) // 是否显示卖方选择弹窗

// 卖方信息类型定义
type OrgListType = {
  orgname: string
}

/**
 * 获取卖方名称列表
 * 功能：根据关键词搜索卖方名称，并返回格式化的数据
 */
const getAplOrgnameList = (val: string) => {
  orgName.value = val
  const data = { orgname: val || '' }
  return new Promise<Array<OrgListType>>((resolve, reject) => {
    vm.sellerList = []
    apiInvoice.getAplOrgnameList(data).then(
      res => {
        vm.sellerList = res.data?.orgnameList || []
        let orgList: OrgListType[] = []
        if (isNotEmpty(res.data) && isNotEmpty(res.data.orgnameList)) {
          // 格式化数据结构
          orgList = res.data.orgnameList.map(item => {
            return {
              orgname: item.orgname
            }
          })
        }
        resolve(orgList)
      },
      () => {
        reject(false)
      }
    )
  })
}

/**
 * 选择卖方名称
 * 功能：打开卖方选择弹窗，可选择获取全部数据
 */
const selectName = async () => {
  try {
    if (orgName.value) {
      // 获取卖方名称数据
      await getAplOrgnameList('')
      showSelectOrg.value = true
    } else {
      showSelectOrg.value = true
    }
  } catch (err) {
    showToast(err as string)
  }
}

/**
 * 关闭卖方选择弹窗
 */
const closeOrg = () => {
  showSelectOrg.value = false
}

/**
 * 选择卖方信息
 * 功能：处理卖方选择结果，更新表单数据
 */
const clickOrgFun = (data: OrgListType) => {
  vm.self.applyOrgname = data.orgname
  showSelectOrg.value = false
}
// 币种选择相关状态
let showSelectPicker = ref(false) // 是否显示选择器
let operateTpye = ref('') // 选择币种时区分是缴费币种还是开票币种

/**
 * 显示币种选择器
 * 功能：根据类型显示不同的币种选择器
 */
const selectPicker = (type: string) => {
  operateTpye.value = type
  if (type === '1') {
    if (isNotEmpty(vm.self.bankrollOrgName)) {
      vm.factoringCcyidList = vm.factoringList.find(item => item.factoringName === vm.self.bankrollOrgName)?.factoringList || []
    }
    // 缴费币种
    const colums = vm.factoringCcyidList.map(item => {
      return { key: item.billCcyid, value: item.ccyidDesc }
    })
    vm.columns = [colums]
    // 设置默认选中项
    const defalultIndex = vm.columns[0].findIndex(item => item.key === vm.factoringCcyidItem.billCcyid)
    defaultIndex.value = [defalultIndex === -1 ? 0 : defalultIndex]
    showSelectPicker.value = true
  }
}

/**
 * 确认选择币种
 * 功能：处理币种选择结果，更新表单数据
 */
const doSelectConfirm = value => {
  // 缴费币种
  if (operateTpye.value === '1') {
    vm.factoringCcyidItem.billCcyid = value.value[0].key
    vm.factoringCcyidItem.ccyidDesc = value.value[0].value
    vm.self.ccyid = value.value[0].key
    vm.self.ccyidDesc = value.value[0].value
    // 更新账户信息
    const selectedFba = vm.factoringCcyidList.find(item => item.billCcyid === value.value[0].key)
    if (selectedFba) {
      vm.factoringCcyidItem.factoringMerchant = selectedFba.factoringMerchant
      vm.factoringCcyidItem.factoringAccountNo = selectedFba.factoringAccountNo
      vm.factoringCcyidItem.factoringBank = selectedFba.factoringBank
      vm.factoringCcyidItem.refcode = selectedFba.refcode
      vm.factoringCcyidItem.invoiceType = selectedFba.invoiceType
      vm.self.bankrollAccRefcode = selectedFba.refcode
    }
    showSelectPicker.value = false
  }
}

/**
 * 处理发票类型选择
 * 功能：更新发票类型
 */
const handlezzAction = (key: string) => {
  vm.self.billType = key
}

/**
 * 验证必填字段
 * 功能：验证所有必填字段是否已填写
 * @returns {boolean} 是否通过验证
 */
const validateForm = (): boolean => {
  // 验证必填字段
  if (isEmpty(vm.self.bankrollOrgName)) {
    showToast('请选择开票主体名称')
    return false
  }
  if (isEmpty(vm.self.applyOrgname)) {
    showToast('请选择申请人全称(卖方)')
    return false
  }
  if (isEmpty(vm.factoringCcyidItem.billCcyid)) {
    showToast('请选择缴费币种')
    return false
  }
  if (isEmpty(vm.factoringCcyidItem.factoringMerchant)) {
    showToast('请输入户名')
    return false
  }
  if (vm.factoringCcyidItem.invoiceType !== '1' && isEmpty(vm.self.billType)) {
    showToast('请选择发票类型')
    return false
  }
  if (isEmpty(vm.self.ccyid)) {
    showToast('请选择开票币种')
    return false
  }
  if (isEmpty(vm.self.generateAmt)) {
    showToast('请输入申请开票金额')
    return false
  }
  if (Number(vm.self.generateAmt) <= 0) {
    showToast('申请开票金额需大于0')
    return false
  }
  if (isEmpty(vm.self.appOrgName)) {
    showToast('请输入开票企业名称')
    return false
  }
  if (vm.factoringCcyidItem.invoiceType !== '1' && isEmpty(vm.self.appCreditCode)) {
    showToast('请输入开票企业税号')
    return false
  }
  if (isEmpty(vm.self.email)) {
    showToast('请输入开票企业邮箱')
    return false
  }
  if (isNotEmpty(vm.self.email) && !checkEmail(vm.self.email)) {
    showToast('请输入正确的开票企业邮箱')
    return false
  }
  return true
}
let isGuideFlag = ref(false)
/**
 * 保存开票申请
 * 功能：保存表单数据但不提交审核
 */
const doSave = (type?: string) => {
  vm.self.generateType = '2' // 开票类型固定为征信费
  // 验证必填字段
  if (isEmpty(vm.self.bankrollOrgName)) {
    showToast('请选择开票主体名称')
    return
  }
  if (isNotEmpty(vm.self.generateAmt) && Number(vm.self.generateAmt) <= 0) {
    showToast('申请开票金额需大于0')
    return
  }
  vm.self.submitFlag = '0' // 0表示保存
  vm.self.operatorType = '1'
  if (opType === 'reApply') {
    vm.self.refcode = '' // 重新申请需要清空refcode
    vm.self.appNo = '' // 重新申请需要清空申请单号
  }
  loading.value = true
  apiInvoice.doSubmitInfo(vm.self).then(
    res => {
      refcode = res.data.refcode
      loading.value = false
      opType = 'apply' // 保存后切换到申请状态
      getInvoiceDetail()
      if (type !== 'auto') {
        showToast('保存成功')
      } else {
        isGuideFlag.value = true
      }
    },
    () => {
      loading.value = false
    }
  )
}

/**
 * 提交开票申请
 * 功能：提交表单数据进行审核
 */
const doSubmitInfo = () => {
  // 验证必填字段
  if (!validateForm()) {
    return
  }
  vm.self.generateType = '2' // 开票类型固定为征信费
  vm.self.submitFlag = '1' // 1表示提交
  vm.self.operatorType = '1'
  if (opType === 'reApply') {
    vm.self.refcode = '' // 重新申请需要清空refcode
    vm.self.appNo = '' // 重新申请需要清空申请单号
  }
  loading.value = true
  apiInvoice.doSubmitInfo(vm.self).then(
    () => {
      router.push(`/member/myinfo/invoice/success/${encodeBase64('2')}`)
    },
    () => {
      loading.value = false
    }
  )
}

/**
 * 获取保理商信息
 * 功能：获取所有可用的保理商列表
 */
const getFactoringInfo = () => {
  apiInvoice.getFactoringInfo().then(res => {
    vm.factoringList = res.data.factoringList
  })
}
const inviteWrite = () => {
  // 验证必填字段
  if (isEmpty(vm.self.bankrollOrgName)) {
    showToast('请选择开票主体名称')
    return false
  }
  if (isEmpty(vm.self.applyOrgname)) {
    showToast('请选择申请人全称(卖方)')
    return false
  }
  if (isEmpty(vm.factoringCcyidItem.billCcyid)) {
    showToast('请选择缴费币种')
    return false
  }
  doSave('auto')
}
onMounted(() => {
  // 在 H5 环境下，尽可能早地执行 hideAllNonBaseMenuItem
  if (getPlatform() === 'H5') {
    wx.hideAllNonBaseMenuItem()
  }
  getAplOrgnameList('') // 获取卖方名称列表
  getFactoringInfo() // 获取保理商信息
  if (isNotEmpty(refcode)) {
    getInvoiceDetail() // 获取发票详情
  }
})
</script>

<style lang="scss" scoped>
.main {
  background: #f6f6f6;
  padding: 0;
}
.input-box {
  width: 100%;
}
.otherCcyid {
  display: flex;
  align-items: center;
}
.appointCcyid {
  margin-right: 6rpx;
}
.inputValueClass {
  min-height: 160rpx;
  position: relative;
  top: -20rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    font-size: 28rpx;
  }
}
.tip-box {
  color: #e6a23c;
  font-size: 24rpx;
  line-height: 34rpx;
  margin-bottom: 10rpx;
}
.returnReason {
  background: #fff;
  padding: 60rpx 30rpx 10rpx 30rpx;
  margin-bottom: -20rpx;

  font-size: 28rpx;
  .reasonValue {
    color: $danger;
    word-break: break-all;
    & :first-child {
      word-break: break-all;
    }
  }
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.generate-type {
  width: 100%;
  text-align: right;
  font-size: 28rpx;
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
.inviteWrite {
  position: absolute;
  right: 30rpx;
}
:deep(.u-form-item__body__right__content__slot) {
  justify-content: end;
}
</style>
