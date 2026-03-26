# Day 04 学习笔记

- 日期：2026-03-28（周六）
- 周次：第 1 周
- 本周主题：Python + HTTP + FastAPI 最小必备
- 阶段：第 1 阶段：先跑通最小闭环
- 阶段目标：先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。

## Day 4 学习目标

今天结束时，你要做到这 7 件事：

- 熟练使用列表的常见操作
- 熟练使用字典的常见操作
- 会遍历列表里套字典的数据
- 会写更实用的函数
- 会把 Python 数据和 JSON 相互转换
- 能完成一个用户数据处理小练习
- 产出 `day4_practice.py`

今天的关键词：遍历、查找、更新、封装。

## Day 4 时间安排

约 3 小时。

## 第一阶段：先理解今天为什么学这些

预计时间：15 分钟

你后面会经常遇到这种数据：

```python
users = [
    {"name": "Alice", "role": "frontend"},
    {"name": "Bob", "role": "backend"},
    {"name": "Charon", "role": "frontend"}
]
```

或者这种：

```python
response = {
    "success": True,
    "data": {
        "title": "Python 入门",
        "tags": ["python", "backend", "llm"]
    }
}
```

这就是典型的：

- 列表里放字典
- 字典里放列表
- 嵌套数据结构

以后你调接口、处理模型结果、做结构化抽取，基本天天都在处理这些。

所以今天就是专门练这个。

## 第二阶段：列表 list 强化

预计时间：45 分钟

### 1. 复习列表基础

```python
skills = ["html", "css", "javascript", "python"]
print(skills)
print(skills[0])
print(skills[-1])
```

### 2. 常见操作

新增元素：

```python
skills.append("fastapi")
print(skills)
```

插入元素：

```python
skills.insert(1, "typescript")
print(skills)
```

删除元素：

```python
skills.remove("css")
print(skills)
```

弹出最后一个元素：

```python
last_skill = skills.pop()
print(last_skill)
print(skills)
```

判断元素是否存在：

```python
if "python" in skills:
    print("有 Python")
```

获取长度：

```python
print(len(skills))
```

### 3. 遍历列表

```python
for skill in skills:
    print(skill)
```

带索引遍历：

```python
for index, skill in enumerate(skills):
    print(index, skill)
```

### 4. 列表排序

```python
numbers = [5, 2, 9, 1, 7]
numbers.sort()
print(numbers)
```

倒序：

```python
numbers.sort(reverse=True)
print(numbers)
```

### 5. Day 4 列表练习

练习 1：定义一个学习技术列表：

```python
["python", "fastapi", "sql", "rag"]
```

完成这些操作：

- 打印长度
- 打印第一个和最后一个
- 追加 `"agent"`
- 删除 `"sql"`
- 遍历输出全部技术

## 第三阶段：字典 dict 强化

预计时间：45 分钟

### 1. 复习字典基础

```python
user = {
    "name": "charon",
    "role": "frontend developer",
    "target": "llm developer"
}

print(user)
print(user["name"])
```

### 2. 常见操作

新增字段：

```python
user["city"] = "Singapore"
print(user)
```

修改字段：

```python
user["role"] = "frontend engineer"
print(user)
```

删除字段：

```python
del user["city"]
print(user)
```

安全读取字段：

```python
print(user.get("name"))
print(user.get("salary"))
print(user.get("salary", "暂无信息"))
```

取所有 key：

```python
print(user.keys())
```

取所有 value：

```python
print(user.values())
```

遍历字典：

```python
for key, value in user.items():
    print(key, value)
```

### 3. Day 4 字典练习

练习 2：定义一个字典：

```python
student = {
    "name": "charon",
    "age": 25,
    "skills": ["html", "css", "javascript", "python"]
}
```

完成这些操作：

- 打印 `name`
- 打印 `skills`
- 新增 `target = "llm developer"`
- 修改 `age`
- 遍历输出所有字段

## 第四阶段：处理嵌套数据

预计时间：50 分钟

这是今天最重要的部分。

### 1. 列表里套字典

```python
users = [
    {"name": "Alice", "role": "frontend", "age": 24},
    {"name": "Bob", "role": "backend", "age": 27},
    {"name": "Charon", "role": "frontend", "age": 25}
]
```

遍历每个用户：

```python
for user in users:
    print(user["name"], user["role"])
```

找出所有前端：

```python
for user in users:
    if user["role"] == "frontend":
        print(user["name"])
```

统计人数：

```python
print(len(users))
```

### 2. 字典里套列表

```python
profile = {
    "name": "charon",
    "skills": ["html", "css", "javascript", "python"],
    "projects": ["portfolio", "admin system", "ai assistant"]
}

print(profile["skills"])
print(profile["projects"][0])
```

### 3. Day 4 嵌套数据练习

练习 3：定义一个用户列表：

```python
users = [
    {"name": "Tom", "role": "frontend", "score": 80},
    {"name": "Lucy", "role": "backend", "score": 92},
    {"name": "Charon", "role": "frontend", "score": 88}
]
```

完成这些任务：

- 打印所有人的名字
- 打印所有前端的名字
- 打印分数大于等于 85 的名字
- 统计一共有几个人

## 第五阶段：函数强化

预计时间：35 分钟

今天开始别只写演示函数，要写有用途的函数。

### 1. 回顾基础函数

```python
def introduce(name, role):
    return f"My name is {name}, and I am a {role}."
```

### 2. 写更像工具的函数

判断是否是前端：

```python
def is_frontend(role):
    return role == "frontend"
```

获取高分用户：

