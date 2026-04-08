# WebSpatial：像 SwiftUI + RealityKit 一样用「HTML/CSS」开发 visionOS 空间应用

封面页除了标题，还需要包含：

- 演讲者：Dexter Yang (杨扬) @ ByteDance，WebSpatial 开源项目创始人
- 场合：Let's Vision 2026
- 地点：上海

不需要其他内容

## Agenda

议程页展示以下内容：

1. Background
2. Make the Web Spatial Too
3. WebSpatial Features
4. WebSpatial Philosophy

## Background

### visionOS 上现有的新 Web 能力

#### 1. Web 统一渲染

这一页的主体内容是 ![](images/01.png)

讲稿备注：

Safari/WebView 里的浏览器引擎跟 visionOS 有深度结合， 网页内容跟 visionOS 里其他原生 2D 内容一样由系统统一渲染

网页从独立渲染的、像素固定的贴图，变成跟现实世界物体一样可以在空间关系和注视行为动态变化的过程中保持清晰

1. 系统统一合成：Web 内容进入 visionOS 的 render server + compositor 显示链路，而不是停留在传统“浏览器内部自给自足”的独立渲染模式里。

2. 自动保证清晰：系统会依据 UI 与用户在空间中的角度和距离关系，根据用户的视野和注视位置，实时动态提升文本与矢量 UI 的可读性与锐度。

#### 2. Web 自然交互

这一页的主体内容是 ![](images/02.png)

讲稿备注：

Safari/WebView 里的网页内容，支持 visionOS 里的 Natural Interaction，包括间接交互（眼手交互）和直接交互（触摸），都等价于触屏设备上的交互，像触屏设备中的网页一样触发 JS 事件、兼容旧网页中基于鼠标事件/css hover。

区别是，visionOS 里的网页也支持眼手交互模式下的 Hover Effect，眼动注视数据是用户隐私，应用和网页都无法获取到，因此无法在用户通过眼动做「选择」的过程中，用网页代码实现自定义的 Hover Effect，没有 Hover state。

网页中的元素会根据规则被提前识别为可交互区域，OS 会负责在可交互区域被眼睛注视的时候显示 Hover Effect。按钮、链接、菜单、表单控件，以及带对应 ARIA role 的元素会自动获得 Hover Effect，自定义元素通常需要 cursor: pointer 才会被识别为可交互区域

#### 3. Model Element

这一页的主体内容是 ![](images/03.png)

讲稿备注：

是 Apple 推动的新 web 标准，在 visionOS safari 里已经有比较完整的支持。

<model> 把 3D 模型变成 Web 的一等媒体元素，像 <img> / <video> 一样，API 沿用 src、<source>、fallback content、poster、autoplay、loop 这套熟悉的 HTML 媒体元素的心智。

在 visionOS 上不只是“投影到网页里平面画布上的贴图”，而是类似在网页里挖了一个洞口，透过洞口可以看到在「里面」立体渲染的 3D 模型，用户视角改变可以看到模型的不同角度。

用户还能把模型从页面里拖出来（相当于用原生的 Model Viewer 查看），在空间中像真实物体一样查看。

支持多个模型文件来源（比如USDZ和 GLTF），模型可以通过 entityTransform API 控制如何在容器中精确放置(朝向、缩放和位移)，支持播放和编程控制模型文件内建的关键帧动画，还可以零代码启用容器自带的原生交互（stagemode）。

#### 4. Fullscreen API + Immersive Media

这一页的主体内容是 ![](images/04.png)

讲稿备注：

Apple 先把 Fullscreen API 用于 panorama 和 spatial photo 的沉浸式查看，之后又扩展到 spatial video、180°、360°、Wide FOV，以及 Apple Immersive Video。

这些媒体通过现有 html 元素嵌入网页，先以内联 2D 内容出现。开发者仍然使用现有的标准 requestFullscreen() API，不需要新的 HTML 元素和 JS API。

#### 5. Spatial Browsing

这一页的主体内容是 ![](images/05.png)

讲稿备注：

visionOS Safari 会自动识别出支持 Reader mode 的文章类网页，浏览器在看这种网页时可以切换成Spatial Browsing 模式，去掉干扰元素、用空间化 UI 显示内容，对于符合条件的图像内容会呈现为 inline spatial scenes。网页还可以在 HTML 中声明 Spatial Backdrop 资源，影响 Spatial Browsing 模式下的环境背景

#### 6. WebXR: Natural Input（transient-pointer）

