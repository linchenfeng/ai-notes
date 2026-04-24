/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-23 19:56:55
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-23 20:01:00
 * @Description  : 公共平台
 */
export interface DownloadFile {
  /**
   * 文件唯一标识
   */
  hash: string
  /**
   * 文件类型 【01-源文件，02-转换文件， 03-缩略文件】
   */
  fileType: string
  /**
   * 指定打包下载的层级，如u01/video
   */
  filePath?: string
}
