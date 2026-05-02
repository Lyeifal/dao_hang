---
title: 使用指南
description: 了解如何添加新文档、工具和子站点导航
date: 2026-05-01
category: guide
---

## 添加新文档

所有文档位于 `src/content/docs/` 目录下，使用 Markdown 格式编写。

### Frontmatter 格式

```yaml
---
title: 文档标题
description: 文档简介
date: 2026-05-01
category: announcement  # 可选：announcement | changelog | guide
draft: false            # 设为 true 可隐藏文档
---
```

### 支持的 Markdown 语法

- 标题（H1-H6）
- 列表（有序/无序）
- 代码块与行内代码
- 链接与图片
- 引用块
- 表格

## 添加子站点

编辑 `src/pages/index.astro`，在 `externalSites` 数组中添加新站点：

```astro
{
  title: '新站点',
  url: 'https://example.com',
  description: '站点描述',
  icon: '🚀',
  color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  iconBg: 'bg-purple-100 text-purple-600',
}
```

## 添加工具

工具页面位于 `src/pages/tools/index.astro`，你可以直接在该页面中添加纯前端工具组件。