这一页的主体内容是 ![](images/06.png)

讲稿备注：

把 visionOS 的自然交互带进 WebXR, 开发者处理的是“交互意图和结果”，而不是眼动、手势识别和手部渲染本身。

WebXR 支持的交互方式原本只有控制器模式和 Hand Input 模式（需要开发者自己渲染手部，自己实现具体手势），Apple 在此基础上扩展出了 Natural Input，支持 visionOS 里无控制器的自然交互，包括间接的眼手交互和直接的手部触控，都由系统统一负责渲染手部、实现手势和判断命中，

inputSources 是空的，只有当用户开始手指捏合/触摸时，才会临时生成一个 XRInputSource，交互结束后这个输入源被移除。不是持续暴露的控制器(tracked-pointer)，而是一次一次出现、用完即消失的交互对象(transient-pointer)。开发者只能处理交互结果，接触不到眼动和手部运动的隐私数据

#### Why these new web capabilities are not enough

这一页的主体内容是 ![](images/07.png)

### visionOS + SwiftUI + RealityKit 带来的新范式

这一页的主体内容是 ![](images/08.png)

#### 1. Spatial Runtime (Shared Space / Full Space)

这一页的主体内容是 ![](images/09.png)

讲稿备注：

Spatial Runtime 相当于一个所有空间应用共存的 3D 空间和共用的 3D 渲染引擎，由空间计算操作系统统一负责用底层 3D 图形 API 渲染这个 3D 空间里跨应用的、2D 和 3D 混合的内容，统一负责实现和渲染交互效果，统一负责应用内容跟空间环境的结合。相当于由操作系统来统一负责空间计算，空间应用可以自动获得这些空间计算的效果。

各个空间应用里需要让系统理解自己内部的 3D 内容，能把它们融合到同一个空间中，有一致的光照、遮挡关系等）。也需要让系统理解自己内部可交互的 2D 内容，能为它们渲染交互效果，比如 Hover Effect。

在 Shared Space 下空间应用默认获取不到眼动、手部移动、空间环境信息等隐私数据，需要切换到 Full Space 模式才允许空间应用获得人体和环境的数据实现自定义空间计算逻辑。

#### 2. Spatial Scene

这一页的主体内容是 ![](images/10.png)

讲稿备注：

Spatial Scene 又叫 Spatial Container，是空间计算操作系统中 Spatial Runtime 提供的基础容器，在 Shared Space 里，每个容器（包括 Window 和 Volume）都是空间中一块有边界的局部空间，在 Full Space 里，有一个特殊的容器（称作 ImmersiveSpace 或 Stage）是无边界的，对应整个空间。

空间应用的所有内容必须通过这些空间容器来提供，从而让 Spatial Runtime 可以统一负责实现这些容器跟空间环境的结合，统一负责这些容器之外跨应用的全局交互行为。

空间应用在空间场景容器创建时提供期望的初始化属性，但能否满足由 Spatial Runtime 判断，一旦空间场景容器创建完成，空间应用就无法改变这些容器的状态，它们的状态完全由 Spatial Runtime 和用户的交互决定。

#### 3. Spatialized 2D View

这一页的主体内容是 ![](images/11.png)

讲稿备注：

空间场景容器中的应用内容，沿用 2D GUI 的组件和布局系统，API 和心智模型都保持不变，在此基础上扩展了 Z 轴相关的空间化 API，让 2D View 能成为空间化 UI，可以突破「屏幕」（空间场景容器的背板）的限制，被「抬升」到「屏幕」前方的空间中做 Z 轴方向的布局，也可以在空间中旋转缩放。

多个 2D View 不用再被捆绑在一个有不透明背景和边框的「屏幕」上，可以分散、悬浮在空间中，更灵活充分的利用空间，把整个空间都变成软件界面环境。

#### 4. "2D containing 3D"

这一页的主体内容是 ![](images/12.png)

#### 5. Spatial Gestures

这一页的主体内容是 ![](images/13.png)

讲稿备注：

2D 界面分散、悬浮在空间中，3D 容器里的内容有了真实体积，都导致原有的针对 2D 平面的交互 API 不再够用，为了在整个空间中保持一致的交互体验和保护用户隐私，也不能让应用各自去获取底层眼手数据自行实现空间交互手势。

Spatial Runtime 统一定义和实现了一套空间手势，能跟 3D 空间中的软件 UI 和虚拟物体的不同部位交互，能在空间中任意拖拽，也提供像双手拖拉、旋转等常用的双手自然交互手势。

