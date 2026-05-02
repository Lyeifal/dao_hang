# 图片资源目录

此目录用于存放网站的静态图片资源，所有文件都会直接复制到构建输出（`dist/`）中。

## 目录说明

| 目录 | 用途 | 推荐尺寸 |
|------|------|----------|
| `backgrounds/` | 页面背景图、区域背景图 | 1920×1080 或更大 |
| `logo/` | 网站 logo、favicon | logo: 200×200, favicon: 32×32 / 180×180 |
| `illustrations/` | 首页插图、公告配图、横幅图 | 800×400 ~ 1200×600 |
| `avatars/` | 角色头像、用户默认头像 | 200×200 ~ 400×400 |

## 使用方法

### 背景图（CSS）

在任意页面或组件中使用：

```astro
<div class="bg-[url('/images/backgrounds/your-bg.jpg')] bg-cover bg-center">
  <!-- 内容 -->
</div>
```

或通过全局样式变量（见 `src/styles/global.css`）：

```css
.my-section {
  background-image: var(--bg-image-url);
}
```

### Logo

替换 `public/favicon.svg` 或在 `src/layouts/Layout.astro` 中修改：

```html
<link rel="icon" type="image/png" href="/images/logo/favicon.png" />
```

### 插图

```astro
<img src="/images/illustrations/banner.png" alt="横幅" class="rounded-xl" />
```

## 版权提醒

- 柚子社（YUZU SOFT）角色图片受版权保护
- 建议使用：官方发布的免费壁纸、自己绘制的同人图、或原创角色图
- 若使用版权素材，请确保拥有合法使用权
