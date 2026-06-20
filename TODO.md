# Homepage TODO 清单

先跑起来：`cd /cloud/yany/homepage && npx vite`，浏览器打开 localhost:5173

---

## 第一阶段：填内容（HTML）

完成这些就能看到一个完整的个人主页了。

- [ ] **TODO 1** — `index.html` 导航链接
  加两个 `<a>` 标签，指向 blog 和 awards 页面

- [ ] **TODO 2** — `index.html` 大标题
  写一个 `<h1>`，放你的名字或网名

- [ ] **TODO 3** — `index.html` 一句话介绍
  写一个 `<p>`，比如 "A student who loves ..."

- [ ] **TODO 4** — `index.html` About 段落
  写 1-2 个 `<p>`，介绍你的背景和兴趣

- [ ] **TODO 5** — `index.html` 页脚
  把 "Your Name" 改成你自己的名字

- [ ] **TODO 6** — `blog.html` 加一张文章卡片
  照着已有的示例卡片，复制粘贴后改标题、日期、摘要

- [ ] **TODO 7** — `awards.html` 加奖项
  照着示例加 1-2 个 award-item

- [ ] **TODO 8** — `posts/hello-world.html` 写博客
  用 `<p>` 写几段内容，想加小标题用 `<h2>`

---

## 第二阶段：改样式（CSS）

每个 TODO 只需要改 `css/style.css` 里的一行或几行，保存后浏览器自动刷新看效果。

- [ ] **TODO 9** — 换强调色
  找到 `--color-accent`，换个颜色值（如 `#e63946` 红、`#06d6a0` 绿、`#8338ec` 紫）

- [ ] **TODO 10** — 链接 hover 效果
  在 `a:hover {}` 里加 `text-decoration: underline;` 或 `opacity: 0.8;`

- [ ] **TODO 11** — 调整标题大小
  改 `.hero h1` 的 `font-size`，试试 `3rem`、`2rem`

- [ ] **TODO 12** — 调整 section 间距
  改 `.section` 的 `margin-top`，试试 `3rem`、`4rem`

- [ ] **TODO 13** — 给年份加装饰
  取消 `.award-year` 里的注释，看到背景色 + 圆角效果

- [ ] **TODO 14** — 手机端导航适配
  在 `@media` 里给 `.nav-inner` 加 `flex-direction: column;`

---

## 第三阶段：部署

- [ ] 在 GitHub 创建仓库（比如 `username.github.io`）
- [ ] `git init && git add . && git commit -m "init"`
- [ ] `git remote add origin <你的仓库地址>`
- [ ] `git push -u origin main`
- [ ] 在仓库 Settings → Pages 里选 "GitHub Actions" 作为 source
- [ ] 等 Action 跑完，访问 `https://username.github.io`

---

## 速查

| 想做的事 | 命令 |
|---------|------|
| 启动开发服务器 | `npx vite` |
| 构建生产版本 | `npx vite build` |
| 预览构建结果 | `npx vite preview` |

颜色选取工具：浏览器搜索 "color picker"，选好后复制 HEX 值（如 #ff6b6b）粘贴到 CSS 里。
