# b6plus 官方教程整理

本文把 W3C `b6plus` 官方文档里的入门内容重新整理成一份中文 Markdown，适合在本仓库里直接查阅。

## 1. `b6plus` 是什么

`b6plus` 是 W3C 提供的一个轻量级 HTML 幻灯框架。核心思路很简单:

- 幻灯内容就是普通 HTML
- 一个页面里同时包含索引视图和演示视图
- JavaScript 负责切换幻灯、增量显示、第二屏、计时等能力
- CSS 决定视觉样式和大部分动画效果

在这个仓库里，运行时脚本已经 vendored 到本地:

- `assets/b6plus.js`

主题样式在:

- `assets/css/theme.css`

## 2. 在本仓库里怎么启动

本仓库已经用 Bun 提供了本地预览服务:

```bash
bun run dev
```

常用地址:

- `http://localhost:4173/`
- `http://localhost:4173/?full`
- `http://localhost:4173/talks/template/?full`

## 3. 最小可用结构

官方推荐的写法是: 每一页 slide 用一个带 `slide` class 的块级元素包起来, 最常见是 `section.slide`。

一个最小可用骨架如下:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Talk</title>
    <link rel="stylesheet" href="assets/css/theme.css">
    <script src="assets/b6plus.js"></script>
  </head>
  <body>
    <div class="progress"></div>

    <section class="slide cover clear">
      <h1>Talk title</h1>
      <p>Subtitle</p>
    </section>

    <section class="slide">
      <h1>Agenda</h1>
      <ul>
        <li>One</li>
        <li>Two</li>
      </ul>
    </section>

    <section class="comment">
      Speaker notes here.
    </section>
  </body>
</html>
```

如果你在 `talks/template/` 下新建 deck, 相对路径通常要改成指向上层 `assets/`。

## 4. 基本写作模型

### 4.1 幻灯页

最常见写法:

```html
<section class="slide">
  ...
</section>
```

官方也支持两种替代写法:

- 旧式 `h1` 开新页: `body` 下每个 `h1` 开始一个新 slide
- 给起始元素设置 `page-break-before: always`

但在这个仓库里, 继续使用 `section.slide` 最稳定。

### 4.2 讲稿备注

演讲备注或补充说明可以写成:

```html
<section class="comment">
  ...
</section>
```

特点:

- 索引模式可见
- 演示模式默认隐藏
- 第二屏预览模式可见

### 4.3 不显示页码

如果某页不想显示页码, 加 `clear`:

```html
<section class="slide clear">
  ...
</section>
```

### 4.4 封面页 / 分隔页

封面或章节分割页用 `cover`:

```html
<section class="slide cover clear">
  <h1>Part 1</h1>
</section>
```

`cover` 和 `clear` 可以一起用。

## 5. 常用内容布局

### 5.1 左右配图布局

给 slide 加 `side`, 再给其中一个元素也加 `side`:

```html
<section class="slide side">
  <img class="side" src="diagram.png" alt="diagram">
  <h1>Title</h1>
  <p>Text on the right.</p>
</section>
```

默认图片在左侧。若想放右侧, 加 `right` 或缩写 `r`:

```html
<section class="slide side r">
  <img class="side" src="diagram.png" alt="diagram">
  ...
</section>
```

### 5.2 两列布局

```html
<ul class="columns">
  <li>Left column</li>
  <li>Right column</li>
</ul>
```

规则是交替分配:

- 第 1 个子元素进左列
- 第 2 个子元素进右列
- 第 3 个回到左列

### 5.3 3x3 定位布局

`place` 可以把元素定位到 slide 九宫格中的位置:

```html
<div class="place">Center</div>
<div class="place bottom">Bottom center</div>
<div class="place top right">Top right</div>
```

方向类也可以写缩写:

- `t`
- `r`
- `b`
- `l`

### 5.4 小字说明

```html
<p class="note">Less important supporting text.</p>
```

### 5.5 自动缩放图片

如果页内内容过高, 给图片加 `autosize` 可以让 `b6plus` 在需要时统一缩小图片:

```html
<img class="autosize" src="chart.png" alt="chart">
```

### 5.6 自动缩小正文

```html
<section class="slide textfit">
  ...
</section>
```

官方提醒:

- `textfit` 很容易把文字缩得过小
- 只有在 slide 尺寸固定时效果才可靠

## 6. 增量显示

### 6.1 用 `next`

```html
<ul>
  <li>Visible immediately</li>
  <li class="next">Reveal later</li>
  <li class="next">Reveal after that</li>
</ul>
<p class="next">Reveal last</p>
```

### 6.2 用 `incremental`

如果一组子元素都需要逐步出现, 可以把 `incremental` 放在父元素上:

```html
<ol class="incremental">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ol>
```

## 7. 图片覆盖与明暗模式

### 7.1 作为背景图覆盖文本区

铺满并允许裁切:

```html
<img class="cover" src="hero.jpg" alt="">
```

完整显示但可能留白:

```html
<img class="fit" src="hero.jpg" alt="">
```

### 7.2 深色图上用浅色字

```html
<section class="slide darkmode">
  ...
