---
name: bms-uniapp-vue3-guardrails
description: 用于约束同级 `bms` 项目中的代码生成与代码修改。该项目基于 uni-app、Vue 3、TypeScript、Pinia 和 uview-plus。适用于 Codex 需要在 `../bms` 下新增或修改页面、路由、API、类型、store、插件、样式、资源文件或公共工具时，要求先阅读相邻代码，保持现有业务目录对齐方式，并避免擅自引入新架构、新依赖或无关重构。
---

# BMS UniApp Vue3 代码生成约束

把 `../bms` 视为一个稳定运行中的存量项目，而不是空白脚手架。先找相邻实现，再复用本地模式，用最小但完整的改动完成需求。

## 先读什么

开始编辑前先读 [references/project-conventions.md](references/project-conventions.md)。

按任务类型再补充读取：

- 新增或调整功能时，读 [references/feature-workflow.md](references/feature-workflow.md)
- 新增或改动页面时，读 [references/page-development-rules.md](references/page-development-rules.md)
- 新增或改动接口、请求、类型时，读 [references/api-and-types-rules.md](references/api-and-types-rules.md)
- 新增或复用组件时，读 [references/component-reuse-rules.md](references/component-reuse-rules.md)
- 生成移动端列表页前，读 [references/list-page-rules.md](references/list-page-rules.md)

## 默认工作顺序

1. 先在 `../bms/src` 中找到目标业务模块。
2. 阅读该模块附近已有的 `pages`、`router`、`api`、`interfaces`、`store`、`plugins`、`utils` 文件。
3. 从相邻文件归纳本仓库的本地模式，不直接套用通用 Vue 或 uni-app 模板。
4. 在新增任何代码前，优先复用已有组件、工具函数、hooks、store、插件和样式体系。
5. 用最小但完整的改动实现需求。
6. 选择与本次改动匹配的最轻量但有意义的校验方式。

## 关键约束

- 把 `pages / router / api / interfaces` 视为这个项目最核心的四层业务落点。
- 先判断四层是否需要同步补齐，而不是只改其中一层。
- 保持业务目录平行对齐，先沿用已有业务切片，再决定文件落点。
- 保持相邻页面、路由、接口、类型、样式的写法一致。
- 统一复用 `src/api/api.request.ts` 中的 `request<T>`，不要另起请求层。
- 优先复用 `src/plugins`、`src/components`、`src/utils`、`src/hooks`、`src/store` 里的既有能力。
- 除非用户明确要求，否则不要引入新依赖、新目录体系或大范围重构。

## 遇到这些任务时这样取参

- 做业务功能增改：先看同业务目录下的兄弟页面、兄弟路由、兄弟 API、兄弟类型。
- 做列表页：优先对照相同业务目录中的列表页，再参考 `references/examples/`。
- 做详情页或表单页：先找同层级页面中最接近的交互结构，不要自行发明新的页面骨架。
- 做复用组件：先判断是否应放页面局部 `components/`，只有跨多处业务复用时才考虑放入 `src/plugins` 或全局组件层。

## 结束前检查

- 确认改动文件与兄弟文件属于同一条业务切片。
- 确认 import、命名、样式、注释风格与相邻文件一致。
- 确认在新增抽象前已经优先复用现有能力。
- 如果改动涉及较多 TypeScript 内容且环境允许，执行 `pnpm type-check`。
- 如果依赖了合理假设，在最终回复中明确说明。
