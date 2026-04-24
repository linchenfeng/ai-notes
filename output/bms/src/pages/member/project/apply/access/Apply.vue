<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:45:24
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-27 10:25:43
 * @Description  : 项目-业务申请-申请准入 /member/project/apply/access/apply
-->
<template>
  <NavBar />
  <view>
    <up-sticky bg-color="#fff">
      <state-module
        v-if="vm.submitInfo.intLoanStatus"
        :state-name="stateName[vm.submitInfo.intLoanStatus]"
        :state-color="stateColor[vm.submitInfo.intLoanStatus]"
      ></state-module>
    </up-sticky>
    <view class="businessApply-internation" :class="showSelectCountry ? 'selectCountryClass' : ''">
      <ty-info-card :show-line="false">
        <view class="topCell" :class="vm.submitInfo.intLoanStatus ? 'paddingTop' : ''">
          <view v-if="vm.submitInfo.postponeRemark" class="returnReason">
            <view>
              <text>暂缓原因：</text>
              <text class="reasonValue">
                {{ vm.submitInfo.postponeRemark }}
              </text>
            </view>
          </view>
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
                <view class="unFocus" @click="showSelectPicker('3')">
                  <u-input v-model="getProduceType" placeholder="请选择业务产品" />
                </view>
                <template #right>
                  <up-icon name="arrow-down" @click="showSelectPicker('3')"></up-icon>
                </template>
              </u-form-item>
            </u-cell-group>
          </view>
        </u-form>
      </ty-info-card>
      <ty-info-card title="卖方基本信息">
        <u-form label-width="30%">
          <view class="internation-info-group">
            <u-cell-group :border="false" :stop="true">
              <u-form-item label="卖方名称" required>
                <view class="unFocus" @click="selectName()">
                  <u-input v-model="vm.submitInfo.orgname" maxlength="90" placeholder="请选择卖方名称" />
                </view>
                <!--   国内业务固定为中国不让选择 -->
                <template #right>
                  <up-icon name="arrow-right" @click="selectName()"></up-icon>
                </template>
              </u-form-item>
              <u-form-item label="卖方所在国" required>
                <view class="unFocus" @click="showSelectCty()">
                  <u-input v-model="vm.submitInfo.orgctyDesc" placeholder="请选择卖方所在国" />
                </view>
                <template #right>
                  <up-icon name="arrow-right" @click="showSelectCty()"></up-icon>
                </template>
              </u-form-item>
            </u-cell-group>
          </view>
        </u-form>
      </ty-info-card>
      <ty-info-card title="买方及贸易信息">
        <template #subtitle>
          <view v-if="!['5', '10'].includes(vm.submitInfo.intLoanStatus)" class="inviteWrite" @click.stop="addBuyer">
            <text class="iconfont invite icon-plustianjia"></text>
            <text class="name">添加</text>
          </view>
        </template>
        <view v-if="showEdit">
          <view v-for="(item, i) in vm.submitInfo.fintAplDtcVoList" :key="i" class="buyer-swipe" @click="editBuyer(item, i)">
            <ty-swipe-action :index="i">
              <template #slide-right>
                <view class="slide-right" @click="onDeleteBuyer(i, $event)">
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
      <!-- 准入历程 -->
      <History v-if="hasApply && vm.submitInfo.intLoanStatus !== '0'" />
      <view v-if="getHasPermissionsById('member:project:apply:access')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button
            v-if="['0', '5', '10'].includes(vm.submitInfo.intLoanStatus) && hasApply"
            :loading="loading"
            block
            type="error"
            native-type="submit"
            @click="onDelete"
          >
            删除
          </u-button>
          <u-button :loading="loading" block type="success" native-type="submit" @click="doSave">保存</u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onSubmit">提交</u-button>
        </view>
      </view>
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
      <u-picker
        :show="showNamePicker"
        :columns="vm.nameColumns"
        item-height="88"
        key-name="orgname"
        @confirm="doNameConfirm"
        @cancel="showNamePicker = false"
      />
      <u-popup :show="showSelectCountry" mode="center">
        <SelectCountry
          type="list"
          title="国家地区信息"
          :data="selectCountryList.data"
          :search-fun="getCountryList"
          @back="close"
          @click-fun="clickFun"
        ></SelectCountry>
      </u-popup>
      <u-popup :show="showSelectOrg" mode="center">
        <OrgList
          type="list"
          title="卖方信息"
          id-key="orgctyid"
          name-key="orgname"
          :data="vm.sellerList"
          :search-fun="listOaAndAppOrgInfo"
          @back="closeOrg"
          @click-fun="clickOrgFun"
        ></OrgList>
      </u-popup>
      <u-modal
        :show="showModalFlag"
        title="温馨提示"
        confirm-text="确认"
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
  </view>
