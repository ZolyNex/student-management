

# 学生管理系统(未完成...)

## 项目概述

这是一个Vite+React+Js的学生管理系统，主要用于管理学生信息、成绩等数据。
==**未完成登录表单校验、数据同步等功能**==

## 技术栈

### 核心框架

- **React**: 使用最新的 React 19 版本构建用户界面
- **React Router**: 使用 React Router v7 进行路由管理，实现页面导航
- **Supabase**: 作为后端服务，提供：
    - 用户认证（登录、注册、登出）
    - 数据存储（学生信息、成绩管理）
    - 文件存储（头像上传）
- **Jotai**: 轻量级状态管理库，用于管理全局状态

### 主要功能

1. 用户系统
    - 用户注册和登录
    - 支持教师和学生两种角色
    - 个人信息管理（包括头像上传）

2. 学生管理
    - 学生信息的增删改查
    - 学生成绩记录

3. 成绩管理
    - 成绩录入和修改
    - 成绩查询
    - 学期成绩统计

### 技术特点

1. **状态管理**

    - 使用 Jotai 进行状态管理，例如用户角色状态：

2. **数据持久化**

    - 使用 Supabase 实现数据的持久化存储
    - 支持实时数据更新

    

3. **路由管理**

    - 使用 React Router 实现页面导航
    - 支持路由保护和权限控制
    - 路由守卫

4. **文件存储**

    - 集成 Supabase Storage 实现文件上传功能
    - 支持头像等图片资源的管理

## 项目结构

- `src/features/`: 功能模块
- `src/services/`: API 服务层
- `src/utils/`: 工具函数
- `src/atoms/`: Jotai 状态定义
- `src/ui/`: 通用UI组件

## 开发环境

- 使用 Vite 作为构建工具
- 集成 ESLint 进行代码规范检查
- 使用 TailwindCSS 和 DaisyUI 构建用户界面