#### Web is still missing these new paradigms

这一页的主体内容是 ![](images/14.png)

#### Why it matters: spatial computing and multimodal AI need the web

这一页的主体内容是 ![](images/15.png)

讲稿备注：

下一代操作系统相比移动操作系统，更需要基于开放标准的 “免安装应用”。

“免安装应用” 规模巨大，而且难以编目；它们通过链接启动，按需运行，默认是一次性的，并且可以在需要时升级为已安装应用。

为什么：

客户端 AI Agent 正越来越多地自行选择 “工具”。用于 “Tool Use” 的应用类型，往往数量庞大、范围未知，而且使用频率很低。这意味着它们不适合被预装、临时安装，或在使用后继续保留在设备上。

在空间环境中，应用的发现与启动方式也是一样的。就像中国和日本的人们通过扫描二维码来参加活动或下单一样。

桌面时代唯一的 “超级应用” - 浏览器 - 正在回归，但会以新的形式出现：

ChatGPT app -
聊天框正在取代地址栏。
消息流正在取代标签页。

TikTok/Snapchat camera -
XR 透视视图正在取代地址栏。
具有空间布局的窗口容器正在取代标签页。

新一代对 Agent 友好、Tool 优先的 Web 标准正在涌现，比如 MCP App、WebMCP

像 ChatGPT 这样的 Agentic 浏览器正在从文本界面像图形界面发展，已经支持分发和嵌入 包含 MCP-UI 的 MCP App

设想：Spatial + Agentic 的 OS，Home 界面不再是应用图标组成的 App Launcher，而是在空间上下文中分发 Web App 和 MCP App 的 Agent，MCP App 中的 MCP-UI 可以包含空间化 UI 的空间容器

## Make the Web Spatial Too

以下视频和图片，每页一个：
![](assets/media/app2.mp4)
![](assets/media/app1.mp4)
![](assets/media/demo-app1.mp4)
![](assets/media/demo-game1.mp4)
![](assets/media/demo-game2.mp4)
![](images/real-apps.png)

### WebSpatial 是什么

分为两页

第一页的主体内容是 ![](images/16.png)

讲稿备注：

WebSpatial 是一套对 HTML/CSS/DOM API 的最小化扩展，以及 Polyfill 风格的开源 SDK，致力于在 Web 标准和现有主流 Web 框架中引入跟原生空间应用等价的空间化 UI 能力和「2D 包含 3D」范式的开发者体验，让 HTML 内容在空间计算平台上能摆脱屏幕的限制、进入现实空间、获得真实体积、支持空间中的自然交互和灵活的 3D 编程，同时不影响 Web 原有的跨平台能力、思维方式和开发方式，让主流 Web 生态和 Web 开发者能无缝进入空间计算和多模态 AI 的时代。

第二页的主体内容就是第一页的讲稿备注。

## WebSpatial Features

### WebSpatial API

#### 1. 空间场景

这一页的右侧是 ![](images/17.png)

左侧是：

Web App（PWA）的起始网页和每个在新窗口打开的自身网页，都成为了跟空间环境结合的空间场景容器，可以对这些容器的空间属性做不同的初始化设置。

#### 2. 材质化背板

这一页的右侧是 ![](images/18.png)

左侧是：

平面窗口类型的网页，可以把背景面板设置为原生质感的半透明材质，随视角和环境实时动态渲染，也可以把背景面板设置为完全透明、边框不可见，让网页中各个元素看上去分散漂浮在空间中。

#### 3. 体积窗口

这一页的右侧是 ![](images/19.png)

左侧是：

可以把网页窗口在空间中的行为方式，从优先服务于 2D GUI 需求，改成模拟真实世界中的物体，让窗口像「盒子」一样有真实体积和深度。

#### 4. 空间化 HTML 元素

这一页的右侧是 ![](images/20.png)

左侧是：

HTML 元素可以被「抬升」到网页平面前方的 3D 空间中，同时继续参与 CSS 布局系统。这些被空间化的 HTML 元素，一方面在 X 轴和 Y 轴上的原有状态和 API 都保持不变，另一方面能作为悬浮在空间场景中的 2D 面片，通过 CSS 在 Z 轴上布局和定位、在 3D 空间中做旋转等变形转换，可以通过 DOM API 获取相关状态，可以有材质化背板。

#### 5. 3D 容器元素

这一页的右侧是 ![](images/21.png)

