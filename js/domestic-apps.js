const apps = [
    ['Douyin', '\u6296\u97f3', 'douyin'],
    ['Xiaohongshu', '\u5c0f\u7ea2\u4e66', 'xiaohongshu'],
    ['Amap', '\u9ad8\u5fb7\u5730\u56fe', 'amap'],
    ['Jd', '\u4eac\u4e1c', 'jd'],
    ['Meituan', '\u7f8e\u56e2', 'meituan'],
    ['Dingtalk', '\u9489\u9489', 'dingtalk'],
    ['UnionPay', '\u4e91\u95ea\u4ed8', 'unionpay'],
    ['QQ', 'QQ', 'qq'],
    ['BaiduMap', '\u767e\u5ea6\u5730\u56fe', 'baidu-map'],
    ['TaobaoFlash', '\u6dd8\u5b9d\u95ea\u8d2d', 'taobao-flash'],
    ['Pinduoduo', '\u62fc\u591a\u591a', 'pinduoduo']
];

export const DOMESTIC_APPS = apps.map(([id, name, file]) => ({
    key: `icon${id}`, name, file: `icons/domestic/${file}.jpg`, group: 'app'
}));
