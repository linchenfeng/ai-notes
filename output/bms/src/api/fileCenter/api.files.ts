/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-22 14:48:51
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-31 11:01:01
 * @Description  : 公共平台文件公共接口
 */
import { request, download } from '@/api/fileCenter/api.request'
import { encode64 } from '@/utils/crypto'
import { DownloadFile } from '@/interfaces/common/publicFiles'
import { useFileCenterTokenStore } from '@/store/fileCenter/token'
import { storeToRefs } from 'pinia'
import { useSystemConfigstore } from '@/store/systemConfig'

export default {
  // 文件上传状态校验
  check(hash: string, chunkSize: number) {
    type UploadedChunk = {
      check: number
    }
    return request<UploadedChunk>('GET', `/openapi/filecenter/file/check/${hash}/${chunkSize}`)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-24 10:44:15
   * @param {string} hash 文件唯一hash值
   * @param {*} fileType 文件类型 01-源文件，02-转换文件， 03-缩略文件
   * @param {string} fileName 文件名称，未传时使用文件名称
   * @description:单文件下载
   */
  download(hash: string | string, fileType?: string, fileName?: string) {
    let url = `/openapi/filecenter/file/download?hash=${hash}&fileType=${fileType || '01'}&fileFormat=01`
    if (fileName) {
      url += `&fileName=${encodeURIComponent(encode64(fileName))}`
    }
    return download(url)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-24 10:55:38
   * @param {DownloadFile} fileDownloadList 文件信息列表
   * @param {string} fileName 文件名称
   * @description: 批量下载
   */
  batchDownload(fileDownloadList: DownloadFile[] | string, fileName?: string) {
    const data: {
      fileFormat: string
      fileDownloadList: DownloadFile[] | string
      fileName?: string
    } = {
      fileFormat: '01',
      fileDownloadList
    }
    if (fileName) {
      data.fileName = fileName
    }
    const dataStr = encodeURIComponent(encode64(JSON.stringify(data)))
    return download(`/openapi/filecenter/file/batchDownload?params=${dataStr}`)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-09-25 11:00:39
   * @param {*} hash   文件唯一标识
   * @param {*} fileType 文件类型
   * @description: 文件预览
   */
  filecenterPreview(hash: string, fileType?: string) {
    const { fileCenterToken } = storeToRefs(useFileCenterTokenStore())
    const { systemConfig } = useSystemConfigstore()
    return systemConfig.MINIO_URL + `/openapi/filecenter/file/preview?hash=${hash}&fileType=${fileType || '01'}&access_token=${fileCenterToken.value}`
  }
}
