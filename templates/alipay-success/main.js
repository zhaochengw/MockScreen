/**
 * @file 支付宝支付成功页 - 模板模块 (已升级)
 * @description
 * 定义了“支付宝支付成功页”模板的所有专属配置、UI控件、交互逻辑和 Canvas 绘制方法。
 * [V2] 状态栏系统已升级，采用全局图标库和三区域拖放排序功能。
 * 模板原有的“支付有礼”动态勾选排序功能已完整保留。
 */

// [保留] 存储用户选择奖励的顺序
let rewardSelectionOrder = [];

/**
 * 模板专属的初始化函数。
 * @param {function} drawCanvas - 对主绘图函数的回调引用，用于在交互后触发画布重绘。
 */
export function initialize(drawCanvas) {
    const container = document.getElementById('template-controls-container');
    if (!container) return;

    // --- 2. [保留] “支付有礼”勾选逻辑 ---
    // 清空上一次的顺序记录，以防模板切换后状态混乱
    rewardSelectionOrder = [];
    const rewardCheckboxes = container.querySelectorAll('.reward-checkbox');
    rewardCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const rewardId = checkbox.dataset.rewardId;
            if (!rewardSelectionOrder.includes(rewardId)) {
                rewardSelectionOrder.push(rewardId);
            }
        }
    });
    rewardCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const rewardId = event.target.dataset.rewardId;
            const isChecked = event.target.checked;
            if (isChecked) {
                if (!rewardSelectionOrder.includes(rewardId)) {
                    rewardSelectionOrder.push(rewardId);
                }
            } else {
                rewardSelectionOrder = rewardSelectionOrder.filter(id => id !== rewardId);
            }
            drawCanvas(); // 状态更新后，立即重绘
        });
    });
}

/**
 * 导出的模板定义对象。
 */
