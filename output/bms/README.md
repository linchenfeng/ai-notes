<!--
 * @Author       : may.ruan
 * @Date         : 2023-08-15 19:02:30
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-08-15 19:05:01
 * @Description  : README项目说明
-->

# uniapp 跨平台开发技术指南

## 初识 uniapp

`uniapp`是使用`vue.js`开发所有前端应用的框架，开发一套代码，可发布到 IOS、Android、Web、以及各种小程序等多个平台。

## 环境准备

##### 环境配置

- node 安装

  [版本：V16.20.1](https://nodejs.org/dist/v16.20.1/)

- pnpm 安装

  ```js
  npm i pnpm@8 -g
  ```

##### 开发工具

- Visual Studio Code
- hbuilderx [下载](https://www.dcloud.io/hbuilderx.html)

## 快速上手

##### 下载项目依赖包

```js
打开cmd
cd 项目根目录
pnpm i
```

##### 启动项目

- H5 端

  ```js
  // 使用cmd启动
  npm run dev:h5
  ```

- 非 H5 端

  使用 hbuilderx 开发工具，可视化界面启动模拟器 [文档说明](https://uniapp.dcloud.net.cn/quickstart-hx.html)
