/**
 * @file 机型数据库
 * @description
 * 收录主流 iPhone 与安卓机型的物理分辨率、像素密度以及默认状态栏样式。
 * 状态栏样式标识：
 * - dynamic-island: 灵动岛
 * - notch: 刘海屏
 * - classic-ios: 经典 iOS（iPhone 8 / SE）
 * - pill-center: 居中胶囊挖孔
 * - punch-center: 居中挖孔
 * - punch-left: 左上挖孔
 * - waterdrop: 水滴屏
 * - classic-android: 经典安卓（无挖孔）
 */

/**
 * 创建 iPhone 机型描述。
 * @param {string} id 唯一标识
 * @param {string} name 显示名称
 * @param {number} width 物理像素宽度
 * @param {number} height 物理像素高度
 * @param {number} dpr 设备像素比（逻辑点与物理像素之比）
 * @param {string} style 默认状态栏样式
 * @param {string} cellular 蜂窝网络标识
 * @returns {object}
 */
const iphone = (id, name, width, height, dpr, style, cellular = '5G') => ({
    id, name, brand: 'Apple', platform: 'ios', width, height, dpr, style, cellular
});

/**
 * 创建安卓机型描述。
 * @param {string} id 唯一标识
 * @param {string} name 显示名称
 * @param {string} brand 品牌
 * @param {number} width 物理像素宽度
 * @param {number} height 物理像素高度
 * @param {string} style 默认状态栏样式
 * @param {number} dpr 设备像素比
 * @returns {object}
 */
const android = (id, name, brand, width, height, style, dpr = 3) => ({
    id, name, brand, platform: 'android', width, height, dpr, style, cellular: '5G'
});

/**
 * @const {Array<{label: string, devices: object[]}>}
 */