左侧是：

新增两种 3D HTML 元素，作为有真实体积的 3D 内容的容器。这些 3D 容器元素仍然作为 2D 面片参与 CSS 布局系统，支持 Z 轴布局和变形，但除此之外还能在 2D 面片前方建立一个基于 3D 开发范式的局部空间，在其中渲染有真实体积的 3D 内容，让它们能融入 2D 布局系统和 2D GUI 框架的渲染机制，实现「2D 包含 3D」的开发范式。

#### 6. 静态 3D 容器元素

这一页的右侧是 ![](images/22.png)

左侧是：

支持用预制好的 3D 模型资产文件来渲染容器中的 3D 内容，这种 3D 容器元素的 API 完全基于 Web 标准中的 model element。

#### 7. 动态 3D 容器元素

这一页的右侧是 ![](images/23.png)

左侧是：

支持用可灵活编程的 HTML 风格 3D 引擎 API 来动态渲染容器中的 3D 内容。

#### 8. HTML 风格的 3D 引擎 API

这一页的主体内容是：

这些 API 包括 3D 资产声明（模型、材质等），以及内置能力模块、开箱即用的 3D 实体（比如预制的几何形状）。可以通过树状结构和 Transform 属性在 3D 坐标系中自由组合这些实体，实现任意 3D 场景和动画效果。

也可以把 2D HTML 内容附着在面片形状的 3D 实体上，让 3D 内容中也可以嵌入全功能的 2D 内容。

#### 9. 空间交互

这一页的主体内容是：

在空间化 2D HTML 元素对应的 2D 面片上，在 3D 容器元素中的 3D 内容上（3D 网格的表面或包围盒），都可以触发新的空间交互事件（比如点击、拖拽、旋转等），获得 3D 坐标系位置等 3D 空间中的交互信息。

#### 10. 2D + 3D 混合内容

这一页的主体内容是：

基于 CSS 布局系统的 2D 内容，和基于 3D 引擎的动态 3D 容器内容，可以通过坐标系转换、单位转换等 API 实现彼此之间的对齐、联动等结合。

### WebSpatial SDK

#### 1. 前瞻性预实现

这一页的主体内容是：

结合原生 Runtime 实现，在 React 项目的 JSX、Ref、CSS 里提前模拟实现拟议标准中的 HTML/DOM/CSS API，让 WebSpatial API 现在就立即可用 ，不用等待各个平台上的浏览器引擎正式支持这些 API。

#### 2. 跨版本兼容

这一页的主体内容是：

屏蔽了 WebSpatial API 进入 Web 标准（HTML/CSS/DOM）过程中的不稳定、变动和平台差异，SDK 提供的 API 始终保持向后兼容，让旧代码一直可运行

#### 3. 跨平台兼容

这一页的主体内容是：

在不支持空间计算和统一渲染的平台上，会自动忽略 WebSpatial API、不加载完整的 SDK 实现，不影响网页在桌面电脑、手机等屏幕设备和普通浏览器里的效果和性能。

#### 4. 自定义跨平台逻辑

这一页的主体内容是：

提供特性检测和 Runtime 检测方法，可以对少数无法自动忽略的 JS API / DOM API 调用做自定义的跨平台处理，也可以在空间计算平台上启用自定义的增强效果和专属功能。

#### 5. 应用打包

这一页的主体内容是：

支持把 PWA 打包成自带 WebSpatial Runtime、无外部依赖的原生应用安装包（比如 visionOS 应用），跟原生应用一样能在模拟器或真机设备上安装和运行调试，能上架到 visionOS App Store 这样的应用商店。

## WebSpatial Philosophy

这一页的右侧是 ![](images/100.png)

左侧是：

1. 让 SDK 能尽可能低成本、以接近「一键安装」的方式整合到现有的标准 Web 项目中，不改变项目原有的开发流程、构建方式和部署方式，确保这个网站在桌面/移动平台和普通浏览器里原有的效果、性能、调试都不受影响。

2. 在 WebSpatial API 和 SDK 的支持下，Web 开发者做一个全新空间应用的方式应该跟开发普通网站一样。只要开发者愿意，这个应用仍然能作为一个标准网站来分发，保持 Web 原有的跨平台能力和基于网址的用法。

## Community

这页的主体内容是三个二维码，从左到右排列，每个二维码下有文字：

![微信群](images/wechat-group.png)

![微信公众号](images/wechat-news.png)

![开源网站](images/website.jpg)
