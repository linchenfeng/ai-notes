# Day 11 学习记录

## 今天完成了什么
- 学了为什么项目结构很重要
- 创建了 app 目录
- 学会了拆分 routers / schemas / services
- 学会了使用 APIRouter
- 写了新的 app/main.py
- 跑通了重构后的 FastAPI 项目
- 在 /docs 中看到了更清晰的分组

## 我现在理解了什么
- 项目不能一直把代码堆在一个文件里
- main.py 应该尽量轻，只负责应用入口和注册路由
- routers 负责接口定义
- services 负责业务逻辑
- schemas 负责数据结构定义
- APIRouter 是做路由拆分的关键工具

## 我还不熟的点
- 
- 
- 

## 今天最容易混淆的地方
- router 和 app 的区别
- include_router 的作用
- 哪些逻辑该放到 services，哪些该放到 routers

## 明天准备做什么
- 学配置管理和环境变量
- 让项目更接近真实可运行服务
- 为接入真实 LLM API 做准备
