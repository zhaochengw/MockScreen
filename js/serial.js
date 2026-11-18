/**
 * @file 订单号生成器
 * @description
 * 按各平台真实单号格式生成随机单号，用于让账单详情截图更接近真实。
 * - 支付宝交易号：28 位数字，前 8 位为交易日期，随后为固定段 2200 与 16 位随机数。
 * - 微信支付订单号：28 位数字，以 4200 开头。
 * - 微信商户单号：18 位数字，前 8 位为交易日期，后 10 位为随机数。
 * 单号仅为模拟数据，不对应任何真实交易。
 */

/**
 * 数字左侧补零。
 * @param {number} value
 * @param {number} length
 * @returns {string}
 */
function pad(value, length = 2) {
    return String(value).padStart(length, '0');
}

/**
 * 生成指定长度的随机数字串。
 * @param {number} count
 * @returns {string}
 */
function randomDigits(count) {
    let result = '';
    for (let index = 0; index < count; index += 1) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

/**
 * 将日期格式化为 YYYYMMDD。
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

/**
 * 把控件里的时间字符串安全转换为 Date，非法时回退为当前时间。
 * @param {string} value
 * @returns {Date}
 */
export function toDate(value) {
    const date = value ? new Date(value) : new Date();
    return Number.isNaN(date.getTime()) ? new Date() : date;
}

/**
 * 生成支付宝交易号（28 位）。
 * @param {Date} [date]
 * @returns {string}
 */
export function createAlipayTradeNo(date = new Date()) {
    return `${formatDate(date)}2200${randomDigits(16)}`;
}

/**
 * 生成支付宝商家订单号（18 位，商家自定义格式，日期开头）。
 * @param {Date} [date]
 * @returns {string}
 */
export function createAlipayMerchantOrderNo(date = new Date()) {
    return `${formatDate(date)}${randomDigits(10)}`;
}

/**
 * 生成微信支付订单号（28 位，4200 开头）。
 * @returns {string}
 */
export function createWechatTransactionId() {
    return `4200${randomDigits(24)}`;
}

/**
 * 生成微信商户单号（18 位，日期开头）。
 * @param {Date} [date]
 * @returns {string}
 */
export function createWechatMerchantId(date = new Date()) {
    return `${formatDate(date)}${randomDigits(10)}`;
}