export const template = {
    // [升级] 模板主题，用于主应用加载 'day' 风格的通用图标。
    theme: 'day',
    
    // [升级] 模板专属资源。移除了所有状态栏图标。
    assets: {
        bg: 'templates/alipay-success/icons/background.png',
        reward1: 'templates/alipay-success/icons/reward-1.png',
        reward2: 'templates/alipay-success/icons/reward-2.png',
        reward3: 'templates/alipay-success/icons/reward-3.png',
        reward4: 'templates/alipay-success/icons/reward-4.png',
        reward5: 'templates/alipay-success/icons/reward-5.png',
        reward6: 'templates/alipay-success/icons/reward-6.png',
        reward7: 'templates/alipay-success/icons/reward-7.png',
        reward8: 'templates/alipay-success/icons/reward-8.png',
        reward9: 'templates/alipay-success/icons/reward-9.png',
        currency: 'templates/alipay-success/icons/currency.png',
    },

    // 模板布局与样式配置中心
    config: {
        canvasWidth: 1170,                  // [画布] 画布的总宽度 (px)
        canvasHeight: 2532,                 // [画布] 画布的总高度 (px)

        // --- 核心支付信息 ---
        paymentInfo: { 
            amountY: 505,                   // [核心内容] 金额数字文本的基线Y坐标
            amountFont: ' 145px "AlipayNumber"',// [核心内容] 金额数字的字体样式
            currencySize: 90,               // [核心内容] 人民币图标的边长
            currencyGap: 10,                // [核心内容] 人民币图标与金额数字之间的空隙

            detailsAnchorY: 740,            // [详情] 作为定位基准的“交易方式”行的Y坐标
            detailsRowHeight: 75,           // [详情] 每一行的高度
            detailsLeftX: 70,               // [详情] 左侧文本的X坐标
            detailsRightX: 1095,            // [详情] 右侧文本的X坐标 (用于右对齐)
            payeeFont: '42px "PingFang"',   // [详情] 收款方行的字体
            detailsFont: '42px "PingFang"'  // [详情] 其他行的字体
        },

        // --- 底部奖励模块 ---
        rewards: { 
            startY: 952,                    // [奖励] 第一个奖励模块的起始Y坐标
            startX: 58,                     // [奖励] 所有奖励模块的统一X坐标
            gap: 66                         // [奖励] 模块之间的垂直间距
        },

        // --- 颜色配置 ---
        colors: { 
            statusBar: '#FFFFFF',           // [颜色] 状态栏所有元素的颜色
            mainText: '#FFFFFF',            // [颜色] 页面主要文本颜色 (金额、收款方等)
            deduction: '#FFFFFF'            // [颜色] “随机立减”行的文本颜色
        }
    },
    
    /**
     * @returns {string} 返回用于生成此模板控制面板的 HTML 字符串。
     */
    getControlsHTML: () => `
        <fieldset data-statusbar-controls>
            <legend>顶部状态栏</legend>
            <div class="input-group"><label>时间</label><input type="time" class="control" data-id="time" value="03:00"></div>
            <div class="input-group">
                <label>电池电量: <span class="control-value" data-id="batteryValue">68</span>%</label>
                <input type="range" class="control" data-id="battery" min="0" max="100" value="68">
            </div>
            <!-- ICON_CONTROLS_PLACEHOLDER -->
        </fieldset>

        <fieldset>
            <legend>支付信息</legend>
            <div class="input-group"><label>收款方</label><input type="text" class="control" data-id="payee" value="简知"></div>
            <div class="input-group"><label>支付金额</label><input type="text" class="control" data-id="amount" value="4680"></div>
            <div class="input-group">
                <label>交易方式</label>
                <input type="text" class="control" data-id="methodInput" value="工商银行储蓄卡(5871)">
                <div class="quick-buttons">
                    <button data-target="methodInput" data-value="余额宝 (转出资金付款)">余额宝</button>
                    <button data-target="methodInput" data-value="余额">余额</button>
                    <button data-target="methodInput" data-value="花呗 (分期6期)">花呗</button>
                    <button data-target="methodInput" data-value="招商银行储蓄卡 (5812)">招商银行</button>
                    <button data-target="methodInput" data-value="光大银行信用卡 (6820)">光大银行</button>
                </div>
            </div>
            <div class="input-group checkbox-group"><input type="checkbox" class="control" data-id="deductionToggle"><label>随机立减</label><input type="text" class="control" data-id="deductionAmount" value="0.08" style="width: 80px;"></div>
        </fieldset>

        <fieldset>
            <legend>支付有礼</legend>
            <div class="horizontal-controls-container">
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward1Toggle" data-reward-id="reward1" checked><label>支付积分</label></div>
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward2Toggle" data-reward-id="reward2" checked><label>蚂蚁庄园</label></div>
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward3Toggle" data-reward-id="reward3" checked><label>绿色能量</label></div>
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward4Toggle" data-reward-id="reward4" checked><label>里程币</label></div>
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward5Toggle" data-reward-id="reward5"><label>水果店</label></div>
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward6Toggle" data-reward-id="reward6"><label>健康能量</label></div>
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward7Toggle" data-reward-id="reward7"><label>绿色能量+71</label></div>
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward8Toggle" data-reward-id="reward8"><label>支付积分+18</label></div>
                <div class="checkbox-group"><input type="checkbox" class="control reward-checkbox" data-id="reward9Toggle" data-reward-id="reward9"><label>蚂蚁庄园+80</label></div>
            </div>
        </fieldset>
    `,

    /**
     * 模板的核心绘制函数。
     */
    draw: (ctx, config, controls, assets) => {
        // 背景与状态栏由主应用按机型统一绘制

        // --- 2. [保留] 绘制核心支付信息 ---
        const pi = config.paymentInfo;
        ctx.fillStyle = config.colors.mainText;
        const originalAmount = parseFloat(controls.amount) || 0;
        const deduction = parseFloat(controls.deductionAmount) || 0;
        let finalAmount = controls.deductionToggle ? (originalAmount - deduction) : originalAmount;

        if (assets.currency) {
            const amountText = finalAmount.toFixed(2);
            ctx.font = pi.amountFont;
            const textWidth = ctx.measureText(amountText).width;
            const totalWidth = pi.currencySize + pi.currencyGap + textWidth;
            const startX = (config.canvasWidth - totalWidth) / 2;
            const IconX = startX;
            const IconY = pi.amountY - pi.currencySize + 15;
            ctx.drawImage(assets.currency, IconX, IconY, pi.currencySize, pi.currencySize);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(amountText, IconX + pi.currencySize + pi.currencyGap, pi.amountY);
        } else {
            ctx.font = pi.amountFont; ctx.textAlign = 'center';
            ctx.fillText(`¥${finalAmount.toFixed(2)}`, config.canvasWidth / 2, pi.amountY);
        }

        const currentRowHeight = controls.deductionToggle ? 65 : pi.detailsRowHeight;
        let payeeY;
        if (controls.deductionToggle) {
            payeeY = pi.detailsAnchorY - currentRowHeight * 2;
            const deductionY = payeeY + currentRowHeight;
            ctx.font = pi.detailsFont; ctx.textAlign = 'left'; ctx.fillText('支付宝随机立减', pi.detailsLeftX, deductionY);
            ctx.fillStyle = config.colors.deduction; ctx.textAlign = 'right'; ctx.fillText(`- ¥ ${deduction.toFixed(2)}`, pi.detailsRightX, deductionY);
        } else {
            payeeY = pi.detailsAnchorY - currentRowHeight;
        }
        
        ctx.font = pi.payeeFont; ctx.fillStyle = config.colors.mainText; ctx.textAlign = 'left'; ctx.fillText(controls.payee, pi.detailsLeftX, payeeY);
        ctx.textAlign = 'right'; ctx.fillText(`¥ ${originalAmount.toFixed(2)}`, pi.detailsRightX, payeeY);
        ctx.font = pi.detailsFont; ctx.fillStyle = config.colors.mainText; ctx.textAlign = 'left';
        ctx.fillText('交易方式', pi.detailsLeftX, pi.detailsAnchorY);
        ctx.textAlign = 'right'; ctx.fillText(controls.methodInput, pi.detailsRightX, pi.detailsAnchorY);
        
        // --- 3. [保留] 绘制底部奖励模块 (数据源: rewardSelectionOrder 数组) ---
        const rw = config.rewards;
        let currentRewardY = rw.startY;
        let currentRewardX = rw.startX;
        rewardSelectionOrder.forEach(rewardId => {
            const asset = assets[rewardId];
            if (asset) {
                ctx.drawImage(asset, currentRewardX, currentRewardY);
                currentRewardY += asset.height + rw.gap;
            }
        });
    }
};
