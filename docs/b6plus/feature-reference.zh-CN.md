# b6plus 完整功能速查

这份文档按"写作能力 / 演示能力 / URL 参数 / CSS 钩子"来整理 `b6plus` 官方提供的主要能力, 便于在仓库里直接搜索。

## 1. 写作与结构能力

### 1.1 Slide 基本结构

| 名称 | 写法 | 作用 |
| --- | --- | --- |
| 普通 slide | `section.slide` | 标准单页 |
| 旧式 slide 语法 | `body` 下每个 `h1` 开新页 | 兼容旧写法 |
| page-break 语法 | 起始元素带 `page-break-before: always` | 另一种分隔 slide 的方式 |
| 备注 | `section.comment` | 索引视图和第二屏可见, 演示模式默认隐藏 |

### 1.2 Slide / 元素 class

| Class / 属性 | 级别 | 作用 |
| --- | --- | --- |
| `slide` | slide | 定义一页 slide |
| `clear` | slide | 不显示页码等装饰 |
| `cover` | slide | 封面页 / 分隔页 |
| `side` | slide | 左右配图布局 |
| `right` / `r` | slide | 配合 `side` 把配图放右边 |
| `side` | element | 在 `side` slide 中指定那个侧栏元素 |
| `autosize` | image | 需要时自动缩小图片 |
| `next` | element | 增量出现 |
| `incremental` | parent | 子元素逐个出现 |
| `overlay` | parent | 官方样式编写文档里给出的 `incremental` 别名 |
| `columns` | parent | 子元素交替进入两列 |
| `note` | element | 小字说明 |
| `textfit` | slide / body | 自动缩小文字以适应页面 |
| `numbered` | `pre` | 自动行号 |
| `place` | element | 九宫格定位 |
| `top` / `t` | element | 与 `place` 配合, 顶部 |
| `right` / `r` | element | 与 `place` 配合, 右侧 |
| `bottom` / `b` | element | 与 `place` 配合, 底部 |
| `left` / `l` | element | 与 `place` 配合, 左侧 |
| `cover` | `img` | 背景图铺满并裁切 |
| `fit` | `img` | 背景图完整显示, 允许留白 |
| `darkmode` | slide / body | 深色模式, 适合深色背景图 |
| `lightmode` | slide / body | 强制浅色文本模式 |

### 1.3 进度、页码、总页数

| 机制 | 写法 | 说明 |
| --- | --- | --- |
| 当前页码 | `span.slidenum` | 运行时动态更新 |
| 总页数 | `span.numslides` | 运行时动态更新 |
| 进度条元素 | `div.progress` | 运行时更新宽度 |
| 进度变量 | `body { --progress: ... }` | `0` 到 `1` |

### 1.4 增量显示行为

默认情况下, `b6plus` 在演示模式里会给增量元素切换这些状态:

| 状态 | 含义 |
| --- | --- |
| `next` | 这是一个增量元素 |
| `active` | 当前这一步正在显示的元素 |
| `visited` | 已经显示过的元素 |

官方还支持 4 种"往回翻"策略, 配在 `body` 上:

| Class | 含义 |
| --- | --- |
| `incremental-symmetric` | 默认行为, 回退时逐个隐藏 |
| `incremental-freeze` | 返回该页后, 已显示元素保持冻结 |
| `incremental-reset` | 每次重新进入该页都从全隐藏开始 |
| `incremental-forwardonly` | 返回或左箭头都会把该页重置到初始状态 |

## 2. 媒体、图片、排版能力

### 2.1 图片与背景

| 能力 | 写法 | 说明 |
| --- | --- | --- |
| 自动缩小内容图 | `img.autosize` | 同页多个 `autosize` 会按相同比例缩小 |
| 背景图裁切铺满 | `img.cover` | 填满文本区, 多余部分裁掉 |
| 背景图完整显示 | `img.fit` | 不裁切, 可能留白 |

### 2.2 视频和音频

| 能力 | 写法 | 说明 |
| --- | --- | --- |
| 进入 slide 后自动播放 | `autoplay` | `b6plus` 改写了标准 HTML 的触发时机, 不在文档加载时播放, 而在该 slide 被打开时播放 |

### 2.3 自动缩字

| 能力 | 写法 | 说明 |
| --- | --- | --- |
| 单页自动缩字 | `section.slide.textfit` | 过长内容时缩小字号 |
| 全局自动缩字 | `body.textfit` | 所有 slide 生效 |

限制:

- slide 需要固定尺寸
- CSS 不能依赖 slide 内容外层是否有 wrapper

## 3. 自动播放与计时

### 3.1 `data-timing`

| 位置 | 作用 |
| --- | --- |
| `body` | 所有未单独覆写的 slide 使用默认时长 |
| `section.slide` | 该 slide 的总时长 |
| 增量元素 | 覆盖该步的单独时长 |

