export interface QuotaCount {
  /**
   * 总数
   */
  count: number
  /**
   * 待申请
   */
  waitApplyCount: number
  /**
   * 待提交
   */
  waitSubmitCount: number
}
export interface SearchData {
  /**
   * 查询状态，0=待申请/1=待提交
   */
  finalStatus: string
  /**
   * 卖方名称，模糊搜索
   */
  orgname: string
}
// 定义整个search对象的类型接口
export interface Search {
  data: SearchData
  pageNum: number
  pageSize: number
}
export interface QuotaList {
  /**
   * 企业信息流水号，待提交存在
   */
  appRefcode?: number
  /**
   * 业务类型
   */
  bizScene: string
  /**
   * 卖方数
   */
  buyerCount: number
  /**
   * 卖方所在国
   */
  ctyDesc: string
  /**
   * 卖方名称
   */
  orgname: string
  /**
   * 产品类型
   */
  productType: string
  /**
   * 准入流水号，不准确，仅用于确认卖方名称
   */
  refcode: number
  /**
   * 查询状态，0=待申请/1=待提交
   */
  finalStatus: string
}
export interface BuyerList {
  /**
   * 详细地址
   */
  addressEn?: string
  /**
   * 买方名称
   */
  aplOrgname: string
  /**
   * 额度申请金额，单位万元
   */
  applyAmt: string
  /**
   * 额度申请币种，默认人民币
   */
  applyCcyid: string
  /**
   * 额度申请情况说明
   */
  applyRemark?: string
  /**
   * 业务编号，页面无用
   */
  buyerBusinessNo: string
  /**
   * 买方流水号，页面无用
   */
  buyerRefcode: string
  /**
   * 公司注册编码（统一社会信用代码）
   */
  companyRegistrationNo?: string
  /**
   * 国家描述
   */
  ctyDesc?: string
  /**
   * 国家编码
   */
  orgctyid: string
  /**
   * 买方流水号
   */
  refcode: string
  /**
   * 数据补充状态，0=待补充/1=已补充
   */
  supplementStatus: string
  /**
   * 准入买方业务编号
   */
  aplFinancingNo: string
}
export interface QuotaInfo {
  /**
   * 业务大类
   */
  bizScene: string
  /**
   * 买方信息，未保存不存在
   */
  buyerList: BuyerList[]
  /**
   * 国家描述
   */
  ctyDesc?: string
  /**
   * 国别编码
   */
  ctyid: string
  /**
   * 卖方名称，必填
   */
  orgname: string
  /**
   * 业务产品
   */
  productType: string
  /**
   * 卖方信息流水号，未保存不存在
   */
  refcode?: number | string
  /**
   * 提交标记，0=临时保存/1=提交
   */
  submitFlag: string
}
export interface SelectBuyerList {
  /**
   * 详细地址，准入不存在该值
   */
  address?: string
  /**
   * 准入买方业务编号
   */
  aplFinancingNo: string
  /**
   * 买方名称
   */
  aplOrgname: string
  /**
   * 买方企业流水号
   */
  buyerRefcode: string
  /**
   * 公司注册编号（统一社会信用代码），准入不存在该值
   */
  companyRegistrationNo?: string
  /**
   * 买方国家描述
   */
  ctyDesc: string
  /**
   * 准入买方流水号
   */
  dtcRefcode: string
  /**
   * 买方国家编码
   */
  orgctyid: string
}
export interface ReqGetBuyerInfo {
  /**
   * 买方名称，模糊搜索
   */
  aplOrgname?: string
  /**
   * 卖方名称
   */
  fullOrgname: string
  /**
   * 产品类型，默认国内业务产品
   */
  productType: string
}
