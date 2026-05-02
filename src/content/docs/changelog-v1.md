---
title: v1.0.0 更新日志
description: 导航站首个正式版本发布，包含基础导航与文档功能
date: 2026-05-01
category: changelog
level: major
---

## v1.0.0 (2026-05-01)

### ✨ 新功能

- **首页导航** — 展示所有子站点卡片，支持一键跳转
- **文档系统** — 基于 Markdown 的内容发布能力，支持分类筛选
- **响应式设计** — 适配桌面端与移动端
- **工具聚合入口** — 预留工具页面，方便后续扩展

### 🛠 技术栈

- [Astro](https://astro.build/) — 静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) — 原子化 CSS 框架
- [TypeScript](https://www.typescriptlang.org/) — 类型安全

### 📁 项目结构

```
src/
├── content/docs/     # Markdown 文档
├── layouts/          # 布局组件
├── pages/            # 页面路由
└── styles/           # 全局样式
```
