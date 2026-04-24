// 国际业务资料集合
export interface OverseasFileTodoTaskList {
  /**
   * 文件资料贷前审查申请编号
   */
  dqscNo: string
  /**
   * 资料描述
   */
  fileDesc: string
  /**
   * 资料上传时间
   */
  uploadDate: string
  /**
   * 任务是否上传标记，Y=YES/N=NO
   */
  taskOver: string
  /**
   * 不通过原因
   */
  examineOpinion: string
  /**
   * BMS文件资料展示状态[1=待上传/2=已上传/3=已退回/8=已拒绝/9=已通过]
   */
  bmsFileTodoTaskStatus: string
}
// 国内业务资料集合
export interface DomesticFileTodoTaskList {
  /**
   * 文件资料贷前审查申请编号
   */
  dqscNo: string
  /**
   * 资料描述
   */
  fileDesc: string
  /**
   * 资料上传时间
   */
  uploadDate: string
  /**
   * 任务是否上传标记，Y=YES/N=NO
   */
  taskOver: string
  /**
   * 不通过原因
   */
  examineOpinion: string
  /**
   * BMS文件资料展示状态[1=待上传/2=已上传/3=已退回/8=已拒绝/9=已通过]
   */
  bmsFileTodoTaskStatus: string
  /**
   * 买方名称
   */
  counterpartyName?: string
  /**
   * 文件uuid
   */
  fileUuid?: string
  /**
   * 父级文件资料类型代号
   */
  parentFileCode: string
  /**
   * 资料来源[1-客户提供/2-客户授权获取]
   */
  fileSource: string
}

/**
 * 上传资料进度
 */
export interface CusBusinessMaterialVo {
  /**
   * 授权状态，[0=未授权/1=已授权]
   */
  businessStatus: string
  /**
   * 授权失败原因，授权状态为失败时展示
   */
  businessMsg?: string
  /**
   * 国内财税信息
   */
  domesticTaxList: DomesticFileTodoTaskList[]
  /**
   * 国内证照信息
   */
  domesticCertList: DomesticFileTodoTaskList[]
  /**
   * 国内买方历史交易信息
   */
  domesticTradeHisList: DomesticFileTodoTaskList[]
  /**
   * 国际财税信息
   */
  overseasTaxList: DomesticFileTodoTaskList[]
  /**
   * 国际证照信息
   */
  overseasCertList: DomesticFileTodoTaskList[]
  /**
   * 国际买方历史交易信息
   */
  overseasTradeHisList: DomesticFileTodoTaskList[]
  /**
   * 信用报告uuid
   */
  repUuid: string
  /**
   * 状态
   */
  dsqcStatus: string
  /**
   * 国内业务状态
   */
  domesticDqscStatus: string
  /**
   * 国际业务状态
   */
  overseasDqscStatus: string
  /**
   * 企业名称
   */
  orgname: string
}
export interface CreditRepFileVo {
  /**
   * 自动生成报告uuid
   */
  repAutoPdfUuid: string
  /**
   * 第三方客户生成报告uuid
   */
  repUploadPdfUuid: string
}
