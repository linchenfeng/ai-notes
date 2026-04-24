/*
 * @Author       : may.ruan
 * @Date         : 2023-03-30 09:46:30
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-16 16:11:21
 * @Description  : 文件公共处理
 */
export interface CFile {
  /**
   * 流水号
   */
  refcode: number
  /**
   * 文件编号resourceUuid
   */
  resourceUuid: string
  /**
   * 文件编号fileUuid
   */
  fileUuid: string
  /**
   * 文件编号fileUuid
   */
  uuid: string
  /**
   * 文件来源[1-本系统/2-信贷系统]
   */
  fileSource?: string
  /**
   * 文件类型（后缀名）
   */
  fileType: string
  /**
   * 文件名
   */
  fileName: string
  /**
   * 文件路径
   */
  url: string
  /**
   * 文件标识
   */
  fileKey: string
  /**
   * 上传状态
   */
  status?: string
  /**
   * 上传描述
   */
  message?: string
  /**
   * 文件类型
   */
  type?: string
}

export interface FileList {
  apxList: Array<CFile>
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-30 14:20:21
 * @return {*}
 * @description: 上传的文件信息
 */
export interface FileItem {
  /**
   * 文件名称
   */
  name: string
  /**
   * 文件大小
   */
  size: number
  /**
   * 文件类型
   */
  type: string
  /**
   * 文件路径
   */
  url: string
}
export interface ResUuidVo {
  /**
   * resourceUuid的Key,不传默认为resourceUuid
   */
  key?: string
  /**
   * 回显的list
   */
  fileList: Array<{ [key: string]: string | number }>
}
