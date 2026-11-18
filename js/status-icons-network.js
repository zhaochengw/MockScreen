/**
 * @file 网络与信号类状态栏图标
 * @description 由 status-icons.js 统一注册，绘制函数使用归一化坐标系。
 */

/**
 * 注册网络与信号图标。
 * @param {Function} define
 * @param {Function} defineText
 * @param {Function} roundRect
 */
export function registerNetworkIcons(define, defineText, roundRect) {
    // --- 信号 ---

    define('vIosSignal', '信号 (iOS)', 1.35, (ctx, color) => {
        const heights = [0.32, 0.54, 0.76, 1];
        const barWidth = 0.19;
        const gap = (1.35 - barWidth * heights.length) / (heights.length - 1);
        ctx.fillStyle = color;
        heights.forEach((ratio, index) => {
            roundRect(ctx, index * (barWidth + gap), 1 - ratio, barWidth, ratio, barWidth / 2);
            ctx.fill();
        });
    });

    define('vSignal', '信号 (Android)', 1.25, (ctx, color) => {
        const heights = [0.32, 0.54, 0.76, 1];
        const barWidth = 0.18;
        const gap = (1.25 - barWidth * heights.length) / (heights.length - 1);
        ctx.fillStyle = color;
        heights.forEach((ratio, index) => {
            roundRect(ctx, index * (barWidth + gap), 1 - ratio, barWidth, ratio, 0.02);
            ctx.fill();
        });
    });

    define('vIosDots', '信号圆点 (经典 iOS)', 2.4, (ctx, color) => {
        const radius = 0.18;
        const gap = (2.4 - radius * 2 * 5) / 4;
        ctx.lineWidth = 0.08;
        for (let index = 0; index < 5; index += 1) {
            const cx = radius + index * (radius * 2 + gap);
            ctx.beginPath();
            ctx.arc(cx, 0.5, radius, 0, Math.PI * 2);
            if (index < 4) {
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }
    });

    // --- 网络 ---

    define('vWifi', 'Wi-Fi', 1.45, (ctx, color) => {
        const cx = 0.725;
        const cy = 1.02;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        [0.36, 0.6, 0.84].forEach((radius, index) => {
            ctx.lineWidth = index === 2 ? 0.12 : 0.12;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI * 1.2, Math.PI * 1.8);
            ctx.stroke();
        });
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy - 0.02, 0.1, 0, Math.PI * 2);
        ctx.fill();
    });

    defineText('v5G', '5G', '5G', 1.55);
    defineText('vLTE', 'LTE', 'LTE', 1.65);
    defineText('v4G', '4G', '4G', 1.5);
    defineText('v3G', '3G', '3G', 1.5);

    // --- 连接与状态 ---

    define('vAirplane', '飞行模式', 1.0, (ctx, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0.5, 0.03);
        ctx.lineTo(0.58, 0.34);
        ctx.lineTo(0.94, 0.56);
        ctx.lineTo(0.94, 0.66);
        ctx.lineTo(0.58, 0.58);
        ctx.lineTo(0.57, 0.84);
        ctx.lineTo(0.72, 0.93);
        ctx.lineTo(0.72, 0.98);
        ctx.lineTo(0.5, 0.92);
        ctx.lineTo(0.28, 0.98);
        ctx.lineTo(0.28, 0.93);
        ctx.lineTo(0.43, 0.84);
        ctx.lineTo(0.42, 0.58);
        ctx.lineTo(0.06, 0.66);
        ctx.lineTo(0.06, 0.56);
        ctx.lineTo(0.42, 0.34);
        ctx.closePath();
        ctx.fill();
    });

    define('vCast', '投屏', 1.35, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.09;
        ctx.lineCap = 'round';
        roundRect(ctx, 0.42, 0.06, 0.88, 0.62, 0.1);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0.18, 0.88, 0.07, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.18, 0.88, 0.26, Math.PI * 1.28, Math.PI * 1.72);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.18, 0.88, 0.46, Math.PI * 1.28, Math.PI * 1.72);
        ctx.stroke();
    });

    define('vVpn', 'VPN', 0.82, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0.3, 0.28, 0.24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.47, 0.45);
        ctx.lineTo(0.82, 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.68, 0.72);
        ctx.lineTo(0.58, 0.82);
        ctx.moveTo(0.79, 0.86);
        ctx.lineTo(0.69, 0.96);
        ctx.stroke();
    });

    define('vSync', '同步', 1.0, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0.5, 0.5, 0.37, Math.PI * 1.15, Math.PI * 1.95);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.5, 0.5, 0.37, Math.PI * 0.15, Math.PI * 0.95);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0.82, 0.2);
        ctx.lineTo(0.92, 0.46);
        ctx.lineTo(0.66, 0.42);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0.18, 0.8);
        ctx.lineTo(0.08, 0.54);
        ctx.lineTo(0.34, 0.58);
        ctx.closePath();
        ctx.fill();
    });

}
