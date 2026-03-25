import json

from utils import introduce, safe_divide, safe_int

# 先读取文本文件，模拟后续读取 prompt 或知识库文档的场景。
with open("data/profile.txt", "r", encoding="utf-8") as file:
    profile_content = file.read()

print("个人资料内容：")
print(profile_content)

# 这里再逐行读取一次，练习 readlines() 和 strip() 的用法。
with open("data/profile.txt", "r", encoding="utf-8") as file:
    profile_lines = file.readlines()

print("逐行查看个人资料：")
for line in profile_lines:
    print(line.strip())

# 调用独立模块里的函数，体验“拆代码再复用”的写法。
print(introduce("charon", "frontend developer"))
print("safe_int('123'):", safe_int("123"))
print("safe_int('abc'):", safe_int("abc"))
print("safe_divide(10, 2):", safe_divide(10, 2))
print("safe_divide(10, 0):", safe_divide(10, 0))

# 先写入文本文件，再追加一行内容，体验 w 和 a 两种模式。
summary_text = "Today I started learning Python modules and file operations."
with open("data/output.txt", "w", encoding="utf-8") as file:
    file.write(summary_text)

with open("data/output.txt", "a", encoding="utf-8") as file:
    file.write("\nI also learned try-except and JSON today.")

print("output.txt 写入完成")

# 把结构化数据保存成 JSON，后面做 API 和 RAG 时会经常用到。
user_info = {
    "name": "charon",
    "current_role": "frontend developer",
    "target_role": "llm developer",
}

with open("data/user.json", "w", encoding="utf-8") as file:
    json.dump(user_info, file, ensure_ascii=False, indent=2)

print("user.json 保存完成")

# 再把 JSON 读回来，确认保存成功。
with open("data/user.json", "r", encoding="utf-8") as file:
    saved_user = json.load(file)

print("读取到的 JSON：", saved_user)
print("读取到的姓名：", saved_user["name"])
