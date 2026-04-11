# Day16~20 AI 总结助手

这是一个按 Day16~20 任务拆解完成的最小全栈项目：
- Day16：目录与架构设计
- Day17：前端页面（支持 mock）
- Day18：FastAPI `/generate` 后端
- Day19：前后端联调
- Day20：loading / 错误提示 / 复制按钮

## 目录
- `backend/day18_main.py`：后端接口
- `backend/day18_requirements.txt`：后端依赖
- `frontend/day17_app.html`：前端页面（React CDN）
- `docs/day16_architecture.md`：架构图和目录说明
- `docs/day19_day20_checklist.md`：联调和 UX 验收清单

## 1. 启动后端
在项目根目录执行：

```bash
cd code/day16_20_ai_summary_app
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r backend/day18_requirements.txt
uvicorn backend.day18_main:app --reload --port 8000
```

## 2. 打开前端
直接用浏览器打开：
- `code/day16_20_ai_summary_app/frontend/day17_app.html`

## 3. 联调说明
- 勾选“使用 mock 数据”：
  - 可模拟 Day17 的前端联调阶段（不依赖后端）。
- 取消勾选：
  - 进入 Day19 的真实联调，前端会请求 `http://127.0.0.1:8000/generate`。

## 4. 可选风格
- `简洁版`（brief）
- `要点版`（bullets）
- `结构化版`（structured）

## 5. 你现在能演示的路径
1. 输入文章
2. 选择风格
3. 点击“生成总结”
4. 查看结果并点击“复制结果”
