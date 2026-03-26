# Day 06 学习笔记

- 日期：2026-03-30（周一）
- 周次：第 1 周
- 本周主题：Python + HTTP + FastAPI 最小必备
- 阶段：第 1 阶段：先跑通最小闭环
- 阶段目标：先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。

## Day 6 学习目标

今天结束时，你要做到这 8 件事：

- 知道 FastAPI 是干什么的
- 会安装 FastAPI 和 Uvicorn
- 会写最简单的接口
- 会启动本地服务
- 会写 GET 接口
- 会接收查询参数
- 会写 POST 接口并接收 JSON
- 产出一个 `day6_api.py`

今天的关键词：路由、接口、参数、请求体、JSON 响应。

## 为什么 Day 6 很重要

后面你做这些东西时，基本都会用到今天的能力：

- 给前端提供 AI 接口
- 封装大模型调用
- 做聊天接口
- 做文档问答接口
- 做工具调用服务
- 部署自己的 AI 后端

你可以把今天理解成：把 Python 脚本升级成能对外服务的程序。

## Day 6 时间安排

约 3 小时。

## 第一阶段：先理解 FastAPI 是什么

预计时间：20 分钟

FastAPI 可以理解成一个帮你快速写后端接口的 Python 框架。

你写一个函数，给它一个路由地址，比如 `/ping`，别人请求这个地址时，你的函数就会执行，然后返回结果。

这里的路由更像：某个 URL 对应某段后端逻辑。

你今天先记住这几个词：

1. 接口 API：程序对外暴露的访问入口。
2. 路由 route：比如 `/ping`、`/hello`、`/user`
3. GET：一般用于获取数据。
4. POST：一般用于提交数据。
5. JSON 响应：后端经常返回 JSON，前端最容易消费。

## 第二阶段：安装 FastAPI 环境

预计时间：20 分钟

确保你已经进入虚拟环境，然后安装：

```bash
pip install fastapi uvicorn
```

为什么要装这两个：

- `fastapi`：写接口用的框架
- `uvicorn`：运行 FastAPI 服务的服务器

验收标准：

- 安装完成后没有报错
- `pip list` 里能看到 `fastapi` 和 `uvicorn`

## 第三阶段：写第一个 FastAPI 服务

预计时间：35 分钟

新建文件：`day6_api.py`

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}
```

你要理解这几行代码：

- `app = FastAPI()`：创建一个 FastAPI 应用
- `@app.get("/")`：当有人访问根路径 `/` 时，执行下面这个函数
- `return {"message": "Hello, FastAPI!"}`：FastAPI 会自动把 Python 字典转成 JSON 返回

启动服务：

```bash
uvicorn day6_api:app --reload
```

这条命令的含义：

- `day6_api`：你的 Python 文件名，不带 `.py`
- `app`：文件里的 FastAPI 实例名
- `--reload`：保存代码后自动重启，开发阶段很好用

验收标准：

- 启动成功后能看到本地地址，通常是 `http://127.0.0.1:8000`
- 浏览器打开后能看到 `{"message":"Hello, FastAPI!"}`

## 第四阶段：写 GET 接口

预计时间：35 分钟

今天先多写几个简单 GET 接口，建立感觉。

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}


@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.get("/hello")
def hello():
    return {"message": "Hello, Charon!"}
```

你现在有 3 个接口了：

- `/`
- `/ping`
- `/hello`

Day 6 GET 练习 1：

新增一个接口 `/profile`，返回：

```json
{
  "name": "charon",
  "role": "frontend developer",
  "target": "llm developer"
}
```

## 第五阶段：学查询参数 query params

预计时间：35 分钟

真实开发里，很多 GET 请求都要带参数。

比如：

- `/search?keyword=python`
- `/user?id=1`

FastAPI 写起来很直观：

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/hello")
def hello(name: str = "world"):
    return {"message": f"Hello, {name}!"}
```

访问：

```text
http://127.0.0.1:8000/hello?name=charon
```

会看到：

```json
{"message":"Hello, charon!"}
```

你要理解：

- `name: str = "world"` 表示 `name` 是一个字符串参数
- 如果没传，就默认是 `"world"`

Day 6 查询参数练习 2：

写一个接口：

```text
/square?num=5
```

返回：

```json
{"num": 5, "result": 25}
```

参考写法：

```python
@app.get("/square")
def square(num: int):
    return {"num": num, "result": num * num}
```

再做一个练习 3：

写一个接口：

```text
/check-role?role=frontend
```

如果 `role` 是 `frontend`，返回：

```json
{"role": "frontend", "is_match": true}
```

否则返回 `false`。

## 第六阶段：学路径参数 path params

预计时间：25 分钟

除了查询参数，后端还常用路径参数。

比如：

- `/users/1`
- `/posts/10`

写法这样：

```python
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}
```

访问：

```text
http://127.0.0.1:8000/users/1
```

会返回：

```json
{"user_id":1}
```

Day 6 路径参数练习 4：

写一个接口：

```text
/skills/{skill_name}
```

