<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-12-01 10:07:47
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-16 15:18:20
 * @Description  : 项目-业务申请-申请融资-发起融资申请 /member/project/apply/loanApply/apply
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <up-sticky bg-color="#fff">
        <state-module
          v-if="isNotEmpty(vm.fintLoaVo.loanStatus)"
          :state-name="getValueByKey(vm.fintLoaVo.loanStatus, 'fintLoanStatus')"
          :state-color="stateColor[vm.fintLoaVo.loanStatus]"
        ></state-module>
      </up-sticky>
      <ty-info-card :show-line="false">
        <view v-if="['2'].includes(vm.fintLoaVo.loanStatus)" class="returnReason paddingTop">
          <view>
            <text>退回原因：</text>
            <text class="reasonValue">
              {{ vm.fintLoaVo.handleReason }}
            </text>
          </view>
          <view>
            <text>退回人员：</text>
            <text class="reasonValue">
              {{ vm.fintLoaVo.handleUsername }}
            </text>
          </view>
        </view>
        <view class="topCell" :class="isNotEmpty(vm.fintLoaVo.loanStatus) && !['2'].includes(vm.fintLoaVo.loanStatus) ? 'paddingTop' : ''">
          <u-cell-group :border="false" :stop="true">
            <view class="item-title">
              <u-cell title="客户经理" :value="vm.fintLoaVo.applyUsername" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="业务主管" :value="vm.fintLoaVo.superiorUsername" :border="false" />
            </view>
            <view v-if="isNotEmpty(vm.fintLoaVo.applyDate)" class="item-title">
              <u-cell title="申请日期" :value="dateFormat(vm.fintLoaVo.applyDate)" :border="false" />
            </view>
          </u-cell-group>
        </view>
      </ty-info-card>
      <ty-info-card>
        <u-form label-width="35%">
          <view class="internation-info-group">
            <u-cell-group :border="false" :stop="true">
              <u-form-item label="业务产品" label-width="45%" required>
                <view class="unFocus" @click="showSelectPicker('1')">
                  <u-input v-model="getProduceType" placeholder="请选择业务产品" />
                </view>
                <template #right>
                  <up-icon name="arrow-down" @click="showSelectPicker('1')"></up-icon>
                </template>
              </u-form-item>
            </u-cell-group>
          </view>
        </u-form>
      </ty-info-card>
      <u-form label-width="43%">
        <ty-info-card title="客户基本信息">
          <u-form-item required>
            <template #label>
              <view class="custom-label">
                <text class="u-form-item__body__left__content__required">*</text>
                <text>用户编号</text>
                <ty-tooltip content="可在业务看板的客户详情中获取">
                  <text class="iconfont icon-tishi1"></text>
                </ty-tooltip>
              </view>
            </template>
            <u-input ref="creditCodeInputRef" v-model="companyCreditCodeTrimmed" maxlength="150" placeholder="请输入用户编号" />
          </u-form-item>
          <u-form-item label="客户名称" required>
            <u-input v-model="vm.fintLoaVo.orgname" maxlength="450" placeholder="请输入客户名称" />
          </u-form-item>
          <u-form-item label="法定代表人" required>
            <u-input v-model="vm.fintLoaVo.legalPerson" maxlength="50" placeholder="请输入客户法定代表人" />
          </u-form-item>
          <u-form-item label="共借人名称">
            <u-input v-model="vm.fintLoaVo.borrowerPerson" maxlength="50" placeholder="请输入共借人名称" />
          </u-form-item>
          <u-form-item label="法定代表人">
            <u-input v-model="vm.fintLoaVo.borrowerLegalPerson" maxlength="50" placeholder="请输入共借人法定代表人" />
          </u-form-item>
        </ty-info-card>
        <ty-info-card title="担保人信息">
          <template #subtitle>
            <view class="inviteWrite" @click.stop="addGuaList()">
              <text class="iconfont invite icon-plustianjia"></text>
              <text class="name">添加</text>
            </view>
          </template>
          <view v-for="(item, index) in vm.fintLoaVo.guaList" :key="index" class="gua-list">
            <view v-if="index > 0" class="operate-content">
              <view class="inviteWrite add" @click.stop="addGuaList(index)">
                <text class="iconfont invite icon-plustianjia"></text>
                <text class="name">添加</text>
              </view>
              <view class="inviteWrite" @click.stop="delGuaList(index)">
                <text class="iconfont invite icon-changyonggoupiaorenshanchu"></text>
                <text class="name">删除</text>
              </view>
            </view>

            <u-form-item label="担保人名称" required>
              <u-input v-model="item.guarantor" maxlength="450" placeholder="请输入担保人名称" />
            </u-form-item>
            <u-form-item label="担保人身份" label-width="50%" required>
              <view v-if="item.guarantorType !== '9'" class="unFocus" @click="showSelectPicker('4', index)">
                <u-input v-model="item.guarantorTypeDesc" placeholder="请选择担保人身份" />
              </view>
              <view v-else class="otherCcyid">
                <text @click="showSelectPicker('4', index)">其他</text>
                <u-input v-model="item.remark" maxlength="300" placeholder="请输入其他说明" />
              </view>
              <template #right>
                <up-icon name="arrow-down" @click="showSelectPicker('4', index)"></up-icon>
              </template>
              <!--   <view class="unFocus" @click="showSelectPicker('4', index)">
                <u-input v-model="item.guarantorTypeDesc" placeholder="请选择担保人身份" />
              </view>
              <template #right>
                <up-icon name="arrow-down" @click="showSelectPicker('4', index)"></up-icon>
              </template> -->
            </u-form-item>
            <!--   <u-form-item v-if="item.guarantorType === '9'" label="其他说明" required>
              <u-input v-model="item.remark" maxlength="300" placeholder="请输入其他说明" />
            </u-form-item> -->
          </view>
        </ty-info-card>
        <ty-info-card title="申请融资信息">
          <u-form-item label="授信产品" required>
            <view class="radio-group">
              <u-button
                v-for="(obj, index) in getConstant('fintCreditPro')"
                :key="index"
                class="check-button"
                :class="{ active: vm.fintLoaVo.creditProducts && vm.fintLoaVo.creditProducts.includes(obj.key) }"
                round
                size="mini"
                @click="handlezzAction(obj, '1')"
              >
                {{ obj.value }}
              </u-button>
            </view>
          </u-form-item>
          <u-form-item v-if="vm.fintLoaVo.creditProducts && vm.fintLoaVo.creditProducts.includes('2')" label="年利率(%)" required label-width="50%">
            <InputNumber
              v-model:number="vm.fintLoaVo.loanYearRate"
              :point="4"
              :format-flag="false"
              :max="100"
              placeholder="请输入年利率"
              maxlength="15"
            ></InputNumber>
          </u-form-item>
          <u-form-item v-if="vm.fintLoaVo.creditProducts && vm.fintLoaVo.creditProducts.includes('1')" label="月利率(%)" required label-width="50%">
            <InputNumber
              v-model:number="vm.fintLoaVo.loanMonthRate"
              :point="4"
              :format-flag="false"
              :max="100"
              placeholder="请输入月利率"
              maxlength="15"
            ></InputNumber>
          </u-form-item>
          <u-form-item label="币种" label-width="50%" required>
            <view class="unFocus" @click="showSelectPicker('2')">
              <u-input v-model="vm.fintLoaVo.loanCcyidDesc" placeholder="请选择币种" />
            </view>
            <template #right>
              <up-icon name="arrow-down" @click="showSelectPicker('2')"></up-icon>
            </template>
          </u-form-item>
          <u-form-item label="预估额度说明" required label-width="50%"></u-form-item>
          <u-textarea
            v-model="vm.fintLoaVo.quotaRemark"
            :confirm-type="null"
            maxlength="300"
            placeholder-style="font-size: 28rpx;"
            class="inputValueClass"
            count
            auto-height
            placeholder="请输入预估额度说明"
          ></u-textarea>
          <u-form-item label="支付渠道" required>
            <view class="unFocus" @click="showSelectPicker('3')">
              <u-input v-model="vm.fintLoaVo.channelName" placeholder="请选择支付渠道" />
            </view>
            <template #right>
              <up-icon name="arrow-down" @click="showSelectPicker('3')"></up-icon>
            </template>
          </u-form-item>
          <u-form-item label="是否需要过桥" label-width="60%" required>
            <view class="radio-group">
              <u-button
                v-for="obj in getConstant('yesNo')"
                :key="obj.key"
                class="check-button"
                :class="{ active: vm.fintLoaVo.bridgeLoanFlag === obj.key }"
                round
                size="mini"
                @click="handlezzAction(obj, '2')"
              >
                {{ obj.value }}
              </u-button>
            </view>
          </u-form-item>
          <u-form-item v-if="vm.fintLoaVo.bridgeLoanFlag === '1'" label="过桥类型" required>
            <view class="radio-group">
              <u-button
                v-for="obj in getConstant('fintBridgeType')"
                :key="obj.key"
                class="check-button"
                :class="{ active: vm.fintLoaVo.bridgeLoanType === obj.key }"
                round
                size="mini"
                @click="handlezzAction(obj, '3')"
              >
                {{ obj.value }}
              </u-button>
            </view>
          </u-form-item>
          <u-form-item v-if="vm.fintLoaVo.bridgeLoanFlag === '1'" label="过桥对手方" required>
            <u-input v-model="vm.fintLoaVo.bridgeCounterparty" maxlength="450" placeholder="请输入过桥对手方" />
          </u-form-item>
          <u-form-item label="备注说明" label-width="50%"></u-form-item>
          <u-textarea
            v-model="vm.fintLoaVo.applyRemark"
            :confirm-type="null"
            maxlength="300"
            placeholder-style="font-size: 28rpx;"
            class="inputValueClass"
            count
            auto-height
            placeholder="请输入交易结构说明及其他补充说明"
          ></u-textarea>
        </ty-info-card>
      </u-form>
      <u-picker
        ref="uPickerRef"
        :show="showPicker"
        :columns="vm.columns"
        :default-index="defaultIndex"
        item-height="88"
        key-name="value"
        @change="changeHandler"
        @confirm="doConfirm"
        @cancel="showPicker = false"
      />
      <u-modal
        :show="showModalFlag"
        title="温馨提示"
        confirm-text="确认"
        show-cancel-button="true"
        class="accessModal"
        @confirm="onDelete"
        @cancel="showModalFlag = false"
      >
        <view class="slot-content">
          <view>请确认是否删除？</view>
        </view>
      </u-modal>
      <up-popup :show="showPopup" :round="14" @close="showPopup = false">
        <view class="operate">
          <view class="cancel" @tap="showPopup = false">取消</view>
          <view class="submit" @tap="handleConfirm">确认</view>
        </view>
        <view class="line"></view>
        <scroll-view v-if="vm.channelNameList.length" class="list-wrap" scroll-y="true" scroll-with-animation="true">
          <view class="userName-list">
            <u-checkbox-group v-model="channelName" placement="column">
              <u-checkbox v-for="(item, index) in vm.channelNameList" :key="index" :label="item.value" :name="item.key"></u-checkbox>
            </u-checkbox-group>
          </view>
        </scroll-view>
        <view v-else class="empty">暂无数据</view>
      </up-popup>
      <view v-if="getHasPermissionsById('member:project:apply:loanApply')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button v-if="isNotEmpty(route.params.refcode)" :loading="loading" block type="error" native-type="submit" @click="showModalFlag = true">
            删除
          </u-button>
          <!-- 已退回已撤回数据不允许保存 -->
          <u-button v-if="!['2', '4'].includes(vm.fintLoaVo.loanStatus)" :loading="loading" block type="success" native-type="submit" @click="doSave">
            保存
          </u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onSubmit">提交</u-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { FintLoaVo, ProductTypeList } from '@/interfaces/member/project/apply/loanApply'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import apiLoanApply from '@/api/member/project/apply/api.loanApply'
