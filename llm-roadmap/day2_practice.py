# Day 2 Python basics practice

name = "charon"
current_role = "frontend developer"
target_role = "llm developer"
print(f"My name is {name}, I am a {current_role}, and I want to become a {target_role}.")

title = "LLM Developer"
print("Title:", title)
print("Lower title:", title.lower())
print("Upper title:", title.upper())
print("Title length:", len(title))

skills = ["html", "css", "javascript", "python"]
print("Skills:", skills)
print("Skills count:", len(skills))
print("First skill:", skills[0])
print("Last skill:", skills[-1])

skills.append("fastapi")
skills.append("sql")
print("Updated skills:", skills)

age = 25
if age < 18:
    print("未成年")
elif age <= 35:
    print("青年")
else:
    print("成年")

for skill in skills:
    print("Skill item:", skill)

count = 1
while count <= 3:
    print("While count:", count)
    count += 1


def square(num):
    return num * num


def check_llm_path(has_frontend, has_python):
    if has_frontend and has_python:
        return "你很适合往大模型应用开发方向转。"
    return "继续补基础。"


def build_learning_summary(user_profile):
    joined_skills = ", ".join(user_profile["skills"])
    return (
        f"{user_profile['name']} is learning Python today. "
        f"Current role: {user_profile['current_role']}. "
        f"Target role: {user_profile['target_role']}. "
        f"Skills: {joined_skills}."
    )


print("5 squared:", square(5))
print(check_llm_path(True, True))

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
