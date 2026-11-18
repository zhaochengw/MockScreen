/**
 * @file 微信账单详情页 - 模板模块
 * @description
 * 定义了“微信账单详情页”模板的所有专属配置、UI控件、交互逻辑和 Canvas 绘制方法。
 * [V2] 状态栏系统已升级，采用与 wechat-success 模板相同的全局图标库和三区域拖放排序功能。
 * 之前的 Wi-Fi/5G 互斥逻辑已被移除，现在所有图标均可独立控制。
 * 模板原有的日期单号联动、商户头像选择等功能均已保留。
 */

import { createWechatTransactionId, createWechatMerchantId, toDate } from '../../js/serial.js';
import { MERCHANT_ASSETS, merchantOptionsHTML } from '../../js/merchant-icons.js';

export function initialize(drawCanvas) {
    const container = document.getElementById('template-controls-container');
    if (!container) return;

    // --- 3. [保留] 日期与单号联动功能 ---
    const paymentTimeInput = container.querySelector('[data-id="paymentTime"]');
    const paymentSecondsInput = container.querySelector('[data-id="paymentSeconds"]');
    const transactionIdInput = container.querySelector('[data-id="transactionId"]');
    const merchantIdInput = container.querySelector('[data-id="merchantId"]');
    if (paymentTimeInput && transactionIdInput && merchantIdInput && paymentSecondsInput) {
        const updateDynamicData = () => {
            if (!paymentTimeInput.value) return;
            const date = toDate(paymentTimeInput.value.replace('T', ' '));
            const randomSeconds = Math.floor(Math.random() * 60).toString().padStart(2, '0');
            transactionIdInput.value = createWechatTransactionId();
            merchantIdInput.value = createWechatMerchantId(date);
            paymentSecondsInput.value = randomSeconds;

            transactionIdInput.dispatchEvent(new Event('input'));
            merchantIdInput.dispatchEvent(new Event('input'));
            paymentSecondsInput.dispatchEvent(new Event('input'));
        };

        paymentTimeInput.addEventListener('input', updateDynamicData);
        updateDynamicData();
    }

    // --- 3. [保留] 商户头像选择器功能 ---
    const merchantIconSelector = container.querySelector('.merchant-icon-selector');
    const merchantHiddenInput = container.querySelector('[data-id="merchantIconSelection"]');
    if (merchantIconSelector && merchantHiddenInput) {
        const merchantIconOptions = merchantIconSelector.querySelectorAll('.merchant-icon-option');
        merchantIconOptions.forEach(icon => {
            icon.addEventListener('click', (event) => {
                merchantIconOptions.forEach(opt => opt.classList.remove('selected'));
                const clickedIcon = event.currentTarget;
                clickedIcon.classList.add('selected');
                merchantHiddenInput.value = clickedIcon.dataset.assetKey;
                merchantHiddenInput.dispatchEvent(new Event('input'));
            });
        });
    }
}

/**
 * 导出的模板定义对象。
 */
