/*
 * @Author       : oscar.yu
 * @Date         : 2023-1-16 09:12:09
 * @LastEditors: oscar.yu
 * @LastEditTime: 2023-01-16 19:27:10
 * @Description  : 微信公众号授权控制类
 */

/**
 * @Author: oscar.yu
 * @Date: 2022-10-13 10:08:29
 * @return {*}
 * @description: 微信公众号网页授权跳转页面
 */
export interface SystemConfig {
  /**
   * 微信公众号开关
   */
  P_WX_OPEN: string
  /**
   * superset域名
   */
  SUPERSET_URL: string
  /**
   * 直连文件中心域名
   */
  MINIO_URL: string
  /**
   * 是否启用生产环境配置[1:是(default),0:否]
   * 1为生产，启用水印
   */
  ENABLE_PRODUCTION_CONFIGURATION: string
  // /**
  //  * superset看板UUID（废弃）
  //  */
  // SUPERSET_UUID: string
}

export interface LoginidData {
  brandRefcode: number
  chgpwdFlag: string
  createDate: string
  createUser: string
  dataStatus: string
  delFlag: string
  edtid: string
  /**
   * 邮箱
   */
  email: string
  emailVaildStatus: string
  lastLoginDate: string
  lastModDate: string
  lastModUser: string
  loginId: string
  /**
   * 手机号
   */
  mobilephone: string
  mobileVaildStatus: string
  password: string
  refcode: number
  registerBrandRefcode: number
  remark: string
  source: string
  systemType: string
  useFlag: string
  userid: string
  userName: string
  weixinOpenId: string
}

export interface SipaBurMVo {
  sipaBurMVo: LoginidData
}

export interface PasswordCheckObj {
  flag: boolean
}

export interface SMSData {
  /**
   * 临时令牌，用于校验验证码
   */
  uuid: string
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 16:04:09
 * @description: 国家列表
 */
export interface CountryList {
  /**
   * 国别名称，30
   */
  ctyDesc: string
  /**
   * 国家英文名称，120
   */
  ctyDescEn: string
  /**
   * 国别代号，10
   */
  ctyid: string
  /**
   * 排序权重，10
   */
  ctyRank: string
  /**
   * 国家区号，10
   */
  phoneCode: string
  /**
   * 国家标记，1=白名单/2=黑名单
   */
  ctyFlag: string
}
export interface CountryDataList {
  /**
   * 国别列表
   */
  countryList: CountryList[]
}
export interface passData {
  /**
   * 密码字符串
   */
  password: string
}

export interface CtyData {
  /**
   * 国别名称，30
   */
  ctyDesc: string
  /**
   * 国家英文名称，120
   */
  ctyDescEn: string
  /**
   * 国家标记，1=白名单/2=黑名单
   */
  ctyFlag: string
  /**
   * 国别代号，10
   */
  ctyid: string
  /**
   * 排序权重，10
   */
  ctyRank: number
  /**
   * 国家区号，10
   */
  phoneCode: string
}

/**
 * token参数对象
 */
export interface MinIOTokenVo {
  /**
   * token参数
   */
  accessToken: string
  /**
   * token存活时间
   */
  expiresIn: string
}
/**
 * minIO token
 */
export interface MinIOToken {
  /**
   * token参数对象
   */
  minIOTokenVo: MinIOTokenVo
}
