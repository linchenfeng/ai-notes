/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-19 10:30:04
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-15 10:41:19
 * @Description  : 媒体文件interface
 */
export interface MediaInfo {
  /**
   * 文件唯一标识resourceUuid
   */
  resourceUuid: string
  /**
   * 文件类型【1=照片，2=视频，3=音频】
   */
  fileType?: string
  /**
   * 资源预览路径
   */
  src?: string
  /**
   * 文件时长
   */
  fileDuration?: number
  /**
   * 是否勾选
   */
  checked?: Array<string>
}
