import { DOMESTIC_APPS } from './domestic-apps.js';

const PRESETS = [
    ['Cafe', '\u661f\u69d0\u5496\u5561', '\u62ff\u94c1\u4e0e\u53ef\u9882', '#875a46', 'M7 8h9v5a4.5 4.5 0 0 1-9 0zM16 9h2a2 2 0 0 1 0 4h-2M6 19h13M10 4v1m3-1v1', 19, 58],
    ['Market', '\u8def\u53e3\u4fbf\u5229\u5e97', '\u98df\u54c1\u4e0e\u65e5\u7528\u54c1', '#28776a', 'M4 5h2l2 10h10l2-7H7m2 11h.1m8 0h.1', 8, 68],
    ['Food', '\u5c0f\u6ee1\u5c0f\u9986', '\u53cc\u4eba\u5957\u9910', '#cb673f', 'M7 4v5a3 3 0 0 0 6 0V4m-3 0v16m8-16c-2 2-3 5-3 8h3m0-8v16', 45, 138],
    ['Book', '\u84dd\u9875\u4e66\u5e97', '\u56fe\u4e66\u4e0e\u6587\u5177', '#436ab1', 'M12 7c-3-2-5-2-8-2v12c3 0 5 0 8 2 3-2 5-2 8-2V5c-3 0-5 0-8 2zm0 0v12', 16, 95],
    ['Bakery', '\u9ea6\u7a57\u70d8\u7119', '\u9c9c\u70e4\u9762\u5305', '#ad7030', 'M4 11a7 5 0 0 1 7-5h2a7 5 0 0 1 7 5v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zm5-3 2 3m2-3 2 3', 12, 53],
    ['Flower', '\u6625\u679d\u82b1\u574a', '\u9c9c\u82b1\u82b1\u675f', '#ae5377', 'M12 11a8 8 0 0 1-5-6 6 6 0 0 1 5 3 6 6 0 0 1 5-3 8 8 0 0 1-5 6zm0 0v9m0-4c2-2 4-3 6-3m-6 5c-2-2-4-3-6-3', 28, 118],
    ['Transit', '\u6f84\u6c34\u516c\u4ea4', '\u516c\u4ea4\u4e58\u8f66', '#436687', 'M6 17V6c0-3 12-3 12 0v11zm0-7h12m-9 4h.1m6 0h.1M8 17v3m8-3v3', 2, 12]
];

export const MERCHANT_PRESETS = PRESETS.map(([id, name, product, color, path, min, max]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${color}"/><path d="${path}" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return { key: `merchant${id}`, name, product, min, max, file: `data:image/svg+xml,${encodeURIComponent(svg)}` };
});

const COMMERCE_AVATARS = DOMESTIC_APPS.filter(({ key }) => ['iconJd', 'iconMeituan', 'iconPinduoduo', 'iconTaobaoFlash'].includes(key));
const MERCHANT_ICONS = [...MERCHANT_PRESETS, ...COMMERCE_AVATARS];

export const MERCHANT_ASSETS = Object.fromEntries(MERCHANT_ICONS.map(({ key, file }) => [key, file]));

export function merchantOptionsHTML(selected) {
    return MERCHANT_ICONS.map(({ key, name, file }) =>
        `<button type="button" class="merchant-icon-option merchant-preset${selected === key ? ' selected' : ''}" data-asset-key="${key}" title="${name}" aria-label="${name}"><img src="${file}" alt="" width="45" height="45"></button>`
    ).join('');
}
