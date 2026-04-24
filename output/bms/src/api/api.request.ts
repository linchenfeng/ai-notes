/* eslint-disable no-console */
/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 09:06:20
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-25 16:32:59
 * @Description  : API 请求基类
 */
import { encrypt, decrypt } from '@/utils/crypto'
import serverConfig from '@/config/serverConfig'
import { getStorage } from '@/utils/storages'
import { webLoading, showToast } from '@/utils/uniapp/toast'
import { ResponseData } from '@/interfaces/root'
import { logOut } from '@/utils/permissions'
import { trimFormat } from '@/utils/format'
import { reLaunch, redirectTo } from '@/utils/uniapp'
import { getPlatform } from '@/utils/uniapp'

// 组装请求的参数值(加解密)
function _encryptData(reqData) {
  if (!reqData) {
    return ''
  }
  const result = {
    data: reqData.data ? reqData.data : reqData,
    client: 'wap',
    pageNum: reqData.pageNum || 0,
    pageSize: reqData.pageSize || 0,
    sort: JSON.stringify(reqData.sort) || ''
  }
  // 去空格
  result.data = trimFormat(result.data)
  // 判断是否开启开密
  if (serverConfig.ENCRYPT === true) {
    result.data = encrypt(JSON.stringify(result.data))
  }
  return JSON.stringify(result)
}
/**
 * @Author: may.ruan
 * @Date: 2022-11-21 09:31:03
 * @param {string} method 请求时使用的方法 get/post/put/delete...
 * @param {string} url api请求地址
 * @param {object} data // 请求附带参数
 * @param {boolean} needToken // 是否需要拼接token,签约信息收集模块不拼接
 * @return {*} Promise对象，成功或失败
 * @description: api请求基类
 */
export async function request<T>(
  method: 'GET' | 'POST',
  url: string,
  postData?: object,
  needToken = true,
  showLoadingFlag = true,
  showTip = true //是否展示接口异常信息
): Promise<ResponseData<T>> {
  let miniLoading: any = {}
  if (getPlatform() === 'H5') {
    miniLoading = await webLoading()
  }
  return new Promise(function (resolve, reject) {
    try {
      // 打印请求数据
      console.log(`%c请求类型：${method.toLocaleUpperCase()}，请求接口：${url}`, 'background:#008cd6 ; padding:1px 2px;  color: #fff')
      if (postData) {
        console.log(JSON.stringify(postData))
      }
      if (showLoadingFlag && getPlatform() === 'H5') {
        miniLoading.loading()
      }
      // hideLoading()
      // showLoading()
      let baseUrl = serverConfig.API_BASE_URL + url + '?t=' + new Date().getTime()
      const token = getStorage('token')
      if (token && needToken) {
        baseUrl += `&access_token=${token}`
      }
      uni.request({
        url: baseUrl,
        method,
        data: _encryptData(postData),
        dataType: 'json',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: serverConfig.API_TIME_OUT,
        success: function ({ data }) {
          // hideLoading()
          if (showLoadingFlag && getPlatform() === 'H5') {
            miniLoading.close()
          }
          const response = data as ResponseData<T>
          // 开发环境 & 模拟数据
          if (import.meta.env.DEV && url.includes('/api-mock')) {
            // 打印响应数据
            console.log(`%c响应接口：${url}`, `background:#3eb00e ; padding:1px 2px; color: #fff`)
            console.log(JSON.stringify(response))
            const responseData = {
              data: response as T,
              code: 200,
              msg: 'success'
            }
            return resolve(responseData)
          }
          try {
            // 判断是否开启开密
            if (serverConfig.ENCRYPT === true) {
              if (response.data) {
                response.data = JSON.parse(decrypt(response.data as string))
              }
            } else {
              response.data = JSON.parse(response.data as string)
            }
            let resColor = '#e60012' //异常红色
            // 正常成功
            if ([1, 100, 200].includes(response.code)) {
              resColor = '#3eb00e'
            }
            // 打印响应数据
            console.log(`%c响应接口：${url}`, `background:${resColor} ; padding:1px 2px; color: #fff`)
            console.log(JSON.stringify(response))
          } catch (error) {
            reject(error)
          }
          switch (response.code) {
            case 1:
            case 100:
            case 200:
              resolve(response)
              break
            // 没有权限
            case 401:
              redirectTo('/401')
              break
            // Authorization认证失败、认证过期
            case 400:
            case 402:
            case 403:
              showToast('您很久未操作已自动退出，请重新登录')
              logOut()
              reLaunch('/login')
              break
            case 500:
            default:
              if (response && response.msg) {
                if (showTip) {
                  showToast(response.msg)
                }
              } else {
                showToast('网络不稳定,请稍候再试')
              }
          }
          reject(response)
        },
        fail: function (error) {
          showToast('网络不稳定,请稍候再试')
          reject(error)
        }
      })
    } catch (error) {
      showToast('网络不稳定,请稍候再试')
      reject(error)
      // hideLoading()
      if (showLoadingFlag && getPlatform() === 'H5') {
        miniLoading.close()
      }
    }
  })
}
/**
 * @Author: may.ruan
 * @Date: 2022-12-07 14:21:50
 * @param {string} url 文件下载路径
 * @description: 文件下载
 */
export function download(url: string) {
  const downloadUrl = serverConfig.API_BASE_URL + url + '?access_token=' + getStorage('token') + '&t=' + new Date().getTime()
  return new Promise(function (resolve, reject) {
    if (getPlatform() === 'H5') {
      // uni.getSystemInfo({
      //   success(res) {
      //     if (res.osName === 'android' && isWxBrowser()) {
      //       wx.ready(function () {
      //       wx.openUrl({ url: downloadUrl })
      //       })
      //     } else {
      // const eleLink = document.createElement('a')
      // // eleLink.download = downloadUrl
      // eleLink.style.display = 'none'
      // eleLink.href = downloadUrl
      // document.body.appendChild(eleLink)
      // eleLink.click()
      // document.body.removeChild(eleLink)
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = downloadUrl
      document.body.appendChild(iframe)
      //     }
      //   }
      // })
    } else {
      uni.downloadFile({
        url: downloadUrl,
        success: res => {
          if (res.statusCode === 200) {
            // h5

            // app
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: function () {
                // console.error('下载成功')
                //  savedFilePath = res1.savedFilePath
              }
            })
            // uni.openDocument({
            //   filePath: res.tempFilePath,
            //   success: function (res) {
            //     // console.log('打开文档成功')
            //   },
            //   complete: function () {
            //     // console.log(error)
            //   }
            // })
          }

          resolve(res)
        },
        fail: error => {
          showToast('下载失败,请稍候再试')
          reject(error)
        }
      })
    }
  })
}
