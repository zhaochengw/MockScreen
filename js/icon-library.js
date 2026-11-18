import { DOMESTIC_APPS } from './domestic-apps.js';

/**
 * @file PNG 图标库定义
 * @description
 * 统一维护 icons/ 目录下的状态栏图标资源，供资源加载与图标库界面共用。
 * 文件名中的 {suffix} 会按模板主题替换为 ''（白天）或 'nighi'（夜间）。
 */

/**
 * @type {Array<{key: string, name: string, css: string, file: string, group: string}>}
 */
export const PNG_ICONS = [
    // iOS 状态栏图标
    { key: 'Ioslocat', name: '定位 (iOS)', css: 'icon-Ioslocat', file: 'icons/Ioslocat{suffix}Icon.png', group: 'ios' },
    { key: 'Iosalarm', name: '闹钟 (iOS)', css: 'icon-Iosalarm', file: 'icons/Iosalarm{suffix}Icon.png', group: 'ios' },
    { key: 'Iosbell', name: '铃声 (iOS)', css: 'icon-Iosbell', file: 'icons/IosBell{suffix}Icon.png', group: 'ios' },
    { key: 'Iosuser', name: '用户 (iOS)', css: 'icon-Iosuser', file: 'icons/Iosuser{suffix}Icon.png', group: 'ios' },
    { key: 'Iossleep', name: '睡眠 (iOS)', css: 'icon-Iossleep', file: 'icons/Iossleep{suffix}Icon.png', group: 'ios' },
    { key: 'Ioswifi', name: 'Wi-Fi (iOS)', css: 'icon-Ioswifi', file: 'icons/IosWifi{suffix}Icon.png', group: 'ios' },
    { key: 'Ioslte5Ga', name: '5G-A (iOS)', css: 'icon-Ioslte5Ga', file: 'icons/Ioslte5Ga{suffix}Icon.png', group: 'ios' },
    { key: 'Iosltea', name: '信号 A (iOS)', css: 'icon-Iosltea', file: 'icons/Iosltea{suffix}Icon.png', group: 'ios' },
    { key: 'Ioslteb', name: '信号 B (iOS)', css: 'icon-Ioslteb', file: 'icons/Ioslteb{suffix}Icon.png', group: 'ios' },

    // 系统与品牌图标
    { key: 'iconchat', name: '短信', css: 'icon-chat', file: 'icons/chat{suffix}Icon.png', group: 'system' },
    { key: 'iconwifia', name: 'Wi-Fi 箭头', css: 'icon-wifia', file: 'icons/WifiArrow{suffix}Icon.png', group: 'system' },
    { key: 'iconlte4Ga', name: '4G A', css: 'icon-lte4Ga', file: 'icons/lte4Ga{suffix}Icon.png', group: 'system' },
    { key: 'iconlte4Gb', name: '4G B', css: 'icon-lte4Gb', file: 'icons/lte4Gb{suffix}Icon.png', group: 'system' },
    { key: 'iconlte3G', name: '3G', css: 'icon-lte3G', file: 'icons/lte3G{suffix}Icon.png', group: 'system' },
    { key: 'iconlte5Gb', name: '5G B', css: 'icon-lte5Gb', file: 'icons/lte5Gb{suffix}Icon.png', group: 'system' },
    { key: 'iconPhone', name: '电话', css: 'icon-Phone', file: 'icons/Phone{suffix}Icon.png', group: 'system' },
    { key: 'iconAlipay', name: '支付宝', css: 'icon-Alipay', file: 'icons/Alipay{suffix}Icon.png', group: 'app' },
    { key: 'iconTaobao', name: '淘宝', css: 'icon-Taobao', file: 'icons/Taobao{suffix}Icon.png', group: 'app' },
    { key: 'iconWechat', name: '微信', css: 'icon-Wechat', file: 'icons/Wechat{suffix}Icon.png', group: 'app' },
    { key: 'iconWeibo', name: '微博', css: 'icon-Weibo', file: 'icons/Weibo{suffix}Icon.png', group: 'app' },
    { key: 'iconZhihu', name: '知乎', css: 'icon-Zhihu', file: 'icons/Zhihu{suffix}Icon.png', group: 'app' },

    // 第三方应用图标
    { key: 'icon12306', name: '12306', css: 'icon-12306', file: 'icons/radius/12306Icon.png', group: 'app' },
    { key: 'icon163music', name: '网易云音乐', css: 'icon-163music', file: 'icons/radius/163musicIcon.png', group: 'app' },
    { key: 'iconAlidrive', name: '阿里云盘', css: 'icon-alidrive', file: 'icons/radius/AlidriveIcon.png', group: 'app' },
    { key: 'iconAtuin', name: 'Atuin', css: 'icon-atuin', file: 'icons/radius/AtuinIcon.png', group: 'app' },
    { key: 'iconBaidu', name: '百度', css: 'icon-baidu', file: 'icons/radius/BaiduIcon.png', group: 'app' },
    { key: 'iconBaidudriveA', name: '百度网盘 A', css: 'icon-baidudrivea', file: 'icons/radius/BaidudriveaIcon.png', group: 'app' },
    { key: 'iconBaidudriveB', name: '百度网盘 B', css: 'icon-baidudriveb', file: 'icons/radius/BaidudrivebIcon.png', group: 'app' },
    { key: 'iconBilibili', name: '哔哩哔哩', css: 'icon-bilibili', file: 'icons/radius/BilibiliIcon.png', group: 'app' },
    { key: 'iconDoubao', name: '豆包', css: 'icon-doubao', file: 'icons/radius/DoubaoIcon.png', group: 'app' },
    { key: 'iconDsvideo', name: 'DS Video', css: 'icon-dsvideo', file: 'icons/radius/DsvideoIcon.png', group: 'app' },
    { key: 'iconEdge', name: 'Edge', css: 'icon-edge', file: 'icons/radius/EdgeIcon.png', group: 'app' },
    { key: 'iconFlclash', name: 'FlClash', css: 'icon-flclash', file: 'icons/radius/FlclashIcon.png', group: 'app' },
    { key: 'iconIptv', name: 'IPTV', css: 'icon-iptv', file: 'icons/radius/IptvIcon.png', group: 'app' },
    { key: 'iconKmplayer', name: 'KMPlayer', css: 'icon-kmplayer', file: 'icons/radius/KmplayerIcon.png', group: 'app' },
    { key: 'iconMiwifi', name: '小米 WiFi', css: 'icon-miwifi', file: 'icons/radius/MiwifiIcon.png', group: 'app' },
    { key: 'iconOffice', name: 'Office', css: 'icon-office', file: 'icons/radius/OfficeIcon.png', group: 'app' },
    { key: 'iconOnedev', name: 'OneDev', css: 'icon-onedev', file: 'icons/radius/OnedevIcon.png', group: 'app' },
    { key: 'iconPalworld', name: '幻兽帕鲁', css: 'icon-palworld', file: 'icons/radius/PalworldIcon.png', group: 'app' },
    ...DOMESTIC_APPS
];

/**
 * 图标分组配置。
 * @type {Array<{id: string, label: string}>}
 */
export const PNG_ICON_GROUPS = [
    { id: 'ios', label: 'iOS 状态图标' },
    { id: 'system', label: '\u7cfb\u7edf\u56fe\u6807' },
    { id: 'app', label: '第三方应用' }
];

/**
 * 按模板主题生成本次绘制需要加载的图标资源表。
 * @param {string} themeSuffix 主题后缀，白天为 ''，夜间为 'nighi'
 * @returns {Object<string, string>}
 */
export function buildStatusIconAssets(themeSuffix) {
    const assets = {};
    PNG_ICONS.forEach(icon => {
        assets[icon.key] = icon.file.replace('{suffix}', themeSuffix);
    });
    return assets;
}
