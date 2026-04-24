/*
 * @Author       : Charon.Lin
 * @Date         : 2025-12-09 10:00:16
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-09 13:33:38
 * @Description  : 店铺&融资信息字段标签常量
 */
// 中文标签 ↔ 英文标识 映射
export const SHOP_FINANCE_FIELD_MAP = {
  // 英文标识: 中文标签
  OPERATION_TYPE: '运营模式',
  OPERATION_DURATION: '经营时长',
  MONTHLY_RECEIPTS: '月均回款',
  INVENTORY_TURNOVER_DAYS: '主要SKU库存周转天数',
  INVENTORY_TURNOVER_DAYS_WITH_SPACE: '主要SKU库存周转天数 ', // 兼容带空格的旧格式
  MAIN_WAREHOUSE_COMPANY: '主要仓库公司',
  HAS_OTHER_FINANCING: '是否当前有其他未结清的融资',
  OTHER_FINANCING_PARTY: '未结清融资的资金方',
  OTHER_FINANCING_AMOUNT: '未结清融资金额',
  CCY_DESC: '融资币种',
  EXPECTED_AMOUNT: '预期融资金额',
  FUNDING_PURPOSE: '本次融资资金用途'
} as const

// 反向映射：中文标签 → 英文标识
export const SHOP_FINANCE_FIELD_REVERSE_MAP = Object.entries(SHOP_FINANCE_FIELD_MAP).reduce((obj, [key, value]) => {
  obj[value] = key
  return obj
}, {} as Record<string, string>)

// 原有标签常量调整为英文标识（核心修改）
export type ShopFinanceLabel = keyof typeof SHOP_FINANCE_FIELD_MAP
export const SHOP_FINANCE_FIELD_LABEL = {
  OPERATION_TYPE: 'OPERATION_TYPE',
  OPERATION_DURATION: 'OPERATION_DURATION',
  MONTHLY_RECEIPTS: 'MONTHLY_RECEIPTS',
  INVENTORY_TURNOVER_DAYS: 'INVENTORY_TURNOVER_DAYS',
  INVENTORY_TURNOVER_DAYS_WITH_SPACE: 'INVENTORY_TURNOVER_DAYS',
  MAIN_WAREHOUSE_COMPANY: 'MAIN_WAREHOUSE_COMPANY',
  HAS_OTHER_FINANCING: 'HAS_OTHER_FINANCING',
  OTHER_FINANCING_PARTY: 'OTHER_FINANCING_PARTY',
  OTHER_FINANCING_AMOUNT: 'OTHER_FINANCING_AMOUNT',
  CCY_DESC: 'CCY_DESC',
  EXPECTED_AMOUNT: 'EXPECTED_AMOUNT',
  FUNDING_PURPOSE: 'FUNDING_PURPOSE'
} as const
