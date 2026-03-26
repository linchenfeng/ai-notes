# Day 11 学习笔记

- 日期：2026-03-26（周四）
- 周次：第 2 周
- 主题：项目结构整理
- 阶段：从“接口练习”走向“可维护项目”

## 今日学习主题
把 FastAPI 项目按职责拆分为入口层、路由层、模型层、服务层，建立真实后端项目的基础结构。

## 今日任务
- 创建 `app/` 目录结构
- 拆分 `routers/`、`schemas/`、`services/`、`core/`
- 使用 `APIRouter` 拆出 `text` 与 `system` 路由
- 保持主入口 `app/main.py` 轻量
- 运行并验证新结构可用

## 今日产出
- `llm-roadmap/app/main.py`
- `llm-roadmap/app/routers/text.py`
- `llm-roadmap/app/routers/system.py`
- `llm-roadmap/app/schemas/text.py`
- `llm-roadmap/app/services/text_service.py`
- `llm-roadmap/app/core/config.py`
- `llm-roadmap/notes/day11.md`

## 建议学习节奏
- 学新知识 40~50 分钟
- 写代码 60~90 分钟
- 复盘记录 15~20 分钟

## 完成记录
- 完成时间：已完成代码与运行验证
- 实际投入：约 2.5~3 小时
- 遇到的问题：
  - 需要明确“路由逻辑”和“业务逻辑”的边界
- 解决方式：
  - 路由层只处理请求/校验/返回，处理逻辑下沉到 service 层

## 今日代码 / 笔记链接
- 新入口：`llm-roadmap/app/main.py`
- 路由层：`llm-roadmap/app/routers/`
- 模型层：`llm-roadmap/app/schemas/`
- 服务层：`llm-roadmap/app/services/`
- 文档地址：`http://127.0.0.1:8000/docs`

## 复盘
- 今天学到了什么：
  - 会写接口和会组织项目是两种能力
  - `APIRouter` 是拆分路由的关键
  - 主入口越轻，项目越容易扩展
- 还没弄懂什么：
  - 多模块之间共享依赖与公共异常处理的最佳组织方式
  - 更复杂项目中的配置分环境实践
- 明天开始前要准备什么：
  - 学习配置管理和环境变量
  - 为接入真实 LLM API 做配置准备

## 与 90 天目标的关系
Day 11 的分层重构让项目从 demo 形态进入工程化形态，为后续接真实模型 API、管理 Key、扩展多模块能力打下结构基础。
