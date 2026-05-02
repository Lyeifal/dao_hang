# 导航站

个人站点群的入口中心，静态导航页。聚合子站点导航、网站公告与更新日志发布能力。
主要使用Kimi构建，图片素材来源于网络，侵删。

## 技术栈

- [Astro](https://astro.build/) v6 — 静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) v4 — 原子化 CSS 框架
- TypeScript

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建（输出到 dist/）
npm run build

# 本地预览构建结果
npm run preview
```

## 发布公告 / 更新日志

### 方式一：草稿箱发布（推荐）

把写好的 Markdown 文件放进 `drafts/` 目录，运行命令即可自动发布：

```bash
npm run publish
```

脚本会扫描 `drafts/` 下的所有 `.md` 文件，自动补齐 frontmatter、生成文件名、移动到 `src/content/docs/`，然后询问是否立即构建。

**草稿文件格式示例：**

```markdown
# 五一维护通知

站点将于 5 月 1 日凌晨 02:00 - 04:00 进行例行维护。
```

只需写 `# 标题` 和正文，脚本会自动提取标题、填充日期和分类。

如需自定义 frontmatter，可在文件顶部手写：

```markdown
---
title: 自定义标题
date: 2026-05-10
category: changelog
---

正文...
```

`category` 可选值：
- `announcement` — 通知公告（默认）
- `changelog` — 更新日志
- `guide` — 使用指南

`level` 可选值（仅 `category: changelog` 时生效）：
- `minor` — 小更新，仅显示在 `/changelog` 时间轴右侧，首页不展示
- `major` — 大版本更新，显示在 `/changelog` 时间轴左侧，首页时间轴也会展示
- `event` — 活动更新，显示在 `/changelog` 时间轴左侧，首页不展示

### 方式二：交互式创建空白模板

```bash
npm run new
```

按提示选择类型、输入标题，即可在 `src/content/docs/` 下生成带 frontmatter 的空白文件，然后直接编辑内容。

## 项目结构

```
├── drafts/              # 草稿箱（放置待发布的 Markdown 文件）
├── scripts/             # 辅助脚本
│   ├── new-post.js      # npm run new — 交互式创建空白模板
│   └── publish.js       # npm run publish — 草稿箱一键发布
├── public/              # 静态资源（直接复制到 dist/）
│   └── images/          # 图片资源：backgrounds/ logo/ illustrations/ avatars/
├── src/
│   ├── content/docs/    # Markdown 公告/更新日志源文件
│   ├── layouts/         # 页面布局
│   ├── pages/           # 页面路由
│   └── styles/          # 全局样式
└── dist/                # 构建输出（部署此目录）
```

## 页面说明

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 子站点导航（含聚合工具）+ 最新 2 篇公告 + 第三方站点导航 + 大版本更新日志竖向时间轴 |
| 公告中心 | `/docs` | 通知公告 与 更新日志 分区展示 |
| 更新日志专页 | `/changelog` | 竖向时间轴，大版本/活动更新在左，小更新在右 |
| 公告详情 | `/docs/:slug` | Markdown 渲染的详情页 |
| 工具聚合 | `/tools` | 预留页面，当前未在导航展示 |

## 部署

执行 `npm run build` 后，`dist/` 目录即为纯静态 HTML，可直接部署到：

- Vercel
- Cloudflare Pages
- GitHub Pages
- Nginx / 任意静态托管
