# Day 13 学习笔记

- 日期：2026-03-26（周四）
- 周次：第 2 周
- 主题：接入真实 LLM API（Ollama + 本地 Qwen）
- 阶段：从伪 AI 服务升级到真实模型调用

## 今日学习主题
在服务端打通真实模型调用链路：客户端请求 FastAPI，FastAPI 通过 service 层调用 Ollama，本地 Qwen 返回结果。

## 今日任务
- 配置 Ollama 相关环境变量
- 新建 llm 的 schema/service/router
- 注册 `/llm` 路由到主应用
- 完成总结与改写两个真实模型接口
- 补充就绪检查与错误处理

## 今日产出
- `llm-roadmap/app/schemas/llm.py`
- `llm-roadmap/app/services/llm_service.py`
- `llm-roadmap/app/routers/llm.py`
- `llm-roadmap/app/main.py`（注册 llm 路由）
- `llm-roadmap/app/core/config.py`（改为 OLLAMA 配置）
- `llm-roadmap/.env`、`llm-roadmap/.env.example`
- `llm-roadmap/notes/day13.md`

## 建议学习节奏
- 学新知识 40~50 分钟
- 写代码 60~90 分钟
- 复盘记录 15~20 分钟

## 完成记录
- 完成时间：已完成代码与接口验证
- 实际投入：约 2.5~3 小时
- 遇到的问题：
  - 本地模型服务可用性会直接影响接口结果
- 解决方式：
  - 在路由层区分 400/503/502/500，先保证错误语义清晰

## 今日代码 / 笔记链接
- LLM 路由：`llm-roadmap/app/routers/llm.py`
- LLM 服务：`llm-roadmap/app/services/llm_service.py`
- 配置文件：`llm-roadmap/app/core/config.py`
- 文档地址：`http://127.0.0.1:8000/docs`

## 复盘
- 今天学到了什么：
  - 真实 AI 后端是“接口 + 配置 + 服务封装 + 上游调用”闭环
  - 即使用本地模型，也要保持工程化错误处理
  - 接口 readiness 检查能显著降低联调成本
- 还没弄懂什么：
  - 流式输出在本地模型场景的最佳实现
  - 多模型切换时的路由与配置组织方式
- 明天开始前要准备什么：
  - 增加聊天历史输入结构
  - 封装通用 LLM 调用函数（支持 summarize/rewrite/chat）

## 与 90 天目标的关系
Day 13 标志着项目进入真实模型调用阶段，为后续聊天、RAG、Agent 场景打下关键基础。
