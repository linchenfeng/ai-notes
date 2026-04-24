/*
 * @Author       : Charon.Lin
 * @Date         : 2025-12-09 09:58:30
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-17 14:32:42
 * @Description  : 店铺&融资信息hook
 */
import { reactive, watch, Ref, shallowRef, unref, toRaw, isRef } from 'vue'
import { getConstant } from '@/utils/constant'
import { showToast } from '@/utils/uniapp/toast'
import { isEmpty } from '@/utils/validate'
import { SHOP_FINANCE_FIELD_LABEL, ShopFinanceLabel } from './shopFinance'

// 1. 定义表单数据类型
export interface ShopFinanceFormData {
  // 店铺信息
  operationType: string
  operationDuration: string
  monthlyReceipts: string
  inventoryTurnoverDays: string
  mainWarehouseCompany: string
  hasOtherFinancing: string
  otherFinancingParty: string
  otherFinancingAmount: string
  // 融资信息
  ccyid: string
  ccyDesc: string
  expectedAmount: string
  fundingPurpose: string
}

// 2. 解析配置项类型
interface ParseConfigItem {
  id: ShopFinanceLabel | ShopFinanceLabel[]
  prop: keyof ShopFinanceFormData
  // eslint-disable-next-line no-unused-vars
  formatter?: (value: string) => string
  dependsOn?: {
    prop: keyof ShopFinanceFormData
    value: string | string[]
  }
}

// 3. 拼接配置项类型
interface SubmitConfigItem {
  label: ShopFinanceLabel
  prop: keyof ShopFinanceFormData
  // eslint-disable-next-line no-unused-vars
  formatter?: (value: string) => string
  dependsOn?: {
    prop: keyof ShopFinanceFormData
    value: string | string[]
  }
}

// 新增：校验规则类型定义（解决TS类型报错）
interface ValidateRule {
  key: keyof ShopFinanceFormData
  msg: string
  // eslint-disable-next-line no-unused-vars
  validator?: (v: string) => boolean // 可选的校验函数
}

// 4. 映射规则常量
const yesNoMap = { 是: '1', 否: '0' }
const yesNoReverseMap = { '1': '是', '0': '否' }

/**
 * 店铺&融资信息 Hook（包含解析、校验、拼接、重置等核心逻辑）
 * @param formStr 父组件传递的拼接字符串（响应式，可选，不传则仅返回选项配置）
 * @param customParseConfig 自定义解析配置（可选）
 * @param customSubmitConfig 自定义拼接配置（可选）
 */
