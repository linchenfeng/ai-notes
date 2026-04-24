/*
 * @Author       : Charon.Lin
 * @Date         : 2025-07-11 11:17:04
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-29 10:04:17
 * @Description  :项目-业务审核-业务报价interface
 */
export interface QuotationCount {
  /**
   * 总数
   */
  count: number
  /**
   * 已报价
   */
  quotedCount: number
  /**
   * 待报价
   */
  waitCount: number
}
export interface QuotaItem {
  /**
   * 申请书编号，申请书信息
   */
  applyNo: string
  /**
   * 所在国
   */
  buyerCtyDesc: string
  /**
   * 买方名称
   */
  buyerOrgname: string
  /**
   * 报价状态，1=待报价/2=已报价
   */
  quotaStatus: string
  /**
   * 报价流水号
   */
  refcode: number
  /**
   * 业务主管，申请书信息
   */
  superiorName: string
  /**
   * 客户经理，申请书信息
   */
  userName: string
}
export interface FintAppApxVoList {
  /**
   * 文件名称
   */
  fileName: string
  /**
   * 文件UUID
   */
  resourceUuid: string
  // 添加索引签名
  [key: string]: string | number
}
export interface QuotaInfo {
  /**
   * 买方详细地址，买方信息
   */
  address: string
  /**
   * 额度申请金额，额度申请书信息
   */
  applyAmt: number | string
  /**
   * 额度币种，额度申请书信息
   */
  applyCcyid: string
  /**
   * 申请报价日期
   */
  applyDate: string
  /**
   * 申请书编号，申请书信息
   */
  applyNo: string
  /**
   * 额度申请说明
   */
  applyRemark?: string
  /**
   * 额度申请状态，98=已开立（内部）/99=已开立（外部）
   */
  applyStatus: string
  /**
   * 买方国家，买方信息
   */
  buyerCtyDesc: string
  /**
   * 买方名称，买方信息
   */
  buyerOrgname: string
  /**
   * 卖方国家，卖方信息
   */
  ctyDesc: string
  /**
   * 审批单附件
   */
  fintAppApxVoList?: FintAppApxVoList[]
  /**
   * 卖方名称，卖方信息
   */
  orgname: string
  /**
   * 报价状态，1=待报价/2=已报价
   */
  quotaStatus: string
  /**
   * 报价流水号
   */
  refcode: number
  /**
   * 关联审批单费率
   */
  relFeeRatio?: number
  /**
   * 审批单编号，关联审批单信息
   */
  relSerialNo?: string
  /**
   * 审批单附件
   */
  relSerialUuid?: string
  /**
   * 业务主管
   */
  superiorName: string
  /**
   * 账期，准入信息
   */
  tenor: string
  /**
   * 客户经理
   */
  userName: string
  /**
   * 报价备注
   */
  quotaRemark: string
  /**
   * 手续费率
   */
  quotaRate: string
  /**
   * 核准金额
   */
  checkAmt: number | string
  /**
   * 核准币种
   */
  checkCcyid: string
  /**
   * 申请类型，1=内部审批/2=外部审批
   */
  applyType?: string
  /**
   * 承保公司名称，仅外部审批展示
   */
  facOrgname?: string
}
export interface QuotationSubmit {
  /**
   * 报价手续费
   */
  quotaRate: string
  /**
   * 报价备注
   */
  quotaRemark?: string
  /**
   * 报价流水号
   */
  refcode: number
}
