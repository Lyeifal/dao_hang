# 草稿箱

把写好的 Markdown 文件放在这里，然后运行 `npm run publish` 即可发布。

## 文件格式

### 方式一：只写正文（推荐）

直接写 Markdown 内容，脚本会自动提取第一行 `# 标题` 作为公告标题：

```markdown
# 五一维护通知

站点将于 5 月 1 日凌晨 02:00 - 04:00 进行例行维护，期间可能出现短暂访问中断。

感谢理解！
```

发布后自动生成：
- `date`: 当天日期
- `category`: `announcement`（通知公告）

### 方式二：自带 frontmatter

如果需要自定义字段，可以在文件顶部手动写好 frontmatter：

```markdown
---
title: v1.1.0 更新日志
description: 新增暗色模式与搜索功能
date: 2026-05-10
category: changelog
---

## v1.1.0

- 新增暗色模式
- 新增文档搜索
```

`category` 可选值：
- `announcement` — 通知公告（默认）
- `changelog` — 更新日志

## 发布

```bash
npm run publish
```

脚本会自动：
1. 扫描 `drafts/` 下的所有 `.md` 文件
2. 补齐缺失的 frontmatter
3. 生成文件名并移动到 `src/content/docs/`
4. 删除已发布的草稿
5. 询问是否立即构建站点
