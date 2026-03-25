# Day 02 学习笔记

- 日期：2026-03-26（周四）
- 周次：第 1 周
- 本周主题：Python + HTTP + FastAPI 最小必备
- 阶段：第 1 阶段：先跑通最小闭环
- 阶段目标：先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。

## Day 2 学习目标

今天结束时，你要能做到这 6 件事：

- 看懂并写出 Python 变量、字符串、列表、字典
- 会写 `if / for / while`
- 会写函数
- 知道 Python 和 JS 在基础语法上的主要区别
- 独立完成 6～8 个小练习
- 产出一个 `day2_practice.py`

今天不追求难，追求以后看到 Python 代码不陌生，能自己动手改。

## Day 2 时间安排

约 3 小时。

## 第一阶段：建立 Python 基本感觉

预计时间：30 分钟

今天先记住一个核心认知：

Python 和 JS 最大的不同，不是功能不同，而是写法习惯不同。

你重点先适应这几件事：

- Python 用缩进表示代码块，不用 `{}`
- Python 很多地方更简洁
- Python 里 `dict` 很像 JS 的 `object`
- Python 里 `list` 很像 JS 的 `array`
- Python 常用 `None`，对应 JS 的 `null`
- Python 没有 `===`，常见比较直接用 `==`

## 第二阶段：学最常用语法

预计时间：60 分钟

下面这些你今天要边学边敲。

### 1. 变量和基础类型

```python
name = "charon"
age = 18
is_learning = True
height = 175.5

print(name)
print(age)
print(is_learning)
print(height)
```

你要理解的常见类型：

- `str`
- `int`
- `float`
- `bool`

对照 JS：

```javascript
let name = "charon"
let age = 18
let isLearning = true
```

### 2. 字符串

```python
title = "LLM Developer"
print(title)
print(title.lower())
print(title.upper())
print(len(title))
print(f"My target is {title}")
```

今天先记住：

- `len()`：长度
- `.lower()` / `.upper()`
- `f""`：字符串插值，类似 JS 模板字符串

### 3. 列表 list

```python
skills = ["html", "css", "javascript", "python"]
print(skills)
print(skills[0])
print(skills[-1])

skills.append("fastapi")
print(skills)
```

对照 JS：

- Python `list` 约等于 JS `array`
- `append()` 约等于 `push()`

### 4. 字典 dict

```python
user = {
    "name": "charon",
    "role": "frontend developer",
    "target": "llm developer"
}

print(user)
print(user["name"])
print(user["target"])
```

对照 JS：

- Python `dict` 约等于 JS `object`

### 5. 条件判断 if

```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

注意：Python 用冒号 `:` 和缩进，不用大括号。

### 6. 循环 for / while

```python
skills = ["html", "css", "js", "python"]

for skill in skills:
    print(skill)

count = 1
while count <= 5:
    print(count)
    count += 1
```

先重点掌握：实际开发里，`for` 比 `while` 更常用。

### 7. 函数

```python
def introduce(name, role):
    return f"I am {name}, and I am a {role}."

result = introduce("charon", "frontend developer")
print(result)
```

对照 JS：

```javascript
function introduce(name, role) {
  return `I am ${name}, and I am a ${role}.`
}
```

## 第三阶段：做专项练习

预计时间：80 分钟

今天最重要的是练习。下面这些题你要自己敲，不要只看。

建议你新建文件：`day2_practice.py`

### 练习 1：打印个人信息

定义 3 个变量：

- 你的名字
- 你现在的职业
- 你的目标职业

输出一句完整介绍。

### 练习 2：计算列表长度

定义一个列表：

```python
["html", "css", "javascript", "python"]
```

输出：

- 列表长度
- 第一个技能
- 最后一个技能

### 练习 3：给列表新增元素

在技能列表后面追加：

- `fastapi`
- `sql`

然后打印新列表。

### 练习 4：根据年龄判断阶段

定义一个年龄变量：

- 小于 18 输出：未成年
- 18 到 35 输出：青年
- 大于 35 输出：成年

### 练习 5：遍历技能列表

把技能列表里的每个元素逐行打印出来。

### 练习 6：写一个函数计算平方

写一个函数：

```python
def square(num):
    ...
