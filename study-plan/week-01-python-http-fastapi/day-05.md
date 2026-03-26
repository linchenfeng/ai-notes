# Day 05 学习笔记

- 日期：2026-03-29（周日）
- 周次：第 1 周
- 本周主题：Python + HTTP + FastAPI 最小必备
- 阶段：第 1 阶段：先跑通最小闭环
- 阶段目标：先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。

## Day 5 学习目标

今天结束时，你要做到这 8 件事：

- 知道什么是 HTTP 请求
- 知道 GET 和 POST 的区别
- 会用 Python 发 GET 请求
- 会用 Python 发 POST 请求
- 会读取接口返回的 JSON 数据
- 会处理请求失败和超时
- 完成一个调用公开 API 的练习
- 产出 `day5_practice.py`

今天的关键词：请求、响应、JSON、状态码。

## 为什么 Day 5 很重要

后面你做这些事情时，都会直接用到今天的内容：

- 调用大模型 API
- 调用自己写的 FastAPI 接口
- 调用第三方服务
- 获取网页、天气、搜索等外部数据
- 做工具调用和 Agent

所以今天其实是在搭一个桥：从本地 Python 练习走向外部 AI 世界。

## Day 5 时间安排

约 3 小时。

## 第一阶段：先理解 HTTP 在干嘛

预计时间：25 分钟

你可以把 HTTP 理解成：你的程序向另一个服务发消息，对方再回你结果。

就像：

- 你去餐厅点餐 = 发请求
- 餐厅给你菜 = 返回响应

### 1. HTTP 最基本的概念

请求 `Request`

你发出去的信息，包括：

- 请求地址 URL
- 请求方法（GET / POST）
- 请求头 headers
- 请求参数 params 或 body

响应 `Response`

服务返回给你的信息，包括：

- 状态码 status code
- 返回内容 text / JSON
- 响应头 headers

### 2. 最常见的两种请求方法

GET：用于获取数据。

例如：

- 获取天气
- 获取文章
- 获取用户列表

特点：

- 参数通常放在 URL 上
- 一般用于查询

POST：用于提交数据。

例如：

- 提交表单
- 提交聊天消息
- 调用模型生成内容

特点：

- 参数通常放在请求体里
- 一般用于创建、提交、生成

### 3. 状态码只先记这几个

- 200：请求成功
- 201：创建成功
- 400：请求有问题
- 401：未授权
- 403：禁止访问
- 404：资源不存在
- 500：服务器报错

今天不用全背，只先有感觉。

## 第二阶段：用 Python 发第一个 GET 请求

预计时间：45 分钟

今天建议你先用 `requests` 这个库，它很适合初学者。

### 1. 先安装 requests

确保你在虚拟环境里，然后执行：

```bash
pip install requests
```

验收标准：安装成功，没有报错。

### 2. 第一个 GET 请求

新建文件：`day5_practice.py`

```python
import requests

url = "https://jsonplaceholder.typicode.com/posts/1"
response = requests.get(url)

print(response)
print(response.status_code)
print(response.text)
```

运行：

```bash
python day5_practice.py
```

你要理解的点：

- `requests.get(url)` 表示发一个 GET 请求
- `response.status_code` 表示状态码
- `response.text` 表示原始返回文本

### 3. 读取 JSON 响应

很多接口返回的是 JSON，这时不要只看 `text`，而要转成 Python 数据。

```python
import requests

url = "https://jsonplaceholder.typicode.com/posts/1"
response = requests.get(url)

data = response.json()

print(data)
print(data["title"])
print(data["body"])
```

你要理解的点：

- `response.json()` 的意思是把接口返回的 JSON 转成 Python 的 `dict` 或 `list`

这一步特别重要，因为以后调大模型 API，返回结果你也要这么取。

### 4. Day 5 GET 练习

练习 1：请求这个地址：

```text
https://jsonplaceholder.typicode.com/users/1
```

要求打印：

- 状态码
- 整个返回数据
- 用户名
- 邮箱
- 所在城市

提示：城市在嵌套字段里。

## 第三阶段：学会带参数请求

预计时间：30 分钟

很多查询接口都支持参数，比如查指定页、查某个用户、查某个关键词。

### 1. GET 请求带 params

```python
import requests

url = "https://jsonplaceholder.typicode.com/comments"
params = {
    "postId": 1
}

response = requests.get(url, params=params)
data = response.json()

print(response.url)
print(data[:2])
```

你要理解的点：

- `params=...` 会自动拼到 URL 后面

例如：`/comments?postId=1`

这在查询接口时非常常见。

### 2. Day 5 参数练习

练习 2：请求：

```text
https://jsonplaceholder.typicode.com/posts
```

带参数：

```python
{"userId": 1}
```

要求：

- 打印最终 URL
- 打印返回数据总长度
- 打印第一篇文章标题

## 第四阶段：学 POST 请求

预计时间：40 分钟

POST 比 GET 更接近后面调用大模型接口的感觉。

### 1. 最小 POST 请求例子

```python
import requests

url = "https://jsonplaceholder.typicode.com/posts"

payload = {
    "title": "My First API Request",
    "body": "I am learning Python HTTP requests.",
    "userId": 1
}

response = requests.post(url, json=payload)

print(response.status_code)
print(response.json())
```

你要理解的点：

- `json=payload` 表示把 Python 字典当成 JSON 请求体发出去

这和以后调用 LLM 接口时传 `model`、`input`、`messages` 是同一种思路。

### 2. Day 5 POST 练习

练习 3：向下面地址发 POST：

```text
https://jsonplaceholder.typicode.com/posts
```

提交内容包括：

- `title`
- `body`
- `userId`

要求打印：

