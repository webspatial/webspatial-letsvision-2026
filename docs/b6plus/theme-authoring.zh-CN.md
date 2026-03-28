# b6plus 主题与样式编写笔记

这份文档对应 W3C 官方的 "Writing style sheets for b6+" 页面, 适合在维护任意 `b6plus` 主题样式时速查。

## 1. 主题作者需要知道的前提

`b6plus` 的脚本只负责:

- 给 `body` / slide / 增量元素添加状态 class
- 更新一些 DOM 内容
- 设置若干 CSS 自定义变量
- 自动插入部分 UI

视觉效果主要由 CSS 决定。也就是说:

- 增量元素是隐藏还是变灰, 取决于你的 CSS
- 过渡动画如何播放, 取决于你的 CSS
- 第二屏预览怎么排版, 也取决于你的 CSS

如果示例里涉及颜色, 更推荐理解成“语义化主题 token 的占位写法”, 不要把某个具体项目的配色直接硬编码回文档。

## 2. 固定 slide 尺寸

官方样式编写文档默认你会给 slide 一个固定尺寸。常见做法:

```css
body.full .slide {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
```

如果你想做一个明确比例的演示平面, `textfit` 等能力会更可靠。

## 3. 增量元素的状态模型

作者标记增量元素时通常会用:

```html
<li class="next">...</li>
```

演示时脚本会切换:

- `next`
- `active`
- `visited`

最基础的隐藏规则可以写成:

```css
body.full .next:not(.visited):not(.active) {
  visibility: hidden;
}
```

如果用父元素写法:

```html
<ol class="incremental">
  <li>...</li>
  <li>...</li>
</ol>
```

对应 CSS 可以是:

```css
body.full .incremental > *:not(.visited):not(.active) {
  visibility: hidden;
}
```

官方文档也提到 `overlay` 可以作为别名:

```css
body.full .overlay > *:not(.visited):not(.active) {
  visibility: hidden;
}
```

## 4. Dark mode 钩子

如果主题支持脚本级深色切换, 需要显式告诉 `b6plus`:

```css
body {
  --has-darkmode: 1;
}
```

然后再写 dark mode 规则:

```css
body.darkmode {
  color-scheme: dark;
}
```

如果没有 `--has-darkmode: 1`, 官方按钮和 `D` 键不会按预期工作。

## 5. 进度条与页码

`b6plus` 会提供:

- `.slidenum`
- `.numslides`
- `.progress`
- `body` 上的 `--progress`

最简单的进度条样式例子:

```css
body.full .progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 0.5em;
  z-index: 1;
}
```

你也可以完全不依赖元素宽度, 直接使用:

```css
transform: scaleX(var(--progress));
```

## 6. `textfit` 的前提

`textfit` 会在 slide 内容外层包一层 `div` 并缩放字号。因此主题需要避免:

- 依赖 slide 内容必须是直接子节点
- 假设 slide 内没有额外 wrapper

更实际的规则是:

- 尽量让排版选择器聚焦在语义元素上
- 少写 `> :first-child` 这类严格结构选择器

## 7. 目录面板 `C`

按 `C` 后, `b6plus` 会生成一个 `dialog.toc`。主题可以直接重写这个对话框:

```css
.toc {
  width: 95%;
  max-width: none;
  max-height: 95%;
}

.toc ol {
  columns: 18em;
}

.toc [aria-current] {
  font-weight: bold;
}
```

## 8. 画笔层

按 `W` 后会出现 `.b6-canvas` 覆盖层。画笔颜色默认跟随前景色, 也可以指向你主题里的某个语义色:

```css
.b6-canvas {
  color: var(--theme-alert-color, currentColor);
}
```

## 9. 第二屏预览态

当当前窗口作为控制窗口, 且第二屏已打开时, `body` 会带上:

```css
body.has-2nd-window
```

你可以据此强化预览体验, 例如用主题里的焦点色高亮当前页:

```css
body.has-2nd-window .slide.active {
  outline: thin solid var(--theme-focus-color, currentColor);
}
```