支持格式:

- 纯秒数: `5.5`
- 分:秒: `1:08`
- 时:分:秒: `0:45:50`
- 秒后缀: `20s`
- 分后缀: `2.2m`
- 时后缀: `1.5h`

补充规则:

- `0` 表示不自动切换
- 如果一个 slide 有多个增量元素, 默认会按总时长平均分配到各步
- 若增量元素单独指定 `data-timing`, slide 实际总时长会重新按各步累加

### 3.2 演讲时钟

`b6plus` 官方内建两种时钟:

| Class | 功能 |
| --- | --- |
| `clock` | 简版时钟, 含剩余时间和控制按钮 |
| `fullclock` | 完整时钟, 含实时时间、已用时间、剩余时间和控制按钮 |

`body` 上可配置:

| Class | 含义 |
| --- | --- |
| `duration=45` | 总时长 45 分钟 |
| `warn=5` | 剩余 5 分钟触发 warning |

可用的时间元素 / 控件类:

| Class | 作用 |
| --- | --- |
| `hours-real` / `minutes-real` / `seconds-real` | 当前真实时间 |
| `hours-used` / `minutes-used` / `seconds-used` | 已用时间 |
| `hours-remaining` / `minutes-remaining` / `seconds-remaining` | 剩余时间 |
| `timeinc` | 加 1 分钟 |
| `timedec` | 减 1 分钟 |
| `timepause` | 暂停 / 继续 |
| `timereset` | 重置计时 |

运行时状态:

| Hook | 说明 |
| --- | --- |
| `body.paused` | 时钟暂停 |
| `body.time-warning` | 进入警告区间 |
| `body[style*="--time-factor"]` | 已耗时占比, `0` 到 `1` |
| `body[data-time-factor]` | 已耗时百分比, `00` 到 `100` |

## 4. 演示模式能力

### 4.1 进入和退出

| 操作 | 方式 |
| --- | --- |
| 进入演示模式 | 播放按钮, `A`, 双击 slide, 某些设备三指触摸 |
| 退出演示模式 | `A` 或 `Esc` |

### 4.2 导航

| 操作 | 快捷键 / 行为 |
| --- | --- |
| 下一页 / 下一增量 | 鼠标左键, `Space`, `Right`, `Down`, `PageDown` |
| 上一页 / 上一增量 | `Left`, `Up`, `PageUp` |
| 第一页 | `Home` |
| 最后一页 | `End` |
| 全屏 | `F` 或 `F1` |
| 帮助面板 | `?` |
| 目录面板 | `C` |

### 4.3 第二屏

| 功能 | 方式 |
| --- | --- |
| 打开第二屏 | `2` 或第二窗口按钮 |
| 第一屏用途 | 控制台 / 预览 / 备注 |
| 第二屏用途 | 正式播放 |

相关运行时 class:

| Class | 说明 |
| --- | --- |
| `body.has-2nd-window` | 当前索引窗口已连接第二屏 |

### 4.4 明暗切换

| 功能 | 方式 |
| --- | --- |
| 演示期间切换深浅色 | `D` |

说明:

- 这是通过临时给 `body` 加 / 去掉 `darkmode` 实现的
- 如果系统已经是 dark mode, 官方说明这个键可能没有效果

### 4.5 讲稿阅读与无障碍

| 功能 | 方式 |
| --- | --- |
| 屏幕阅读器朗读当前页 | 演示时自动通过 `aria-live` 区域播报 |
| 读出当前页备注 | `N` |
| 再按一次 `N` | 重新读当前 slide |

`b6plus` 会自动创建:

```html
<section role="region" aria-live="assertive"></section>
```

如果你想自定义结束播报文案, 可以自己提供这个区域。

### 4.6 画笔标注

| 功能 | 快捷键 | 说明 |
| --- | --- | --- |
| 在当前页上画 | `W` | 再按一次清除 |
| 画笔层 class | `.b6-canvas` | 可用 CSS 改颜色 |

### 4.7 自动播放的手动暂停

| 功能 | 快捷键 | 运行时状态 |
| --- | --- | --- |
| 暂停 / 恢复自动播放 | `P` 或 `Pause` | `body.manual` |

## 5. URL 参数

| 参数 | 作用 |
| --- | --- |
| `?full` | 直接进入演示模式 |
| `?full#id` | 演示模式进入指定 slide |
| `?full#25` | 演示模式进入指定序号 slide |
| `?static` | 禁止切换到演示模式, 仅看静态索引 |
| `?full&static` | 在演示模式下静态展示, 常用于嵌入 |
| `?visible-notes` | 默认显示备注 |
| `?visible-notes=off` | 覆盖 `body.visible-notes` |
| `?sync=https://...` | 接入远程 SSE 同步源 |