import { isNotEmpty, isEmpty } from '@/utils/validate'
import { decodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { useRouter, useRoute } from '@/uni-simple-router'
import { dateFormat } from '@/utils/format'
import { ConstantArray } from '@/interfaces/common/constant'
import { getConstant } from '@/utils/constant'
import InputNumber from '@/plugins/InputNumber.vue'
import type { UPickerInstance } from 'uview-plus' // 导入组件实例类型
import StateModule from '@/plugins/StateModule.vue'
const creditCodeInputRef = ref<any>(null)
const router = useRouter()
const route = useRoute()
let loading = ref(false)
let refcode = '0' // 融资申请流水号【0=新增/其他=修改】
let selectType = ref('')
const showPicker = ref(false)
let showModalFlag = ref(false) // 确认删除弹框
let showPopup = ref(false) //支付渠道弹窗
let channelName = ref<string[]>([]) //支付渠道
const uPickerRef = ref<UPickerInstance | null>(null)
let operateIndex = ref(0) //当前担保人列表索引
let defaultIndex = ref([0, 0]) //默认索引
let channelNameList: { key: string; value: string }[] = []
const productTypeList: ProductTypeList[] = [] // 业务产品列表
const columns: ConstantArray = [getConstant('saaApplyType')]
const stateColor = {
  '0': 'warning',
  '1': 'warning',
  '2': 'warning',
  '3': 'error',
  '4': 'warning',
  '9': 'success'
}
let fintLoaVo: FintLoaVo = {
  /**
   * 申请日期，【未传递流水号自动初始化】
   */
  applyDate: '',
  /**
   * 申请备注说明
   */
  applyRemark: '',
  /**
   * 客户经理，【未传递流水号自动初始化】
   */
  applyUser: '',
  /**
   * 客户经理名称，【未传递流水号自动初始化】
   */
  applyUsername: '',
  /**
   * 业务大类，3=跨境电商（前端不传后端默认）
   */
  bizScene: '',
  /**
   * 共借人法人名称
   */
  borrowerLegalPerson: '',
  /**
   * 共借人名称
   */
  borrowerPerson: '',
  /**
   * 过桥对手方
   */
  bridgeCounterparty: '',
  /**
   * 是否需要过桥[0=否/1=是]
   */
  bridgeLoanFlag: '',
  /**
   * 过桥类型[1=单锁过桥/2=双锁过桥]
   */
  bridgeLoanType: '',
  /**
   * 字符渠道名称，第三方获取
   */
  channelName: '',
  /**
   * 用户编号
   */
  companyCreditCode: '',
  /**
   * 授信产品[1=天e贸/2=天e贷]，可多选（逗号拼接）
   */
  creditProducts: '',
  guaList: [
    {
      guarantor: '',
      guarantorType: '',
      remark: ''
    }
  ],
  /**
   * 法人名称
   */
  legalPerson: '',
  /**
   * 币种
   */
  loanCcyid: '',
  /**
   * 月利率%，天e贸必填
   */
  loanMonthRate: '',
  /**
   * 年利率%，天e贷必填
   */
  loanYearRate: '',
  /**
   * 客户名称
   */
  orgname: '',
  /**
   * 产品类型
   */
  productType: '',
  /**
   * 预估额度说明
   */
  quotaRemark: '',
  /**
   * 流水号，保存后存在
   */
  refcode: '',
  /**
   * 业务主管，【未传递流水号自动初始化】
   */
  superiorUserid: '',
  /**
   * 业务主管名称，【未传递流水号自动初始化】
   */
  superiorUsername: '',
  /**
   * 融资状态，[0=已保存/1=审核中/2=已退回/3=已拒绝/4=已撤回/9=已审核]
   */
  loanStatus: ''
}
let vm = reactive({
  fintLoaVo: fintLoaVo, // 申请信息
  productTypeList: productTypeList, // 业务产品列表
  columns: columns,
  channelNameList: channelNameList // 支付渠道列表
})
const companyCreditCodeTrimmed = computed({
  // 取值：返回原变量的内容
  get(): string {
    return vm.fintLoaVo.companyCreditCode || ''
  },
  // 赋值：自动trim后同步回原变量
  set(newValue: string) {
    vm.fintLoaVo.companyCreditCode = newValue.trim()
  }
})
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取融资详情
 */
const getLoanDetail = () => {
  apiLoanApply.getLoanDetail(refcode).then(res => {
    // 首次新增时 只获取客户经理和业务主管
    if (refcode === '0') {
      vm.fintLoaVo.applyUsername = res.data.fintLoaVo.applyUsername
      vm.fintLoaVo.superiorUsername = res.data.fintLoaVo.superiorUsername
      vm.fintLoaVo.applyUser = res.data.fintLoaVo.applyUser
      vm.fintLoaVo.superiorUserid = res.data.fintLoaVo.superiorUserid
    } else {
      vm.fintLoaVo = res.data.fintLoaVo
      vm.fintLoaVo.guaList = vm.fintLoaVo.guaList || [
        {
          guarantor: '',
          guarantorType: '',
          remark: ''
        }
      ]
      // 币种描述
      vm.fintLoaVo.loanCcyidDesc = getValueByKey(vm.fintLoaVo.loanCcyid, 'applyCcyid')
      // 担保人身份类型描述
      vm.fintLoaVo.guaList.forEach(item => {
        item.guarantorTypeDesc = getValueByKey(item.guarantorType, 'fintLoanGuaType')
      })
    }
  })
}
const getProduceType = computed(() => {
  const bizScene = getValueByKey(vm.fintLoaVo.bizScene as string, 'intBizScene')
  return bizScene ? `${bizScene}-${vm.fintLoaVo.productType}` : vm.fintLoaVo.productType
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:24:23
 * @description: 选择币种 type【1=选择业务产品/2=选择币种/3=选择支付渠道/4=担保人身份】
 */
const showSelectPicker = (type: string, index?) => {
  selectType.value = type
  if (type === '1') {
    // 将一维数组包装成二维数组
    const parentList = vm.productTypeList.map(item => ({ key: item.bizScene, value: getValueByKey(item.bizScene, 'intBizScene') }))
    let parentIndex = vm.productTypeList.findIndex(item => item.bizScene === vm.fintLoaVo.bizScene)
    parentIndex = parentIndex === -1 ? 0 : parentIndex
    const sonList = vm.productTypeList[parentIndex].aplList.map(item => ({ key: item.bizScene, value: item.bizTypes }))
    let sonIndex = vm.productTypeList[parentIndex].aplList.findIndex(item => item.bizTypes === vm.fintLoaVo.productType)
    sonIndex = sonIndex === -1 ? 0 : sonIndex
    vm.columns = [parentList, sonList] // 业务产品列表
    defaultIndex.value = [parentIndex, sonIndex]
  } else if (type === '2') {
    vm.columns = [getConstant('applyCcyid')]
    const defalultIndex = vm.columns[0].findIndex(item => item.key === vm.fintLoaVo.loanCcyid)
    defaultIndex.value = [defalultIndex === -1 ? 0 : defalultIndex]
  } else if (type === '3') {
    //   vm.columns = [vm.channelNameList]
    //  const defalultIndex = vm.columns[0].findIndex(item => item.key === vm.fintLoaVo.channelName)
    // defaultIndex.value = [defalultIndex === -1 ? 0 : defalultIndex]
    channelName.value = vm.fintLoaVo.channelName ? vm.fintLoaVo.channelName.split(',') : []
    showPopup.value = true
    return
  } else if (type === '4') {
    vm.columns = [getConstant('fintLoanGuaType')]
    if (vm.fintLoaVo.guaList && vm.fintLoaVo.guaList.length > 0 && isNotEmpty(index) && index < vm.fintLoaVo.guaList.length) {
      operateIndex.value = index
      const targetGuarantorType = vm.fintLoaVo.guaList[index].guarantorType || ''
      const defalultIndex = vm.columns[0].findIndex(item => item.key === targetGuarantorType)
      defaultIndex.value = [defalultIndex === -1 ? 0 : defalultIndex]
    }
  }
  showPicker.value = true
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取业务产品
 */
const getProductList = () => {
  apiLoanApply.getProductList().then(res => {
    if (res.data.productTypeList && res.data.productTypeList.length) {
      vm.productTypeList = res.data.productTypeList
    } else {
      vm.productTypeList = []
    }
    // 新增时默认第一条业务产品
    if (refcode === '0') {
      const productVo = vm.productTypeList.find(item => {
        return item.bizScene === '3'
      })
      if (productVo && productVo.aplList && productVo.aplList.length) {
        vm.fintLoaVo.productType = productVo.aplList[0].bizTypes
        vm.fintLoaVo.bizScene = '3'
      }
    }
  })
}
const changeHandler = e => {
  if (selectType.value === '1') {
    const { columnIndex, index } = e
    if (columnIndex === 0) {
      const sonList = vm.productTypeList[index].aplList.map(item => ({ key: item.bizScene, value: item.bizTypes }))
      if (uPickerRef.value) {
        uPickerRef.value.setColumnValues(1, sonList)
      }
    }
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:30:47
 * @description: 选择业务产品确定 selectType【1=选择业务产品/2=选择币种/3=选择支付渠道】
 */
const doConfirm = value => {
  if (selectType.value === '1') {
    vm.fintLoaVo.productType = value.value[1].value
    vm.fintLoaVo.bizScene = value.value[0].key
  } else if (selectType.value === '2') {
    vm.fintLoaVo.loanCcyid = value.value[0].key
    vm.fintLoaVo.loanCcyidDesc = value.value[0].value
  } else if (selectType.value === '3') {
    vm.fintLoaVo.channelName = value.value[0].key
  } else if (selectType.value === '4') {
    vm.fintLoaVo.guaList[operateIndex.value].guarantorType = value.value[0].key
    vm.fintLoaVo.guaList[operateIndex.value].guarantorTypeDesc = value.value[0].value
  }
  showPicker.value = false
}
const handleConfirm = () => {
  vm.fintLoaVo.channelName = channelName.value.join(',')
  showPopup.value = false
}
const getChannelNameList = () => {
  apiLoanApply.getChannelNameList().then(res => {
    if (res.data.channelNameList && res.data.channelNameList.length) {
      vm.channelNameList = res.data.channelNameList.map(item => ({
        key: item,
        value: item
      }))
    } else {
      vm.channelNameList = []
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:30:47
 * @description: checkBox切换 type【1=授信产品/2=是否需要过桥/3=过桥类型】
 */
const handlezzAction = (obj, type) => {
  switch (type) {
    case '1':
      // 若creditProducts为空，直接赋值当前产品
      if (isEmpty(vm.fintLoaVo.creditProducts)) {
        vm.fintLoaVo.creditProducts = obj.key
        return
      }
      // 将字符串拆分为数组，判断是否已选中
      const selectedList = vm.fintLoaVo.creditProducts ? vm.fintLoaVo.creditProducts.split(',') : []
      const isSelected = selectedList.includes(obj.key)
      if (isSelected) {
        // 已选中：移除该产品（过滤后重新拼接）
        const newList = selectedList.filter(item => item !== obj.key)
        vm.fintLoaVo.creditProducts = newList.join(',')
      } else {
        // 未选中：添加该产品（拼接到数组末尾）
        selectedList.push(obj.key)
        vm.fintLoaVo.creditProducts = selectedList.join(',')
      }
      break
    case '2':
      vm.fintLoaVo.bridgeLoanFlag = obj.key
      break
    case '3':
      vm.fintLoaVo.bridgeLoanType = obj.key
      break
    default:
      break
  }
}
// 添加担保人
const addGuaList = (index?) => {
  const newGuaItem = {
    guarantor: '',
    guarantorType: '',
    remark: ''
  }
  if (isEmpty(index)) {
    vm.fintLoaVo.guaList.push(newGuaItem)
  } else {
    vm.fintLoaVo.guaList.splice(index + 1, 0, newGuaItem)
  }
}
const delGuaList = (index: number) => {
  vm.fintLoaVo.guaList.splice(index, 1)
  showToast('删除成功')
}
const doSave = () => {
  loading.value = true
  // 新增时refcode不取值
  vm.fintLoaVo.refcode = refcode === '0' ? vm.fintLoaVo.refcode : refcode
  apiLoanApply.doSubmitLoanInfoTemp(vm.fintLoaVo).then(
    res => {
      refcode = res.data.refcode
      vm.fintLoaVo.refcode = res.data.refcode
      loading.value = false
      showToast('保存成功')
    },
    () => {
      loading.value = false
    }
  )
}
const onSubmit = () => {
  if (isEmpty(vm.fintLoaVo.productType)) {
    showToast('请选择业务产品')
    return
  }
  if (isEmpty(vm.fintLoaVo.companyCreditCode)) {
    showToast('请输入用户编号')
    return
  }
  if (isEmpty(vm.fintLoaVo.orgname)) {
    showToast('请输入客户名称')
    return
  }
  if (isEmpty(vm.fintLoaVo.legalPerson)) {
    showToast('请输入法定代表人')
    return
  }
  // 2. 担保人信息校验（至少1个担保人，且所有必填字段完整）
  if (vm.fintLoaVo.guaList.length === 0) {
    showToast('请至少添加1个担保人')
    return
  }
  // 遍历所有担保人，校验必填字段
  const invalidGua = vm.fintLoaVo.guaList.find(item => {
    if (isEmpty(item.guarantor)) {
      showToast(`请输入担保人名称`)
      return true
    }
    if (isEmpty(item.guarantorType)) {
      showToast(`请选择担保人身份`)
      return true
    }
    // 担保人身份为"9"时，校验"其他说明"必填
    if (item.guarantorType === '9' && isEmpty(item.remark)) {
      showToast(`请输入其他说明`)
      return true
    }
    return false
  })
  if (invalidGua) {
    return
  }
  // 3. 申请融资信息校验
  // 3.1 授信产品（至少选择1个）
  if (isEmpty(vm.fintLoaVo.creditProducts)) {
    showToast('请选择授信产品')
    return
  }
  // 3.2 利率校验（根据授信产品动态校验）
  const creditProducts = vm.fintLoaVo.creditProducts ? vm.fintLoaVo.creditProducts.split(',') : []
  // 天e贷（key=2）→ 校验年利率
  if (creditProducts.includes('2') && isEmpty(vm.fintLoaVo.loanYearRate)) {
    showToast('请输入年利率')
    return
  }
  //  天e贸（key=1）→ 校验月利率
  if (creditProducts.includes('1') && isEmpty(vm.fintLoaVo.loanMonthRate)) {
    showToast('请输入月利率')
    return
  }
  // 3.3 币种
  if (isEmpty(vm.fintLoaVo.loanCcyid)) {
    showToast('请选择币种')
    return
  }
  // 3.4 预估额度说明
  if (isEmpty(vm.fintLoaVo.quotaRemark)) {
    showToast('请输入预估额度说明')
    return
  }
  // 3.5 支付渠道
  if (isEmpty(vm.fintLoaVo.channelName)) {
    showToast('请选择支付渠道')
    return
  }
  // 3.6 是否需要过桥（必选）
  if (isEmpty(vm.fintLoaVo.bridgeLoanFlag)) {
    showToast('请选择是否需要过桥')
    return
  }
  // 3.7 过桥相关字段（需要过桥时必填）
  if (vm.fintLoaVo.bridgeLoanFlag === '1') {
    if (isEmpty(vm.fintLoaVo.bridgeLoanType)) {
      showToast('请选择过桥类型')
      return
    }
    if (isEmpty(vm.fintLoaVo.bridgeCounterparty)) {
      showToast('请输入过桥对手方')
      return
    }
  }
  loading.value = true
  apiLoanApply.doSubmitLoanInfo(vm.fintLoaVo).then(
    () => {
      showToast('提交成功')
      setTimeout(() => {
        router.back(1)
      }, 1500)
      loading.value = false
    },
    () => {
      loading.value = false
    }
  )
}
const onDelete = () => {
  loading.value = true
  apiLoanApply.doDeleteLoanInfo(refcode).then(
    () => {
      showToast('删除成功')
      setTimeout(() => {
        router.back(1)
      }, 1500)
      loading.value = false
    },
    () => {
      loading.value = false
    }
  )
}
// eslint-disable-next-line no-unused-vars
let inputHandler: ((e: Event) => void) | null = null
// 4. 封装原生input的事件处理函数（核心逻辑）
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value
  const trimmedValue = value.trim()
  if (value !== trimmedValue) {
    const cursorPos = target.selectionStart
    const diff = value.length - trimmedValue.length
    const newCursorPos = Math.max(0, cursorPos ? cursorPos - diff : 0)
    target.value = trimmedValue
    target.selectionStart = target.selectionEnd = newCursorPos
    target.dispatchEvent(new Event('input'))
  }
}
onMounted(() => {
  if (route.value.params) {
    refcode = isEmpty(route.value.params.refcode) ? '0' : decodeBase64(route.value.params.refcode)
    getLoanDetail()
  }
  getProductList() //获取产品类型
  getChannelNameList() //获取授信产品
  // 获取uvInput组件的根元素，再找到内部的原生input元素
  const uvInputEl = creditCodeInputRef.value?.$el
  if (uvInputEl) {
    const inputEl = uvInputEl.querySelector('input')
    if (inputEl) {
      // 绑定input事件（实时处理）
      inputHandler = handleInput
      inputEl.addEventListener('input', inputHandler)
      // 可选：绑定compositionend事件（处理输入法输入完成后的空格）
      inputEl.addEventListener('compositionend', inputHandler)
    }
  }
})
onUnmounted(() => {
  const uvInputEl = creditCodeInputRef.value?.$el
  if (uvInputEl) {
    const inputEl = uvInputEl.querySelector('input')
    if (inputEl && inputHandler) {
      inputEl.removeEventListener('input', inputHandler)
      inputEl.removeEventListener('compositionend', inputHandler)
      inputHandler = null
    }
  }
})
</script>

<style lang="scss" scoped>
.businessApply-internation {
  .returnReason {
    min-height: 20rpx;
    margin-bottom: 30rpx;
    font-size: 28rpx;
    .reasonValue {
      color: $danger;
      word-break: break-all;
      & :first-child {
        word-break: break-all;
      }
    }
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
.gua-list {
  border-bottom: 1rpx solid $border-color;
  &:not(:first-child) {
    margin-top: 30rpx;
  }
}
.operate-content {
  display: flex;
  margin-bottom: 20rpx;
  .add {
    margin-left: 0 !important;
  }
}
.otherCcyid {
  display: flex;
  align-items: center;
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.paddingTop {
  padding-top: 60rpx !important;
}
.custom-label {
  width: 43%;
  color: $sub-color;
  font-size: 28rpx;
  margin-right: 20rpx;
  line-height: 48rpx;
  display: flex;
  .u-form-item__body__left__content__required {
    position: absolute;
    width: 10rpx;
    font-size: 28rpx;
    color: #fe0101;
    left: 30rpx;
  }
}
.icon-tishi1 {
  padding-left: 5rpx;
}
.operate {
  display: flex;
  padding: 20rpx 30rpx;
  justify-content: space-between;
  border-bottom: 2px solid #eee;
  .cancel {
    color: #909193;
  }
  .submit {
    color: #3c9cff;
  }
}
:deep(.u-checkbox-group) {
  width: 100%;
  .u-checkbox {
    margin: 0;
    align-items: center;
    height: 72rpx;
    .u-icon__icon {
      font-size: 24rpx !important;
    }
    .uicon-checkbox-mark {
      span {
        color: #fff;
      }
    }
    .u-checkbox__icon-wrap {
      margin-right: 10rpx;
      width: 36rpx !important;
      height: 36rpx !important;
    }
    uni-text {
      height: 72rpx;
      line-height: 72rpx !important;
    }
    span {
      font-size: 36rpx;
    }
  }
}
.userName-list {
  padding: 0 20rpx;
}
</style>