export const DEVICE_GROUPS = [
    {
        label: 'iPhone 17 / Air',
        devices: [
            iphone('iphone-17-pro-max', 'iPhone 17 Pro Max', 1320, 2868, 3, 'dynamic-island'),
            iphone('iphone-17-pro', 'iPhone 17 Pro', 1206, 2622, 3, 'dynamic-island'),
            iphone('iphone-17', 'iPhone 17', 1206, 2622, 3, 'dynamic-island'),
            iphone('iphone-air', 'iPhone Air', 1260, 2736, 3, 'dynamic-island')
        ]
    },
    {
        label: 'iPhone 16 系列',
        devices: [
            iphone('iphone-16-pro-max', 'iPhone 16 Pro Max', 1320, 2868, 3, 'dynamic-island'),
            iphone('iphone-16-pro', 'iPhone 16 Pro', 1206, 2622, 3, 'dynamic-island'),
            iphone('iphone-16-plus', 'iPhone 16 Plus', 1290, 2796, 3, 'dynamic-island'),
            iphone('iphone-16', 'iPhone 16', 1179, 2556, 3, 'dynamic-island'),
            iphone('iphone-16e', 'iPhone 16e', 1170, 2532, 3, 'notch')
        ]
    },
    {
        label: 'iPhone 15 系列',
        devices: [
            iphone('iphone-15-pro-max', 'iPhone 15 Pro Max', 1290, 2796, 3, 'dynamic-island'),
            iphone('iphone-15-pro', 'iPhone 15 Pro', 1179, 2556, 3, 'dynamic-island'),
            iphone('iphone-15-plus', 'iPhone 15 Plus', 1290, 2796, 3, 'dynamic-island'),
            iphone('iphone-15', 'iPhone 15', 1179, 2556, 3, 'dynamic-island')
        ]
    },
    {
        label: 'iPhone 14 系列',
        devices: [
            iphone('iphone-14-pro-max', 'iPhone 14 Pro Max', 1290, 2796, 3, 'dynamic-island'),
            iphone('iphone-14-pro', 'iPhone 14 Pro', 1179, 2556, 3, 'dynamic-island'),
            iphone('iphone-14-plus', 'iPhone 14 Plus', 1284, 2778, 3, 'notch'),
            iphone('iphone-14', 'iPhone 14', 1170, 2532, 3, 'notch')
        ]
    },
    {
        label: 'iPhone 13 / 12 系列',
        devices: [
            iphone('iphone-13-pro-max', 'iPhone 13 Pro Max', 1284, 2778, 3, 'notch'),
            iphone('iphone-13-pro', 'iPhone 13 Pro', 1170, 2532, 3, 'notch'),
            iphone('iphone-13', 'iPhone 13', 1170, 2532, 3, 'notch'),
            iphone('iphone-13-mini', 'iPhone 13 mini', 1080, 2340, 3, 'notch'),
            iphone('iphone-12-pro-max', 'iPhone 12 Pro Max', 1284, 2778, 3, 'notch'),
            iphone('iphone-12-pro', 'iPhone 12 Pro', 1170, 2532, 3, 'notch'),
            iphone('iphone-12', 'iPhone 12', 1170, 2532, 3, 'notch'),
            iphone('iphone-12-mini', 'iPhone 12 mini', 1080, 2340, 3, 'notch')
        ]
    },
    {
        label: 'iPhone 11 / X 系列',
        devices: [
            iphone('iphone-11-pro-max', 'iPhone 11 Pro Max', 1242, 2688, 3, 'notch', 'LTE'),
            iphone('iphone-11-pro', 'iPhone 11 Pro', 1125, 2436, 3, 'notch', 'LTE'),
            iphone('iphone-11', 'iPhone 11', 828, 1792, 2, 'notch', 'LTE'),
            iphone('iphone-xs-max', 'iPhone XS Max', 1242, 2688, 3, 'notch', 'LTE'),
            iphone('iphone-xs', 'iPhone XS', 1125, 2436, 3, 'notch', 'LTE'),
            iphone('iphone-xr', 'iPhone XR', 828, 1792, 2, 'notch', 'LTE'),
            iphone('iphone-x', 'iPhone X', 1125, 2436, 3, 'notch', 'LTE')
        ]
    },
    {
        label: 'iPhone SE / 8 / 7',
        devices: [
            iphone('iphone-se3', 'iPhone SE (第三代)', 750, 1334, 2, 'classic-ios', 'LTE'),
            iphone('iphone-se2', 'iPhone SE (第二代)', 750, 1334, 2, 'classic-ios', 'LTE'),
            iphone('iphone-8-plus', 'iPhone 8 Plus', 1080, 1920, 3, 'classic-ios', 'LTE'),
            iphone('iphone-8', 'iPhone 8', 750, 1334, 2, 'classic-ios', 'LTE'),
            iphone('iphone-7-plus', 'iPhone 7 Plus', 1080, 1920, 3, 'classic-ios', 'LTE'),
            iphone('iphone-7', 'iPhone 7', 750, 1334, 2, 'classic-ios', 'LTE')
        ]
    },
    {
        label: '小米 / Redmi',
        devices: [
            android('xiaomi-15', '小米 15', 'Xiaomi', 1200, 2670, 'punch-center'),
            android('xiaomi-14', '小米 14', 'Xiaomi', 1200, 2670, 'punch-center'),
            android('xiaomi-14-ultra', '小米 14 Ultra', 'Xiaomi', 1440, 3200, 'punch-center'),
            android('redmi-k80', 'Redmi K80', 'Redmi', 1440, 3200, 'punch-center')
        ]
    },
    {
        label: '华为 / 荣耀',
        devices: [
            android('huawei-mate-70-pro', '华为 Mate 70 Pro', 'Huawei', 1316, 2832, 'pill-center'),
            android('huawei-mate-60-pro', '华为 Mate 60 Pro', 'Huawei', 1260, 2720, 'pill-center'),
            android('huawei-pura-70-ultra', '华为 Pura 70 Ultra', 'Huawei', 1260, 2844, 'pill-center'),
            android('honor-magic6-pro', '荣耀 Magic6 Pro', 'Honor', 1280, 2800, 'pill-center')
        ]
    },
    {
        label: '三星',
        devices: [
            android('galaxy-s24-ultra', '三星 Galaxy S24 Ultra', 'Samsung', 1440, 3120, 'punch-center'),
            android('galaxy-s24', '三星 Galaxy S24', 'Samsung', 1080, 2340, 'punch-center'),
            android('galaxy-s23', '三星 Galaxy S23', 'Samsung', 1080, 2340, 'punch-center')
        ]
    },
    {
        label: 'OPPO / vivo / 一加',
        devices: [
            android('oppo-find-x7-ultra', 'OPPO Find X7 Ultra', 'OPPO', 1440, 3168, 'punch-center'),
            android('vivo-x100-pro', 'vivo X100 Pro', 'vivo', 1260, 2800, 'punch-center'),
            android('oneplus-12', '一加 12', 'OnePlus', 1440, 3168, 'punch-center')
        ]
    },
    {
        label: 'Google / 通用安卓',
        devices: [
            android('pixel-8-pro', 'Google Pixel 8 Pro', 'Google', 1344, 2992, 'punch-center', 2.625),
            android('android-1440', '通用安卓 (2K 20:9)', 'Android', 1440, 3200, 'punch-center'),
            android('android-1080', '通用安卓 (1080P 20:9)', 'Android', 1080, 2400, 'punch-center'),
            android('android-left', '通用安卓 (左挖孔)', 'Android', 1080, 2400, 'punch-left'),
            android('android-waterdrop', '通用安卓 (水滴屏)', 'Android', 720, 1600, 'waterdrop', 2),
            android('android-classic', '通用安卓 (经典三段)', 'Android', 1080, 1920, 'classic-android')
        ]
    }
];

