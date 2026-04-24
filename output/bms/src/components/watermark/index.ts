import { createSSRApp, App as VueApp } from 'vue'
import NextWatermark from '../../uni_modules/next-watermark/components/next-watermark/next-watermark.vue'
import { useUserLoginInfoStore } from '@/store/user/userLoginInfo'
import { dateFormat } from '@/utils/format'

let watermarkInstance: VueApp<Element> | null = null

// 销毁水印
export function destroyWatermark(): void {
  if (watermarkInstance) {
    watermarkInstance.unmount()
    watermarkInstance = null
  }
}

// 添加水印
export function createWatermark(): void {
  if (!watermarkInstance) {
    const loginStore = useUserLoginInfoStore()
    const { userLoginInfo } = loginStore

    // 创建水印组件实例
    watermarkInstance = createSSRApp(NextWatermark, {
      watermark: `
        <p>诚信、担当、专业、高效</p>
        <p>${dateFormat(new Date(), 2)}</p>
        <p>${userLoginInfo?.userName || ''}</p>
      `,
      show: true,
      opacity: 0.1,
      fontSize: 12
    })

    // 创建一个空的div容器来挂载水印
    const watermarkContainer = document.createElement('div')
    document.body.appendChild(watermarkContainer)

    // 将水印实例挂载到容器上
    watermarkInstance.mount(watermarkContainer)
  }
}
