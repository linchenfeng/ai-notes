# Day 12 学习笔记

- 日期：2026-03-26（周四）
- 周次：第 2 周
- 主题：配置管理 + 环境变量 + .env
- 阶段：为接入真实 LLM API 做工程准备

## 今日学习主题
将会变化的运行参数从代码中拆出，统一通过环境变量和 `.env` 管理，并在项目中集中读取。

## 今日任务
- 安装 `python-dotenv`
- 创建 `.env` 与 `.env.example`
- 在 `.gitignore` 中加入 `.env`
- 在 `app/core/config.py` 统一读取配置
- 让 `app/main.py` 使用动态配置
- 在 `system` 路由新增配置检查接口

## 今日产出
- `llm-roadmap/.env`
- `llm-roadmap/.env.example`
- `llm-roadmap/app/core/config.py`
- `llm-roadmap/app/main.py`
- `llm-roadmap/app/routers/system.py`
- `llm-roadmap/notes/day12.md`

## 建议学习节奏
- 学新知识 40~50 分钟
- 写代码 60~90 分钟
- 复盘记录 15~20 分钟

## 完成记录
- 完成时间：已完成代码与接口验证
- 实际投入：约 2.5~3 小时
- 遇到的问题：
  - 容易把配置继续写死在代码里
- 解决方式：
  - 统一从 `config.py` 读取，路由和入口只消费配置项

## 今日代码 / 笔记链接
- 配置入口：`llm-roadmap/app/core/config.py`
- 应用入口：`llm-roadmap/app/main.py`
- 系统接口：`llm-roadmap/app/routers/system.py`
- 文档地址：`http://127.0.0.1:8000/docs`

## 复盘
- 今天学到了什么：
  - 配置和逻辑分离是工程化的基础
  - `.env` 适合本地开发，`.env.example` 适合共享模板
  - API Key 是否就绪可以通过专门接口提前检查
- 还没弄懂什么：
  - 多环境配置（dev/test/prod）的自动切换方案
  - 更严格的配置类型校验方式
- 明天开始前要准备什么：
  - 接入真实 LLM SDK
  - 把 Key 配置接到真实调用函数

## 与 90 天目标的关系
Day 12 让项目具备了安全、可替换的配置管理能力，是连接“本地练习接口”和“真实外部 API 服务”的关键一步。
