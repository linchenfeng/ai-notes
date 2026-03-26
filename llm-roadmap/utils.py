"""Day 3/4 通用函数模块。"""


def introduce(name, role):
    """返回一段自我介绍。"""
    return f"My name is {name}, and I am a {role}."


def square(num):
    """返回一个数字的平方。"""
    return num * num


def is_adult(age):
    """判断年龄是否达到成年标准。"""
    return age >= 18


def safe_int(value):
    """安全地把输入转换成整数，失败时返回提示文本。"""
    try:
        return int(value)
    except ValueError:
        return "请输入正确数字"


def safe_divide(a, b):
    """安全地执行除法，避免除数为 0 导致程序直接报错。"""
    try:
        return a / b
    except ZeroDivisionError:
        return "除数不能为 0"


def is_frontend(role):
    """判断一个角色是否属于前端方向。"""
    return role == "frontend"


def get_user_names(users):
    """从用户列表里提取所有名字。"""
    names = []
    for user in users:
        names.append(user["name"])
    return names


def get_frontend_users(users):
    """筛选出所有前端用户。"""
    result = []
    for user in users:
        if is_frontend(user["role"]):
            result.append(user)
    return result


def get_high_score_users(users, min_score):
    """筛选出分数大于等于指定值的用户。"""
    result = []
    for user in users:
        if user["score"] >= min_score:
            result.append(user)
    return result
