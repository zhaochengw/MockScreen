import { getDevicePreset } from './devices.js';
import { PNG_ICONS } from './icon-library.js';
import { getStatusIcon } from './status-icons.js';

const pngGroups = new Map(PNG_ICONS.map(icon => [icon.key, icon.group]));
const systemOnly = {
    ios: new Set(['vIosSignal', 'vIosDots', 'vAirplay', 'vRotationLock', 'vIosFocus', 'vIosPrivacy']),
    android: new Set(['vSignal', 'vCast', 'vSync', 'vVoLTE', 'vVoWiFi', 'vAndroidDataSaver',
        'iconwifia', 'iconlte4Ga', 'iconlte4Gb', 'iconlte3G', 'iconlte5Gb'])
};

const brandOnly = new Map([
    ['vMiHd', ['Xiaomi', 'Redmi']],
    ['vHw5gAdvanced', ['Huawei', 'Honor']],
    ['vOneUiRoutine', ['Samsung']]
]);

export function isIconCompatible(key, device) {
    const brands = brandOnly.get(key);
    if (brands) return device.platform === 'android' && brands.includes(device.brand);
    if (pngGroups.get(key) === 'ios' || systemOnly.ios.has(key)) return device.platform === 'ios';
    if (systemOnly.android.has(key)) return device.platform === 'android';
    return pngGroups.has(key) || Boolean(getStatusIcon(key)) || /^customIcon\d+$/.test(key);
}

export function randomInt(min, max, rng = Math.random) {
    return min + Math.floor(rng() * (max - min + 1));
}

export function pick(items, rng = Math.random) {
    return items.length ? items[randomInt(0, items.length - 1, rng)] : undefined;
}

export function getRandomStatusPreset(device, style, rng = Math.random) {
    const preset = getDevicePreset(device, style);
    if (!preset.right.length) return preset;

    const actualStyle = style && style !== 'auto' ? style : device.style;
    const compatible = keys => keys.filter(key => isIconCompatible(key, device));
    const ios = device.platform === 'ios';

    // A typical system bar shows either Wi-Fi or the cellular label, not both.
    const wifi = rng() < 0.65;
    preset.right = preset.right.filter(key => wifi ? !/^v(?:[345]G|LTE)$/.test(key) : key !== 'vWifi');
    if (actualStyle === 'classic-ios' && ios && !wifi) preset.left.push('vLTE');

    const statuses = compatible(ios
        ? ['Ioslocat', 'Iosbell', 'vIosFocus', 'vAlarm', 'vMoon', 'vBluetooth']
        : ['vAlarm', 'vBluetooth', 'vSilent', 'vNfc', 'vVibrate', 'vAndroidDataSaver',
            'vOneUiRoutine', 'vMiHd', 'vHw5gAdvanced']);
    const status = pick(statuses, rng);
    if (status) preset.left.push(status);

    // iOS does not show normal app notification icons in the system bar.
    if (!ios && rng() < 0.75) {
        const app = pick(compatible(['iconWechat', 'iconTaobao', 'iconQQ', 'iconDingtalk', 'iconMeituan', 'iconBilibili']), rng);
        if (app) preset.left.push(app);
    }
    return preset;
}
