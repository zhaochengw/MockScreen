/**
 * @file 系统状态类状态栏图标
 * @description 由 status-icons.js 统一注册，绘制函数使用归一化坐标系。
 */

/**
 * 注册系统状态图标。
 * @param {Function} define
 * @param {Function} roundRect
 */
export function registerSystemIcons(define, roundRect) {
    // --- 系统 ---

    define('vAlarm', '闹钟', 1.0, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.09;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0.5, 0.56, 0.37, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5, 0.56);
        ctx.lineTo(0.5, 0.34);
        ctx.moveTo(0.5, 0.56);
        ctx.lineTo(0.65, 0.64);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.16, 0.26);
        ctx.lineTo(0.3, 0.4);
        ctx.moveTo(0.84, 0.26);
        ctx.lineTo(0.7, 0.4);
        ctx.stroke();
    });

    define('vLocation', '定位', 0.8, (ctx, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0.4, 0);
        ctx.lineTo(0.8, 1);
        ctx.lineTo(0.4, 0.76);
        ctx.lineTo(0, 1);
        ctx.closePath();
        ctx.fill();
    });

    define('vHeadphones', '耳机', 1.2, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.13;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0.6, 0.7, 0.5, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = color;
        roundRect(ctx, 0.02, 0.58, 0.22, 0.4, 0.09);
        ctx.fill();
        roundRect(ctx, 0.96, 0.58, 0.22, 0.4, 0.09);
        ctx.fill();
    });

    define('vMoon', '勿扰模式', 1.0, (ctx, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0.46, 0.5, 0.46, 0, Math.PI * 2);
        ctx.arc(0.68, 0.34, 0.42, 0, Math.PI * 2, true);
        ctx.fill('evenodd');
    });

    define('vRotationLock', '旋转锁定', 1.0, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.arc(0.5, 0.46, 0.24, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = color;
        roundRect(ctx, 0.2, 0.46, 0.6, 0.46, 0.1);
        ctx.fill();
    });

    define('vBluetooth', '蓝牙', 0.72, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(0.06, 0.3);
        ctx.lineTo(0.66, 0.7);
        ctx.lineTo(0.36, 1);
        ctx.lineTo(0.36, 0);
        ctx.lineTo(0.66, 0.3);
        ctx.lineTo(0.06, 0.7);
        ctx.stroke();
    });

    define('vAirplay', 'AirPlay', 1.2, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.1;
        roundRect(ctx, 0.06, 0.06, 1.08, 0.68, 0.12);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0.6, 0.56);
        ctx.lineTo(0.84, 0.96);
        ctx.lineTo(0.36, 0.96);
        ctx.closePath();
        ctx.fill();
    });

    define('vMic', '麦克风', 0.7, (ctx, color) => {
        ctx.fillStyle = color;
        roundRect(ctx, 0.2, 0.02, 0.3, 0.56, 0.15);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.09;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0.35, 0.52, 0.26, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.35, 0.78);
        ctx.lineTo(0.35, 0.96);
        ctx.moveTo(0.2, 0.98);
        ctx.lineTo(0.5, 0.98);
        ctx.stroke();
    });

    define('vHotspot', '个人热点', 1.5, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.arc(0.44, 0.64, 0.26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.94, 0.36, 0.26, 0, Math.PI * 2);
        ctx.stroke();
    });

    define('vNfc', 'NFC', 1.05, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.09;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(0.08, 0.82);
        ctx.lineTo(0.08, 0.18);
        ctx.lineTo(0.44, 0.82);
        ctx.lineTo(0.44, 0.18);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.44, 0.5, 0.3, -0.9, 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.44, 0.5, 0.48, -0.9, 0.9);
        ctx.stroke();
    });

    define('vVibrate', '振动', 1.35, (ctx, color) => {
        ctx.fillStyle = color;
        roundRect(ctx, 0.5, 0.16, 0.35, 0.68, 0.08);
        ctx.fill();
        roundRect(ctx, 0.15, 0.3, 0.08, 0.4, 0.04);
        ctx.fill();
        roundRect(ctx, 1.12, 0.3, 0.08, 0.4, 0.04);
        ctx.fill();
    });

    define('vBell', '铃声', 1.0, (ctx, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0.22, 0.66);
        ctx.quadraticCurveTo(0.22, 0.2, 0.5, 0.2);
        ctx.quadraticCurveTo(0.78, 0.2, 0.78, 0.66);
        ctx.lineTo(0.87, 0.75);
        ctx.lineTo(0.13, 0.75);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5, 0.86, 0.09, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5, 0.12, 0.065, 0, Math.PI * 2);
        ctx.fill();
    });

    define('vSilent', '静音', 1.0, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.085;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0.24, 0.66);
        ctx.quadraticCurveTo(0.24, 0.22, 0.5, 0.22);
        ctx.quadraticCurveTo(0.76, 0.22, 0.76, 0.66);
        ctx.lineTo(0.85, 0.75);
        ctx.lineTo(0.15, 0.75);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.5, 0.87, 0.08, 0.15, Math.PI - 0.15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.1, 0.1);
        ctx.lineTo(0.9, 0.92);
        ctx.stroke();
    });

    define('vScreenRecord', '屏幕录制', 1.0, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.09;
        ctx.beginPath();
        ctx.arc(0.5, 0.5, 0.41, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0.5, 0.5, 0.19, 0, Math.PI * 2);
        ctx.fill();
    });

    define('vTimer', '计时器', 1.0, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.085;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0.5, 0.58, 0.36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = color;
        roundRect(ctx, 0.4, 0.02, 0.2, 0.1, 0.05);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0.5, 0.12);
        ctx.lineTo(0.5, 0.22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5, 0.58);
        ctx.lineTo(0.5, 0.36);
        ctx.moveTo(0.5, 0.58);
        ctx.lineTo(0.66, 0.66);
        ctx.stroke();
    });

    define('vMusic', '音乐', 1.0, (ctx, color) => {
        ctx.fillStyle = color;
        roundRect(ctx, 0.06, 0.62, 0.3, 0.24, 0.12);
        ctx.fill();
        roundRect(ctx, 0.56, 0.54, 0.3, 0.24, 0.12);
        ctx.fill();
        roundRect(ctx, 0.28, 0.12, 0.09, 0.62, 0.045);
        ctx.fill();
        roundRect(ctx, 0.78, 0.04, 0.09, 0.62, 0.045);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0.28, 0.12);
        ctx.lineTo(0.87, 0.04);
        ctx.lineTo(0.87, 0.22);
        ctx.lineTo(0.28, 0.3);
        ctx.closePath();
        ctx.fill();
    });

    define('vVoicemail', '语音留言', 1.4, (ctx, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.12;
        ctx.beginPath();
        ctx.arc(0.26, 0.5, 0.22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(1.14, 0.5, 0.22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.48, 0.5);
        ctx.lineTo(0.92, 0.5);
        ctx.stroke();
    });

    define('vFlashlight', '手电筒', 0.8, (ctx, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0.16, 0.04);
        ctx.lineTo(0.64, 0.04);
        ctx.lineTo(0.52, 0.42);
        ctx.lineTo(0.28, 0.42);
        ctx.closePath();
        ctx.fill();
        roundRect(ctx, 0.28, 0.42, 0.24, 0.54, 0.06);
        ctx.fill();
    });

}
