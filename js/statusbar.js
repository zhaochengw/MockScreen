/**
 * @file 状态栏渲染器
 * @description
 * 根据机型与状态栏样式计算尺寸，并绘制灵动岛/刘海/挖孔等硬件开孔、
 * 时间、左右图标、电池与充电状态。所有尺寸以机型物理像素为单位，
 * 因此不同分辨率下状态栏的比例保持真实。
 */

import { drawStatusIcon, getStatusIconAspect, isVectorIcon } from './status-icons.js';
import { isAppIcon } from './icon-library.js';

/**
 * 可选状态栏样式。
 * @type {Array<{id: string, name: string}>}
 */
export const STATUS_BAR_STYLES = [
    { id: 'auto', name: '跟随机型' },
    { id: 'dynamic-island', name: '灵动岛 (iPhone 14 Pro 起)' },
    { id: 'notch', name: '刘海屏 (iPhone X - 16e)' },
    { id: 'classic-ios', name: '经典 iOS (iPhone 8 / SE)' },
    { id: 'pill-center', name: '居中胶囊挖孔' },
    { id: 'punch-center', name: '居中挖孔' },
    { id: 'punch-left', name: '左上挖孔' },
    { id: 'waterdrop', name: '水滴屏' },
    { id: 'classic-android', name: '经典安卓' },
    { id: 'minimal', name: '极简 (时间 + 电池)' },
    { id: 'none', name: '隐藏状态栏' }
];

const IOS_STYLES = new Set(['dynamic-island', 'notch', 'classic-ios']);

/**
 * 解析实际使用的状态栏样式。
 * @param {object} device
 * @param {string} styleId
 * @returns {string}
 */
export function resolveStatusBarStyle(device, styleId) {
    return (!styleId || styleId === 'auto') ? device.style : styleId;
}

/**
 * 在 Canvas 上绘制圆角矩形路径。
 */