- 状态码
- 返回的 JSON 数据
- 返回中的 `id`

## 第五阶段：处理异常、超时和失败

预计时间：30 分钟

这一步特别重要。真实开发里，网络请求经常失败。

例如：

- 网址错了
- 网络断了
- 接口响应太慢
- 返回的不是你预期内容

今天就开始建立别让程序一碰网络就崩的意识。

### 1. 加超时 timeout

```python
import requests

url = "https://jsonplaceholder.typicode.com/posts/1"
response = requests.get(url, timeout=5)

print(response.json())
```

你要理解：`timeout=5` 表示最多等 5 秒。

### 2. 用 try / except 包起来

```python
import requests

try:
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1", timeout=5)
    print(response.status_code)
    print(response.json())
except requests.exceptions.RequestException as e:
    print("请求失败：", e)
```

### 3. 判断状态码是否成功

```python
import requests

try:
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1", timeout=5)

    if response.status_code == 200:
        print("请求成功")
        print(response.json())
    else:
        print("请求失败，状态码：", response.status_code)
except requests.exceptions.RequestException as e:
    print("网络异常：", e)
```

### 4. 更推荐的写法：raise_for_status()

```python
import requests

try:
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1", timeout=5)
    response.raise_for_status()
    data = response.json()
    print(data)
except requests.exceptions.RequestException as e:
    print("请求失败：", e)
```

你要理解：如果状态码不是 2xx，它会直接抛异常。

这是后面写接口调用时非常常见的写法。

## 第六阶段：封装成函数

预计时间：30 分钟

到今天开始，你要养成一个习惯：不要把所有请求逻辑都直接写死在一坨代码里，而要开始封装函数。

### 1. 封装一个 GET 请求函数

```python
import requests


def fetch_post(post_id):
    url = f"https://jsonplaceholder.typicode.com/posts/{post_id}"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print("请求失败：", e)
        return None
```

### 2. 封装一个 POST 请求函数

```python
import requests


def create_post(title, body, user_id):
    url = "https://jsonplaceholder.typicode.com/posts"
    payload = {
        "title": title,
        "body": body,
        "userId": user_id
    }

    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print("请求失败：", e)
        return None
```

## 第七阶段：Day 5 综合练习

预计时间：60 分钟

今天建议你把 `day5_practice.py` 写成一个小型 API 调用练习项目。

目标：既练 GET，也练 POST，也练异常处理。

### 综合练习要求

你需要完成 4 个函数：

1. 获取单篇文章：`fetch_post(post_id)`
2. 获取某个用户的文章列表：`fetch_posts_by_user(user_id)`
3. 创建一篇新文章：`create_post(title, body, user_id)`
4. 打印文章摘要：`print_post_summary(post)`

参考模板：

```python
import requests

BASE_URL = "https://jsonplaceholder.typicode.com"


def fetch_post(post_id):
    url = f"{BASE_URL}/posts/{post_id}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print("获取文章失败：", e)
        return None


def fetch_posts_by_user(user_id):
    url = f"{BASE_URL}/posts"
    params = {"userId": user_id}
    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print("获取用户文章失败：", e)
        return None


def create_post(title, body, user_id):
    url = f"{BASE_URL}/posts"
    payload = {
        "title": title,
        "body": body,
        "userId": user_id
    }
    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print("创建文章失败：", e)
        return None


def print_post_summary(post):
    if not post:
        print("文章数据为空")
        return

    print("文章摘要")
    print("ID:", post.get("id"))
    print("标题:", post.get("title"))
    print("内容:", post.get("body"))
    print("-" * 30)
```

## 第八阶段：项目目录建议

今天结束后，你的目录可以这样：

```text
llm-roadmap/
├── .venv/
├── main.py
├── utils.py
├── day2_practice.py
├── day3_practice.py
├── day4_practice.py
├── day5_practice.py
├── data/
│   ├── profile.txt
│   ├── output.txt
│   └── user.json
├── notes/
│   ├── day1.md
│   ├── day2.md
│   ├── day3.md
│   ├── day4.md
│   └── day5.md
├── README.md
└── .gitignore
```

## notes/day5.md 模板

```md
# Day 5 学习记录

## 今天完成了什么
- 学了 HTTP 的基本概念
- 学了 GET 和 POST 的区别
- 学会了用 requests 发 GET 请求
- 学会了用 requests 发 POST 请求
- 学会了读取 JSON 响应
- 学会了处理超时和请求失败
- 完成了 day5_practice.py

## 我现在理解了什么
- HTTP 是程序和外部服务交互的基础
- GET 一般用于获取数据
- POST 一般用于提交数据
- 很多接口返回的其实就是 JSON
- response.json() 很重要
- timeout 和异常处理在真实开发里非常必要

## 我还不熟的点
- 
- 
- 

## 今天最容易混淆的地方
- params 和 json 的区别
- response.text 和 response.json() 的区别
- GET 和 POST 的使用场景

## 明天准备做什么
- 学 FastAPI
- 开始自己写接口
- 从调用别人接口过渡到自己提供接口
```

## Day 5 完成标准

今天结束时，你检查这 9 项：

- 知道 GET 和 POST 的区别
- 会安装并导入 `requests`
- 会发 GET 请求
- 会发 POST 请求
- 会取 `status_code`
- 会用 `response.json()`
- 会加 `timeout`
- 完成 `day5_practice.py`
- 写完 `notes/day5.md`

只要这 9 项完成，Day 5 就算合格。

## 今天最重要的一句话

调用大模型 API，本质上也是在发 HTTP 请求。

所以你今天学的不是普通网络知识，而是在给后面的 LLM 开发铺最核心的一块路。

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