访问 `/skills/python` 返回：

```json
{"skill": "python"}
```

## 第七阶段：学 POST 接口和 JSON 请求体

预计时间：45 分钟

这部分是今天最重要的内容之一。

因为后面你调大模型时，前端往往会发 POST 请求到你的后端。

### 1. 最简单的 POST 写法

先导入 `Body`：

```python
from fastapi import FastAPI, Body

app = FastAPI()


@app.post("/echo")
def echo(data: dict = Body(...)):
    return {"received": data}
```

测试方式：

打开自动文档：

```text
http://127.0.0.1:8000/docs
```

在 `/echo` 页面点开 `Try it out`，输入：

```json
{
  "message": "Hello FastAPI"
}
```

执行后会得到：

```json
{
  "received": {
    "message": "Hello FastAPI"
  }
}
```

你要理解：

- `@app.post("/echo")`：这是一个 POST 接口
- `data: dict = Body(...)`：从请求体里接收一个 JSON 对象，并把它当成 Python 字典

Day 6 POST 练习 5：

写一个接口 `/summarize`，它先不用真的总结，只做模拟总结。

例如前端传：

```json
{
  "text": "Python is a programming language. FastAPI is a web framework."
}
```

你返回：

```json
{
  "original_text": "...",
  "summary": "这是一段关于 Python 和 FastAPI 的文本。"
}
```

参考实现：

```python
@app.post("/summarize")
def summarize(data: dict = Body(...)):
    text = data.get("text", "")
    return {
        "original_text": text,
        "summary": f"收到一段文本，长度为 {len(text)}"
    }
```

## 第八阶段：把今天内容整理成一个小 API 服务

预计时间：45 分钟

今天建议你把 `day6_api.py` 做成一个小型练习服务，包含这些接口：

- GET `/`
- GET `/ping`
- GET `/profile`
- GET `/hello?name=...`
- GET `/square?num=...`
- GET `/check-role?role=...`
- GET `/skills/{skill_name}`
- POST `/echo`
- POST `/summarize`

## 第九阶段：建议你今天顺手学会 /docs

预计时间：15 分钟

FastAPI 自带自动文档，这个非常实用。

启动服务后打开：

```text
http://127.0.0.1:8000/docs
```

你今天至少要做这件事：

- 在 docs 页面点开 2 个 GET 接口测试
- 点开 2 个 POST 接口测试

只要你会用这个文档页面，后面调试效率会高很多。

## 第十阶段：项目目录建议

今天结束后，目录可以变成这样：

```text
llm-roadmap/
├── .venv/
├── main.py
├── utils.py
├── day2_practice.py
├── day3_practice.py
├── day4_practice.py
├── day5_practice.py
├── day6_api.py
├── data/
│   ├── profile.txt
│   ├── output.txt
│   └── user.json
├── notes/
│   ├── day1.md
│   ├── day2.md
│   ├── day3.md
│   ├── day4.md
│   ├── day5.md
│   └── day6.md
├── README.md
└── .gitignore
```

## notes/day6.md 模板

```md
# Day 6 学习记录

## 今天完成了什么
- 安装了 FastAPI 和 Uvicorn
- 写了第一个 FastAPI 服务
- 学会了启动本地接口服务
- 学会了写 GET 接口
- 学会了查询参数和路径参数
- 学会了写 POST 接口
- 学会了在 /docs 中测试接口
- 完成了 day6_api.py

## 我现在理解了什么
- FastAPI 是用来快速写后端接口的
- 一个路由地址对应一个后端函数
- GET 一般用于获取数据
- POST 一般用于提交数据
- 查询参数和路径参数是两种常见传参方式
- FastAPI 可以自动把 dict 转成 JSON
- /docs 对调试接口很有帮助

## 我还不熟的点
- 
- 
- 

## 今天最容易混淆的地方
- 查询参数和路径参数
- GET 和 POST 的使用场景
- 请求体和普通参数的区别

## 明天准备做什么
- 继续练 FastAPI
- 学接口拆分和简单项目结构
- 做一个更接近 AI 接口的小后端
```

## Day 6 完成标准

今天结束时，你检查这 9 项：

- 安装成功 `fastapi` 和 `uvicorn`
- 能运行 `uvicorn day6_api:app --reload`
- 会写最基础 GET 接口
- 会写查询参数
- 会写路径参数
- 会写最基础 POST 接口
- 会在 `/docs` 里测试接口
- 完成 `day6_api.py`
- 写完 `notes/day6.md`

只要这 9 项完成，Day 6 就算合格。

## 今天最重要的一句话

以后你的大模型应用后端，本质上就是 FastAPI + 调模型接口 + 返回 JSON。

所以 Day 6 已经不是普通 Python 练习了，而是在正式进入 LLM 应用开发的后端基础。

## 做完 Day 6 后，你的能力会有明显提升

你会从：

- 会写 Python 脚本
- 会调别人 API

进化到：

- 会自己提供 API
- 会让前端和后端连起来
- 会为后面的模型调用做接口封装

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
