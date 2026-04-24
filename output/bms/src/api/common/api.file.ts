/*
 * @Author       : may.ruan
 * @Date         : 2023-03-30 09:43:50
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-22 14:49:44
 * @Description  : 文件相关Api
 */

import { request, download } from '@/api/api.request'
import { encodeBase64 } from '@/utils/crypto'
import { FileList, CFile } from '@/interfaces/common/file'

export default {
  /**
   * @Author: may.ruan
   * @Date: 2022-12-07 14:28:18
   * @description: 获取随机UUID做存储临时文件的文件夹名
   */
  getFolderName() {
    type FolderName = {
      folderName: string
    }
    return request<FolderName>('GET', `/api-sme/file/getFolderName`)
  },
  /**
   * @Author: may.ruan
   * @Date: 2022-12-07 14:23:33
   * @param {string} resourceUuid 文件resourceUuid
   * @description:根据resourceUuid下载文件
   */
  getFileByResourceUuid(resourceUuid: string) {
    const fileResourceUuid = encodeBase64(resourceUuid)
    return download(`/api-sme/file/getFileByResourceUuidApp/${fileResourceUuid}`)
  },
  /**
   * @Author: may.ruan
   * @Date: 2022-12-07 14:24:16
   * @param {string} fileUuid 文件fileuuid
   * @param {*} showName  下载后文件名称，不传则为默认文件名
   * @description: 根据fileUuid下载文件
   */
  getFileByUuid(fileUuid: string, showName = '-') {
    return download(`/api-sme/file/getFileByUuidApp/${fileUuid}/${showName || '-'}`)
  },
  /**
   * @Author: may.ruan
   * @Date: 2022-12-07 14:25:32
   * @param {string} fileName 文件名称
   * @param {*} showName 下载后文件名称，不传则为默认文件名
   * @description:根据文件名称下载文件
   */
  getExportFileByFileName(fileName: string, showName = '-') {
    return download(`/api-sme/file/getExportFileByFileNameApp/${fileName}/${showName || '-'}`)
  },

  /**
   * @Author: may.ruan
   * @Date: 2022-12-07 15:41:27
   * @param {string} resourceUuid 文件resourceUuid
   * @description: 通过resourceUuid获取附件信息
   */
  getApxInfoByResourceUuid(resourceUuid: string) {
    const baseResourceUuid = encodeBase64(resourceUuid)
    return request<CFile>('GET', `/api-sme/file/getApxInfoByRefcode/${baseResourceUuid}`, {}, false)
  },
  /**
   * @Author: may.ruan
   * @Date: 2022-12-07 15:40:59
   * @param {*} fileUuid 文件fileuuid
   * @description:通过fileUuid获取附件信息
   */
  getApxInfoByUuid(fileUuid: string) {
    return request<FileList>('GET', `/api-sme/file/getApxInfoByUuid/${fileUuid}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2023-11-23 17:58:42
   * @param {string} resourceUuid 文件resourceUuid
   * @return {*}
   * @description: BMS通过resourceUuid下载文件
   */
  getBmsFileByResourceUuid(resourceUuid: string) {
    // request('GET', `/api-sme/file/getBmsFileByResourceUuid/${encodeBase64(resourceUuid)}`).then(res => {
    //   download(res.data.tempFilePath, res.data.fileName)
    // })
    return download(`/api-sme/file/getFileByResourceUuidApp/${encodeBase64(resourceUuid)}`)
  },
  /**
   * @Author: Mingchun.Cheng
   * @Date: 2024-11-04 14:42:12
   * @param {string} resourceUuid
   * @return {*}
   * @description: 通过resourceUuid下载二维码图片
   */
  getQrcodeFileByResourceUuid(resourceUuid: string) {
    return download(`/api-sme/file/getFileByResourceUuid/${encodeBase64(resourceUuid)}`)
  }
}
