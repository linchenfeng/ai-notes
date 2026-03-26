# 第 1 阶段：先跑通最小闭环

- Day 范围：01～14
- 阶段目标：先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。

## 阶段日程
- [Day 01](day01.md)：安装 Python、VS Code、Git、创建虚拟环境。
  任务：创建你的第一个项目 llm-roadmap。
  产出：项目目录、README、虚拟环境跑通。
- [Day 02](day02.md)：复习 Python 基础：变量、列表、字典、函数。
  任务：把 3 个你熟悉的 JS 小逻辑改写成 Python。
  产出：basic_practice.py。
- [Day 03](day03.md)：学习 Python 文件结构、模块导入、异常处理。
  任务：拆分 Day 2 代码成多个模块。
  产出：utils/ 目录。
- [Day 04](day04.md)：学习 JSON、文件读写、日志 logging。
  任务：写一个脚本读取 JSON 文件并格式化输出。
  产出：read_json.py。
- [Day 05](day05.md)：学习 HTTP 请求、状态码、GET/POST、超时。
  任务：用 requests 或 httpx 调一个公开 API。
  产出：http_demo.py。
- [Day 06](day06.md)：学习 FastAPI：路由、请求参数、返回 JSON。
  任务：做一个 /ping 和 /echo 接口。
  产出：可运行的本地服务。
- [Day 07](day07.md)：复盘。
  任务：写《我作为前端，为什么要先学 Python/FastAPI》。
  产出：1 篇 Markdown 笔记。
- [Day 08](day08.md)：注册并配置一个模型 API 平台。
  任务：拿到 Key，写第一次调用。
  产出：hello_llm.py。
- [Day 09](day09.md)：学习消息格式、system prompt、user prompt。
  任务：做一个“文本润色器”。
  产出：CLI 版小工具。
- [Day 10](day10.md)：学习 temperature、max tokens、基本参数。
  任务：测试同一任务不同参数的效果差异。
  产出：参数实验记录。
- [Day 11](day11.md)：学习结构化输出的概念。
  任务：让模型把文本转成固定 JSON。
  产出：extract_to_json.py。
- [Day 12](day12.md)：学习 Prompt 的基本写法：角色、目标、限制、输出格式。
  任务：给“文章总结”写 3 版 prompt。
  产出：prompt_compare.md。
- [Day 13](day13.md)：学习对话历史管理。
  任务：做一个带 3 轮上下文的聊天脚本。
  产出：chat_memory_demo.py。
- [Day 14](day14.md)：阶段复盘。
  任务：把 Day 8～13 的代码整理成一个“AI 文本助手”。
  产出：你第一个可运行的 AI 小工具。
