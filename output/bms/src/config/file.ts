/*
 * @Author       : may.ruan
 * @Date         : 2023-03-30 09:42:06
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2023-11-30 15:25:36
 * @Description  : 文件相关地址
 */
import serverConfig from './serverConfig'
// import { getPlatform } from '@/utils/uniapp'
/**
 * 文件默认上传地址
 */
export const API_FILE_URL = '/api-sme/file/doUploadFile'
/**
 * 根据resourceUuid预览图片
 */
export const PREVIEW_RESOURCE_UUID = serverConfig.API_BASE_URL + '/api-sme/file/getPreviewFileInputStreamByApxId/'
/**
 * 根据fileUuid预览图片
 */
export const PREVIEW_FILE_UUID = serverConfig.API_BASE_URL + '/api-sme/file/getPreviewFileInputStreamByUuid/'

/**
 * 根据resourceUuid下载文件
 */
export const DOWNLOAD_RESOURCE_UUID = serverConfig.API_BASE_URL + '/api-sme/file/getFileByResourceUuidApp/'

/**
 * 根据fileUuid下载文件
 */
export const DOWNLOAD_FILE_UUID = serverConfig.API_BASE_URL + '/api-sme/file/getFileByUuidApp/'
