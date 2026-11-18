/**
 * @file 微信支付成功页 - nighi - 模板模块
 * @description
 * 定义了“微信支付成功”模板的所有专属配置、UI控件、交互逻辑和 Canvas 绘制方法。
 * 该模块以 ES Module 的形式导出，由主应用 main.js 动态加载。
 */

/**
 * @type {object}
 * @description
 * 导出的模板定义对象。
 * 主应用 `main.js` 会读取这个对象来获取模板的所有配置信息和绘制能力。
 */
export const template = {

    // === 1. 模板主题 ===
    // 用于主应用判断加载白天（'day'）还是黑夜（'nighi'）风格的通用图标。
    theme: 'day',
    
    // === 2. 模板专属资源 ===
    // 定义只有本模板才会用到的图片资源。
    assets: {
        bg: 'templates/wechat-success-night/icons/background.png',
        notificationBanner: 'templates/wechat-success-night/icons/payicon.png',
        helpIcon: 'templates/wechat-success-night/icons/help-flower.png',
        shakeBanner1: 'templates/wechat-success-night/icons/reward-1.png',
        shakeBanner2: 'templates/wechat-success-night/icons/reward-2.png'
    },

    // === 3. 布局与样式配置中心 ===
    // 将所有可调整的“魔法数字”（如坐标、字体、颜色）集中存放，便于维护。
    config: {
        canvasWidth: 1290,                  // 画布的总宽度 (px)
        canvasHeight: 2796,                 // 画布的总高度 (px)
        
        // [顶部通知] 相关配置
        notification: {
            y: 133,                         // [顶部通知] 支付通知横幅图片的顶部Y坐标
            amountX: 389,                   // [顶部通知] 金额文本的起始X坐标
            amountY: 308,                   // [顶部通知] 金额文本的Y坐标
            amountFont: '40px "PingFang"',  // [顶部通知] 金额文本的字体样式
            amountColor: '#9e9e9e'          // [顶部通知] 金额文本的颜色
        },

        // [核心内容] 相关配置
        mainContent: {
            merchantY: 600,                 // [核心内容] 商家名称文本的Y坐标
            merchantFont: '55px "AlipayNumber"',// [核心内容] 商家名称文本的字体样式
            amountY: 705,                   // [核心内容] 支付金额文本的Y坐标
            amountFont: 'bold 140px "AlipayNumber"',// [核心内容] 支付金额数字部分的字体样式
            currencyFont: '100px "AlipayNumber"',// [核心内容] 货币符号(¥)的字体样式
            currencyGap: 5                  // [核心内容] 货币符号与金额数字之间的间隙
        },
        
        // [优惠券] 相关配置
        shakeBanner: {
            y: 965                          // [优惠券] 摇一摇优惠券图片的顶部Y坐标
        },

        // [底部助力] 相关配置
        helpLink: {
            y: 2125,                        // [底部助力] "爱心助力"整行内容的垂直对齐基线Y坐标
            iconSize: 45,                   // [底部助力] 助力图标的尺寸 (宽度和高度)
            iconTextGap: 25,                // [底部助力] 助力图标与右侧文本之间的间隙
            font: '40px "PingFang"',        // [底部助力] 助力文本的字体样式
        },

        // [颜色] 相关配置
        colors: { 
            statusBar: '#FFFFFF',           // [颜色] 状态栏所有元素的颜色
            mainText: '#9E9E9E',            // [颜色] 页面主要文本颜色 (如商家名称)
            amountColor: '#FFFFFF',         // [颜色] 支付金额的颜色
            subText: '#9E9E9E'              // [颜色] 辅助性文本颜色 (如底部助力链接)
        }
    },
    
    /**
     * @returns {string} 返回用于生成此模板控制面板的 HTML 字符串。
     * `<!-- ICON_CONTROLS_PLACEHOLDER -->` 是一个特殊的占位符，
     * 主应用会将其替换为通用的状态栏图标控件。
     */
    getControlsHTML: () => `
        <fieldset data-statusbar-controls>
            <legend>顶部状态栏</legend>
            <div class="input-group"><label>时间</label><input type="time" class="control" data-id="time" value="18:45"></div>
            <div class="input-group">
                <label>电池电量: <span class="control-value" data-id="batteryValue">80</span>%</label>
                <input type="range" class="control" data-id="battery" min="0" max="100" value="80">
            </div>
            <!-- ICON_CONTROLS_PLACEHOLDER -->
        </fieldset>
        
        <fieldset>
            <legend>页面内容</legend>
            <div class="input-group"><label>商家名称</label><input type="text" class="control" data-id="merchantName" value="简知"></div>
            <div class="input-group"><label>支付金额</label><input type="text" class="control" data-id="amount" value="4680"></div>
            <div class="input-group checkbox-group">
                <input type="checkbox" class="control" data-id="notificationToggle"><label>显示顶部支付通知</label>
            </div>
            <div class="input-group">
                <label>摇一摇优惠</label>
                <div class="radio-group" style="display: flex; gap: 15px; align-items: center;">
                    <input type="radio" name="shake-banner" class="control" data-id="shakeBannerSelection" value="shakeBanner1" checked> <label>样式一</label>
                    <input type="radio" name="shake-banner" class="control" data-id="shakeBannerSelection" value="shakeBanner2"> <label>样式二</label>
                    <input type="radio" name="shake-banner" class="control" data-id="shakeBannerSelection" value="none"> <label>不显示</label>
                </div>
            </div>
            <div class="input-group">
                <label>爱心助力</label>
                <input type="text" class="control" data-id="helpLinkText" value="助力乡村儿童营养改善">
                <div class="quick-buttons">
                    <button data-target="helpLinkText" data-value="助力乡村幼童科学养育">幼童科学</button>
                    <button data-target="helpLinkText" data-value="助力乡村儿童营养改善">儿童营养</button>
                    <button data-target="helpLinkText" data-value="关爱亚洲黑熊">亚洲黑熊</button>
                    <button data-target="helpLinkText" data-value="为环卫工人送爱心餐">环卫工人</button>
                </div>
            </div>
        </fieldset>
    `,

    /**
     * 模板的核心绘制函数。
     * 接收 Canvas 上下文、配置、用户输入和已加载的资源，然后将模板内容绘制到画布上。
     * @param {CanvasRenderingContext2D} ctx - 2D 绘图上下文。
     * @param {object} config - 从本模板 config 属性传入的配置对象。
     * @param {object} controls - 从控制面板收集到的用户输入值。
     * @param {object} assets - 包含所有已加载图片资源（Image 对象）的对象。
     */
    draw: (ctx, config, controls, assets) => {
        // --- 绘制顶部微信支付通知 (如果用户勾选) ---
        if (controls.notificationToggle && assets.notificationBanner) {
            const nf = config.notification;
            const banner = assets.notificationBanner;
            const bannerX = (config.canvasWidth - banner.width) / 2;
            ctx.drawImage(banner, bannerX, nf.y);
            
            ctx.fillStyle = nf.amountColor;
            ctx.font = nf.amountFont;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const amountValue = (parseFloat(controls.amount) || 0).toFixed(2);
            ctx.fillText(`${amountValue}`, nf.amountX, nf.amountY);
        }

        // --- 绘制核心支付信息 (商家与金额) ---
        const mc = config.mainContent;
        ctx.fillStyle = config.colors.mainText;
        ctx.font = mc.merchantFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(controls.merchantName, config.canvasWidth / 2, mc.merchantY);

        // --- 绘制支付金额 (¥ 和数字)，并使其整体居中 ---
        ctx.fillStyle = config.colors.amountColor; 
        const amountText = (parseFloat(controls.amount) || 0).toFixed(2);
        const currencySymbol = '¥ ';
        // 1. 分别测量货币符号和金额数字的宽度
        ctx.font = mc.currencyFont;
        const currencyWidth = ctx.measureText(currencySymbol).width;
        ctx.font = mc.amountFont;
        const amountWidth = ctx.measureText(amountText).width;
        // 2. 计算总宽度并确定绘制起点 X
        const totalWidth = currencyWidth + mc.currencyGap + amountWidth;
        const startX = (config.canvasWidth - totalWidth) / 2;
        // 3. 依次绘制
        ctx.textAlign = 'left'; 
        ctx.textBaseline = 'top'; // 使用 'top' 基线便于对齐
        ctx.font = mc.currencyFont;
        ctx.fillText(currencySymbol, startX, mc.amountY);
        ctx.font = mc.amountFont;
        ctx.fillText(amountText, startX + currencyWidth + mc.currencyGap, mc.amountY);

        // --- 绘制可选的优惠券 (根据用户的 radio 选择) ---
        const selectedBannerKey = controls.shakeBannerSelection;
        if (selectedBannerKey && selectedBannerKey !== 'none') {
            const bannerAsset = assets[selectedBannerKey];
            if (bannerAsset) {
                const bannerX = (config.canvasWidth - bannerAsset.width) / 2;
                ctx.drawImage(bannerAsset, bannerX, config.shakeBanner.y);
            }
        }

        // --- 绘制底部助力链接 (如果用户输入了文本) ---
        if (controls.helpLinkText && controls.helpLinkText.trim() !== '') {
            const hl = config.helpLink;
            ctx.font = hl.font;
            const dynamicText = controls.helpLinkText.trim() + ' >';
            const helpTextWidth = ctx.measureText(dynamicText).width;
            const helpTotalWidth = hl.iconSize + hl.iconTextGap + helpTextWidth;
            const helpStartX = (config.canvasWidth - helpTotalWidth) / 2;

            if (assets.helpIcon) {
                ctx.drawImage(assets.helpIcon, helpStartX, hl.y - hl.iconSize/2, hl.iconSize, hl.iconSize);
            }

            ctx.fillStyle = config.colors.subText;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(dynamicText, helpStartX + hl.iconSize + hl.iconTextGap, hl.y);
        }
    }
};
