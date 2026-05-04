# BMS 项目约定

这个 skill 面向同级目录下的 `../bms` 项目。这里记录项目级总规则，回答“这个仓库默认怎么做”。更细的功能流程、页面规范、API 规范和组件复用规则请分别查看对应专题文档。

## 项目概览

- 技术栈：`uni-app`、`Vue 3`、`TypeScript`、`Pinia`、`uview-plus`、`vite`
- 根别名：`@/* -> src/*`
- 格式化基线：单引号、无分号、`tabWidth: 2`、`printWidth: 150`、`trailingComma: none`
- 样式基线：`scss`、`scoped`、`rpx` 单位，并通过 Vite 注入共享主题和 mixin
- 请求基线：统一走 `src/api/api.request.ts` 中的 `request<T>` 包装器

## 优先阅读这些文件

- 应用入口与全局注册：
  `../bms/src/main.ts`
- 构建与别名配置：
  `../bms/vite.config.ts`
  `../bms/tsconfig.json`
- 请求封装：
  `../bms/src/api/api.request.ts`
- 全局插件注册：
  `../bms/src/plugins/index.ts`
- 路由入口与业务路由分组：
  `../bms/src/router/index.ts`
  `../bms/src/router/member/index.ts`
  `../bms/src/router/member/project/index.ts`
- 代表性页面：
  `../bms/src/pages/member/project/index.vue`
- 代表性 API：
  `../bms/src/api/member/api.project.ts`

## 专题导航

- 功能增改流程：`feature-workflow.md`
- 页面开发规范：`page-development-rules.md`
- API 与类型规范：`api-and-types-rules.md`
- 组件复用规范：`component-reuse-rules.md`
- 列表页专项：`list-page-rules.md`

## 目录规则

项目最核心的四层业务落点是：

- `src/pages`
- `src/router`
- `src/api`
- `src/interfaces`

规范重点不是死记某个目录名字，而是保持“同一业务切片在四层目录中的平行映射”。

例如当前仓库已经形成了明显的业务切片：

- `member/project/apply/*`
- `member/project/audit/*`
- `member/project/query/*`
- `member/myinfo/*`
- `member/customer/*`

新增或修改功能时，优先沿用现有业务树，而不是为了当前需求重新发明目录结构。

## 页面、路由、API、类型的对应关系

通用对应关系优先按下面理解：

- 页面：`src/pages/<业务层级>/<功能目录>/index.vue`
- 路由：`src/router/<业务层级>/<功能目录>.ts` 或由相邻聚合文件维护
- API：`src/api/<业务层级>/api.<功能目录>.ts` 或与同业务目录继续对齐
- 类型：`src/interfaces/<业务层级>/<功能目录>.ts`

真实落点以相邻目录的既有组织方式为准，不强行套一种固定模板。

## 复用边界

- 页面局部能力优先放本地 `components/`
- 跨多个业务切片复用的组件，再考虑放入 `src/plugins` 或共享组件层
- 跨页面辅助能力才考虑放入 `src/utils` 或 `src/hooks`
- 只有明确属于共享状态时才考虑 `src/store`

## 项目级默认约束

- 不新增依赖，除非用户明确要求
- 不替换请求层
- 不重造路由体系
- 不为了抽象偏好挪动现有业务目录
- 不把相邻文件强行改写成另一套风格

## 后续建议优先沉淀的专项

- 列表页、详情页、表单页的页面结构规范
- 路由 `meta` 字段与动态导入规范
- 列表查询、详情、表单提交的 API 与类型规范
- 局部组件、共享组件、插件组件的边界规范
- store、hooks、utils 的新增门槛
