# Day 07 学习笔记

- 日期：2026-03-31（周二）
- 周次：第 1 周
- 本周主题：Python + HTTP + FastAPI 最小必备
- 阶段：第 1 阶段：先跑通最小闭环
- 阶段目标：先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。

## Day 7 学习目标

今天结束时，你要做到这 8 件事：

- 知道为什么接口里不要把所有逻辑写死
- 会把接口层和业务层简单拆开
- 会写一个接收文本并处理的 POST 接口
- 会返回更规范的 JSON 结构
- 会做输入校验的基础版本
- 会写一个模拟 AI 服务的小后端
- 会继续使用 `/docs` 调试
- 产出一个 `day7_api.py` 和一个 `services.py`

今天关键词：拆分、封装、业务逻辑、伪 AI 接口。

## 为什么 Day 7 很重要

从今天开始，你要慢慢形成一个习惯：接口函数只负责接收请求和返回结果，真正的处理逻辑放到单独函数里。

因为以后你做这些项目时：

- 文本总结助手
- 文案改写助手
- 聊天接口
- RAG 问答接口

都不能把所有逻辑全堆在一个接口函数里，不然后面很快会乱。

所以 Day 7 的本质是：开始写像项目的代码。

## Day 7 时间安排

约 3 小时。

## 第一阶段：理解接口层和业务层

预计时间：20 分钟

不推荐：全写在接口里

```python
@app.post("/summarize")
def summarize(data: dict = Body(...)):
    text = data.get("text", "")
    if not text:
        return {"error": "text is required"}

    summary = f"收到一段文本，长度是 {len(text)}"
    return {"summary": summary}
```

这在练习阶段能跑，但问题是：

- 接口函数越来越长
- 逻辑复用不了
- 以后很难维护

更推荐：拆成接口层 + 业务层

接口层负责：

- 接参数
- 做最基本判断
- 调业务函数
- 返回 JSON

业务层负责：

- 真正处理文本
- 生成结果
- 复用逻辑

这就是今天的核心。

## 第二阶段：先创建 Day 7 文件结构

预计时间：20 分钟

今天建议你新增两个文件：

- `day7_api.py`
- `services.py`

你的项目目录现在可以这样：

```text
llm-roadmap/
├── .venv/
├── main.py
├── utils.py
├── services.py
├── day2_practice.py
├── day3_practice.py
├── day4_practice.py
├── day5_practice.py
├── day6_api.py
├── day7_api.py
├── data/
├── notes/
│   ├── day1.md
│   ├── day2.md
│   ├── day3.md
│   ├── day4.md
│   ├── day5.md
│   ├── day6.md
│   └── day7.md
├── README.md
└── .gitignore
```

## 第三阶段：先写业务函数 services.py

预计时间：40 分钟

今天我们先不接真实大模型，先做一个模拟 AI 处理服务。

```python
def summarize_text(text: str):
    text = text.strip()

    if not text:
        return "文本为空，无法总结。"

    return f"这段文本共 {len(text)} 个字符，主题摘要：这是一段待处理文本。"


def rewrite_text(text: str, style: str):
    text = text.strip()

    if not text:
        return "文本为空，无法改写。"

    return f"[{style}风格改写] {text}"


def extract_keywords(text: str):
    text = text.strip()

    if not text:
        return []

    words = text.replace("，", " ").replace("。", " ").split()
    return words[:5]
```

你要理解：

- `summarize_text()`：模拟总结
- `rewrite_text()`：模拟改写
- `extract_keywords()`：模拟关键词提取

虽然还不是真 AI，但接口结构已经开始像真实项目了。

## 第四阶段：写 Day 7 主服务 day7_api.py

预计时间：50 分钟

现在写接口层：

```python
from fastapi import FastAPI, Body
from services import summarize_text, rewrite_text, extract_keywords

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Day 7 AI service is running."}


@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.post("/summarize")
def summarize(data: dict = Body(...)):
    text = data.get("text", "")

    if not text:
        return {
            "success": False,
            "error": "text is required"
        }

    summary = summarize_text(text)

    return {
        "success": True,
        "task": "summarize",
        "original_text": text,
        "result": summary
    }
```

启动方式：

```bash
uvicorn day7_api:app --reload
```

然后打开：

```text
http://127.0.0.1:8000/docs
```

## 第五阶段：理解今天这个服务已经像什么了

预计时间：15 分钟

你今天这个服务，其实已经很像一个真实 AI 产品后端了。

比如以后你接入真实模型时：