```python
def get_high_score_users(users, min_score):
    result = []
    for user in users:
        if user["score"] >= min_score:
            result.append(user)
    return result
```

调用：

```python
users = [
    {"name": "Tom", "score": 80},
    {"name": "Lucy", "score": 92},
    {"name": "Charon", "score": 88}
]

print(get_high_score_users(users, 85))
```

### 3. Day 4 函数练习

练习 4：写一个函数：

```python
def get_frontend_users(users):
    ...
```

功能：传入用户列表，返回所有 `role == "frontend"` 的用户。

练习 5：写一个函数：

```python
def get_user_names(users):
    ...
```

功能：传入用户列表，返回所有用户名字组成的新列表。

## 第六阶段：JSON 数据处理

预计时间：35 分钟

Day 3 你已经学了 JSON 读写，今天再往前一步：把 Python 数据和 JSON 互转。

先记住：

- Python 里常用：`dict`、`list`
- 接口返回时常见：JSON
- 两者经常互相转换

### 1. Python 转 JSON 字符串

```python
import json

user = {
    "name": "charon",
    "role": "frontend developer",
    "target": "llm developer"
}

json_str = json.dumps(user, ensure_ascii=False, indent=2)
print(json_str)
```

你要理解：

- `dumps()`：转成字符串
- `dump()`：写入文件

### 2. JSON 字符串转 Python

```python
import json

text = '{"name": "charon", "role": "frontend developer"}'
data = json.loads(text)

print(data)
print(data["name"])
```

你要理解：

- `loads()`：字符串转 Python 数据
- `load()`：文件转 Python 数据

### 3. Day 4 JSON 练习

练习 6：定义一个 Python 字典，把它转成 JSON 字符串并打印。

练习 7：给你一段 JSON 字符串：

```python
text = '{"title": "LLM Learning", "days": 90, "status": "ongoing"}'
```

把它转成 Python 字典，然后打印：

- `title`
- `days`
- `status`

## 第七阶段：Day 4 综合练习

预计时间：50 分钟

今天建议你新建：`day4_practice.py`

目标：做一个学习者信息处理器。

### 综合练习要求

你需要准备一组数据：

```python
learners = [
    {"name": "Tom", "role": "frontend", "score": 80},
    {"name": "Lucy", "role": "backend", "score": 92},
    {"name": "Charon", "role": "frontend", "score": 88}
]
```

你要完成这些任务：

- 打印所有学习者名字
- 找出所有前端学习者
- 找出分数大于等于 85 的学习者
- 写一个函数返回所有名字列表
- 把高分学习者保存成 JSON 字符串打印出来

参考模板：

```python
import json

learners = [
    {"name": "Tom", "role": "frontend", "score": 80},
    {"name": "Lucy", "role": "backend", "score": 92},
    {"name": "Charon", "role": "frontend", "score": 88}
]


def get_user_names(users):
    names = []
    for user in users:
        names.append(user["name"])
    return names


def get_frontend_users(users):
    result = []
    for user in users:
        if user["role"] == "frontend":
            result.append(user)
    return result


def get_high_score_users(users, min_score):
    result = []
    for user in users:
        if user["score"] >= min_score:
            result.append(user)
    return result


print("所有学习者名字：")
print(get_user_names(learners))

print("前端学习者：")
print(get_frontend_users(learners))

high_score_users = get_high_score_users(learners, 85)

print("高分学习者：")
print(high_score_users)

json_str = json.dumps(high_score_users, ensure_ascii=False, indent=2)
print("高分学习者 JSON：")
print(json_str)
```

## 今天项目目录建议

今天结束后，你的目录可以变成这样：

```text
llm-roadmap/
├── .venv/
├── main.py
├── utils.py
├── day2_practice.py
├── day3_practice.py
├── day4_practice.py
├── data/
│   ├── profile.txt
│   ├── output.txt
│   └── user.json
├── notes/
│   ├── day1.md
│   ├── day2.md
│   ├── day3.md
│   └── day4.md
├── README.md
└── .gitignore
```

## notes/day4.md 模板

```md
# Day 4 学习记录

## 今天完成了什么
- 学了列表的常见操作
- 学了字典的常见操作
- 学了遍历嵌套数据
- 学了更实用的函数写法
- 学了 Python 和 JSON 的互转
- 完成了 day4_practice.py

## 我现在理解了什么
- 很多真实数据都是 list + dict 组合
- 遍历和筛选是数据处理的基础
- 函数可以把重复逻辑封装起来
- JSON 和 Python 数据结构之间可以方便转换

## 我还不熟的点
- 
- 
- 

## 今天最容易出错的地方
- 字典取值
- 列表和字典嵌套时的访问
- 函数参数和返回值

## 明天准备做什么
- 学 HTTP 请求和 API
- 开始接触后续最重要的能力之一：调接口
```

## Day 4 完成标准

今天结束时，你检查这 8 项：

- 会 `append / remove / pop`
- 会 `get / items`
- 会遍历列表和字典
- 会处理列表里套字典
- 会写 2～3 个有实际作用的函数
- 会 `json.dumps()` 和 `json.loads()`
- 完成 `day4_practice.py`
- 写完 `notes/day4.md`

只要这 8 项完成，Day 4 就合格。

## 今天最重要的一句话

后面你调用大模型 API，拿到的结果本质上就是 Python 里的字典和列表。

所以今天这部分不是基础边角料，而是后续 LLM 开发的核心地基。

## 做完 Day 4 后，你会明显进入下一阶段

你会开始具备：

- 处理接口返回数据的能力
- 读懂结构化输出的能力
- 写简单数据处理逻辑的能力

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