</template>
<script setup lang="ts">
import { FintAplMVo, OrgListPicker, OaOrgList, FintAplDtcVoList, ProductTypeList } from '@/interfaces/member/project/apply/businessApply'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import StateModule from '@/plugins/StateModule.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { ConstantArray } from '@/interfaces/common/constant'
import { getConstant } from '@/utils/constant'
import apiCommon from '@/api/common/api.common'
import { CountryList } from '@/interfaces/common/common'
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
import SelectCountry from '@/plugins/SelectCountryNew.vue'
import { isEmpty } from '@/utils/validate'
import OrgList from './components/OrgList.vue'
import { decodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { setStorage } from '@/utils/storages'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import { onShow } from '@dcloudio/uni-app'
import { getStorage, removeStorage } from '@/utils/storages'
import { useShopFinance } from './components/shopFinanceInfo/useShopFinance' // 导入hook
import History from '@/pages/member/project/query/access/History.vue'
let defaultIndex = ref([0, 0])
const router = useRouter()
const route = useRoute()
let loading = ref(false)
let holdName = ref('')
let orgName = ref('')
let selectType = ref('')
let showEdit = ref(true)
const stateColor = {
  '1': 'warning',
  '3': 'success',
  '4': 'error',
  '6': 'warning',
  '5': 'warning',
  '0': 'warning',
  '2': 'error',
  '7': 'warning',
  '8': 'error',
  '9': 'warning',
  '10': 'warning'
}
let showModalFlag = ref(false) //删除提示弹窗
const uPickerRef = ref<InstanceType<any>>(null)
let refcode: number | string = '-1' // 业务准入流水号【-1=新增/其他=修改】
const currentType = ref('0') // 当前选择的名称【1=卖方/2=买方】
const showPicker = ref(false) // 是否展示选择币种框
const showNamePicker = ref(false) // 是否展示选择名称框
const columns: ConstantArray = [getConstant('applyCcyid').concat([{ key: 'qt', value: '其他' }])]
const nameColumns: OrgListPicker = [[]] // 选择买卖方列表
const buyerList: OrgListPicker = [[]] // 买方列表
const sellerList: OaOrgList[] = [] // 卖方列表
const countryList: CountryList[] = []
const productTypeList: ProductTypeList[] = [] // 业务产品列表
const hasApply = ref(false) // 是否申请过
let showSelectCountry = ref(false) // 是否展示选择国家弹窗
let showSelectOrg = ref(false) // 是否展示选择卖方弹窗
let submitInfo: FintAplMVo = {
  intLoanStatus: '',
  returnReason: '',
  rejectReason: '',
  annualTurnover: '',
  ccyid: '',
  counterpartyName: '',
  ctyid: '',
  futureAnnualTurnover: '',
  orgctyid: '',
  orgname: '',
  productName: '',
  projectSource: '',
  tenor: '',
  ctyDesc: '',
  orgctyDesc: '',
  ccyidDesc: '',
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
  customType: '',
  fintAplDtcVoList: [],
  postponeRemark: ''
}
let vm = reactive({
  submitInfo: submitInfo, // 提交信息
  countryList: countryList, // 所有国家信息
  nameColumns: nameColumns, // 选择已关联国家信息
  sellerList: sellerList, // 卖方国家列表
  buyerList: buyerList, // 买方国家列表
  columns: columns, // 币种/账期选择列表
  productTypeList: productTypeList // 业务产品列表
})
const stateName = computed(() => ({
  '1': '待准入',
  '3': vm.submitInfo.conditionFlag === '1' ? '有条件准入' : '已准入',
  '4': '已拒绝',
  '6': '待受理',
  '5': '已撤回',
  '0': '已保存',
  '2': '已退回',
  '7': '受理退回',
  '8': '已拒绝',
  '9': '已暂缓',
  '10': '解除暂缓'
}))
type ListType = {
  code: string
  text: string
  ctyFlag: string
}
type OrgListType = {
  orgname: string
  ctyDesc: string
  orgctyid: string
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
 * @Date: 2025-04-03 16:38:30
 * @param {*} val 查询关键字
 * @return {*}
 * @description: 获取准入申请及OA企业列表
 */
const listOaAndAppOrgInfo = (val: string) => {
  orgName.value = val
  const data = { orgname: val || '' }
  return new Promise<Array<OrgListType>>((resolve, reject) => {
    vm.sellerList = []
    apiBusinessApply.listOaAndAppOrgInfo(data).then(
      res => {
        vm.sellerList = res.data.orgList
        resolve(res.data.orgList)
      },
      () => {
        reject(false)
      }
    )
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 14:40:27
 * @param {*} type 类型【1=卖方所在国】
 * @description: 选择国家
 */
const showSelectCty = () => {
  // 若存在holdName获取所有国家
  if (holdName.value) {
    getCountryList('')
  }
  showSelectCountry.value = true
}
const close = () => {
  showSelectCountry.value = false
}
const closeOrg = () => {
  showSelectOrg.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:24:23
 * @description: 选择币种 type【1=选择账期起算日/2=选择币种/3=选择业务产品】
 */
const showSelectPicker = (type: string) => {
  selectType.value = type
  if (type === '1') {
    defaultIndex.value = [0]
    vm.columns = [getConstant('tenorStartType')]
  } else if (type === '3') {
    // 将一维数组包装成二维数组
    const parentList = vm.productTypeList.map(item => ({ key: item.bizScene, value: getValueByKey(item.bizScene, 'intBizScene') }))
    let parentIndex = vm.productTypeList.findIndex(item => item.bizScene === vm.submitInfo.bizScene)
    parentIndex = parentIndex === -1 ? 0 : parentIndex
    const sonList = vm.productTypeList[parentIndex].aplList.map(item => ({ key: item.bizScene, value: item.bizTypes }))
    let sonIndex = vm.productTypeList[parentIndex].aplList.findIndex(item => item.bizTypes === vm.submitInfo.productType)
    sonIndex = sonIndex === -1 ? 0 : sonIndex
    vm.columns = [parentList, sonList] // 业务产品列表
    defaultIndex.value = [parentIndex, sonIndex]
  } else {
    defaultIndex.value = [0]
    vm.columns = [getConstant('applyCcyid').concat([{ key: 'qt', value: '其他' }])]
  }
  showPicker.value = true
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:50:02
 * @return {*}
 * @description: 校验买方信息选项是否填完
 */
const checkBuyerList = () => {
  const { parseFormStr, validateForm } = useShopFinance()
  vm.submitInfo.fintAplDtcVoList.forEach(item => {
    let filloutFlag = true
    const baseFieldsValid = !(
      isEmpty(item.counterpartyName) ||
      isEmpty(item.ctyid) ||
      isEmpty(item.productName) ||
      // eslint-disable-next-line no-extra-parens
      (vm.submitInfo.productType.includes('物流') &&
        (isEmpty(item.logisticsSystemFlag) || isEmpty(item.waybillVerifyType) || isEmpty(item.publicBiddingFlag))) ||
      isEmpty(item.tenorStartDesc) ||
      // eslint-disable-next-line no-extra-parens
      (item.tenorStartType === '5' && isEmpty(item.tenorStartDesc)) ||
      isEmpty(item.tenor) ||
      isEmpty(item.ccyid) ||
      isEmpty(item.annualTurnover) ||
      isEmpty(item.futureAnnualTurnover) ||
      isEmpty(item.transactionYears) ||
      isEmpty(item.projectSource)
    )
    let shopFinanceValid = true
    if (vm.submitInfo.productType.includes('国内电商') && vm.submitInfo.bizScene === '1') {
      parseFormStr(item.storeInformation || '')
      shopFinanceValid = validateForm()
    }
    filloutFlag = baseFieldsValid && shopFinanceValid
    item.supplementStatus = filloutFlag ? '1' : '0'
  })
  //如果是国内电商的数据需要店铺融资信息是否填写完整
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:30:47
 * @description: 选择币种确定 selectType【1=选择账期起算日/2=选择币种/3=选择业务产品】
 */
const doConfirm = value => {
  if (selectType.value === '1') {
    vm.submitInfo.tenorStartType = value.value[0].key
    vm.submitInfo.tenorStartDesc = vm.submitInfo.tenorStartType === '5' ? '' : value.value[0].value
  } else if (selectType.value === '3') {
    //切换业务产品时，清掉买方列表中的买方名称,买方国家
    if (vm.submitInfo.productType !== value.value[1].value) {
      vm.submitInfo.fintAplDtcVoList.map(item => {
        item.counterpartyName = ''
        item.supplementStatus = '0'
        item.ctyid = ''
        item.ctyDesc = ''
      })
    }
    vm.submitInfo.productType = value.value[1].value
    vm.submitInfo.bizScene = value.value[0].key
    // 如果业务产品是国内电商卖方所在国默认中国
    if (vm.submitInfo.productType === '国内电商' && vm.submitInfo.bizScene === '1' && isEmpty(vm.submitInfo.orgctyid)) {
      vm.submitInfo.orgctyid = 'CHN'
      vm.submitInfo.orgctyDesc = '中国'
    }
    checkBuyerList()
  } else {
    vm.submitInfo.ccyidDesc = value.value[0].value
    vm.submitInfo.ccyid = value.value[0].key === 'qt' ? '' : value.value[0].key
  }
  showPicker.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 11:00:52
 * @param {*}
 * @description: 选择卖方名称
 */
const selectName = async () => {
  try {
    if (orgName.value) {
      // 获取卖方名称数据
      await listOaAndAppOrgInfo('')
      showSelectOrg.value = true
    } else {
      showSelectOrg.value = true
    }
  } catch (err) {
    showToast(err as string)
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 13:17:43
 * @param {*} value
 * @description: 选择买卖方名称确定
 */
const doNameConfirm = value => {
  if (currentType.value === '1') {
    vm.submitInfo.orgname = value.value[0].orgname
    vm.submitInfo.orgctyid = value.value[0].orgctyid
    vm.submitInfo.orgctyDesc = value.value[0].ctyDesc
  } else if (currentType.value === '2') {
    vm.submitInfo.counterpartyName = value.value[0].orgname
    vm.submitInfo.ctyid = value.value[0].orgctyid
    vm.submitInfo.ctyDesc = value.value[0].ctyDesc
  }
  showNamePicker.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 16:56:50
 * @param {*} data
 * @description: 选择国籍确定
 */
const clickFun = (data: ListType) => {
  vm.submitInfo.orgctyDesc = data.text
  vm.submitInfo.orgctyid = data.code
  showSelectCountry.value = false
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*} data
 * @description: 选择名称确定
 */
const clickOrgFun = (data: OrgListType) => {
  vm.submitInfo.orgname = data.orgname
  // 国内业务卖方所在国固定为中国
  vm.submitInfo.orgctyid = data.orgctyid
  vm.submitInfo.orgctyDesc = data.ctyDesc
  showSelectOrg.value = false
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取准入详情
 */
const getOverseasBusinessInfo = () => {
  apiBusinessApply.getOverseasBusinessInfo(refcode as number).then(res => {
    vm.submitInfo = res.data
  })
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务提交
 */
const onSubmit = () => {
  if (isEmpty(vm.submitInfo.productType)) {
    showToast('请选择业务产品')
    return
  }
  if (isEmpty(vm.submitInfo.orgname)) {
    showToast('请选择卖方名称')
    return
  }
  if (isEmpty(vm.submitInfo.orgctyid)) {
    showToast('请选择卖方所在国')
    return
  }
  // 买方列表校验
  if (vm.submitInfo.fintAplDtcVoList.length === 0) {
    showToast('请添加买方及贸易信息')
    return
  }
  const pendingBuyer = vm.submitInfo.fintAplDtcVoList.find(item => item.supplementStatus === '0')
  if (pendingBuyer) {
    showToast(`请补充${pendingBuyer.counterpartyName}的信息`)
    return
  }
  // 填写的买卖方都是一个企业，则提交时阻挡提示：买卖企业名称不能相同
  const sellerName = vm.submitInfo.orgname
  const hasSameBuyer = vm.submitInfo.fintAplDtcVoList.some(item => item.counterpartyName === sellerName)
  if (hasSameBuyer) {
    showToast('买卖方企业名称不能相同')
    return
  }
  loading.value = true
  const data = {
    ...vm.submitInfo,
    isSubmit: '1'
  }
  apiBusinessApply.doSubmitOverseasBusinessInfo(data).then(
    () => {
      uni.redirectTo({
        url: '/member/project/apply/access/success',
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
 * @description: 准入暂存
 */
const doSave = (type?: string) => {
  if (isEmpty(vm.submitInfo.orgname)) {
    showToast('请选择卖方名称')
    return
  }
  vm.submitInfo.isSubmit = '0'
  loading.value = true
  apiBusinessApply.doSubmitOverseasBusinessInfo(vm.submitInfo).then(
    res => {
      refcode = res.data.refcode
      getOverseasBusinessInfo()
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
const onConfirmDel = () => {
  loading.value = true
  const data = {
    financingNo: vm.submitInfo.financingNo || '',
    refcode: vm.submitInfo.refcode as number,
    delFlag: '1'
  }
  apiBusinessApply.doWithdrawOverseasBusinessInfo(data).then(
    () => {
      loading.value = false
      showToast('删除成功')
      setTimeout(() => {
        router.back(1)
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务删除
 */
const onDelete = () => {
  showModalFlag.value = true
}
const getApplyOrgInfo = (type: string) => {
  apiBusinessApply.getApplyOrgInfo(type).then(res => {
    vm.buyerList = [res.data.orgList]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 13:56:49
 * @description: 获取个人信息
 */
const getUserInfo = () => {
  apiBusinessApply.getUserInfo().then(res => {
    vm.submitInfo.superior = res.data.loginUser.superior
    vm.submitInfo.superiorName = res.data.loginUser.superiorName // 申请人主管
    vm.submitInfo.userName = res.data.loginUser.userName // 申请人
  })
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取业务产品
 */
const getProductTypeList = () => {
  apiBusinessApply.getProductTypeList().then(res => {
    if (res.data.productTypeList && res.data.productTypeList.length) {
      vm.productTypeList = res.data.productTypeList
    } else {
      vm.productTypeList = []
    }
  })
}
// 添加买方信息
const addBuyer = () => {
  setStorage('application-fintAplDtcVoList', vm.submitInfo.fintAplDtcVoList)
  const path = `/member/project/apply/access/buyerInfo/${encodeBase64(-1)}/${encodeBase64(vm.submitInfo.productType || '-1')}/${encodeBase64(
    vm.submitInfo.bizScene as string
  )}`
  router.push(path)
}
// 修改买方信息
const editBuyer = (item: FintAplDtcVoList, i) => {
  setStorage('application-fintAplDtcVoList', vm.submitInfo.fintAplDtcVoList)
  const path = `/member/project/apply/access/buyerInfo/${encodeBase64(i)}/${encodeBase64(vm.submitInfo.productType || '-1')}/${encodeBase64(
    vm.submitInfo.bizScene as string
  )}`
  router.push(path)
}
// 删除买方信息
const onDeleteBuyer = (index, event: MouseEvent) => {
  event.stopPropagation()
  vm.submitInfo.fintAplDtcVoList.splice(index, 1)
  showEdit.value = false
  nextTick(() => {
    showEdit.value = true
  })
}
const changeHandler = e => {
  if (selectType.value === '3') {
    const { columnIndex, index } = e
    if (columnIndex === 0) {
      const sonList = vm.productTypeList[index].aplList.map(item => ({ key: item.bizScene, value: item.bizTypes }))
      if (uPickerRef.value) {
        uPickerRef.value.setColumnValues(1, sonList)
      }
    }
  }
}
onMounted(() => {
  getCountryList('') // 获取国家列表
  listOaAndAppOrgInfo('') // 获取卖方名称数据
  getApplyOrgInfo('2') // 获取买方名称数据
  getUserInfo() // 获取个人信息
  getProductTypeList() //获取产品类型
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode) === '-1' ? '' : decodeBase64(route.value.params.refcode)
    if (refcode) {
      hasApply.value = true
      getOverseasBusinessInfo()
    }
  }
})
let firstEntryFlag = true
onShow(() => {
  if (firstEntryFlag) {
    removeStorage('application-fintAplDtcVoList')
    firstEntryFlag = false
  }
  if (getStorage('application-fintAplDtcVoList')) {
    vm.submitInfo.fintAplDtcVoList = getStorage('application-fintAplDtcVoList') as FintAplDtcVoList[]
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
  .internation-info-group,
  .topCell {
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
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.paddingTop {
  padding-top: 60rpx;
}
</style>
