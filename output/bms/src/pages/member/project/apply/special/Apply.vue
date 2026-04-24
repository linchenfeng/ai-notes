<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-09 13:10:50
 * @LastEditors  : xujie.yu
 * @LastEditTime : 2025-12-12 10:36:30
 * @Description  : 项目-业务申请-特批申请 /member/project/apply/special/apply
-->
<template>
  <NavBar />
  <view>
    <view class="special-approval">
      <!-- 新增申请不展示 -->
      <up-sticky v-if="vm.submitInfo.applyStatus">
        <state-module :state-name="stateName[pageApplyStatus]" :state-color="stateColor[pageApplyStatus]"></state-module>
      </up-sticky>

      <view v-if="vm.submitInfo.applyStatus" class="top-box"></view>

      <ty-info-card :show-line="false">
        <view class="topCell">
          <u-cell-group :border="false" :stop="true">
            <view class="item-title">
              <u-cell title="客户经理" :value="vm.submitInfo.userName" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="业务主管" :value="vm.submitInfo.superiorName" :border="false" />
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
                  <up-icon v-if="!isReturnFlag" name="arrow-down" @click="showSelectPicker('1')"></up-icon>
                </template>
              </u-form-item>
              <u-form-item label="申请类型" label-width="45%" required>
                <view class="unFocus" @click="showSelectPicker('2')">
                  <u-input v-model="vm.submitInfo.applyTypeDesc" placeholder="请选择申请类型" />
                </view>
                <template #right>
                  <up-icon v-if="!isReturnFlag" name="arrow-down" @click="showSelectPicker('2')"></up-icon>
                </template>
              </u-form-item>
            </u-cell-group>
          </view>
        </u-form>
      </ty-info-card>

      <ty-info-card title="客户基本信息">
        <u-form label-width="30%">
          <view class="internation-info-group special-cell">
            <u-cell-group :border="false" :stop="true">
              <u-form-item v-if="!isReturnFlag" label="卖方名称" required>
                <view class="unFocus" @click="selectName()">
                  <u-input v-model="vm.submitInfo.orgname" maxlength="90" placeholder="请选择卖方名称" />
                </view>
                <template #right>
                  <up-icon v-if="!isReturnFlag" name="arrow-right" @click="selectName()"></up-icon>
                </template>
              </u-form-item>
              <view v-if="isReturnFlag" class="item-title">
                <u-cell title="卖方名称" :value="vm.submitInfo.orgname" :border="false" />
              </view>
              <view v-if="vm.submitInfo.orgname && vm.submitInfo.legalPerson" class="item-title">
                <u-cell title="法定代表人" :value="vm.submitInfo.legalPerson" :border="false" />
              </view>
              <view v-if="vm.submitInfo.orgname && vm.submitInfo.jointBorrower" class="item-title">
                <u-cell title="共借人" :value="vm.submitInfo.jointBorrower" :border="false" />
              </view>
              <view v-if="vm.submitInfo.orgname && vm.submitInfo.guarantor" class="item-title">
                <u-cell title="担保人" :value="vm.submitInfo.guarantor" :border="false" />
              </view>
              <u-form-item v-if="vm.submitInfo.applyStatus !== '1'" label="授权平台" required>
                <view>
                  <search-select
                    key="creditPlatform"
                    v-model="vm.submitInfo.creditPlatform"
                    v-model:modelText="vm.submitInfo.creditPlatformDesc"
                    placeholder="请选择授权平台"
                    :localdata="creditPlatformColumns"
                    :disabled="vm.submitInfo.applyStatus === '1'"
                    height="25vh"
                  ></search-select>
                </view>
                <template #right>
                  <up-icon v-if="vm.submitInfo.applyStatus !== '1'" name="arrow-down"></up-icon>
                </template>
              </u-form-item>
              <view v-if="vm.submitInfo.applyStatus === '1'" class="item-title">
                <u-cell title="授权平台" :value="getValueByKey(vm.submitInfo.creditPlatform, 'creditPlatform')" :border="false" />
              </view>
              <u-form-item v-if="vm.submitInfo.applyStatus !== '1' && ['31', '35'].includes(vm.submitInfo.applyType)" label="授信产品" required>
                <view class="unFocus" @click="showCeditProductPicker()">
                  <u-input v-model="vm.submitInfo.creditApplyProductDesc" placeholder="请选择授信产品" />
                </view>
                <template #right>
                  <up-icon v-if="vm.submitInfo.applyStatus !== '1'" name="arrow-down" @click="showCeditProductPicker"></up-icon>
                </template>
              </u-form-item>
              <view v-if="vm.submitInfo.applyStatus === '1'" class="item-title">
                <u-cell title="授信产品" :value="vm.submitInfo.creditApplyProductDesc" :border="false" />
              </view>

              <!-- <u-form-item v-if="['31', '35'].includes(vm.submitInfo.applyType)" label="授信产品" required>
                <view>
                  <search-select
                    key="creditApplyProduct"
                    v-model="vm.submitInfo.creditApplyProduct"
                    v-model:modelText="vm.submitInfo.creditApplyProductDesc"
                    placeholder="请选择授信产品"
                    :localdata="productColumns"
                    :disabled="vm.submitInfo.applyStatus === '1'"
                    height="25vh"
                  ></search-select>
                </view>
                <template #right>
                  <up-icon v-if="vm.submitInfo.applyStatus !== '1'" name="arrow-down"></up-icon>
                </template>
              </u-form-item> -->
              <!-- <u-form-item label="买方名称" required class="form-item">
                <view class="buyername-box">
                  <search-select
                    key="buyerName"
                    v-model="vm.submitInfo.buyerName"
                    v-model:modelText="vm.submitInfo.buyerName"
                    placeholder="请选择买方名称"
                    :localdata="buyerInfoColumns"
                    :field="'buyername'"
                    :disabled="vm.submitInfo.applyStatus === '1'"
                  ></search-select>
                </view>
                <template #right>
                  <up-icon v-if="vm.submitInfo.applyStatus !== '1'" name="arrow-down"></up-icon>
                </template>
              </u-form-item> -->

              <view v-if="pageBuyerNames" class="item-title">
                <u-cell title="买方名称" :border="false" class="buyername-box2">
                  <template #value>
                    <view v-if="!pageBuyerNames.includes(',')" class="name-item">{{ pageBuyerNames }}</view>
                    <view v-else>
                      <view v-for="(item, index) in pageBuyerNames.split(',')" :key="index" class="name-item">
                        {{ `买方${index + 1}：${item}` }}
                      </view>
                    </view>
                  </template>
                </u-cell>
              </view>
            </u-cell-group>
          </view>
        </u-form>
      </ty-info-card>
      <!-- 客户授信信息 -->
      <!-- 没选择申请类型时,也不展示 -->
      <CusAuthInfo
        v-if="vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length && !['31', '35', ''].includes(vm.submitInfo.applyType)"
        :self="vm.submitInfo"
      ></CusAuthInfo>
      <!-- 本次申请的特批额度/区间额度 -->
      <ty-info-card
        v-if="vm.submitInfo.applyStatus !== '1' && ['33', '34'].includes(vm.submitInfo.applyType)"
        :title="vm.submitInfo.applyType === '33' ? '本次申请的特批额度' : '本次申请开启的区间额度'"
      >
        <u-form label-width="30%">
          <view class="internation-info-group special-cell">
            <u-cell-group :border="false" :stop="true">
              <u-cell
                v-if="vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length"
                title="额度币种"
                :value="`${vm.submitInfo.orgLocList[0].ccydesc}(${vm.submitInfo.orgLocList[0].ccyid})`"
                :border="false"
              />
              <u-form-item v-if="vm.submitInfo.applyType === '33'" label="特批额度(万元)" label-width="55%" required>
                <view v-if="vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length" class="appointCcyid">
                  <text>{{ vm.submitInfo.orgLocList[0].ccyid }}</text>
                </view>
                <view class="unFocus">
                  <InputNumber v-model:number="vm.submitInfo.applySpecialAmt" placeholder="请输入特批额度" maxlength="16"></InputNumber>
                </view>
              </u-form-item>
              <u-cell
                v-if="vm.submitInfo.applyType === '34' && vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length"
                title="区间额度(万元)"
                :value="`${vm.submitInfo.orgLocList[0].ccyid} ${moneyFormat(vm.submitInfo.orgLocList[0].temporaryAmt)}`"
                :border="false"
              />
              <u-form-item v-if="vm.submitInfo.applyType === '33'" label="额度生效日类型" label-width="45%" required>
                <view class="unFocus" @click="showSelectPicker('3')">
                  <u-input v-model="vm.submitInfo.applyValidTypeDesc" placeholder="请选择额度生效日类型" />
                </view>
                <template #right>
                  <up-icon v-if="vm.submitInfo.applyStatus !== '1'" name="arrow-down" @click="showSelectPicker('3')"></up-icon>
                </template>
              </u-form-item>
              <u-form-item v-if="vm.submitInfo.applyValidType === '2' || vm.submitInfo.applyType === '34'" label="额度生效日" required>
                <view class="unFocus amt-date" @click="showSelectPopup()">
                  <u-input v-model="vm.submitInfo.applyValidStartDate" placeholder="请选择额度生效日" />
                </view>
                <template #right>
                  <up-icon name="arrow-right" @click="showSelectPopup()"></up-icon>
                </template>
              </u-form-item>
              <u-form-item label="额度有效期(天)" label-width="45%" required>
                <view class="unFocus">
                  <InputNumber
                    key="applyValidPeriod"
                    ref="applyValidPeriodRef"
                    v-model:number="vm.submitInfo.applyValidPeriod"
                    :point="0"
                    placeholder="请输入额度有效期"
                    maxlength="16"
                  ></InputNumber>
                </view>
              </u-form-item>
              <u-form-item v-if="vm.submitInfo.applyType === '33'" label="是否循环" label-width="45%" required>
                <view class="unFocus" @click="showSelectPicker('4')">
                  <u-input v-model="vm.submitInfo.cycleFlagDesc" placeholder="请选择是否循环" />
                </view>
                <template #right>
                  <up-icon v-if="vm.submitInfo.applyStatus !== '1'" name="arrow-down" @click="showSelectPicker('4')"></up-icon>
                </template>
              </u-form-item>
            </u-cell-group>
          </view>
        </u-form>
      </ty-info-card>
      <ty-info-card
        v-if="vm.submitInfo.applyStatus === '1' && ['33', '34'].includes(vm.submitInfo.applyType)"
        :title="vm.submitInfo.applyType === '33' ? '本次申请的特批额度' : '本次申请开启的区间额度'"
      >
        <u-form label-width="30%">
          <view class="internation-info-group special-cell">
            <u-cell-group :border="false" :stop="true">
              <u-cell
                v-if="vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length"
                title="额度币种"
                :value="`${vm.submitInfo.orgLocList[0].ccydesc}(${vm.submitInfo.orgLocList[0].ccyid})`"
                :border="false"
              />
              <u-cell
                v-if="vm.submitInfo.applyType === '33'"
                title="特批额度(万元)"
                :value="`${vm.submitInfo.orgLocList[0].ccyid} ${moneyFormat(vm.submitInfo.applySpecialAmt)}`"
                :border="false"
              />
              <u-cell
                v-if="vm.submitInfo.applyType === '34' && vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length"
                title="区间额度(万元)"
                :value="`${vm.submitInfo.orgLocList[0].ccyid} ${moneyFormat(vm.submitInfo.orgLocList[0].temporaryAmt)}`"
                :border="false"
              />
              <u-cell v-if="vm.submitInfo.applyType === '33'" title="额度生效日类型" :value="vm.submitInfo.applyValidTypeDesc" :border="false" />
              <u-cell
                v-if="vm.submitInfo.applyValidType === '2' || vm.submitInfo.applyType === '34'"
                title="额度生效日"
                :value="dateFormat(vm.submitInfo.applyValidStartDate)"
                :border="false"
              />
              <u-cell title="额度有效期(天)" :value="vm.submitInfo.applyValidPeriod" :border="false" />
              <u-cell v-if="vm.submitInfo.applyType === '33'" title="是否循环" :value="vm.submitInfo.cycleFlagDesc" :border="false" />
            </u-cell-group>
          </view>
        </u-form>
      </ty-info-card>
      <AccessStore v-if="['32', '36'].includes(vm.submitInfo.applyType)" ref="accessStoreRef" identity="apply" :self="vm.submitInfo"></AccessStore>
      <ty-info-card title="申请理由" :required="true">
        <!-- <u-form label-width="50%"> -->
        <view v-if="vm.submitInfo.applyStatus === '1'" class="content pre-wrap applyRemark">{{ vm.submitInfo.applyRemark }}</view>
        <view v-else class="content pre-wrap">
          <u-textarea
            v-model="vm.submitInfo.applyRemark"
            :confirm-type="null"
            auto-height
            maxlength="1000"
            count
            class="inputValueClass"
            placeholder="请输入申请理由"
          ></u-textarea>
        </view>
        <!-- </u-form> -->
      </ty-info-card>
      <!-- 当数据在审批中且没有附件时不显示 -->
      <ty-info-card v-if="!(vm.submitInfo.applyStatus === '1' && vm.submitInfo.apxList.length < 1)" title="附件">
        <view>
          <Uploader
            accept=".jpg,.jpeg,.png,.pdf,.gif,.doc,.docx,.xls,.xlsx,.zip,.rar"
            :max-size="10"
            :max-count="5"
            remark-text="文件支持图片、WORD、EXCEL、PDF、ZIP、RAR格式，大小不超过10MB"
            :editable="vm.submitInfo.applyStatus !== '1'"
            :res-uuid-vo="{ fileList: vm.submitInfo.apxList }"
            @upload-success="uploadSuccess"
            @upload-remove="uploadRemove"
          ></Uploader>
        </view>
      </ty-info-card>
      <!-- 退回状态展示审批历程 -->
      <History v-if="isReturnFlag"></History>

      <view v-if="getHasPermissionsById('member:project:apply:special')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button
            v-if="vm.submitInfo.applyStatus && ['0', '1', '2', '5'].includes(vm.submitInfo.applyStatus)"
            :loading="loading"
            block
            type="error"
            native-type="submit"
            @click="onDelete"
          >
            删除
          </u-button>
          <u-button
            v-if="vm.submitInfo.applyStatus && ['1'].includes(vm.submitInfo.applyStatus)"
            :loading="loading"
            block
            type="primary"
            native-type="submit"
            @click="onWithdraw"
          >
            撤回
          </u-button>
          <u-button
            v-if="(vm.submitInfo.applyStatus && ['0'].includes(vm.submitInfo.applyStatus)) || !vm.submitInfo.applyStatus"
            :loading="loading"
            block
            type="success"
            native-type="submit"
            @click="doSave"
          >
            保存
          </u-button>
          <u-button
            v-if="(vm.submitInfo.applyStatus && ['0', '2', '5'].includes(vm.submitInfo.applyStatus)) || !vm.submitInfo.applyStatus"
            :loading="loading"
            block
            type="primary"
            native-type="submit"
            @click="onSubmit"
          >
            提交
          </u-button>
        </view>
      </view>
      <!-- 授信产品弹框 -->
      <u-picker
        ref="ceditProductPickerRef"
        :show="ceditProductPicker"
        :columns="creditProductColumns2"
        :default-index="ceditProductDefaultIndex"
        item-height="88"
        key-name="value"
        @confirm="confirmCeditProduct"
        @cancel="ceditProductPicker = false"
      />

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
      <u-popup :show="showSelectOrg" mode="center">
        <OrgList
          type="list"
          title="卖方信息"
          id-key="orgctyid"
          name-key="orgname"
          :data="vm.sellerList"
          :search-fun="listOrgInfo"
          :placeholder="'请输入卖方名称'"
          @back="closeOrg"
          @click-fun="clickOrgFun"
        ></OrgList>
      </u-popup>
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
          <view v-if="operationType === '1'">请确认是否删除？</view>
          <view v-else>请确认是否撤回？</view>
        </view>
      </u-modal>
      <u-datetime-picker
        v-model="temDate"
        :show="finanShowPicker"
        mode="date"
        item-height="88"
        :title="'选择额度生效日'"
        :min-date="date"
        @cancel="finanShowPicker = false"
        @confirm="onFinanConfirm"
      />
    </view>
  </view>