</section>
```

如果全局都想白字黑底, 把 `darkmode` 放到 `body` 上。个别页面要强制回到浅色文本, 给该页加 `lightmode`。

## 8. 行号、页码、进度条

### 8.1 代码行号

```html
<pre class="numbered">
const a = 1;
</pre>
```

官方说明:

- 最多给 20 行编号
- 默认字号下, 一页通常只适合约 13 行代码

### 8.2 当前页码与总页数

动态页码:

```html
<span class="slidenum"></span>
```

总页数:

```html
<span class="numslides"></span>
```

### 8.3 进度条

在 `body` 下放一个空元素:

```html
<div class="progress"></div>
```

然后让 CSS 决定它怎么显示。`b6plus` 还会在 `body` 上设置 `--progress` 变量, 取值范围是 `0` 到 `1`。

## 9. 自动播放与计时

### 9.1 单页定时自动切换

```html
<section class="slide" data-timing="20s">
  ...
</section>
```

支持的时间格式:

- `5.5`
- `1:08`
- `0:45:50`
- `20s`
- `2.2m`
- `1.5h`

`0` 表示不自动切换。

### 9.2 给全局设置默认时间

```html
<body data-timing="19.5s">
```

### 9.3 给增量元素单独覆写时间

```html
<section class="slide" data-timing="8s">
  <ol>
    <li class="next" data-timing="10s">A</li>
    <li class="next" data-timing="15s">B</li>
    <li class="next" data-timing="5s">C</li>
  </ol>
</section>
```

### 9.4 演讲计时器

官方内建两类时钟:

- `clock`
- `fullclock`

示例:

```html
<div class="clock"></div>
```

可以在 `body` 上配:

```html
<body class="duration=45 warn=5">
```

含义:

- `duration=45`: 总时长 45 分钟
- `warn=5`: 剩余 5 分钟时告警

## 10. 演示时怎么操作

### 10.1 进入演示模式

官方支持以下方式:

- 点击播放按钮
- 按 `A`
- 双击 slide
- 某些设备上三指触摸

### 10.2 常用导航键

| 操作 | 官方快捷键 |
| --- | --- |
| 下一页 / 下一增量 | `Space`, `Right`, `Down`, `PageDown` |
| 上一页 / 上一增量 | `Left`, `Up`, `PageUp` |
| 第一页 | `Home` |
| 最后一页 | `End` |
| 全屏切换 | `F` 或 `F1` |
| 帮助 | `?` |
| 退出演示 | `A` 或 `Esc` |
| 目录 | `C` |
| 深浅色切换 | `D` |
| 第二屏 | `2` |
| 读出备注 / 当前页 | `N` |
| 在页上画笔标记 | `W` |
| 自动播放暂停 / 恢复 | `P` 或 `Pause` |
| 同步模式断开 / 重连 | `S` |

### 10.3 第二屏模式

按 `2` 或点击第二屏按钮后:

- 一个窗口负责正式播放
- 原窗口继续停在索引视图
- 原窗口可看当前页、下一页、讲稿备注和计时信息

### 10.4 在 slide 上临时涂画

按 `W` 开启画笔:

- 再按一次 `W` 清除
- 标记不会永久保存
- 同时只保留一页的涂画

## 11. URL 参数

### 11.1 直接以演示模式打开

```text
?full
```

例如:

```text
/index.html?full
```

### 11.2 以演示模式直接打开到某一页

```text
?full#slide-id
?full#25
```

### 11.3 禁用交互, 适合嵌入

```text
?full&static
```

### 11.4 默认显示讲稿备注

```text
?visible-notes
```

关闭 URL 级别的备注显示:

```text
?visible-notes=off
```

### 11.5 远程同步显示

```text
?sync=https://example.org/sse
```

官方要求远端服务器提供 Server-Sent Events。

## 12. 嵌入与循环播放

### 12.1 嵌入单页 slide

官方示例:

```html
<iframe src="Overview.html?full&static#18"></iframe>
```

### 12.2 无尽循环播放

```html
<body class="loop">
```

适合:

- 展台循环播放
- 自带 `data-timing` 的自动轮播

## 13. 这个仓库里最值得直接套用的做法

1. 新建演讲时, 从 `talks/template/index.html` 复制开始
2. 日常写作只用这些核心概念:
   - `slide`
   - `comment`
   - `cover`
   - `clear`
   - `next`
   - `incremental`
   - `columns`
   - `progress`
3. 需要第二屏时再加:
   - `clock` / `fullclock`
   - `duration=...`
   - `warn=...`
4. 需要强视觉页时再使用:
   - `side`
   - `cover` image
   - `darkmode`
   - transition classes

## 14. 官方原始来源

- User manual: <https://www.w3.org/Talks/Tools/b6plus/>
- Intro page: <https://www.w3.org/Talks/Tools/b6plus.html>

建议和 [feature-reference.zh-CN.md](./feature-reference.zh-CN.md) 一起看: 前者偏教程, 后者偏速查。
