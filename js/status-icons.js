/**
 * @file 状态栏图标注册表
 * @description ICONS 注册表的门面：汇总网络/系统两组矢量图标并对外导出。
 */

import { define, defineText, roundRect } from './status-icons-core.js';
import { registerNetworkIcons } from './status-icons-network.js';
import { registerSystemIcons } from './status-icons-system.js';
import { registerExtraIcons, EXTRA_ICON_GROUPS } from './status-icons-extra.js';

export {
    getStatusIcon,
    isVectorIcon,
    getStatusIconAspect,
    drawStatusIcon
} from './status-icons-core.js';

registerNetworkIcons(define, defineText, roundRect);
registerSystemIcons(define, roundRect);
registerExtraIcons(define, defineText, roundRect);

export const STATUS_ICON_GROUPS = [
    {
        label: '网络与信号',
        icons: ['vIosSignal', 'vSignal', 'vIosDots', 'vWifi', 'v5G', 'vLTE', 'v4G', 'v3G', 'vAirplane', 'vCast', 'vVpn', 'vSync']
    },
    {
        label: '系统状态',
        icons: [
            'vAlarm', 'vTimer', 'vLocation', 'vHeadphones', 'vMoon', 'vRotationLock', 'vBluetooth',
            'vAirplay', 'vMic', 'vHotspot', 'vNfc', 'vVibrate', 'vBell', 'vSilent', 'vMusic',
            'vScreenRecord', 'vVoicemail', 'vFlashlight'
        ]
    },
    ...EXTRA_ICON_GROUPS
];
