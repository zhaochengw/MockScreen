export const EXTRA_ICON_GROUPS = [
    { label: '\u7f51\u7edc\u6269\u5c55', icons: ['v5Ga', 'vVoLTE', 'vVoWiFi', 'vNoSim', 'vDualSim'] },
    { label: '\u7cfb\u7edf\u4e13\u7528', icons: ['vIosFocus', 'vIosPrivacy', 'vAndroidDataSaver'] },
    { label: '\u54c1\u724c\u4e13\u7528', icons: ['vMiHd', 'vHw5gAdvanced', 'vOneUiRoutine'] }
];

export function registerExtraIcons(define, text, roundRect) {
    text('v5Ga', '5G-A', '5G-A', 2.5);
    text('vVoLTE', 'VoLTE (Android)', 'VoLTE', 3.2);
    text('vVoWiFi', 'VoWiFi (Android)', 'VoWiFi', 3.4);
    text('vMiHd', 'HD (Xiaomi / Redmi)', 'HD', 1.65);
    text('vHw5gAdvanced', '5GA (Huawei / Honor)', '5GA', 2.2);

    define('vIosFocus', '\u4e2a\u4eba\u4e13\u6ce8 (iOS)', 1, (ctx, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0.5, 0.28, 0.23, 0, Math.PI * 2);
        ctx.fill();
        roundRect(ctx, 0.14, 0.57, 0.72, 0.37, 0.18);
        ctx.fill();
    });
    define('vIosPrivacy', '\u9ea6\u514b\u98ce\u9690\u79c1\u6307\u793a (iOS)', 0.7, ctx => {
        ctx.fillStyle = '#ff9f0a';
        ctx.beginPath();
        ctx.arc(0.35, 0.5, 0.23, 0, Math.PI * 2);
        ctx.fill();
    });
    define('vAndroidDataSaver', '\u6d41\u91cf\u8282\u7701 (Android)', 1, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.11;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0.5, 0.5, 0.41, 0.15, Math.PI * 1.8);
        ctx.moveTo(0.3, 0.5);
        ctx.lineTo(0.7, 0.5);
        ctx.moveTo(0.5, 0.3);
        ctx.lineTo(0.5, 0.7);
        ctx.stroke();
    });
    define('vOneUiRoutine', '\u6a21\u5f0f\u548c\u65e5\u5e38\u7a0b\u5e8f (Samsung)', 1, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.12;
        ctx.lineJoin = 'round';
        roundRect(ctx, 0.1, 0.1, 0.8, 0.8, 0.24);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.54, 0.24);
        ctx.lineTo(0.35, 0.53);
        ctx.lineTo(0.63, 0.53);
        ctx.lineTo(0.46, 0.76);
        ctx.stroke();
    });
    define('vNoSim', '\u65e0 SIM \u5361', 0.95, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.09;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(0.1, 0.94);
        ctx.lineTo(0.1, 0.3);
        ctx.lineTo(0.34, 0.07);
        ctx.lineTo(0.85, 0.07);
        ctx.lineTo(0.85, 0.94);
        ctx.closePath();
        ctx.moveTo(0.33, 0.43);
        ctx.lineTo(0.62, 0.74);
        ctx.moveTo(0.62, 0.43);
        ctx.lineTo(0.33, 0.74);
        ctx.stroke();
    });
    define('vDualSim', '\u53cc SIM \u5361', 1.45, (ctx, color) => {
        ctx.fillStyle = color;
        for (let row = 0; row < 2; row += 1) {
            for (let i = 0; i < 4; i += 1) {
                const height = 0.17 + i * 0.08;
                roundRect(ctx, 0.05 + i * 0.36, 0.43 + row * 0.52 - height, 0.23, height, 0.08);
                ctx.fill();
            }
        }
    });
}