export const template = {
    // 模板主题，用于主应用加载 'nighi' 风格的通用图标。
    theme: 'night',
    
    // 模板专属资源。移除了所有状态栏图标，因为它们现在由主应用全局管理。
    assets: {
        ...MERCHANT_ASSETS,
        bg: 'templates/wechat-details/icons/background.png',
        // 预设商户头像
        defaultMerchantIcon1: 'icons/merchanticon1.png',
        defaultMerchantIcon2: 'icons/merchanticon2.png',
        defaultMerchantIcon3: 'icons/merchanticon3.png',
        defaultMerchantIcon4: 'icons/merchanticon4.png',
        defaultMerchantIcon5: 'icons/merchanticon5.png',
        // 底部账单服务图片
        billServiceStyle1: 'templates/wechat-details/icons/bill-service-1.png',
        billServiceStyle2: 'templates/wechat-details/icons/bill-service-2.png',
        billServiceStyle3: 'templates/wechat-details/icons/bill-service-3.png',
    },

    // 模板布局与样式配置中心 (保持不变)
    config: {
        canvasWidth: 1290,                  // [全局] 画布的总宽度 (px)
        canvasHeight: 2796,                 // [全局] 画布的总高度 (px)
        
        // --- 核心内容配置 (商户、金额) ---
        mainContent: {
            merchantIconY: 350,
            merchantIconSize: 155,
            merchantNameY: 590,
            merchantNameFont: '48px "AlipayNumber"',
            amountY: 735,
            amountFont: '100px "AlipayNumber"',
        },
        
        // --- 账单详情列表配置 ---
        detailsList: { 
            startY: 1025,                   // [定位] 列表第一行的顶部Y坐标 (用于整体定位)
            leftX: 95,                      // [定位] 左侧标签文本的起始X坐标
            rightX: 356,                    // [定位] 右侧内容文本的起始X坐标
            rowHeight: 87,                  // [布局] 每一行的基础高度 (行间距)
            multiLineSpacing: 55,           // [布局] 多行内容时，第二行相对于第一行的额外垂直间距
            labelFont: '39px "AlipayNumber"',// [字体] 左侧标签的字体样式
            valueFont: '41px "PingFang SC"', // [字体] 右侧内容的字体样式
            labelColor: '#8f8f8f',          // [颜色] 左侧标签的颜色
            valueColor: '#000000',          // [颜色] 右侧主内容的颜色
            subValueColor: '#8f8f8f',       // [颜色] 右侧次要内容(附注)的颜色
        },

        // --- 底部账单服务配置 ---
        billServices: {
            imageY: 2125,                   // [定位] 底部账单服务图片的顶部Y坐标
        },

        // --- 全局颜色配置 ---
        colors: {
            statusBar: '#000000'            // [颜色] 状态栏所有元素的颜色
        }
    },
    
    /**
     * @returns {string} 返回用于生成此模板控制面板的 HTML 字符串。
     */
    getControlsHTML: () => `
        <fieldset data-statusbar-controls>
            <legend>顶部状态栏</legend>
            <div class="input-group"><label>时间</label><input type="time" class="control" data-id="time" value="18:40"></div>
            <div class="input-group">
                <label>电池电量: <span class="control-value" data-id="batteryValue">80</span>%</label>
                <input type="range" class="control" data-id="battery" min="0" max="100" value="80">
            </div>
            <!-- ICON_CONTROLS_PLACEHOLDER -->
        </fieldset>

        <!-- 以下为模板专属控件，保持不变 -->
        <fieldset>
            <legend>核心信息</legend>
            <div class="input-group"><label>商户名称</label><input type="text" class="control" data-id="merchantName" value="简知"></div>
            <div class="input-group"><label>金额</label><input type="text" class="control" data-id="amount" value="4680"></div>
            <div class="input-group">
                <label>商户头像</label>
                <div class="merchant-icon-selector">
                    <img src="icons/merchanticon1.png" class="merchant-icon-option" data-asset-key="defaultMerchantIcon1">
                    <img src="icons/merchanticon2.png" class="merchant-icon-option" data-asset-key="defaultMerchantIcon2">
                    <img src="icons/merchanticon3.png" class="merchant-icon-option selected" data-asset-key="defaultMerchantIcon3">
                    <img src="icons/merchanticon4.png" class="merchant-icon-option" data-asset-key="defaultMerchantIcon4">
                    <img src="icons/merchanticon5.png" class="merchant-icon-option" data-asset-key="defaultMerchantIcon5">
                    ${merchantOptionsHTML()}
                </div>
                <input type="hidden" class="control" data-id="merchantIconSelection" value="defaultMerchantIcon3">
            </div>
            <div class="input-group">
                <label>上传自定义头像</label>
                <div>
                    <input type="file" class="control" data-id="merchantIcon" id="merchantIconUpload" style="display: none;">
                    
                    <label for="merchantIconUpload" class="button-like-label">选择文件</label>
                    
                    <span class="file-name-display" data-id="merchantIconFileName"></span>
                </div>
            </div>
        </fieldset>
        
        <fieldset>
            <legend>账单详情</legend>
            <div class="input-group"><label>当前状态</label><input type="text" class="control" data-id="status" value="支付成功"></div>
            <div class="input-group"><label>支付时间</label><input type="datetime-local" class="control" data-id="paymentTime" value="2025-10-17T21:33"></div>
            <input type="hidden" class="control" data-id="paymentSeconds" value="33">
            <div class="input-group"><label>商品</label><textarea class="control" data-id="product" rows="3">训练营:【升级版】平衡焕能瑜伽营</textarea></div>
            <div class="input-group"><label>商户全称</label><input type="text" class="control" data-id="merchantFullName" value="广州简知信息科技有限公司"></div>
            <div class="input-group"><label>&#x6536;&#x5355;&#x673a;&#x6784;</label><input type="text" class="control" data-id="acquirer" placeholder="&#x8d22;&#x4ed8;&#x901a;&#x652f;&#x4ed8;&#x79d1;&#x6280;&#x6709;&#x9650;&#x516c;&#x53f8;"></div>
            <div class="input-group"><label>&#x6536;&#x5355;&#x673a;&#x6784;&#x6ce8;&#x91ca;</label><input type="text" class="control" data-id="acquirerSub" placeholder="&#x7531;&#x4e2d;&#x56fd;&#x94f6;&#x8054;&#x80a1;&#x4efd;&#x6709;&#x9650;&#x516c;&#x53f8;&#x63d0;&#x4f9b;&#x6536;&#x6b3e;&#x6e05;&#x7b97;&#x670d;&#x52a1;"></div>
            <div class="input-group">
            <label>支付方式</label>
                <input type="text" class="control" data-id="paymentMethod" value="中原银行储蓄卡(9820)">
                    <div class="quick-buttons">
                        <button data-target="paymentMethod" data-value="零钱">零钱</button>
                        <button data-target="paymentMethod" data-value="零钱通">零钱通</button>
                        <button data-target="paymentMethod" data-value="邮储银行储蓄卡(1369)">邮储银行</button>
                        <button data-target="paymentMethod" data-value="中原银行储蓄卡(9820)">中原银行</button>
                        <button data-target="paymentMethod" data-value="招商银行储蓄卡(5812)">招商银行</button>
                        <button data-target="paymentMethod" data-value="光大银行信用卡(6820)">光大银行</button>
                    </div>
                </div>
            <div class="input-group"><label>&#x652f;&#x4ed8;&#x65b9;&#x5f0f;&#x6ce8;&#x91ca;</label><input type="text" class="control" data-id="paymentMethodSub" placeholder="&#x7531;&#x4e2d;&#x56fd;&#x94f6;&#x8054;&#x80a1;&#x4efd;&#x6709;&#x9650;&#x516c;&#x53f8;&#x63d0;&#x4f9b;&#x4ed8;&#x6b3e;&#x6e05;&#x7b97;&#x670d;&#x52a1;"></div>
            <div class="input-group"><label>交易单号 <span class="field-hint-inline">28 位，随支付时间重新生成</span></label><input type="text" class="control" data-id="transactionId" value="4200002882202510172887219911"></div>
            <div class="input-group"><label>商户单号 <span class="field-hint-inline">18 位，日期开头</span></label><input type="text" class="control" data-id="merchantId" value="202510174046600814"></div>
        </fieldset>

        <fieldset>
            <legend>账单服务</legend>
            <div class="radio-group">
                <input type="radio" name="bill-service-choice" class="control" data-id="billServiceSelection" value="style1" checked> <label>样式一</label>
                <input type="radio" name="bill-service-choice" class="control" data-id="billServiceSelection" value="style2"> <label>样式二</label>
                <input type="radio" name="bill-service-choice" class="control" data-id="billServiceSelection" value="style3"> <label>样式三</label>
            </div>
        </fieldset>
    `,

    /**
     * 模板的核心绘制函数。
     */
    draw: (ctx, config, controls, assets) => {
        // 背景与状态栏由主应用按机型统一绘制

        // --- 绘制核心信息 (商户与金额) ---
        const mc = config.mainContent;
        let iconToDraw = controls.merchantIcon || (assets[controls.merchantIconSelection]);
        if (iconToDraw) {
            ctx.save();
            ctx.beginPath();
            const iconX = (config.canvasWidth - mc.merchantIconSize) / 2;
            ctx.arc(iconX + mc.merchantIconSize / 2, mc.merchantIconY + mc.merchantIconSize / 2, mc.merchantIconSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(iconToDraw, iconX, mc.merchantIconY, mc.merchantIconSize, mc.merchantIconSize);
            ctx.restore();
        }
        
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.font = mc.merchantNameFont;
        ctx.fillText(controls.merchantName, config.canvasWidth / 2, mc.merchantNameY);
        
        ctx.font = mc.amountFont;
        ctx.fillText(`-${parseFloat(controls.amount || 0).toFixed(2)}`, config.canvasWidth / 2, mc.amountY);

        // --- [保留] 绘制账单详情列表 ---
        const dl = config.detailsList;
        let currentY = dl.startY;
        
        const drawDetailRow = (label, value, value2 = null) => {
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = dl.labelFont;
            ctx.fillStyle = dl.labelColor;
            ctx.fillText(label, dl.leftX, currentY);
            ctx.font = dl.valueFont;
            ctx.fillStyle = dl.valueColor;
            const valueWidth = config.canvasWidth - dl.rightX - dl.leftX;
            if (value) ctx.fillText(value, dl.rightX, currentY, valueWidth);

            if (value2) {
                ctx.fillStyle = dl.subValueColor;
                ctx.fillText(value2, dl.rightX, currentY + (value ? dl.multiLineSpacing : 0), valueWidth);
                currentY += dl.rowHeight + (value ? dl.multiLineSpacing : 0);
            } else {
                currentY += dl.rowHeight;
            }
        };
        
        let formattedPaymentTime = '';
        if (controls.paymentTime) {
            const date = new Date(controls.paymentTime);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = controls.paymentSeconds || '00';
            formattedPaymentTime = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
        }
        
        drawDetailRow('当前状态', controls.status);
        drawDetailRow('支付时间', formattedPaymentTime);
        drawDetailRow('商品', controls.product);
        drawDetailRow('商户全称', controls.merchantFullName);
        const acquirer = controls.acquirer?.trim();
        const acquirerNote = controls.acquirerSub?.trim();
        if (acquirer || acquirerNote) drawDetailRow('\u6536\u5355\u673a\u6784', acquirer, acquirerNote);
        drawDetailRow('\u652f\u4ed8\u65b9\u5f0f', controls.paymentMethod, controls.paymentMethodSub?.trim());
        drawDetailRow('交易单号', controls.transactionId);
        drawDetailRow('商户单号', controls.merchantId);

        // --- [保留] 绘制底部账单服务 ---
        const bs = config.billServices;
        const selectedServiceKey = 'billService' + controls.billServiceSelection.charAt(0).toUpperCase() + controls.billServiceSelection.slice(1);
        const selectedServiceImage = assets[selectedServiceKey];
        if (selectedServiceImage) {
            const imageX = (config.canvasWidth - selectedServiceImage.width) / 2;
            ctx.drawImage(selectedServiceImage, imageX, bs.imageY);
        }
    }
};
