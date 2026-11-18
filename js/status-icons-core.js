/**
 * @file 状态栏矢量图标注册表
 * @description
 * 维护图标定义表，并提供注册与绘制的基础设施。
 * 所有图标在「宽度 = aspect、高度 = 1」的归一化坐标系中绘制，
 * 由 drawStatusIcon 统一缩放，因此在任意分辨率下都保持清晰。
 */

/**
 * 图标定义表。
 * @type {Object<string, {key: string, name: string, aspect: number, text?: string, draw?: Function}>}
 */
const ICONS = {};

/**
 * 注册一个路径图标。
 * @param {string} key 图标键名
 * @param {string} name 显示名称
 * @param {number} aspect 宽高比
 * @param {Function} draw 绘制函数
 */
export function define(key, name, aspect, draw) {
    ICONS[key] = { key, name, aspect, draw };
}

/**
 * 注册一个文字图标（如 5G / LTE）。
 * @param {string} key 图标键名
 * @param {string} name 显示名称
 * @param {string} text 显示文本
 * @param {number} aspect 宽高比
 */
export function defineText(key, name, text, aspect) {
    ICONS[key] = { key, name, aspect, text };
}

/**
 * 绘制圆角矩形路径。
 */
export function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.arcTo(x + w, y, x + w, y + radius, radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
    ctx.lineTo(x + radius, y + h);
    ctx.arcTo(x, y + h, x, y + h - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}

/**
 * 获取图标定义。
 * @param {string} key
 * @returns {object|undefined}
 */
export function getStatusIcon(key) {
    return ICONS[key];
}

/**
 * 判断是否为已注册的矢量图标。
 * @param {string} key
 * @returns {boolean}
 */
export function isVectorIcon(key) {
    return Boolean(ICONS[key]);
}

/**
 * 获取图标宽高比（宽度 / 高度）。
 * @param {string} key
 * @returns {number}
 */
export function getStatusIconAspect(key) {
    const icon = ICONS[key];
    return icon ? icon.aspect : 1;
}

/**
 * 绘制矢量图标。
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} key 图标键名
 * @param {number} x 左上角 X
 * @param {number} y 左上角 Y
 * @param {number} width 目标宽度
 * @param {number} height 目标高度
 * @param {string} color 颜色
 */
export function drawStatusIcon(ctx, key, x, y, width, height, color) {
    const icon = ICONS[key];
    if (!icon) return;

    ctx.save();
    ctx.translate(x, y);
    if (icon.text) {
        ctx.fillStyle = color;
        ctx.font = `600 ${height * 0.92}px "PingFang", "Helvetica Neue", Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon.text, width / 2, height * 0.54);
    } else {
        ctx.scale(width / icon.aspect, height);
        icon.draw(ctx, color);
    }
    ctx.restore();
}