/**
 * @const {Object<string, number>} IOS_BAR_HEIGHT
 * @description
 * iOS 状态栏高度（pt），按机型覆盖默认值。
 * 数据来源：Apple 人机界面指南与 Use Your Loaf 的 iPhone 屏幕尺寸实测文章。
 * 未列出的机型按样式取默认值：灵动岛 54、刘海 47、经典 20。
 */
const IOS_BAR_HEIGHT = {
    // 刘海机型：iPhone X ~ 11 Pro 为 44pt，XR / 11 为 48pt，12 mini / 13 mini 为 44pt
    'iphone-x': 44,
    'iphone-xs': 44,
    'iphone-xs-max': 44,
    'iphone-11-pro': 44,
    'iphone-11-pro-max': 44,
    'iphone-xr': 48,
    'iphone-11': 48,
    'iphone-12-mini': 44,
    'iphone-13-mini': 44,
    // 经典 Home 键机型：20pt
    'iphone-se3': 20,
    'iphone-se2': 20,
    'iphone-8-plus': 20,
    'iphone-8': 20,
    'iphone-7-plus': 20,
    'iphone-7': 20
};

/**
 * @const {Object<string, number>} ANDROID_BAR_HEIGHT
 * @description
 * 安卓状态栏高度（dp）按品牌取值：原生与三星为 24dp，国产定制系统普遍为 28dp。
 */
const ANDROID_BAR_HEIGHT = {
    Google: 24,
    Samsung: 24,
    Xiaomi: 28,
    Redmi: 28,
    Huawei: 30,
    Honor: 30,
    OPPO: 28,
    vivo: 28,
    OnePlus: 28,
    Android: 28
};

/**
 * 展平后的机型列表。
 * @type {object[]}
 */
export const DEVICES = DEVICE_GROUPS.reduce((list, group) => list.concat(group.devices), []);

// 为每个机型补齐状态栏高度，绘制时按机型取值
DEVICES.forEach(device => {
    if (device.platform === 'ios') {
        device.barHeight = IOS_BAR_HEIGHT[device.id]
            || (device.style === 'dynamic-island' ? 54 : device.style === 'classic-ios' ? 20 : 47);
    } else {
        device.barHeight = ANDROID_BAR_HEIGHT[device.brand] || 28;
    }
});

/** @type {string} 默认机型（与项目模板 1290x2796 的设计尺寸一致） */
export const DEFAULT_DEVICE_ID = 'iphone-15-pro-max';

/**
 * 按 id 查找机型，找不到时回退到默认机型。
 * @param {string} id
 * @returns {object}
 */
export function getDeviceById(id) {
    return DEVICES.find(device => device.id === id)
        || DEVICES.find(device => device.id === DEFAULT_DEVICE_ID)
        || DEVICES[0];
}

/**
 * 将蜂窝网络制式转换为对应的图标键名。
 * @param {string} cellular
 * @returns {string|null}
 */
function getCellularIcon(cellular) {
    if (!cellular) return null;
    const map = { '5G': 'v5G', 'LTE': 'vLTE', '4G': 'v4G', '3G': 'v3G' };
    return map[cellular] || null;
}

/**
 * 根据机型与状态栏样式生成默认状态栏图标排列。
 * 数组顺序与界面一致：右侧区域的第一个图标紧邻电池。
 * @param {object} device 机型
 * @param {string} styleId 状态栏样式（可为 auto）
 * @returns {{left: string[], right: string[]}}
 */
export function getDevicePreset(device, styleId) {
    const style = (!styleId || styleId === 'auto') ? device.style : styleId;
    const isIos = device.platform === 'ios';
    const cellular = getCellularIcon(device.cellular);

    if (style === 'none' || style === 'minimal') {
        return { left: [], right: [] };
    }
    if (style === 'classic-ios' && isIos) {
        return { left: ['vIosDots'], right: ['vWifi'] };
    }

    const right = ['vWifi', isIos ? 'vIosSignal' : 'vSignal'];
    if (cellular) right.push(cellular);
    return { left: [], right };
}
