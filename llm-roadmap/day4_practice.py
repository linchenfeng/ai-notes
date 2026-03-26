import json

from utils import get_frontend_users, get_high_score_users, get_user_names

# 这组数据很像后面接口返回的结构：列表里放字典。
learners = [
    {"name": "Tom", "role": "frontend", "score": 80},
    {"name": "Lucy", "role": "backend", "score": 92},
    {"name": "Charon", "role": "frontend", "score": 88},
]

# 先练列表的常见操作：新增、删除、遍历。
tech_stack = ["python", "fastapi", "sql", "rag"]
print("技术栈长度：", len(tech_stack))
print("第一个技术：", tech_stack[0])
print("最后一个技术：", tech_stack[-1])

tech_stack.append("agent")
tech_stack.remove("sql")

print("当前技术栈：")
for index, tech in enumerate(tech_stack):
    print(index, tech)

# 再练字典的新增、修改、读取和遍历。
student = {
    "name": "charon",
    "age": 25,
    "skills": ["html", "css", "javascript", "python"],
}
print("学生姓名：", student["name"])
print("学生技能：", student["skills"])

student["target"] = "llm developer"
student["age"] = 26

print("遍历 student 字典：")
for key, value in student.items():
    print(key, value)

# 处理嵌套数据时，最常见的动作就是遍历和筛选。
print("所有学习者名字：")
for learner_name in get_user_names(learners):
    print(learner_name)

frontend_learners = get_frontend_users(learners)
print("前端学习者：", frontend_learners)

high_score_learners = get_high_score_users(learners, 85)
print("高分学习者：", high_score_learners)
print("学习者总数：", len(learners))

# json.dumps() 会把 Python 数据转成 JSON 字符串。
high_score_json = json.dumps(high_score_learners, ensure_ascii=False, indent=2)
print("高分学习者 JSON：")
print(high_score_json)

# json.loads() 会把 JSON 字符串再转回 Python 数据。
course_text = '{"title": "LLM Learning", "days": 90, "status": "ongoing"}'
course_data = json.loads(course_text)
print("课程标题：", course_data["title"])
print("学习天数：", course_data["days"])
print("当前状态：", course_data["status"])
