# ✨ MockScreen ✨

**一个灵活、强大的浏览器端截图生成器。**

[![部署平台](https://img.shields.io/badge/deployment-github.io-blue?logo=github)](https://zhaochengw.github.io/MockScreen/)
[![许可证: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub 语言数量](https://img.shields.io/github/languages/count/YANXIAOXIH/MockScreen)](https://github.com/YANXIAOXIH/MockScreen)

---

`MockScreen` 是一个零依赖、纯前端实现的在线工具，旨在帮助用户轻松创建高度可定制、外观逼真的各类应用截图。无论是支付宝的支付成功页面，还是复杂的账单详情，您都可以通过简单的参数设置，实时预览并生成高质量的PNG图片。

## 🔗 在线体验 (Live Demo)

您可以随时通过以下链接访问 `MockScreen` 的最新版本：

**[https://zhaochengw.github.io/MockScreen/](https://zhaochengw.github.io/MockScreen/)**

## 🚀 主要功能

*   **🎨 高度可定制**: 几乎所有可见元素（时间、电量、金额、商户名、图标等）均可修改。
*   **📱 机型选择**: 内置 58 款主流机型，覆盖 iPhone 17 / 16 / 15 / 14 / 13 / 12 / 11 / X / SE 系列，以及小米、华为、荣耀、三星、OPPO、vivo、一加、Google 等安卓机型。切换机型会同步调整画布分辨率与状态栏。
*   **🎛️ 丰富状态栏**: 支持灵动岛、刘海屏、经典 iOS、居中胶囊挖孔、居中挖孔、左上挖孔、水滴屏、经典安卓、极简、隐藏等样式，并可单独覆盖配色、充电状态与电量百分比。
*   **🔣 双图标体系**: PNG 图标与矢量状态栏图标（信号、Wi-Fi、5G/LTE/4G/3G、飞行模式、投屏、VPN、同步、闹钟、计时器、定位、耳机、勿扰、旋转锁定、蓝牙、AirPlay、麦克风、热点、NFC、振动、铃声、静音、音乐、屏幕录制、语音留言、手电筒等）共同组成图标库，支持拖拽排序、点击移出和自定义上传。
*   **📌 分栏工作台**：宽屏下左栏固定模板、机型和顶部状态栏，图标库按需展开；中栏从商户、金额等页面内容开始，随机按钮就在页面内容标题旁；右栏固定预览和下载按钮。中等宽度使用双栏，手机使用单栏。
*   **🧩 七个支付模板**：微信支付成功、夜间支付成功及账单详情；支付宝支付成功及账单详情；云闪付支付成功及账单详情。
*   **⚡️ 实时预览**: 所有参数修改都会即时反映在右侧的预览画布上，所见即所得。
*   **🖼️ 高清图片导出**: 一键下载当前预览为高质量、无损的 PNG 图片。
*   **📦 模块化架构**: 项目采用高度模块化的文件结构，添加一个全新的模板就像增加一个“插件”一样简单。
*   **💡 动态布局**: 支持根据用户操作动态调整布局，例如“支付有礼”模块的顺序会根据勾选先后动态排列。
*   **🌐 纯前端实现**: 无需后端服务，所有操作均在浏览器端完成，快速、安全且易于部署。

## 🔧 技术栈

*   **HTML5**
*   **CSS3**：使用 CSS Grid、Flexbox 和吸顶定位实现响应式布局。
*   **JavaScript (ES6+)**:
    *   原生JS，无任何外部框架依赖。
    *   使用 **ES Modules** 实现代码的模块化和解耦。
    *   通过 **Canvas API** 进行所有图形的绘制和合成。

## 📁 项目结构

项目采用了清晰的“关注点分离”结构，每个模板都是一个独立的包。

```
.
├── .github/workflows/pages.yml  # GitHub Pages 发布流程
├── css/style.css                # 全局样式和分栏布局
├── fonts/                       # 本地字体
├── icons/                       # 公共素材及国内应用图标
├── js/
│   ├── main.js                  # 模板加载、控件分栏、Canvas 调度及导出
│   ├── devices.js               # 机型、分辨率和状态栏高度
│   ├── statusbar*.js            # 状态栏渲染、控件、兼容性和随机预设
│   ├── status-icons*.js         # 矢量图标定义和注册
│   ├── icon-library.js          # 图片图标库
│   ├── domestic-apps.js         # 国内应用图标清单
│   ├── merchant-icons.js        # 店铺头像与商户预设
│   ├── bank-picker.js           # 银行及卡种选择
│   ├── payment-random.js        # 页面内容随机设置
│   ├── serial.js                # 账单测试单号生成
│   ├── unionpay-template.js     # 云闪付成功页和详情页的共享逻辑
│   └── utils.js                 # 通用绘图工具
├── templates/                   # 微信、支付宝、云闪付的七个模板
├── tests/                       # 机型兼容性和站点子路径检查
└── index.html                   # 页面入口
```

## 📱 机型与状态栏说明

*   **图标兼容性**：iOS、Android 和品牌专用图标仅在兼容机型下可见、可添加；通用、第三方应用和自定义图标不受限制。手动覆盖状态栏样式不会改变机型归属。第三方应用位于图标库末尾。
*   **随机设置**：“随机状态栏”只改变时间、电量、充电状态及适配机型的常用图标，并在左侧随机放入 1–2 个不重复的第三方应用图标（刘海样式放 1 个；极简、隐藏不放）。“随机支付页面元素”只改变当前模板适用的示例商户、金额、付款方式和页面选项，不覆盖手填的账单注释。

*   **素材**：补充了店铺头像、VoLTE / VoWiFi 等矢量状态图标，以及抖音、小红书、高德地图、京东、云闪付等 11 个国内应用图标。图标库不再显示 Google 服务和 Chrome。详见[素材说明](icons/domestic/SOURCES.md)。

*   **分辨率**：画布尺寸直接使用所选机型的物理分辨率，例如 iPhone 15 Pro Max 为 1290 × 2796，小米 15 为 1200 × 2670。
*   **状态栏高度**：机型信息栏显示当前预设高度。常见 iPhone 预设为 20–54 pt；安卓的 24–30 dp 是按品牌配置的近似值。
*   **硬件开孔**：状态栏会根据机型自动绘制灵动岛、刘海、胶囊挖孔、单挖孔或水滴屏；也可在“状态栏样式”中手动覆盖。
*   **模板适配**：页面内容从模板设计尺寸映射到所选机型的画布；预览缩放不改变 PNG 的导出尺寸。
*   **图标预设**：切换机型或状态栏样式时，会自动套用对应的 iOS / 安卓状态栏图标组合；点击“恢复机型默认图标”可随时还原。
*   **配色**：状态栏颜色默认跟随模板主题，也可手动指定为深色或浅色；充电状态与电量百分比可单独开关。
*   **单号生成**：微信和支付宝账单详情可在修改支付时间时重新生成可编辑的测试单号；生成规则是本项目预设，不代表平台的固定编号规则。

## 支付模板补充

*   云闪付包含支付成功和交易详情两个模板，详情可切换线上支付、线下消费、电费及水费。布局根据本地参考重绘，包括「在此商户的交易」左侧的双波峰票据图标。不嵌入原图或其中的单号、账号及条码；设置、预览和导出不显示“样张”字样。默认编号仍为 `DEMO-…` 测试值，导出图片不代表真实交易。
*   有付款方式字段的模板可展开“更多银行卡”，从 18 家国内银行中选择信用卡或储蓄卡。账单中的灰色收单机构和注释是输入提示，留空时不绘入预览或 PNG。

## GitHub Pages 部署

1. 在 `MockScreen` 仓库的 **Settings → Pages** 中，将 **Source** 设为 **GitHub Actions**。
2. 将代码推送到 `main`，或在 **Actions → Deploy GitHub Pages** 中手动运行。工作流先运行 `node --test`，随后发布入口与运行所需的静态资源；无需安装依赖或构建前端。
3. 发布成功后，打开 <https://zhaochengw.github.io/MockScreen/>。图片、字体和模板模块使用相对路径，兼容 `/MockScreen/` 项目子路径。


## 🛠️ 本地开发

本项目无需复杂的构建步骤，您可以轻松地在本地运行。

1.  **克隆仓库**
    ```powershell
    git clone 'https://github.com/zhaochengw/MockScreen.git'
    ```

2.  **进入项目目录**
    ```powershell
    Set-Location 'MockScreen'
    ```

3.  **运行项目**
    由于项目使用了 ES Modules (`import`/`export`)，直接用浏览器打开 `index.html` 文件可能会遇到跨域问题。推荐使用一个简单的本地服务器来运行。

    如果您使用 **Visual Studio Code**，可以安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件，然后在 `index.html` 文件上右键，选择 "Open with Live Server"。

     您的浏览器将自动打开 `http://127.0.0.1:5500` (或类似地址)，项目即可正常运行。

     也可以从项目目录运行 `python -m http.server 5173 --bind 127.0.0.1` 后打开 <http://127.0.0.1:5173/>。使用 Node.js 22 或更高版本运行 `node --test` 可检查机型、模板和资源路径。

## 🤝 如何贡献

欢迎为 `MockScreen` 贡献代码！如果您有好的想法或发现了Bug，请随时提交 Issue 或 Pull Request。

1.  **Fork** 本仓库
2.  创建您的新分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送您的分支 (`git push origin feature/AmazingFeature`)
5.  **提交一个 Pull Request**

## 📄 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。详情请见 `LICENSE` 文件。
