---
name: bms-uniapp-vue3-guardrails
description: 用于约束同级 `bms` 项目中的代码生成与代码修改。该项目基于 uni-app、Vue 3、TypeScript、Pinia 和 uview-plus。适用于 Codex 需要在 `../bms` 下新增或修改页面、路由、API、类型、store、插件、样式、资源文件或公共工具时，要求先阅读相邻代码，保持现有业务目录对齐方式，并避免擅自引入新架构、新依赖或无关重构。
---

# BMS UniApp Vue3 代码生成约束

## 概述

将 `../bms` 视为一个已经稳定运行的存量项目，而不是空白脚手架。先看相邻实现，再复用本地模式，并用最小改动完成需求。

开始编辑前先读 [references/project-conventions.md](references/project-conventions.md)。把它当作项目目录、路由方式、API 封装、页面结构、样式习惯和校验方式的默认参考。

## 按这个顺序工作

1. 先在 `../bms/src` 中找到目标业务模块。
2. 阅读该模块附近已经存在的 `pages`、`router`、`api`、`interfaces`、`store`、`plugins` 和 `utils` 文件。
3. 从这些文件里归纳当前仓库的本地模式，不要直接套用通用 Vue 或 uni-app 模板。
4. 在新增任何东西之前，优先复用现有封装、辅助函数、hooks、全局组件和样式。
5. 用最小但完整的改动实现需求。
6. 选择与本次改动匹配的最轻量但有意义的校验方式。

## 遵守这些约束

- 把 `api / pages / router / interfaces` 视为这个项目最核心的四层结构。新增或修改业务功能时，先判断这四层是否需要同步对齐，而不是只改其中一层。
- 保持业务目录的平行对齐关系。如果某个功能属于 `member/project/query/foo`，先去 `pages`、`router`、`api`、`interfaces` 中寻找对应落点，不要先发明新目录。
- 保持相邻页面的写法风格。很多页面采用一个简短的 `<script lang="ts"> export default { name } </script>` 配合 `<script setup lang="ts">`，如果附近文件这么写，就沿用。
- 保持现有请求链路。统一使用 `src/api/api.request.ts` 中的 `request<T>`，不要另起 axios、fetch 封装或临时请求方式。
- 保持现有路由风格。复用 `__dynamicImportComponent__`、当前 `meta` 结构，以及目标文件附近已经使用的路由拆分策略。
- 保持现有 UI 技术栈。优先使用 `uview-plus`、现有布局组件和 `src/plugins` 中已有组件，不要随意引入新的 UI 抽象层。
- 保持现有样式方式。优先使用 `scss`、`scoped` 样式、`rpx` 单位，以及当前主题和 mixin 体系。
- 保持现有导入风格。优先使用 `@` 指向 `src` 的别名，并遵循相邻文件的 import 顺序。
- 保持现有格式风格。默认使用单引号和无分号，除非周边文件明确不是这样。
- 保持本地业务术语。优先复用项目中已有的业务命名、中文文案和字段名。
- 避免架构漂移。除非用户明确要求，否则不要引入新的状态库、请求库、目录层级或全局重构。

## 有意识地放置代码

- 页面放到 `src/pages` 里现有的业务路径下。
- 路由声明放到 `src/router` 中与之对应的位置。
- API 模块放到 `src/api` 中对应的业务目录下。
- 请求和返回类型放到 `src/interfaces` 中对应的业务目录下。
- 只有当状态被多个页面复用，或该状态本来就应该集中管理时，才新增 store。
- 复用型业务组件优先放在最近的局部 `components` 目录，或者放进当前已经存在的 `src/plugins` 体系，具体跟随相邻代码结构。
- 资源文件优先放在现有业务资源旁边，不要无故新建一个顶层资源分类。

## 优先复用现有能力

- 如果周边页面已经在使用 `@dcloudio/uni-app` 的生命周期 API，例如 `onLoad`、`onShow`，就继续沿用。
- 优先使用 `src/utils` 和 `src/hooks` 中现有的权限、存储、toast、路由、格式化等辅助能力。
- 如果 `src/plugins` 中已有能力匹配的全局组件，优先直接复用。
- 在新建组件之前，先检查并复用现有的 `NavBar`、`Tabbar`、picker、上传、预览、tooltip、info-card、tabs 等项目组件。

## 结束前做校验

- 如果这次改动涉及较多 TypeScript 内容，并且环境允许，优先执行 `pnpm type-check`。
- 格式化或 lint 只做有针对性的校验，前提是它们能帮助验证当前改动，而且不会带来无关 churn。
- 如果不适合跑自动化检查，就手动把改动文件和相邻文件做对比，确认风格和结构一致。
- 只要过程中依赖了合理假设，就在最终回复里明确说明。

## 遇到下面这些场景时这样取参考

- 阅读 [references/project-conventions.md](references/project-conventions.md)，获取项目概览和关键文件锚点。
- 新增页面前，先对照同一业务目录下同层级的兄弟页面。
- 新增路由前，先看相邻路由模块以及它指向的页面。
- 新增 API 前，先看相邻 API 模块和对应的接口类型目录。
