/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 10:07:49
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-03-06 15:20:39
 * @Description  : 路由
 */

import { getStorage, removeStorage } from '@/utils/storages'
import { getHasPermissionsById } from '@/utils/permissions'
import { getPlatform } from '@/utils/uniapp'
import { logOut } from '@/utils/permissions'
import { createRouter, __dynamicImportComponent__, platformRule } from '@/uni-simple-router'
import member from './member'
import finCollect from './finCollect'
import forgetPswd from './forgetPswd'
import version from '@/utils/version'
import { useFileCenterTokenStore } from '@/store/fileCenter/token'
import { createWatermark, destroyWatermark } from '@/components/watermark/index'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { useSystemConfigstore } from '@/store/systemConfig'
const router = createRouter({
  // `h5` | `app` | `mp-toutiao` | `mp-weixin` | `mp-baidu` | `mp-alipay` | `mp-qq` | `mp-lark` | `mp-jd` | `mp-kuaishou`
  platform: getPlatform().toLocaleLowerCase() as platformRule,
  routeNotFound: () => {
    return {
      name: `NoFound`
    }
  },
  routes: [
    {
      path: `/`,
      redirect: '/login',
      component: __dynamicImportComponent__(`@/pages/index.vue`, {
        pageType: `top`
      })
    },
    {
      path: '/login',
      redirect: '/wap/login',
      component: __dynamicImportComponent__(`@/pages/index.vue`, {
        pageType: `top`
      })
    },
    {
      path: '/wap/login',
      name: 'Login',
      meta: {
        title: '登录',
        requiresAuth: false // 是否需要登录验证
      },
      component: __dynamicImportComponent__('@/pages/login/index.vue', {
        pageType: `top`,
        style: {
          navigationStyle: 'custom',
          navigationBarTitleText: ''
        }
      })
    },
    {
      path: '/404',
      name: 'NoFound',
      meta: {
        title: '404',
        requiresAuth: false // 是否需要登录验证
      },
      component: __dynamicImportComponent__('@/pages/errorPage/404.vue', {
        pageType: `top`
      })
    },
    {
      path: '/401',
      name: 'NoPermissions',
      meta: {
        title: '401',
        requiresAuth: false // 是否需要登录验证
      },
      component: __dynamicImportComponent__('@/pages/errorPage/401.vue', {
        pageType: `top`
      })
    },
    {
      path: '/transfer',
      name: 'Transfer',
      meta: {
        title: 'transfer',
        requiresAuth: false // 是否需要登录验证
      },
      component: __dynamicImportComponent__('@/pages/transfer/index.vue', {
        pageType: `top`
      })
    },
    ...finCollect,
    ...forgetPswd,
    ...member
  ]
})
/**
 * @Author: may.ruan
 * @Date: 2022-09-26 14:56:49
 * @description: 路由权限验证拦截
 */
router.beforeEach(async to => {
  if (to.meta && to.meta.fileCenter) {
    const fileCenterStore = useFileCenterTokenStore()
    // 获取文件中心token
    await fileCenterStore.getFileCenterToken()
  }
  // 判断是否需要登录验证
  let token = getStorage('token')
  // 不需要权限的页面,防止误取token,进入页面前清除token
  if (to.meta.type === 'share') {
    logOut()
    token = ''
  }

  if (to.name === 'Login') {
    if (isNotEmpty(token)) {
      removeStorage('token')
    }
    if (getPlatform() === 'H5') {
      destroyWatermark()
    }
  } else if (to.meta && to.meta.requiresAuth) {
    if (isNotEmpty(token)) {
      const { systemConfig } = useSystemConfigstore()
      if (getPlatform() === 'H5' && systemConfig.ENABLE_PRODUCTION_CONFIGURATION === '1') {
        createWatermark()
      }
      // 验证funids 如果是白名单不校验权限
      if (!getHasPermissionsById(to.meta.funids as string) && !to.meta.whiteList) {
        return {
          path: '/401'
        }
      }
    } else {
      return {
        path: '/login'
      }
    }
    // if (to.name === 'Login') {
    //   if (isNotEmpty(token)) {
    //     return {
    //       path: '/member'
    //     }
    //   }
    // }
  } else if (isEmpty(token)) {
    if (getPlatform() === 'H5') {
      destroyWatermark()
    }
  }
  // else if (to.name === 'Login') {
  //   if (isNotEmpty(token)) {
  //     return {
  //       path: '/member'
  //     }
  //   }
  // }
})

router.afterEach(() => {
  if (getPlatform() === 'H5') {
    // 兼容版本，如果是新版本则进行刷新并缓存
    version.getPro()
    if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
      window.entryUrl = window.location.href
    }
    setTimeout(() => {
      window.document.title = '融逸金链'
    }, 0)
  }
})

export default router