也可以把按钮固定在顶部:

```css
body.has-2nd-window .b6-ui {
  position: sticky;
  top: 0.5em;
  z-index: 1;
}
```

## 10. 计时器相关钩子

时间元素类:

- `hours-real`
- `minutes-real`
- `seconds-real`
- `hours-used`
- `minutes-used`
- `seconds-used`
- `hours-remaining`
- `minutes-remaining`
- `seconds-remaining`

控制类:

- `timepause`
- `timedec`
- `timeinc`
- `timereset`

运行时状态:

- `body.paused`
- `body.time-warning`
- `body[data-time-factor]`
- `body` 上的 `--time-factor`

一个很实用的用法是拿 `--time-factor` 做圆环或表盘:

```css
.clock > span,
.fullclock > span {
  display: inline-block;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  background: conic-gradient(
    var(--theme-timer-active, currentColor) calc(var(--time-factor) * 360deg),
    var(--theme-timer-rest, transparent) calc(var(--time-factor) * 360deg),
    var(--theme-timer-rest, transparent) 360deg
  );
}
```

## 11. UI 按钮结构

官方会自动插入一个 `.b6-ui`, 里面的按钮 class 包括:

- `.b6-playbutton`
- `.b6-secondwindowbutton`
- `.b6-prevbutton`
- `.b6-nextbutton`
- `.b6-darkmodebutton`
- `.b6-helpbutton`

因此主题最好至少覆盖:

- 定位
- 间距
- 背景 / 边框
- hover / focus 状态

## 12. Slide 过渡动画的实现思路

`b6plus` 会在 slide 切换时设置:

- 当前页: `.slide.active`
- 已看过页: `.slide.visited`

你可以基于这两个状态写 transition / animation。官方给出的淡入示例:

```css
body.full .slide.visited {
  animation: delay 1s 1;
}

body.full .slide + .active {
  animation: fade-in 1s 1;
}

@keyframes delay {
  from {
    visibility: visible;
  }

  to {
    visibility: visible;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
```

要点:

- 旧页默认会被隐藏
- 如果你想让旧页在动画结束前暂时保留, 需要像上面这样覆写 `visibility`

## 13. 嵌入模式

当 slide 被放进 `iframe` / `embed` / `object` 时:

- `b6plus` 会给 `body` 加 `framed`
- 并把 slide 里的链接改成 `target="_parent"`

这对主题意味着可以专门写嵌入态样式:

```css
body.full {
  background: var(--theme-canvas, black);
}

body.full .slide {
  border-radius: 0.5em;
}

body.framed {
  background: transparent;
}
```

## 14. 区分 `b6plus`

脚本一加载就会给 `body` 加上:

```css
body.b6plus
```

如果一个主题要同时兼容别的 slide 框架, 这是最直接的命名空间入口。示例里也尽量使用语义变量, 避免把具体配色写死:

```css
body.b6plus h1 {
  color: var(--theme-title-color, currentColor);
}
```

## 15. 主题元数据 JSON

官方还提到, 如果你要让 Markdown 编辑器或专用编辑器识别你的主题能力, 可以为 CSS 配一个 JSON-LD 元数据文件, 描述:

- `documentation`
- `supports-clear`
- `layouts`
- `transitions`

这对大多数本地主题不是必需项, 但如果后面把主题独立发布, 这部分值得补。

## 16. 对维护者的直接建议

如果你只是维护一个现有主题文件, 最值得优先看的是:

1. `body.darkmode`
2. `body.full .slide`
3. `.slide.active` / `.slide.visited`
4. `.next` / `.next.active` / `.next.visited`
5. `.b6-ui`
6. `.toc`
7. `.b6-canvas`
8. `--progress`
9. `--time-factor`

## 17. 官方来源

- Style sheet guide:
  <https://www.w3.org/Talks/Tools/b6plus/writing-style-sheets.html>
- User manual:
  <https://www.w3.org/Talks/Tools/b6plus/>
