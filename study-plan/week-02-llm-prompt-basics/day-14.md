# Day 14 学习笔记

- 日期：2026-03-26（周四）
- 周次：第 2 周
- 主题：最小多轮聊天后端（Ollama 版）
- 阶段：从单轮调用升级到可持续对话

## 今日学习主题
在后端维护最小会话状态，用 `session_id` 将多轮请求串起来，让第二轮回答能够延续第一轮上下文。

## 今日任务
- 新增 `LLMChatRequest`、`LLMChatResponse`
- 在 service 层新增会话内存存储与 `chat_with_llm`
- 新增 `/llm/chat` 与 `/llm/reset-session`
- 补充 `/llm/chat-once` 便于对比
- 完成同 session 多轮 + reset + 新 session 测试

## 今日产出
- `llm-roadmap/app/schemas/llm.py`
- `llm-roadmap/app/services/llm_service.py`
- `llm-roadmap/app/routers/llm.py`
- `llm-roadmap/notes/day14.md`

## 完成记录
- 完成时间：已完成代码与接口验证
- 实际投入：约 2.5~3 小时
- 遇到的问题：
  - 本地模型没有 `previous_response_id` 参数
- 解决方式：
  - 用最小 transcript 方式拼接历史，先跑通多轮概念闭环

## 今日代码 / 笔记链接
- 聊天路由：`llm-roadmap/app/routers/llm.py`
- 聊天服务：`llm-roadmap/app/services/llm_service.py`
- 文档地址：`http://127.0.0.1:8000/docs`

## 复盘
- 今天学到了什么：
  - 多轮聊天本质是上下文连续性
  - `session_id` 是会话识别键
  - reset 会清空会话状态并使对话重新开始
- 还没弄懂什么：
  - 生产级会话存储（Redis/DB）的设计
  - 多并发下会话隔离与过期策略
- 明天开始前要准备什么：
  - 学习 prompt 设计
  - 尝试结构化输出与格式约束

## 与 90 天目标的关系
Day 14 让项目从“会调用模型”升级为“会管理会话”，这是聊天助手、RAG 对话、Agent 场景的关键基础。