</template>
<script setup lang="ts">
import StateModule from '@/plugins/StateModule.vue'
import { ProductType, OrgListItem, SaveSpecialVo, BuyerInfo } from '@/interfaces/member/project/apply/specialApproval'
import NavBar from '@/layout/NavBar.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { ConstantArray, Constant } from '@/interfaces/common/constant'
import { getConstant } from '@/utils/constant'
import { moneyFormat, dateFormat } from '@/utils/format'
import apiSpecialApproval from '@/api/member/project/apply/api.specialApproval'
import apiSpecialApprovalQuery from '@/api/member/project/query/api.specialApprovalQuery'
import { isEmpty } from '@/utils/validate'
import OrgList from '../access/components/OrgList.vue'
import { decodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { useRouter, useRoute } from '@/uni-simple-router'
import History from '@/pages/member/project/audit/special/History.vue'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import CusAuthInfo from '../../audit/special/components/CusAuthInfo.vue'
import AccessStore from './components/AccessStore.vue'
import SearchSelect from './components/SearchSelect.vue'
import InputNumber from '@/plugins/InputNumber.vue'
let defaultIndex = ref([0, 0])
const router = useRouter()
const route = useRoute()
let loading = ref(false)
const accessStoreRef = ref()
let orgName = ref('')
let selectType = ref('')
let isReturnFlag = ref(false) // 是否退回的数据
let showModalFlag = ref(false) //删除提示弹窗
const uPickerRef = ref<InstanceType<any>>(null)
let refcode: number | string = '-1' // 业务准入流水号【-1=新增/其他=修改】
const showPicker = ref(false) // 是否展示选择币种框
const finanShowPicker = ref(false) // 选择日期生效日弹窗
const sellerList: OrgListItem[] = [] // 客户列表
const productTypeList: ProductType[] = [] // 业务产品列表
const date = new Date()
const temDate = ref('') // 临时时间数据
const operationType = ref('1') // 操作类型【1：删除/2：撤回】
/**
 * 任务流水号
 */
const taskRefcode = ref<string | number>('')
/**
 * 路由参数 9-待提交 1-已提交
 */
const taskType = decodeBase64(route.value.params.taskType) as string
const applyValidPeriodRef = ref()
const pageApplyStatus = ref('')

let showSelectOrg = ref(false) // 是否展示选择客户弹窗
let disabledFlag = ref(false) // 是否禁用按钮
let submitInfo: SaveSpecialVo = {
  applyRemark: '',
  applyType: '',
  bizScene: '',
  orgname: '',
  productType: '',
  applyTypeDesc: '',
  apxList: [],
  applyDate: '',
  applyStatus: '',
  orgLocList: [],
  legalPerson: '',
  jointBorrower: '',
  guarantor: '',
  financingNo: '',
  orgRefcode: 0,
  refcode: 0,
  superior: '',
  superiorName: '',
  userName: '',
  orgctyid: '',
  orgctyDesc: '',
  shopList: [], // 选中的店铺集合
  creditApplyProduct: '',
  creditApplyProductDesc: '',
  buyerName: '',
  applySpecialAmt: '',
  applyValidType: '',
  applyValidTypeDesc: '',
  applyValidStartDate: '',
  applyValidPeriod: '',
  applyTemporaryAmt: '',
  applyCcyid: '',
  handleSummary: '',
  creditPlatform: '',
  creditPlatformDesc: '',
  cycleFlag: '',
  cycleFlagDesc: ''
}
const columns: ConstantArray = [getConstant('saaApplyType')]
// const productColumns: Array<Constant> = getConstant('creditProduct')
const buyerInfoColumns: Array<Constant> = []
let vm = reactive({
  submitInfo: submitInfo, // 提交信息
  sellerList: sellerList, // 客户国家列表
  columns: columns,
  productTypeList: productTypeList // 业务产品列表
})
const stateName = {
  0: '已保存',
  1: '审批中',
  2: '已退回',
  3: '已通过',
  4: '已拒绝',
  5: '已撤回'
}
const stateColor = {
  0: 'warning',
  1: 'warning',
  2: 'warning',
  3: 'success',
  4: 'danger',
  5: 'warning'
}

const getProduceType = computed(() => {
  const bizScene = getValueByKey(vm.submitInfo.bizScene as string, 'intBizScene')
  return bizScene ? `${bizScene}-${vm.submitInfo.productType}` : vm.submitInfo.productType
})
/**
 * 授信产品默认选中项
 */
const ceditProductDefaultIndex = ref([0])
/**
 * 定义授信产品字典项(单选)
 */
const creditProductColumns2 = computed((): ConstantArray => {
  if (['31', '35'].includes(vm.submitInfo.applyType)) {
    return [getConstant('creditProduct').filter(item => item.key !== '20')]
  }
  return [getConstant('creditProduct').filter(item => item.key === '20')]
})
/**
 * 定义授权平台zi典项(多选)
 */
const creditPlatformColumns: Array<Constant> = getConstant('creditPlatform')
/**
 * 授信产品弹窗
 */
const ceditProductPicker = ref(false)
/**
 * 授信产品弹窗点击事件
 */
const showCeditProductPicker = () => {
  let currentIndex = 0
  const creditProductList = creditProductColumns2.value[0]
  creditProductList.forEach((item, i) => {
    if (item.key === vm.submitInfo.creditApplyProduct) {
      currentIndex = i
    }
  })
  ceditProductDefaultIndex.value = [currentIndex]
  ceditProductPicker.value = true
}
/**
 * 授信产品弹窗确认事件
 */
const confirmCeditProduct = value => {
  vm.submitInfo.creditApplyProduct = value.value[0].key
  vm.submitInfo.creditApplyProductDesc = value.value[0].value
  ceditProductPicker.value = false
}
/**
 * 用computed属性定义页面显示的买方名称
 */
const pageBuyerNames = computed(() => {
  const { creditApplyProduct, creditPlatform } = vm.submitInfo
  if (!creditApplyProduct || !creditPlatform) {
    return ''
  }
  if (creditApplyProduct === '30') {
    if (creditPlatform === '1') {
      return '亚马逊平台及亚马逊平台实际消费者'
    } else if (creditPlatform === '2') {
      return '沃尔玛平台及沃尔玛平台实际消费者'
    } else if (creditPlatform === '1,2') {
      return '亚马逊平台及亚马逊平台实际消费者,沃尔玛平台及沃尔玛平台实际消费者'
    }
  } else if (creditApplyProduct === '21') {
    if (creditPlatform === '1') {
      return '亚马逊'
    } else if (creditPlatform === '2') {
      return '沃尔玛'
    } else if (creditPlatform === '1,2') {
      return '亚马逊,沃尔玛'
    }
  } else if (creditApplyProduct === '22') {
    if (creditPlatform === '1') {
      return '亚马逊,跨境电商池买方集合'
    } else if (creditPlatform === '2') {
      return '沃尔玛,跨境电商池买方集合'
    } else if (creditPlatform === '1,2') {
      return '亚马逊,沃尔玛,跨境电商池买方集合'
    }
  }
  return ''
})

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 额度生效日选择框
 */
const showSelectPopup = (): void => {
  finanShowPicker.value = true
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 选择本次申请额度生效日
 */
const onFinanConfirm = (value): void => {
  vm.submitInfo.applyValidStartDate = dateFormat(value.value)
  finanShowPicker.value = false
}

/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:38:30
 * @param {*} val 查询关键字
 * @return {*}
 * @description: 获取准入申请及OA企业列表
 */
const listOrgInfo = (val: string, type?: string) => {
  orgName.value = val
  const data = {
    orgname: val || '',
    bizScene: vm.submitInfo.bizScene || '3'
  }
  return new Promise<Array<OrgListItem>>((resolve, reject) => {
    vm.sellerList = []
    apiSpecialApproval.listOrgInfo(data).then(
      res => {
        vm.sellerList = res.data.orgList
        if (type === 'change') {
          const temOrgName = vm.submitInfo.orgname
          if (orgName) {
            const temSellerList = Array.isArray(vm.sellerList) ? vm.sellerList : []
            // 判断当前 orgName 是否存在于 sellerList 中
            const isInclude = temSellerList.some(item => item && item.orgname === temOrgName)
            if (!isInclude || !temSellerList.length) {
              // 修改了业务大类 && 新的客户集合不包含当前客户，清空客户名称
              vm.submitInfo.orgname = ''
              vm.submitInfo.orgctyid = ''
              vm.submitInfo.orgctyDesc = ''
              vm.submitInfo.legalPerson = ''
              vm.submitInfo.jointBorrower = ''
              vm.submitInfo.guarantor = ''
              vm.submitInfo.orgLocList = []
            }
          }
        }
        resolve(res.data.orgList)
      },
      () => {
        reject(false)
      }
    )
  })
}

/**
 * @Author: Mingchun.Cheng
 * @Date: 2025-08-20 17:32:52
 * @return {*}
 * @description: 获取买方名称信息
 */
const listBuyerNameInfo = () => {
  apiSpecialApproval.listBuyerNameInfo({}).then(res => {
    let data: BuyerInfo = res.data.buyerInfo

    for (const dateKey in data) {
      let tmp: Constant = {
        key: dateKey,
        value: data[dateKey]
      }
      buyerInfoColumns.push(tmp)
    }
  })
}

const closeOrg = () => {
  showSelectOrg.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:24:23
 * @description: 选择业务产品 【1=选择业务产品/2=选择申请类型】
 */
const showSelectPicker = (type: string) => {
  selectType.value = type
  if (type === '1') {
    if (isReturnFlag.value) {
      // 已退回的数据不允许修改
      return
    }
    // 将一维数组包装成二维数组
    const parentList = vm.productTypeList.map(item => ({ key: item.bizScene, value: getValueByKey(item.bizScene, 'intBizScene') }))
    let parentIndex = vm.productTypeList.findIndex(item => item.bizScene === vm.submitInfo.bizScene)
    parentIndex = parentIndex === -1 ? 0 : parentIndex
    if (vm.productTypeList[parentIndex] && vm.productTypeList[parentIndex].aplList) {
      const sonList = vm.productTypeList[parentIndex].aplList.map(item => ({ key: item.bizScene, value: item.bizTypes }))
      let sonIndex = vm.productTypeList[parentIndex].aplList.findIndex(item => item.bizTypes === vm.submitInfo.productType)
      sonIndex = sonIndex === -1 ? 0 : sonIndex
      vm.columns = [parentList, sonList] // 业务产品列表
      defaultIndex.value = [parentIndex, sonIndex]
    }
  } else if (type === '2') {
    if (isReturnFlag.value) {
      // 已退回的数据不允许修改
      return
    }
    let columnKey = ''
    if (vm.submitInfo.bizScene === '3') {
      columnKey = 'saaApplyTypeCbe'
    } else if (vm.submitInfo.bizScene === '2') {
      // 国际业务无申请类型，暂时用此字典项
      columnKey = 'saaApplyTypeIf'
    } else {
      // 国内业务无申请类型，暂时用此字典项
      columnKey = 'saaApplyTypeEf'
    }
    const columnData = getConstant(columnKey) || []
    vm.columns = [columnData]
    let currentIndex = 0
    columnData.forEach((item, i) => {
      if (item.value === vm.submitInfo.applyTypeDesc) {
        currentIndex = i
      }
    })
    defaultIndex.value = [currentIndex]
  } else if (type === '3') {
    if (vm.submitInfo.applyStatus === '1') {
      // 审批中的数据不允许修改
      return
    }
    defaultIndex.value = [0]
    vm.columns = [getConstant('applyValidType')]
  } else {
    if (vm.submitInfo.applyStatus === '1') {
      // 审批中的数据不允许修改
      return
    }
    defaultIndex.value = [0]
    vm.columns = [getConstant('yesNo')]
  }
  showPicker.value = true
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:30:47
 * @description:  选择业务产品
 */
const doConfirm = value => {
  if (selectType.value === '1') {
    const originalBizScene = vm.submitInfo.bizScene // 原始业务大类
    vm.submitInfo.productType = value.value[1].value
    vm.submitInfo.bizScene = value.value[0].key
    if (vm.submitInfo.bizScene !== originalBizScene) {
      // 改变了业务大类，获取客户名称数据
      listOrgInfo('', 'change')
    }
    if (vm.submitInfo.bizScene !== '3') {
      // 非跨境电商清空申请类型
      vm.submitInfo.applyType = ''
      vm.submitInfo.applyTypeDesc = ''
    }
  } else if (selectType.value === '2') {
    if (value.value[0]) {
      if (value.value[0].key !== vm.submitInfo.applyType) {
        // 更改了申请类型，清空勾选的准入店铺
        vm.submitInfo.shopList = []
      }
      vm.submitInfo.applyType = value.value[0].key
      vm.submitInfo.applyTypeDesc = value.value[0].value
      if (vm.submitInfo.applyType === '34') {
        vm.submitInfo.applyValidType = '2'
        // vm.submitInfo.applyValidType = ''
        vm.submitInfo.applyValidTypeDesc = ''
        vm.submitInfo.applyValidStartDate = ''
        vm.submitInfo.applyValidPeriod = '30'
      }
      if (vm.submitInfo.applyType === '33') {
        vm.submitInfo.applyValidType = ''
        vm.submitInfo.applyValidTypeDesc = ''
        vm.submitInfo.applyValidStartDate = ''
        vm.submitInfo.applyValidPeriod = '45'
      }
      vm.submitInfo.creditPlatform = ''
      vm.submitInfo.creditPlatformDesc = ''
      if (['31', '35'].includes(vm.submitInfo.applyType)) {
        vm.submitInfo.creditApplyProduct = ''
        vm.submitInfo.creditApplyProductDesc = ''
      }
      if (!['31', '35'].includes(vm.submitInfo.applyType) && vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length > 0) {
        vm.submitInfo.creditApplyProduct = vm.submitInfo.orgLocList[0].creditApplyProduct
        vm.submitInfo.creditApplyProductDesc = vm.submitInfo.orgLocList[0].productName
      }
    }
  } else if (selectType.value === '3') {
    vm.submitInfo.applyValidType = value.value[0].key
    vm.submitInfo.applyValidTypeDesc = value.value[0].value
    if (vm.submitInfo.applyValidType === '1') {
      vm.submitInfo.applyValidStartDate = ''
    }
  } else {
    vm.submitInfo.cycleFlag = value.value[0].key
    vm.submitInfo.cycleFlagDesc = value.value[0].value
  }
  showPicker.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 11:00:52
 * @param {*}
 * @description: 选择客户名称
 */
const selectName = async () => {
  if (isReturnFlag.value) {
    // 已退回的数据不允许修改
    return
  }
  try {
    if (orgName.value) {
      // 获取客户名称数据
      await listOrgInfo('')
      showSelectOrg.value = true
    } else {
      showSelectOrg.value = true
    }
  } catch (err) {
    showToast(err as string)
  }
}

/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*} data
 * @description: 选择名称确定
 */
const clickOrgFun = (data: OrgListItem) => {
  vm.submitInfo.orgname = data.orgname
  vm.submitInfo.orgctyid = data.orgctyid
  vm.submitInfo.orgctyDesc = data.ctyDesc
  const matchedItem = vm.sellerList.find(item => data.orgname === item.orgname)
  if (matchedItem) {
    vm.submitInfo.legalPerson = matchedItem.legalPerson || ''
    vm.submitInfo.jointBorrower = matchedItem.jointBorrower || ''
    vm.submitInfo.guarantor = matchedItem.guarantor || ''
    vm.submitInfo.orgLocList = matchedItem.orgLocList || []
  }
  // 如果
  if (vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length > 0) {
    vm.submitInfo.applyCcyid = vm.submitInfo.orgLocList[0].ccyid
    vm.submitInfo.applyTemporaryAmt = vm.submitInfo.orgLocList[0].temporaryAmt
    if (!['31', '35'].includes(vm.submitInfo.applyType)) {
      vm.submitInfo.creditApplyProduct = vm.submitInfo.orgLocList[0].creditApplyProduct
      vm.submitInfo.creditApplyProductDesc = vm.submitInfo.orgLocList[0].productName
    }
  }
  showSelectOrg.value = false
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取特批申请详情
 */
const getSpecialAppInfo = async () => {
  try {
    const params = { refcode }
    const res = await apiSpecialApprovalQuery.getSpecialAppInfo(params)

    taskRefcode.value = res.data.saaVo.taskRefcode as number
    vm.submitInfo = res.data.saaVo as unknown as SaveSpecialVo
    vm.submitInfo.creditApplyProductDesc = getValueByKey(vm.submitInfo.creditApplyProduct, 'creditProduct')
    vm.submitInfo.applyValidTypeDesc = getValueByKey(vm.submitInfo.applyValidType, 'applyValidType')
    vm.submitInfo.cycleFlagDesc = getValueByKey(vm.submitInfo.cycleFlag, 'yesNo')
    vm.submitInfo.applyValidStartDate = dateFormat(vm.submitInfo.applyValidStartDate)
    vm.submitInfo.apxList = res.data.apxList
    vm.submitInfo.orgLocList = res.data.orgLocList
    vm.submitInfo.creditPlatformDesc = getValueByKey(vm.submitInfo.creditPlatform, 'creditPlatform')
    isReturnFlag.value = ['1', '2', '5'].includes(vm.submitInfo.applyStatus as string)
    //
    pageApplyStatus.value = res.data.saaVo.applyStatus
    // 如果是已提交tab页的退回数据(二级审批退回至一级审批) 按审批中逻辑处理
    if (taskType === '1' && res.data.saaVo.applyStatus === '2') {
      vm.submitInfo.applyStatus = '1'
    }

    if (vm.submitInfo.bizScene && !['2', '5'].includes(vm.submitInfo.applyStatus as string)) {
      await listOrgInfo('')
    }

    if (vm.submitInfo.applyStatus === '0' && ['32', '33', '34', '36'].includes(vm.submitInfo.applyType)) {
      await listOrgInfo('')
      const matchedItem = vm.sellerList.find(item => vm.submitInfo.orgname === item.orgname)
      if (matchedItem) {
        vm.submitInfo.legalPerson = matchedItem.legalPerson || ''
        vm.submitInfo.jointBorrower = matchedItem.jointBorrower || ''
        vm.submitInfo.guarantor = matchedItem.guarantor || ''
        vm.submitInfo.orgLocList = matchedItem.orgLocList || []
      }

      if (vm.submitInfo.orgLocList && vm.submitInfo.orgLocList.length > 0) {
        vm.submitInfo.applyCcyid = vm.submitInfo.orgLocList[0].ccyid
        vm.submitInfo.applyTemporaryAmt = vm.submitInfo.orgLocList[0].temporaryAmt
        vm.submitInfo.creditApplyProduct = vm.submitInfo.orgLocList[0].creditApplyProduct
        vm.submitInfo.creditApplyProductDesc = vm.submitInfo.orgLocList[0].productName
      }
    }
  } catch (error) {
    showToast(error as string)
  }
}

const validData = () => {
  if (isEmpty(vm.submitInfo.productType)) {
    showToast('请选择业务产品')
    return false
  }
  if (isEmpty(vm.submitInfo.applyType)) {
    showToast('请选择申请类型')
    return false
  }
  if (isEmpty(vm.submitInfo.orgname)) {
    showToast('请选择卖方名称')
    return false
  }
  if (isEmpty(vm.submitInfo.creditPlatform)) {
    showToast('请选择授权平台')
    return false
  }
  if (['31', '35'].includes(vm.submitInfo.applyType) && isEmpty(vm.submitInfo.creditApplyProduct)) {
    showToast('请选择授信产品')
    return false
  }
  // if (isEmpty(vm.submitInfo.buyerName)) {
  //   showToast('请选择买方名称')
  //   return false
  // }
  if (['32', '36'].includes(vm.submitInfo.applyType) && !vm.submitInfo.shopList.length) {
    showToast('请选择待准入的店铺')
    return false
  }
  if (vm.submitInfo.applyType === '33') {
    if (isEmpty(vm.submitInfo.applySpecialAmt)) {
      showToast('请输入特批额度(万元)')
      return false
    }
    if (Number(vm.submitInfo.applySpecialAmt) <= 0) {
      showToast('特批额度(万元)需大于0')
      return
    }
    // eslint-disable-next-line no-extra-parens
    if (isEmpty(vm.submitInfo.applyValidType) || (vm.submitInfo.applyValidType === '2' && isEmpty(vm.submitInfo.applyValidStartDate))) {
      showToast('请选择额度生效日')
      return false
    }
    if (isEmpty(vm.submitInfo.applyValidPeriod)) {
      showToast('请输入额度有效期(天)')
      return false
    }
    if (isEmpty(vm.submitInfo.cycleFlag)) {
      showToast('请选择是否循环')
      return false
    }
  }
  if (vm.submitInfo.applyType === '34') {
    if (isEmpty(vm.submitInfo.applyValidStartDate)) {
      showToast('请选择额度生效日')
      return false
    }
    if (isEmpty(vm.submitInfo.applyValidPeriod)) {
      showToast('请输入额度有效期(天)')
      return false
    }
  }
  if (['32', '33', '34', '36'].includes(vm.submitInfo.applyType) && (!vm.submitInfo.orgLocList || vm.submitInfo.orgLocList.length === 0)) {
    showToast('请先联系风控协销同步卖方授信信息')
    return false
  }
  if (isEmpty(vm.submitInfo.applyRemark)) {
    showToast('请输入申请理由')
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
  if (accessStoreRef.value) {
    // 获取最新的准入店铺信息
    vm.submitInfo.shopList = accessStoreRef.value.getShopList()
  }
  if (!validData()) {
    return
  }
  loading.value = true
  let params = {
    ...vm.submitInfo,
    applyStatus: pageApplyStatus.value,
    buyerName: pageBuyerNames.value
  }
  apiSpecialApproval.doSubmitSpecialAppInfo(params).then(
    () => {
      uni.redirectTo({
        url: '/member/project/apply/special/success',
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
  if (isEmpty(vm.submitInfo.orgname)) {
    showToast('请选择卖方名称')
    return false
  }
  if (accessStoreRef.value) {
    // 获取最新的准入店铺信息
    vm.submitInfo.shopList = accessStoreRef.value.getShopList()
  }
  loading.value = true
  apiSpecialApproval.doSaveSpecialAppInfo(vm.submitInfo).then(
    res => {
      refcode = res.data.refcode
      getSpecialAppInfo()
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
  if (disabledFlag.value) {
    // 删除成功按钮不允许点击
    return
  }
  disabledFlag.value = true
  loading.value = true
  const data = {
    refcode: refcode,
    taskRefcode: taskRefcode.value
  }
  if (operationType.value === '1') {
    // 删除
    apiSpecialApproval.doRemoveSpecialAppInfo(data).then(() => {
      showToast('删除成功')
      setTimeout(() => {
        router.back(1)
        disabledFlag.value = false
        loading.value = false
      }, 1500)
    })
  } else {
    // 撤回
    apiSpecialApproval.doRevokeSpecialAppInfo(data).then(() => {
      showToast('撤回成功')
      setTimeout(() => {
        router.back(1)
        disabledFlag.value = false
        loading.value = false
      }, 1500)
    })
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:特批申请删除
 */
const onDelete = () => {
  operationType.value = '1'
  showModalFlag.value = true
}

/**
 * @Author: Mingchun.Cheng
 * @Date: 2025-08-22 15:56:45
 * @return {*}
 * @description: 特批申请撤回
 */
const onWithdraw = () => {
  operationType.value = '2'
  showModalFlag.value = true
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 13:56:49
 * @description: 获取个人信息
 */
const getUserInfo = () => {
  apiSpecialApproval.getUserInfo().then(res => {
    vm.submitInfo.superior = res.data.loginUser.superior
    vm.submitInfo.superiorName = res.data.loginUser.superiorName // 申请人主管
    vm.submitInfo.userName = res.data.loginUser.userName // 申请人
  })
}
const changeHandler = e => {
  if (selectType.value === '1') {
    const { columnIndex, index } = e
    if (columnIndex === 0 && vm.productTypeList[index].aplList) {
      const sonList = vm.productTypeList[index].aplList.map(item => ({ key: item.bizScene, value: item.bizTypes }))
      if (uPickerRef.value) {
        uPickerRef.value.setColumnValues(1, sonList)
      }
    }
  }
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取业务产品
 */
const getProductTypeList = () => {
  apiSpecialApproval.getProductTypeList().then(res => {
    if (res.data.productTypeList && res.data.productTypeList.length) {
      //【DSBFK-22】 此处仅开放跨进电商
      vm.productTypeList = res.data.productTypeList.filter(item => {
        return item.bizScene === '3'
      })
    } else {
      vm.productTypeList = []
    }
    if (!refcode) {
      // 新增页面设置默认值
      const productVo = vm.productTypeList.find(item => {
        return item.bizScene === '3'
      })
      if (productVo) {
        vm.submitInfo.productType = productVo.aplList[0].bizTypes
        vm.submitInfo.bizScene = productVo.bizScene
      }
      listOrgInfo('')
    }
  })
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
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode) === '-1' ? '' : decodeBase64(route.value.params.refcode)
    if (refcode) {
      getSpecialAppInfo() // 获取详情
    }
  }
  getUserInfo() // 获取个人信息
  getProductTypeList() //获取产品类型
  listBuyerNameInfo() // 获取买方名称信息
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
.special-approval {
  // margin-top: -20rpx;
  .top-box {
    height: 60rpx;
  }
  .special-cell {
    :deep(.u-cell) {
      padding-left: 0.4375rem;
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

  .otherCcyid {
    display: flex;
    align-items: center;
  }
  .appointCcyid {
    margin-right: 6rpx;
    font-size: 15px;
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
.product-popup {
  :deep(.u-popup__content) {
    width: 100%;
  }
}
.form-item {
  :deep(.u-form-item__body) {
    align-items: flex-start;
    .u-form-item__body__left {
      width: auto !important;
      margin-right: 9px;
    }
  }
}
.applyRemark {
  margin-bottom: 15px;
}
.buyername-box {
  width: 100%;
}
.buyername-box2 {
  :deep(.u-cell__body) {
    display: flex;
    justify-content: space-between;
    .u-cell__body__content {
      margin-right: 25px;
    }
    .name-item {
      font-size: 15px;
      min-height: 24px;
      line-height: 24px;
      color: #333333;
    }
  }
}
</style>