- `/summarize`：接收文本，调模型，返回总结
- `/rewrite`：接收文本和风格，调模型，返回改写结果
- `/keywords`：接收文本，调模型或规则逻辑，返回关键词

也就是说：今天你先把系统骨架搭出来，后面只需要把假逻辑替换成真模型调用。

## 第六阶段：在 /docs 里测试 3 个核心接口

预计时间：30 分钟

今天你要至少做这 3 次测试。

### 1. 测试 /summarize

请求体：

```json
{
  "text": "Python is a programming language. FastAPI is a modern web framework."
}
```

### 2. 测试 /rewrite

请求体：

```json
{
  "text": "我想转大模型开发。",
  "style": "正式"
}
```

### 3. 测试 /keywords

请求体：

```json
{
  "text": "Python FastAPI LLM RAG Agent"
}
```

## 第七阶段：开始建立统一返回结构的意识

预计时间：20 分钟

今天你会发现我一直让你返回这种格式：

```python
{
    "success": True,
    "task": "summarize",
    "result": ...
}
```

这是因为真实开发里，接口返回最好尽量统一。

比如统一有：

- `success`
- `task`
- `result`
- `error`

这样前端更容易处理。

推荐你记住这个习惯：

成功时：

```python
{"success": True, "result": ...}
```

失败时：

```python
{"success": False, "error": "..."}
```

## 第八阶段：Day 7 练习升级版

预计时间：45 分钟

练习 1：新增 `/word-count`

功能：接收一段文本，返回字数统计。

练习 2：新增 `/uppercase`

功能：输入文本，返回大写版本。

练习 3：新增 `/analyze-profile`

功能：接收结构化的用户信息，返回一段分析结果。

## 第九阶段：今天的推荐最终版代码

`services.py`

```python
def summarize_text(text: str):
    text = text.strip()

    if not text:
        return "文本为空，无法总结。"

    return f"这段文本共 {len(text)} 个字符，主题摘要：这是一段待处理文本。"


def rewrite_text(text: str, style: str):
    text = text.strip()

    if not text:
        return "文本为空，无法改写。"

    return f"[{style}风格改写] {text}"


def extract_keywords(text: str):
    text = text.strip()

    if not text:
        return []

    words = text.replace("，", " ").replace("。", " ").split()
    return words[:5]


def count_words(text: str):
    text = text.strip()

    if not text:
        return 0

    return len(text.split())


def analyze_profile(name: str, role: str, target: str):
    return f"{name} 当前是 {role}，目标是 {target}，适合从 AI 应用开发方向切入。"
```

## 第十阶段：notes/day7.md 模板

```md
# Day 7 学习记录

## 今天完成了什么
- 学会了把接口层和业务层简单拆分
- 新建了 services.py
- 写了多个模拟 AI 接口
- 学会了返回统一 JSON 结构
- 在 /docs 中测试了多个 POST 接口
- 完成了 day7_api.py

## 我现在理解了什么
- 接口函数不应该承载太多业务逻辑
- 可以把文本处理逻辑抽到单独函数里
- 一个 AI 服务后端本质上就是接收输入、处理数据、返回 JSON
- 即使还没接真实大模型，也可以先把服务骨架写出来
- success / error 这种统一返回结构很适合前后端联调

## 我还不熟的点
- 
- 
- 

## 今天最容易混淆的地方
- 接口层和业务层的边界
- Body 里的数据怎么取
- 哪些逻辑应该拆到 services.py

## 明天准备做什么
- 学 Pydantic
- 用更规范的方式定义请求体和响应体
- 让接口从能跑升级到更规范
```

## Day 7 完成标准

今天结束时，你检查这 9 项：

- 创建了 `services.py`
- 知道为什么要拆业务函数
- `day7_api.py` 能正常启动
- 至少完成 3 个 POST 接口
- 会在接口里读取 Body 数据
- 会返回统一结构的 JSON
- 会在 `/docs` 中测试
- 完成 `day7_api.py`
- 写完 `notes/day7.md`

只要这 9 项完成，Day 7 就算合格。

## 今天最重要的一句话

真正的 AI 后端，不是会写一个接口，而是会把接口写成能持续扩展的小服务。

Day 7 其实就是在给你建立这个意识。

## 完成记录

- 完成时间：
- 实际投入：
- 遇到的问题：
- 解决方式：

## 与 90 天目标的关系

这一天的任务会服务于你的最终作品集，目标是在 90 天结束时至少拿出下面 3 个项目中的 2～3 个：

- AI 文案/总结助手
- RAG 知识库助手
- 工具/数据库问答助手
