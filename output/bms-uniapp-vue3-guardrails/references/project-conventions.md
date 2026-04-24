# BMS 项目约定

这个 skill 面向同级目录下的 `../bms` 项目。

## 项目概览

- 技术栈：`uni-app`、`Vue 3`、`TypeScript`、`Pinia`、`uview-plus`、`vite`。
- 根别名：`@/* -> src/*`。
- 格式化基线：单引号、无分号、`tabWidth: 2`、`printWidth: 150`、`trailingComma: none`。
- 样式基线：`scss`、`scoped`、`rpx` 单位，并通过 Vite 注入共享主题和 mixin。
- 请求基线：统一走 `src/api/api.request.ts` 中的 `request<T>` 包装器。

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

## 专项参考

- 生成移动端列表页前，优先阅读：
  [list-page-rules.md](list-page-rules.md)
- 如果目标页面位于 `member/project/apply/*` 或 `member/project/query/*`，先找同层级的兄弟列表页做对照，不要直接套通用模板。

## 目录规则

- `src/api`、`src/pages`、`src/router`、`src/interfaces` 是日常开发中最核心、最常一起变动的四层目录。
- 这四层目录的业务层级要一一对应。规则重点不是某个固定业务路径，而是“同一业务层级在四层目录中的平行映射”。
- 不要把 `member/project/apply/quota` 这类路径当成唯一模板。真实落点要根据当前业务归属推导。
- 保持以下目录按业务切片平行对齐：
  `src/pages`
  `src/router`
  `src/api`
  `src/interfaces`
- 优先沿用现有业务树，例如：
  `member/project/apply/*`
  `member/project/audit/*`
  `member/project/query/*`
- 如果组件只服务于某个页面或某个业务目录，就在该业务页面目录下新增本地 `components/`。
- 只有当组件确实会跨多个业务切片复用，并且符合当前插件体系时，才放入 `src/plugins`。
- 只有当某段逻辑属于跨页面辅助能力，而不是单页面逻辑时，才放入 `src/utils`。

通用对应关系模板：

- `src/pages/<业务层级>/<功能目录>/index.vue`
- `src/router/<业务层级>/<功能目录>.ts`
- `src/api/<业务层级>/api.<功能目录>.ts`
- `src/interfaces/<业务层级>/<功能目录>.ts`

申请类列表页常见示例：

- `src/pages/member/project/apply/xx/index.vue`
- `src/router/member/project/apply/xx.ts`
- `src/api/member/project/apply/api.xx.ts`
- `src/interfaces/member/project/apply/xx.ts`

## 页面编写规则

- 动手前先阅读你要扩展的那个页面的直接兄弟文件。
- 保持附近页面采用的页面外壳写法：
  有些文件只用 `script setup`，也有很多文件会同时保留一个简短的 `export default { name: '...' }` 和 `script setup`。
- 如果周边页面使用 `@dcloudio/uni-app` 的生命周期，例如 `onLoad`、`onShow`，就优先沿用，不要用浏览器思维硬套。
- 如果附近页面已经在复用 `NavBar`、`Tabbar` 或其他项目组件，就继续复用。
- 如果当前目录普遍保留文件头注释，就继续保留。
- 如果相邻文件在 `@Description` 中使用中文业务说明，就保持一致。

## 路由规则

- 遵循当前已有的路由模块拆分方式，不要擅自再造一套 router 结构。
- 继续复用 `@/uni-simple-router` 中的 `__dynamicImportComponent__`。
- 对齐相邻文件里的 `meta` 字段，例如：
  `requiresAuth`
  `showNavBar`
  `showNavBarLeftArrow`
  `funids`
- 路由定义要放在对应业务切片附近。例如：
  `src/pages/member/project/query/foo/index.vue`
  对应 `src/router/member/project/query.ts` 或当前由相邻模块维护的路由文件

## API 与类型规则

- API 模块放到 `src/api` 下与业务一致的目录中。
- 统一使用 `request<T>('GET' | 'POST', url, data?, needToken?, showLoadingFlag?, showTip?)`。
- 返回值类型写法要和相邻文件一致。
- 请求和响应类型放到 `src/interfaces` 下相应业务目录中。
- 不要为了代码洁癖随意重命名后端字段，优先复用现有业务名词和字段语义。

## 状态、Hooks 与工具规则

- 只有当状态已经是共享状态，或明显跨页面复用时，才使用或新增 Pinia store。
- 页面内部的交互状态优先留在本地页面中。
- 优先复用以下已有能力：
  `src/utils/storages.ts`
  `src/utils/permissions.ts`
  `src/utils/uniapp/*`
  `src/hooks/*`
- 除非已经存在两个以上真实使用场景，或者当前目录本来就有这层抽象，否则不要新建 composable 或工具函数。

## UI 与样式规则

- 优先使用 `uview-plus` 和 `src/plugins` 中现有组件。
- 记住全局插件注册会把插件目录名映射成 `ty-*` 组件名。
- 除非周边文件本来就集中管理样式，否则优先使用 `lang="scss" scoped"` 保持样式本地化。
- 对于当前这种移动端布局模式，尺寸优先使用 `rpx`。
- 资源文件优先复用 `src/assets/<business>` 或 `src/static` 下已有分组，不要平行再造一套资源体系。

## 默认不要这样做

- 不要新增依赖。
- 不要替换请求层。
- 不要把相邻文件从 Options API 风格强行改写成另一套风格，除非用户明确要求。
- 不要为了迎合抽象架构偏好而移动现有文件。
- 如果现有业务切片已经有明确归属，就不要新增顶层目录。

## 最终检查

- 确认改动文件与兄弟文件属于同一条业务切片。
- 确认 import 在项目已使用别名的地方继续使用 `@`。
- 确认格式符合单引号、无分号的现有风格。
- 确认在新增抽象之前已经优先复用了现有能力。
- 如果改动较大且环境允许，执行 `pnpm type-check`。
