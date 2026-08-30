README:[Chinese 中文](https://github.com/turtlelnc/Claude-like-theme-for-ChatGPT/blob/main/README_CH.md)|[English 英语](https://github.com/turtlelnc/Claude-like-theme-for-ChatGPT/blob/main/README.md)

<img width="1457" height="886" alt="image" src="https://github.com/user-attachments/assets/1b2222df-610f-4e3d-8826-186df8a5ea20" />

# 仿 Claude 风格的 ChatGPT 主题

为 ChatGPT 网站打造的、风格温暖且类似 Claude 的视觉主题。

作者推荐ChatGPT网站的外观是深色，会比浅浅色好看。

这是一个非官方的社区项目，与 OpenAI 或 Anthropic 均无关联，也未获得其认可。

## 特性

- 温暖的浅色与深色配色方案
- 衬线字体 UI 搭配等宽字体代码显示
- 温暖色调的侧边栏、输入框、消息气泡、代码块及工具输出区域
- 修正了原版界面中部分纯黑背景及页脚渐变效果
- 完整保留 ChatGPT 原有的布局与交互模式
- 纯 CSS 内容脚本：不包含后台服务、DOM 观察器或远程代码

## 安装

1. 下载或克隆此仓库。
2. 在 Chrome 浏览器中打开 `chrome://extensions`。
3. 启用**开发者模式**。
4. 点击**加载已解压的扩展程序**。
5. 选择包含 `manifest.json` 文件 与 `theme.css` 文件 的仓库文件夹。（关于这两个文件的下载可以在代码页手动操作，也可以跳转到我们的 [Github Release](https://github.com/turtlelnc/Claude-like-theme-for-ChatGPT/releases/tag/0.14.9)
6. 刷新 `chatgpt.com` 页面。

> 为了使您加载更顺畅、更方便，您可以直接下载我们的扩展文件 `ctflc.crx` ，并在启用**开发者模式**后，直接拖入加载。由于我们十分贫穷，并没有任何钱财注册Google应用商店，您首次使用时，可能会警告您 **“不安全”**，请按提示继续添加。如实在无法加载，请您直接选择原来方案，下载`manifest.json` 文件 与 `theme.css` 文件，并把它们放到一个新的干净的文件夹中，给他加载谢谢。

## 当前版本

`0.14.9`

本主题适配当前的 ChatGPT 网页界面。由于 ChatGPT 随时可能更改其 DOM 结构或 CSS 变量，未来的网站更新可能需要调整 CSS 选择器。

## 文件

- `manifest.json` — Chrome Manifest V3 扩展定义文件
- `theme.css` — 主题样式文件

## 许可证

MIT

## 致谢

感谢 ChatGPT 编写代码并查找错误。

