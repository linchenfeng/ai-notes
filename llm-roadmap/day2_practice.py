# Day 2 Python 基础练习
# 这份文件把变量、字符串、列表、条件判断、循环、函数和字典串在一起练一遍。

# 变量可以直接赋值，Python 会根据内容推断类型。
name = "charon"
current_role = "frontend developer"
target_role = "llm developer"
print(f"My name is {name}, I am a {current_role}, and I want to become a {target_role}.")

# 字符串常见操作：大小写转换、求长度。
title = "LLM Developer"
print("Title:", title)
print("Lower title:", title.lower())
print("Upper title:", title.upper())
print("Title length:", len(title))

# list 很像前端里的 array，可以通过索引取值，也能继续追加元素。
skills = ["html", "css", "javascript", "python"]
print("Skills:", skills)
print("Skills count:", len(skills))
print("First skill:", skills[0])
print("Last skill:", skills[-1])

skills.append("fastapi")
skills.append("sql")
print("Updated skills:", skills)

# if / elif / else 通过缩进表示代码块，不需要大括号。
age = 25
if age < 18:
    print("未成年")
elif age <= 35:
    print("青年")
else:
    print("成年")

# for 更适合遍历列表里的每一项。
for skill in skills:
    print("Skill item:", skill)

# while 适合处理“满足条件就继续”的场景。
count = 1
while count <= 3:
    print("While count:", count)
    count += 1


def square(num):
    # return 会把计算结果返回给调用方。
    return num * num


def check_llm_path(has_frontend, has_python):
    # and 表示两个条件都要成立。
    if has_frontend and has_python:
        return "你很适合往大模型应用开发方向转。"
    return "继续补基础。"


def build_learning_summary(user_profile):
    # join 可以把列表拼成一段字符串，实际开发里很常见。
    joined_skills = ", ".join(user_profile["skills"])
    return (
        f"{user_profile['name']} is learning Python today. "
        f"Current role: {user_profile['current_role']}. "
        f"Target role: {user_profile['target_role']}. "
        f"Skills: {joined_skills}."
    )


print("5 squared:", square(5))
print(check_llm_path(True, True))

# dict 很像 JS 里的 object，适合组织一组有名字的数据。
user = {
    "name": name,
    "current_role": current_role,
    "target_role": target_role,
    "skills": skills,
}
print("Name:", user["name"])
print("Current role:", user["current_role"])
print("Target role:", user["target_role"])
print(build_learning_summary(user))