## 6. 远程同步显示

官方支持把 slide 状态交给远程 SSE 服务控制。

### 6.1 前提

- URL 通过 `?sync=` 指向 SSE 服务
- 若 URL 里还有 `&`, 需要转义成 `%26`

### 6.2 支持的远程指令

| 指令 | 含义 |
| --- | --- |
| `+` | 下一增量或下一页 |
| `++` | 直接下一页 |
| `-` / `--` | 上一页 |
| `^` | 第一页 |
| `$` | 最后一页 |
| `0` | 退出到索引模式 |
| `:dark-on` | 开启 dark mode |
| `:dark-off` | 关闭 dark mode |
| `slide id` / `slide number` | 跳到指定页 |

本地用户可以用 `S` 断开或重连同步。

## 7. 过渡动画

官方手册列出的内建过渡 class 如下:

| Class | 效果 |
| --- | --- |
| `fade-in` | 新页淡入 |
| `slide-in` | 新页从左进入, 旧页向左退 |
| `slide-out` | 当前页向左滑出, 露出新页 |
| `move-left` | 新页从右入, 旧页向左出 |
| `move-up` | 旧页上移, 新页自下进入 |
| `flip-up` | 3D 竖向翻转 |
| `flip-left` | 3D 横向翻转 |
| `center-out` | 中心圆形扩展切换 |
| `wipe-left` | 新页从右覆盖旧页 |
| `zigzag-left` | 右向左锯齿切换 |
| `zigzag-right` | 左向右锯齿切换 |
| `cut-in` | 新页从左上切入 |

使用方式:

- 全局设置在 `body` 上
- 局部设置在某个 slide 上, 表示该 slide 离开时使用的过渡

## 8. 嵌入、循环、鼠标行为

| 能力 | 写法 | 说明 |
| --- | --- | --- |
| 隐藏鼠标 | `body.hidemouse` | 5 秒不动后隐藏 |
| 自定义隐藏延迟 | `body.hidemouse=1.5` | 单位秒 |
| 禁用点击翻页 | `body.noclick` | 点 slide 不前进 |
| 循环播放 | `body.loop` | 最后一页后回到第一页 |
| 默认显示备注 | `body.visible-notes` | 初始展开评论区 |

## 9. 运行时 DOM / CSS 钩子

如果你要改主题或做高级定制, 这些钩子最重要:

| Hook | 来源 | 作用 |
| --- | --- | --- |
| `body.full` | `b6plus` | 演示模式 |
| `body.b6plus` | `b6plus` | 标记当前框架是 `b6plus` |
| `body.darkmode` | `b6plus` / 用户操作 | 深色模式 |
| `body.framed` | `b6plus` | 说明当前在 `iframe` / `object` / `embed` 内 |
| `body.has-2nd-window` | `b6plus` | 第二屏已打开 |
| `body.manual` | `b6plus` | 自动播放被手动暂停 |
| `body.time-warning` | `b6plus` | 计时进入 warning 区间 |
| `--progress` | `b6plus` | 演示进度 |
| `--time-factor` | `b6plus` | 已耗时比例 |
| `.slide.active` | `b6plus` | 当前 slide |
| `.slide.visited` | `b6plus` | 已访问过的 slide |
| `.next.active` | `b6plus` | 当前增量项 |
| `.next.visited` | `b6plus` | 已显示过的增量项 |
| `.b6-ui` | `b6plus` | 官方自动插入的控制按钮容器 |
| `.toc` | `b6plus` | `C` 打开的目录对话框 |
| `.b6-canvas` | `b6plus` | `W` 打开的画笔层 |

## 10. 自动插入的 UI 按钮

官方会在索引页自动插入一个 `.b6-ui` 容器, 里面可能包含:

| Class | 按钮作用 |
| --- | --- |
| `b6-playbutton` | 播放 / 停止 |
| `b6-secondwindowbutton` | 第二屏 |
| `b6-prevbutton` | 上一页 |
| `b6-nextbutton` | 下一页 |
| `b6-darkmodebutton` | 切换深浅色 |
| `b6-helpbutton` | 帮助 |

如果主题支持 dark mode, 记得在 CSS 里声明:

```css
body {
  --has-darkmode: 1;
}
```

## 11. 适合这个仓库的最小必记集合

如果你不想记完整手册, 先记这 12 个:

- `slide`
- `comment`
- `cover`
- `clear`
- `next`
- `incremental`
- `columns`
- `progress`
- `textfit`
- `darkmode`
- `?full`
- `2`

## 12. 官方来源

- User manual: <https://www.w3.org/Talks/Tools/b6plus/>
- Writing style sheets: <https://www.w3.org/Talks/Tools/b6plus/writing-style-sheets.html>