```

输入 `5`，输出 `25`。

### 练习 7：写一个函数判断是否适合学大模型开发

函数接收两个参数：

- 是否会前端
- 是否会一点 Python

如果两个都满足，返回一句鼓励的话；否则返回“继续补基础”。

### 练习 8：字典练习

定义一个字典：

```python
{
    "name": "charon",
    "current_role": "frontend developer",
    "target_role": "llm developer"
}
```

输出其中每一个字段。

### 加分练习 9：综合练习

写一个小程序，输出你的学习计划摘要，例如：

- 我的名字
- 我会的技能
- 我的目标
- 我今天在学 Python

这个练习会把变量、列表、字典、函数都串起来。

## 第四阶段：对照 JS 做迁移理解

预计时间：25 分钟

你今天最好专门花一点时间记这些前端转 Python 的高频差异。

### 1. 打印

JS：

```javascript
console.log("hello")
```

Python：

```python
print("hello")
```

### 2. 数组

JS：

```javascript
const arr = [1, 2, 3]
arr.push(4)
```

Python：

```python
arr = [1, 2, 3]
arr.append(4)
```

### 3. 对象

JS：

```javascript
const user = { name: "Tom" }
console.log(user.name)
```

Python：

```python
user = {"name": "Tom"}
print(user["name"])
```

### 4. 函数

JS：

```javascript
function add(a, b) {
  return a + b
}
```

Python：

```python
def add(a, b):
    return a + b
```

### 5. 条件判断

JS：

```javascript
if (age > 18) {
  console.log("adult")
}
```

Python：

```python
if age > 18:
    print("adult")
```

## 第五阶段：整理今天产出

预计时间：20 分钟

今天建议你把项目目录变成这样：

```text
llm-roadmap/
├── .venv/
├── main.py
├── day2_practice.py
├── README.md
├── .gitignore
└── notes/
    ├── day1.md
    └── day2.md
```

## day2_practice.py 建议模板

```python
# Day 2 Python 基础练习

# 1. 变量
name = "charon"
current_role = "frontend developer"
target_role = "llm developer"

print(f"My name is {name}, I am a {current_role}, and I want to become a {target_role}.")

# 2. 列表
skills = ["html", "css", "javascript", "python"]
print("技能列表:", skills)
print("技能数量:", len(skills))
print("第一个技能:", skills[0])
print("最后一个技能:", skills[-1])

skills.append("fastapi")
skills.append("sql")
print("新增后的技能列表:", skills)

# 3. 条件判断
age = 25
if age < 18:
    print("未成年")
elif age <= 35:
    print("青年")
else:
    print("成年")

# 4. 循环
for skill in skills:
    print("我会的技能:", skill)

# 5. 函数
def square(num):
    return num * num

print("5 的平方是:", square(5))

def check_llm_path(has_frontend, has_python):
    if has_frontend and has_python:
        return "你很适合往大模型应用开发方向转。"
    return "继续补基础。"

print(check_llm_path(True, True))

# 6. 字典
user = {
    "name": "charon",
    "current_role": "frontend developer",
    "target_role": "llm developer"
}

print("姓名:", user["name"])
print("当前职业:", user["current_role"])
print("目标职业:", user["target_role"])
```

## notes/day2.md 记录模板

```md
# Day 2 学习记录

## 今天完成了什么
- 学了 Python 基础类型
- 学了字符串、列表、字典
- 学了 if / for / while
- 学了函数
- 做了 day2_practice.py

## 我现在理解了什么
- Python 的 list 很像 JS 的 array
- Python 的 dict 很像 JS 的 object
- Python 用缩进来区分代码块
- Python 的函数定义比 JS 更简洁

## 我还不熟的点
- 
- 
- 

## 今天最容易混淆的地方
- 
- 

## 明天准备做什么
- 继续做 Python 练习
- 开始学模块、异常处理、文件读写
```

## Day 2 完成标准

今天结束时，你检查这 7 项：

- 能写字符串、数字、布尔值变量
- 能写列表和字典
- 能写 `if / elif / else`
- 能写 `for`
- 能写一个简单函数
- 完成 `day2_practice.py`
- 写完 `notes/day2.md`

如果这 7 项完成，Day 2 就合格了。

## 今天最重要的学习原则

今天不是背语法细节，重点是：把 Python 变成你敢写的语言，而不是你看得懂但不敢写的语言。

## 给你的建议

你是前端出身，今天学的时候，脑子里一直做这件事：把 Python 和 JS 一一对照。

这样你会快很多，因为你不是零编程基础，你只是换了一门语言。

## 今天结束后的理想状态

到今晚你应该能做到：

- 自己写一个 30～50 行的 Python 小文件
- 能用 Python 表达简单逻辑
- 不再害怕看到 `.py` 文件
- 对 Day 3 的模块、异常处理、文件读写有承接感

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
