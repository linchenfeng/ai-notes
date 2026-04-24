/*
 * @Author       : may.ruan
 * @Date         : 2023-08-07 09:49:56
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-23 16:10:11
 * @Description  : vite配置，解决开发热更新过慢问题，提高开发效率
 */
import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import vitePluginUniRouter from './src/uni-simple-router/compiler'
import viteCompression from 'vite-plugin-compression'
import VersionUtils from './src/utils/version'
import { visualizer } from 'rollup-plugin-visualizer'
VersionUtils.create()
// 添加时间戳
const Timestamp = new Date().getTime()
const version = require('./package.json').version
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    root: env.VITE_APP_ROOTPATH,
    base: '/',
    plugins: [
      vitePluginUniRouter({
        pluginPath: `./uni-simple-router`
      }),
      uni(),
      AutoImport({
        dts: resolve(__dirname, 'src/typings/auto-imports.d.ts'),
        imports: ['vue'],
        // 解决eslint报错问题
        eslintrc: {
          enabled: true
        }
      }),
      viteCompression({
        disable: false,
        threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b
        algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
        ext: '.gz',
        deleteOriginFile: false // 源文件压缩后是否删除
      }),
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: 'report.html',
        open: false
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      /* CSS 预处理器 */
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "src/styles/theme.scss";
          @import "src/styles/mixin/index.scss";
          @import "src/styles/mixin/status.scss";
          `
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PROT),
      open: true,
      https: false,
      proxy: {
        '/api-sme/api-sme': {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          secure: false,
          headers: { Connection: 'keep-alive' },
          rewrite: path => path.replace(/^\/api-sme\/api-sme/, '')
        },
        // 上传公共平台服务器
        '/api-fileCenter/api-sme': {
          target: env.VITE_APP_FILE_CENTER_API_URL,
          changeOrigin: true,
          secure: false,
          headers: { Connection: 'keep-alive' },
          rewrite: path => path.replace(/^\/api-fileCenter\/api-sme/, '')
        },
        // mock数据代理
        '/api-sme/api-mock': {
          target: env.VITE_APP_MOCK_API_URL,
          changeOrigin: true,
          secure: false,
          headers: { Connection: 'keep-alive' },
          rewrite: path => path.replace(/^\/api-sme\/api-mock/, '')
        }
      }
    },
    build: {
      sourcemap: command === 'build' ? false : 'inline',
      outDir: 'dist', //指定输出目录
      assetsDir: 'assets', //指定静态资源存储目录(相对于outDir)
      // 将js、css文件分离到单独文件夹
      rollupOptions: {
        output: {
          chunkFileNames: `static/js/[name].[hash].${Timestamp}.V${version}.js`,
          entryFileNames: `static/js/[name].[hash].${Timestamp}.V${version}.js`,
          assetFileNames: `static/[ext]/[name].[hash].${Timestamp}.V${version}.[ext]`
        },
        // 分包策略
        manualChunks(id) {
          // if (id.includes('uview-plus')) {
          //   return 'uview'
          // }
          if (id.includes('uni-simple-router')) {
            return 'router-vendor'
          }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境时移除console
          // eslint-disable-next-line camelcase
          drop_console: true,
          // eslint-disable-next-line camelcase
          drop_debugger: true
        }
      }
    }
  }
})