export const useShopFinance = (formStr?: Ref<string>, customParseConfig?: ParseConfigItem[], customSubmitConfig?: SubmitConfigItem[]) => {
  // 5. 核心表单数据
  const formData = reactive<ShopFinanceFormData>({
    operationType: '',
    operationDuration: '',
    monthlyReceipts: '',
    inventoryTurnoverDays: '',
    mainWarehouseCompany: '',
    hasOtherFinancing: '',
    otherFinancingParty: '',
    otherFinancingAmount: '',
    ccyid: '',
    ccyDesc: '',
    expectedAmount: '',
    fundingPurpose: ''
  })

  // 6. 默认解析配置（英文标识）
  const defaultParseConfig: ParseConfigItem[] = [
    { id: SHOP_FINANCE_FIELD_LABEL.OPERATION_TYPE, prop: 'operationType' },
    { id: SHOP_FINANCE_FIELD_LABEL.OPERATION_DURATION, prop: 'operationDuration' },
    { id: SHOP_FINANCE_FIELD_LABEL.MONTHLY_RECEIPTS, prop: 'monthlyReceipts' },
    {
      id: [SHOP_FINANCE_FIELD_LABEL.INVENTORY_TURNOVER_DAYS, SHOP_FINANCE_FIELD_LABEL.INVENTORY_TURNOVER_DAYS_WITH_SPACE],
      prop: 'inventoryTurnoverDays'
    },
    { id: SHOP_FINANCE_FIELD_LABEL.MAIN_WAREHOUSE_COMPANY, prop: 'mainWarehouseCompany' },
    {
      id: SHOP_FINANCE_FIELD_LABEL.HAS_OTHER_FINANCING,
      prop: 'hasOtherFinancing',
      formatter: v => yesNoMap[v] || ''
    },
    {
      id: SHOP_FINANCE_FIELD_LABEL.OTHER_FINANCING_PARTY,
      prop: 'otherFinancingParty',
      dependsOn: { prop: 'hasOtherFinancing', value: '1' }
    },
    {
      id: SHOP_FINANCE_FIELD_LABEL.OTHER_FINANCING_AMOUNT,
      prop: 'otherFinancingAmount',
      dependsOn: { prop: 'hasOtherFinancing', value: '1' }
    },
    { id: SHOP_FINANCE_FIELD_LABEL.CCY_DESC, prop: 'ccyDesc' },
    { id: SHOP_FINANCE_FIELD_LABEL.EXPECTED_AMOUNT, prop: 'expectedAmount' },
    { id: SHOP_FINANCE_FIELD_LABEL.FUNDING_PURPOSE, prop: 'fundingPurpose' }
  ]

  // 7. 默认拼接配置（英文标识）
  const defaultSubmitConfig: SubmitConfigItem[] = [
    { label: SHOP_FINANCE_FIELD_LABEL.OPERATION_TYPE, prop: 'operationType' },
    { label: SHOP_FINANCE_FIELD_LABEL.OPERATION_DURATION, prop: 'operationDuration' },
    { label: SHOP_FINANCE_FIELD_LABEL.MONTHLY_RECEIPTS, prop: 'monthlyReceipts' },
    { label: SHOP_FINANCE_FIELD_LABEL.INVENTORY_TURNOVER_DAYS, prop: 'inventoryTurnoverDays' },
    { label: SHOP_FINANCE_FIELD_LABEL.MAIN_WAREHOUSE_COMPANY, prop: 'mainWarehouseCompany' },
    {
      label: SHOP_FINANCE_FIELD_LABEL.HAS_OTHER_FINANCING,
      prop: 'hasOtherFinancing',
      formatter: v => yesNoReverseMap[v] || ''
    },
    {
      label: SHOP_FINANCE_FIELD_LABEL.OTHER_FINANCING_PARTY,
      prop: 'otherFinancingParty',
      dependsOn: { prop: 'hasOtherFinancing', value: '1' }
    },
    {
      label: SHOP_FINANCE_FIELD_LABEL.OTHER_FINANCING_AMOUNT,
      prop: 'otherFinancingAmount',
      dependsOn: { prop: 'hasOtherFinancing', value: '1' }
    },
    { label: SHOP_FINANCE_FIELD_LABEL.CCY_DESC, prop: 'ccyDesc' },
    { label: SHOP_FINANCE_FIELD_LABEL.EXPECTED_AMOUNT, prop: 'expectedAmount' },
    { label: SHOP_FINANCE_FIELD_LABEL.FUNDING_PURPOSE, prop: 'fundingPurpose' }
  ]

  // 8. 合并配置（自定义配置优先）
  const finalParseConfig = customParseConfig || defaultParseConfig
  const finalSubmitConfig = customSubmitConfig || defaultSubmitConfig

  // 9. 固定选项配置
  const buyerNameOptions = shallowRef([
    { orgctyid: 'CHN', orgname: '美团平台及美团平台实际消费者', ctyDesc: '中国' },
    { orgctyid: 'CHN', orgname: '京东平台及京东平台实际消费者', ctyDesc: '中国' },
    { orgctyid: 'CHN', orgname: `淘宝\\天猫平台及淘宝\\天猫平台实际消费者`, ctyDesc: '中国' },
    { orgctyid: 'CHN', orgname: '抖音平台及抖音平台实际消费者', ctyDesc: '中国' },
    { orgctyid: 'CHN', orgname: '小红书平台及小红书平台实际消费者', ctyDesc: '中国' },
    { orgctyid: 'CHN', orgname: '饿了么平台及饿了么平台实际消费者', ctyDesc: '中国' },
    { orgctyid: 'CHN', orgname: '拼多多平台及拼多多平台实际消费者', ctyDesc: '中国' }
  ])
  const yesNoOptions = shallowRef(getConstant('yesNo'))
  const financeCcyColumns = shallowRef([getConstant('applyCcyid')])
  const operateOptions = shallowRef([
    { key: '自有', value: '自有' },
    { key: '代运营', value: '代运营' }
  ])
  // 10. 工具方法：解析单个配置项
  const parseSingleItem = (item: ParseConfigItem, formObj: Record<string, string>): string => {
    let value = ''
    try {
      if (Array.isArray(item.id)) {
        value = item.id.reduce((res, id) => res || formObj[id] || '', '')
      } else {
        value = formObj[item.id] || ''
      }
      if (item.formatter && value) {
        value = item.formatter(value)
      }
    } catch (e) {
      value = ''
    }
    return value
  }

  // 11. 工具方法：校验依赖条件
  const checkDependsOn = (dependsOn: ParseConfigItem['dependsOn'], formDataObj: ShopFinanceFormData): boolean => {
    if (!dependsOn) {
      return true
    }
    const { prop: depProp, value: depValue } = dependsOn
    const currentDepValue = formDataObj[depProp]
    return Array.isArray(depValue) ? depValue.includes(currentDepValue) : currentDepValue === depValue
  }

  // 12. 核心解析方法（适配换行符+英文标识）
  const parseFormStr = (str: string) => {
    if (!str) {
      return
    }
    if (isEmpty(str)) {
      Object.keys(formData).forEach(key => {
        formData[key as keyof ShopFinanceFormData] = ''
      })
      return
    }

    try {
      // 拆分换行符分隔的键值对
      const pairs = str.split('\n').filter(item => item.includes(':'))
      const formObj: Record<string, string> = {}
      pairs.forEach(pair => {
        const [key, ...valueArr] = pair.split(':')
        const cleanKey = key.trim()
        const cleanValue = valueArr.join(':').trim()
        if (cleanKey && cleanValue) {
          formObj[cleanKey] = cleanValue
        }
      })

      const rawFormData = toRaw(formData)

      // 解析无依赖字段
      finalParseConfig.forEach(item => {
        if (!item.dependsOn) {
          const oldValue = rawFormData[item.prop]
          const newValue = parseSingleItem(item, formObj)
          if (oldValue !== newValue) {
            formData[item.prop] = newValue
          }
        }
      })

      // 处理币种编码映射
      if (formData.ccyDesc && rawFormData.ccyid !== (getConstant('applyCcyid').find(item => item.value === formData.ccyDesc)?.key || '')) {
        const ccyItem = getConstant('applyCcyid').find(item => item.value === formData.ccyDesc)
        formData.ccyid = ccyItem?.key || ''
      }

      // 解析有依赖字段
      finalParseConfig.forEach(item => {
        if (item.dependsOn && checkDependsOn(item.dependsOn, formData)) {
          const oldValue = rawFormData[item.prop]
          const newValue = parseSingleItem(item, formObj)
          if (oldValue !== newValue) {
            formData[item.prop] = newValue
          }
        }
      })
    } catch (e) {
      showToast('数据解析失败，请重新填写')
    }
  }

  // 13. 增强版监听逻辑（兼容Ref/普通字符串 + 防抖）
  const watchFormStr = () => {
    // 防抖处理：避免频繁解析
    const debouncedParse = (val: string) => {
      setTimeout(() => parseFormStr(val), 100)
    }

    if (formStr && isRef(formStr)) {
      watch(
        () => unref(formStr),
        newStr => {
          debouncedParse(newStr)
        },
        { immediate: true, deep: false }
      )
    } else if (formStr) {
      // 普通字符串初始化解析
      parseFormStr(formStr)
    }
  }
  watchFormStr()

  // 14. 表单校验方法（修复validator未定义报错）
  const validateForm = (): boolean => {
    // 定义校验规则（明确类型为ValidateRule）
    const validateRules: ValidateRule[] = [
      { key: 'operationType', msg: '请输入自有店铺还是代运营' },
      { key: 'operationDuration', msg: '请输入店铺经营时长' },
      { key: 'monthlyReceipts', msg: '请输入店铺月均回款' },
      { key: 'inventoryTurnoverDays', msg: '请输入主要SKU 库存周转天数' },
      { key: 'mainWarehouseCompany', msg: '请输入主要仓库公司' },
      { key: 'hasOtherFinancing', msg: '请选择是否有其他未结清融资' },
      { key: 'ccyid', msg: '请选择融资币种' },
      {
        key: 'expectedAmount',
        msg: '请输入预期融资金额'
      },
      { key: 'fundingPurpose', msg: '请输入本次融资资金用途' }
    ]
    // 第一步：基础必填字段校验（任一为空/不满足则返回false）
    for (const rule of validateRules) {
      const fieldValue = formData[rule.key] as string
      // 空值校验
      if (isEmpty(fieldValue)) {
        return false // 空值，静默返回false（无提示）
      }
    }
    // 第二步：融资依赖字段校验（仅当有其他融资时校验）
    if (formData.hasOtherFinancing === '1') {
      // 未结清融资资金方校验
      if (isEmpty(formData.otherFinancingParty)) {
        return false // 校验失败，静默返回false（无提示）
      }
      // 未结清融资金额校验（补充数字）
      if (isEmpty(formData.otherFinancingAmount)) {
        return false // 校验失败，静默返回false（无提示）
      }
    }
    // 第三步：所有校验通过，返回true
    return true
  }
  // 15. 核心拼接方法（英文标识 + 换行符）
  const getSubmitStr = (): string => {
    const strArr: string[] = []
    finalSubmitConfig.forEach(item => {
      if (!checkDependsOn(item.dependsOn, formData)) {
        return
      }

      let value = formData[item.prop]
      if (item.formatter && value) {
        value = item.formatter(value)
      }
      if (value) {
        strArr.push(`${item.label}:${value}`)
      }
    })
    // 换行符分隔，去除末尾空行
    return strArr.join('\n').trimEnd()
  }
  // 19. 扩展方法：重置表单
  const resetForm = (keepDefault = false) => {
    const defaultValues: Partial<ShopFinanceFormData> = {
      ccyDesc: '人民币',
      ccyid: 'CNY'
    }

    Object.keys(formData).forEach(key => {
      const prop = key as keyof ShopFinanceFormData
      formData[prop] = keepDefault ? defaultValues[prop] || '' : ''
    })
  }
  // 18. 辅助方法：校验预期融资金额>0
  const checkAmountPositive = () => {
    if (formData.expectedAmount && Number(formData.expectedAmount) <= 0) {
      showToast('预期融资金额必须大于0')
      formData.expectedAmount = ''
    }
  }

  // 20. 扩展方法：更新单个字段
  const updateField = (prop: keyof ShopFinanceFormData, value: string) => {
    formData[prop] = value
  }

  // 21. 扩展方法：批量更新字段
  const updateFields = (fields: Partial<ShopFinanceFormData>) => {
    Object.keys(fields).forEach(key => {
      const prop = key as keyof ShopFinanceFormData
      formData[prop] = fields[prop] || ''
    })
  }

  return {
    formData,
    buyerNameOptions: buyerNameOptions.value,
    yesNoOptions: yesNoOptions.value,
    financeCcyColumns: financeCcyColumns.value,
    operateOptions: operateOptions.value,
    validateForm,
    getSubmitStr, // 英文格式拼接（OPERATION_TYPE:自有）
    parseFormStr, // 解析英文格式字符串
    checkAmountPositive,
    resetForm,
    updateField,
    updateFields
  }
}
