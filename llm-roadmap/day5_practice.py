import requests

BASE_URL = "https://jsonplaceholder.typicode.com"


def fetch_post(post_id):
    """获取单篇文章，失败时返回 None。"""
    url = f"{BASE_URL}/posts/{post_id}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as error:
        print("获取文章失败：", error)
        return None


def fetch_user_profile(user_id):
    """获取单个用户资料，练习读取嵌套 JSON。"""
    url = f"{BASE_URL}/users/{user_id}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as error:
        print("获取用户信息失败：", error)
        return None


def fetch_posts_by_user(user_id):
    """通过 params 传参，获取指定用户的文章列表。"""
    url = f"{BASE_URL}/posts"
    params = {"userId": user_id}
    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        return response.json(), response.url
    except requests.exceptions.RequestException as error:
        print("获取用户文章失败：", error)
        return None, None


def create_post(title, body, user_id):
    """发送 POST 请求，模拟创建一篇文章。"""
    url = f"{BASE_URL}/posts"
    payload = {
        "title": title,
        "body": body,
        "userId": user_id,
    }
    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as error:
        print("创建文章失败：", error)
        return None


def print_post_summary(post):
    """统一打印文章摘要，避免每次都手写取字段逻辑。"""
    if not post:
        print("文章数据为空")
        return

    print("文章摘要")
    print("ID:", post.get("id"))
    print("标题:", post.get("title"))
    print("内容:", post.get("body"))
    print("-" * 30)


# 1. 获取单篇文章，练习最基础的 GET 请求。
post = fetch_post(1)
print_post_summary(post)

# 2. 获取用户资料，练习读取嵌套 JSON 字段。
user_profile = fetch_user_profile(1)
if user_profile:
    print("用户状态码对应的数据读取成功")
    print("用户名：", user_profile.get("username"))
    print("邮箱：", user_profile.get("email"))
    print("所在城市：", user_profile.get("address", {}).get("city"))
    print("-" * 30)

# 3. 带参数请求，练习 params 的使用。
posts, final_url = fetch_posts_by_user(1)
if posts:
    print("最终请求 URL：", final_url)
    print("用户 1 的文章数量：", len(posts))
    print("第一篇文章标题：", posts[0]["title"])
    print("-" * 30)

# 4. POST 请求，练习提交 JSON 数据。
new_post = create_post(
    "Day 5 Learning",
    "Today I learned how to send HTTP requests in Python.",
    1,
)
print("新建文章结果：")
print(new_post)