function roundRect(ctx, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.lineTo(x + width, y + height - r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.lineTo(x + r, y + height);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

/**
 * 计算 iPhone 状态栏尺寸。
 * @param {string} style
 * @param {object} device
 * @returns {object}
 */
function getIosMetrics(style, device) {
    const unit = device.dpr;
    const fallback = style === 'dynamic-island' ? 54 : style === 'classic-ios' ? 20 : 47;
    const barHeight = device.platform === 'ios' && device.barHeight ? device.barHeight : fallback;

    if (style === 'classic-ios') {
        return {
            platform: 'ios',
            height: barHeight * unit,
            centerY: (barHeight / 2) * unit,
            leftInset: 6 * unit,
            rightInset: 6 * unit,
            time: { align: 'center', size: 17 * unit, weight: 600 },
            iconHeight: 11 * unit,
            iconGap: 5 * unit,
            battery: { width: 24 * unit, height: 12 * unit, radius: 3.4 * unit, capWidth: 1.6 * unit },
            cutout: null
        };
    }

    const island = style === 'dynamic-island';
    return {
        platform: 'ios',
        height: barHeight * unit,
        centerY: (island ? barHeight * 0.5426 : barHeight / 2) * unit,
        leftInset: (island ? 31 : 24) * unit,
        rightInset: (island ? 26 : 8) * unit,
        time: { align: 'left', size: 17 * unit, weight: 600 },
        iconHeight: 12 * unit,
        iconGap: (island ? 6 : 4.5) * unit,
        battery: { width: 25 * unit, height: 13 * unit, radius: 4 * unit, capWidth: 1.8 * unit },
        cutout: island
            ? {
                type: 'island',
                x: (device.width - 126 * unit) / 2,
                y: 11 * unit,
                width: 126 * unit,
                height: 37 * unit,
                radius: 18.7 * unit
            }
            : {
                type: 'notch',
                x: (device.width - 209 * unit) / 2,
                y: 0,
                width: 209 * unit,
                height: 30 * unit,
                radius: 20 * unit
            }
    };
}

/**
 * 计算安卓状态栏尺寸。
 * @param {string} style
 * @param {object} device
 * @returns {object}
 */
function getAndroidMetrics(style, device) {
    const unit = device.dpr;
    const centerX = device.width / 2;
    const baseHeight = device.platform === 'android' && device.barHeight ? device.barHeight : 28;
    // 无挖孔的经典安卓与极简样式按原生 24dp 状态栏绘制
    const barHeight = (style === 'classic-android' || style === 'minimal') ? 24 : baseHeight;
    const metrics = {
        platform: 'android',
        height: barHeight * unit,
        centerY: (barHeight / 2) * unit,
        leftInset: 16 * unit,
        rightInset: 13 * unit,
        time: { align: 'left', size: 14 * unit, weight: 500 },
        iconHeight: 11 * unit,
        iconGap: 4.5 * unit,
        battery: { width: 21 * unit, height: 11 * unit, radius: 3 * unit, capWidth: 1.4 * unit },
        cutout: null
    };

    switch (style) {
        case 'punch-center':
            metrics.cutout = { type: 'circle', cx: centerX, cy: (barHeight / 2) * unit, radius: 5.5 * unit };
            break;
        case 'pill-center':
            metrics.cutout = {
                type: 'pill',
                x: centerX - 16 * unit,
                y: Math.max(3 * unit, (barHeight - 9) / 2 * unit),
                width: 32 * unit,
                height: 9 * unit,
                radius: 4.5 * unit
            };
            break;
        case 'punch-left':
            metrics.leftInset = 26 * unit;
            metrics.cutout = { type: 'circle', cx: 13 * unit, cy: (barHeight / 2) * unit, radius: 5 * unit };
            break;
        case 'waterdrop':
            metrics.cutout = {
                type: 'drop',
                x: centerX - 13 * unit,
                y: 0,
                width: 26 * unit,
                height: 12 * unit
            };
            break;
        default:
            break;
    }
    return metrics;
}

/**
 * 获取状态栏尺寸配置。
 * @param {object} device 机型
 * @param {string} styleId 样式（auto 表示跟随机型）
 * @returns {object}
 */
export function getStatusBarMetrics(device, styleId) {
    const resolved = resolveStatusBarStyle(device, styleId);
    const baseStyle = resolved === 'none' ? device.style : resolved;
    const metrics = IOS_STYLES.has(baseStyle) ? getIosMetrics(baseStyle, device) : getAndroidMetrics(baseStyle, device);
    metrics.style = resolved;
    metrics.visible = resolved !== 'none';
    return metrics;
}

/**
 * 抹除模板背景中预置的状态栏元素（如电池外框），让状态栏干净可控。
 * 做法是取背景图左上角像素的颜色铺满状态栏区域，并额外向下多铺一点，
 * 以覆盖不同分辨率下位置会偏移的预置元素。
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} bg 背景图
 * @param {object} device 机型
 * @param {number} barHeight 状态栏高度（物理像素）
 */
export function drawStatusBarBackplate(ctx, bg, device, barHeight) {
    if (!bg || barHeight <= 0) return;
    const height = Math.max(barHeight, Math.round(device.height * 0.045));
    ctx.drawImage(bg, 0, 0, 1, 1, 0, 0, device.width, height);
}

/**
 * 绘制硬件开孔。
 * @param {CanvasRenderingContext2D} ctx
 * @param {object|null} cutout
 */
function drawCutout(ctx, cutout) {
    if (!cutout) return;
    ctx.save();
    ctx.fillStyle = '#000000';

    if (cutout.type === 'circle') {
        ctx.beginPath();
        ctx.arc(cutout.cx, cutout.cy, cutout.radius, 0, Math.PI * 2);
        ctx.fill();
    } else if (cutout.type === 'island' || cutout.type === 'pill') {
        roundRect(ctx, cutout.x, cutout.y, cutout.width, cutout.height, cutout.radius);
        ctx.fill();
    } else if (cutout.type === 'notch') {
        const { x, y, width, height, radius } = cutout;
        ctx.beginPath();
        ctx.moveTo(x, y - 1);
        ctx.lineTo(x + width, y - 1);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.closePath();
        ctx.fill();
    } else if (cutout.type === 'drop') {
        const { x, y, width, height } = cutout;
        const centerX = x + width / 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 1);
        ctx.lineTo(x + width, y - 1);
        ctx.quadraticCurveTo(x + width, y + height, centerX, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y - 1);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}

/**
 * 绘制电池图标（含电量填充与充电闪电）。
 */
function drawBattery(ctx, x, y, box, percentValue, color, charging) {
    const percent = Math.max(0, Math.min(100, Number(percentValue) || 0));
    const lineWidth = Math.max(1.2, box.height * 0.065);
    const gap = lineWidth * 0.8;
    const outerWidth = box.width - box.capWidth - gap;
    const bodyHeight = box.height - lineWidth;

    ctx.save();

    // 电池外框
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    roundRect(ctx, x + lineWidth / 2, y + lineWidth / 2, outerWidth - lineWidth, bodyHeight, box.radius);
    ctx.stroke();

    // 右侧正极触点
    ctx.fillStyle = color;
    const capHeight = box.height * 0.36;
    roundRect(ctx, x + outerWidth + gap, y + (box.height - capHeight) / 2, box.capWidth, capHeight, box.capWidth / 2);
    ctx.fill();

    // 电量填充
    const innerX = x + lineWidth * 2.4;
    const innerY = y + lineWidth * 2.4;
    const innerMaxWidth = outerWidth - lineWidth * 4.8;
    if (percent > 0 || charging) {
        const fillWidth = Math.max(innerMaxWidth * 0.08, innerMaxWidth * (percent / 100));
        ctx.fillStyle = charging ? '#34c759' : color;
        roundRect(ctx, innerX, innerY, fillWidth, box.height - lineWidth * 4.8, Math.max(1, box.radius * 0.6));
        ctx.fill();
    }

    // 充电闪电
    if (charging) {
        const bx = x + outerWidth / 2;
        const by = y + box.height / 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(bx + box.height * 0.06, y + box.height * 0.14);
        ctx.lineTo(bx - box.height * 0.2, by + box.height * 0.04);
        ctx.lineTo(bx - box.height * 0.03, by + box.height * 0.04);
        ctx.lineTo(bx - box.height * 0.1, y + box.height * 0.86);
        ctx.lineTo(bx + box.height * 0.2, by - box.height * 0.04);
        ctx.lineTo(bx + box.height * 0.03, by - box.height * 0.04);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}

/**
 * 从控件目标值中解析图标键名。
 * @param {string} target
 * @returns {string}
 */
function toIconKey(target) {
    return target.replace(/Toggle$/, '');
}

/**
 * 计算图标宽度。
 * @param {string} key
 * @param {object} assets
 * @param {number} height
 * @returns {number}
 */
function measureIcon(key, assets, height) {
    if (isVectorIcon(key)) {
        return height * getStatusIconAspect(key);
    }
    const asset = assets[key];
    if (!asset || !asset.height) return 0;
    return height * (asset.width / asset.height);
}

/**
 * 在指定位置绘制一个图标，返回其宽度。
 */
function drawIconTarget(ctx, target, x, y, height, assets, color) {
    const key = toIconKey(target);
    const width = measureIcon(key, assets, height);
    if (width <= 0) return 0;

    if (isVectorIcon(key)) {
        drawStatusIcon(ctx, key, x, y, width, height, color);
    } else {
        ctx.drawImage(assets[key], x, y, width, height);
    }
    return width;
}

/**
 * 自左向右绘制图标行。若图标会压到硬件开孔，则停止绘制更靠右的图标。
 */
function drawIconRow(ctx, targets, startX, metrics, assets, color, maxX = 0) {
    let cursor = startX;
    for (const target of targets) {
        const height = metrics.iconHeight;
        const width = measureIcon(toIconKey(target), assets, height);
        if (width <= 0) continue;
        if (maxX > 0 && cursor + width > maxX) break;
        drawIconTarget(ctx, target, cursor, metrics.centerY - height / 2, height, assets, color);
        cursor += width + metrics.iconGap;
    }
}

/**
 * 自右向左绘制图标行。若图标会压到硬件开孔，则停止绘制更靠左的图标。
 */
function drawRightIconRow(ctx, targets, rightEdge, metrics, assets, color, minX = 0) {
    let cursor = rightEdge;
    for (const target of targets) {
        const key = toIconKey(target);
        const height = metrics.iconHeight;
        const width = measureIcon(key, assets, height);
        if (width <= 0) continue;
        if (minX > 0 && cursor - width < minX) break;
        drawIconTarget(ctx, target, cursor - width, metrics.centerY - height / 2, height, assets, color);
        cursor -= width + metrics.iconGap;
    }
}

/**
 * 获取硬件开孔的右边界（用于避免右侧图标压在开孔上）。
 * @param {object} metrics
 * @returns {number}
 */
function getCutoutRightEdge(metrics) {
    const cutout = metrics.cutout;
    if (!cutout) return 0;
    if (cutout.type === 'circle') return cutout.cx + cutout.radius;
    return cutout.x + cutout.width;
}

/**
 * 获取硬件开孔的左边界（用于避免左侧图标压在开孔上）。
 * @param {object} metrics
 * @returns {number}
 */
function getCutoutLeftEdge(metrics) {
    const cutout = metrics.cutout;
    if (!cutout) return 0;
    if (cutout.type === 'circle') return cutout.cx - cutout.radius;
    return cutout.x;
}

/**
 * 绘制完整状态栏。
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} options
 * @param {object} options.device 机型
 * @param {string} options.styleId 状态栏样式
 * @param {string} options.color 文字与图标颜色
 * @param {string} options.time 时间文本
 * @param {number} options.battery 电量百分比
 * @param {boolean} options.charging 是否充电中
 * @param {boolean} options.showBatteryPercent 是否显示电量百分比
 * @param {string[]} options.leftTargets 左侧图标控件 ID 列表
 * @param {string[]} options.rightTargets 右侧图标控件 ID 列表
 * @param {object} options.assets 已加载的图片资源
 */
export function drawStatusBar(ctx, options) {
    const { device, styleId, color, time, battery, charging, showBatteryPercent, leftTargets, rightTargets, assets } = options;
    const metrics = getStatusBarMetrics(device, styleId);
    if (!metrics.visible) return;

    drawCutout(ctx, metrics.cutout);

    ctx.save();
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.font = `${metrics.time.weight} ${metrics.time.size}px "PingFang", "Helvetica Neue", Arial, sans-serif`;

    const timeText = time || '9:41';

    const timeWidth = ctx.measureText(timeText).width;
    const split = device.width / 2;
    const gap = metrics.iconGap;
    const centered = metrics.time.align === 'center';
    const centerCutout = metrics.cutout && metrics.style !== 'punch-left';

    if (centered) {
        drawIconRow(
            ctx,
            leftTargets,
            metrics.leftInset,
            metrics,
            assets,
            color,
            split - timeWidth / 2 - gap * 1.5
        );
        ctx.textAlign = 'center';
        ctx.fillStyle = color;
        ctx.fillText(timeText, device.width / 2, metrics.centerY);
    } else {
        const leftBoundary = centerCutout ? getCutoutLeftEdge(metrics) : split;
        let appWidth = 0;
        for (const target of leftTargets.slice(0, 2)) {
            const key = toIconKey(target);
            if (!isAppIcon(key)) break;
            appWidth += measureIcon(key, assets, metrics.iconHeight) + (appWidth ? gap : 0);
        }
        const timeGap = centerCutout && appWidth ? gap * 0.6 : gap * 1.2;
        const timeX = centerCutout && appWidth
            ? Math.min(metrics.leftInset, Math.max(8 * device.dpr, leftBoundary - timeWidth - timeGap - appWidth - device.dpr))
            : metrics.leftInset;
        ctx.textAlign = 'left';
        ctx.fillStyle = color;
        ctx.fillText(timeText, timeX, metrics.centerY);
        drawIconRow(
            ctx,
            metrics.style === 'minimal' ? [] : leftTargets,
            timeX + timeWidth + timeGap,
            metrics,
            assets,
            color,
            leftBoundary
        );
    }

    // 电池
    const batteryBox = metrics.battery;
    const batteryX = device.width - metrics.rightInset - batteryBox.width;
    drawBattery(ctx, batteryX, metrics.centerY - batteryBox.height / 2, batteryBox, battery, color, charging);

    // 右侧图标（电池左侧）
    let rightEdge = batteryX - metrics.iconGap * 1.2;
    let icons = rightTargets;
    if (metrics.style === 'minimal') icons = [];

    if (showBatteryPercent) {
        const percentText = `${Math.round(Math.max(0, Math.min(100, Number(battery) || 0)))}%`;
        ctx.font = `${metrics.time.weight} ${metrics.time.size * 0.86}px "PingFang", "Helvetica Neue", Arial, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillStyle = color;
        ctx.fillText(percentText, rightEdge, metrics.centerY);
        rightEdge -= ctx.measureText(percentText).width + metrics.iconGap;
    }

    const rightBoundary = centerCutout ? getCutoutRightEdge(metrics) : split + (centered ? timeWidth / 2 : 0);
    drawRightIconRow(
        ctx,
        icons,
        rightEdge,
        metrics,
        assets,
        color,
        rightBoundary + gap * 1.5
    );
    ctx.restore();
}
