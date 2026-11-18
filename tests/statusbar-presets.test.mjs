import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { DEVICES, getDeviceById, getDevicePreset } from '../js/devices.js';
import { buildStatusIconAssets } from '../js/icon-library.js';
import { getStatusIcon, STATUS_ICON_GROUPS } from '../js/status-icons.js';
import { STATUS_BAR_STYLES } from '../js/statusbar.js';
import { getRandomStatusPreset, isIconCompatible } from '../js/statusbar-presets.js';

test('system and brand restrictions do not affect generic or custom icons', () => {
    const iphone = getDeviceById('iphone-15-pro-max');
    const xiaomi = getDeviceById('xiaomi-15');
    const huawei = getDeviceById('huawei-mate-60-pro');
    const samsung = getDeviceById('galaxy-s24-ultra');
    assert.ok(isIconCompatible('Ioswifi', iphone));
    assert.ok(!isIconCompatible('Ioswifi', xiaomi));
    assert.ok(!isIconCompatible('vSignal', iphone));
    assert.ok(getStatusIcon('vMiHd'));
    assert.ok(getStatusIcon('vHw5gAdvanced'));
    assert.ok(isIconCompatible('vMiHd', xiaomi));
    assert.ok(!isIconCompatible('vMiHd', huawei));
    assert.ok(isIconCompatible('vHw5gAdvanced', huawei));
    assert.ok(!isIconCompatible('vOneUiRoutine', huawei));
    assert.ok(isIconCompatible('vOneUiRoutine', samsung));
    for (const device of DEVICES) {
        assert.ok(isIconCompatible('vWifi', device));
        assert.ok(isIconCompatible('iconUnionPay', device));
        assert.ok(isIconCompatible('customIcon123', device));
    }
});

test('default and randomized presets stay compatible for every device and style override', () => {
    for (const device of DEVICES) {
        for (const { id } of STATUS_BAR_STYLES) {
            const presets = [getDevicePreset(device, id), ...[0.05, 0.5, 0.7, 0.99].map(value =>
                getRandomStatusPreset(device, id, () => value))];
            for (const { left, right } of presets) {
                const keys = [...left, ...right];
                assert.equal(keys.length, new Set(keys).size);
                for (const key of keys) assert.ok(isIconCompatible(key, device), `${device.id}/${id}/${key}`);
                if (id === 'none' || id === 'minimal') assert.equal(keys.length, 0);
            }
            for (const { right } of presets.slice(1)) {
                assert.ok(!right.includes('vWifi') || !right.some(key => /^v(?:[345]G|LTE)$/.test(key)));
            }
        }
    }
});

test('listed icons are registered and both image variants resolve to local files', () => {
    for (const group of STATUS_ICON_GROUPS) {
        for (const key of group.icons) assert.ok(getStatusIcon(key), key);
    }
    for (const suffix of ['', 'nighi']) {
        const paths = buildStatusIconAssets(suffix);
        assert.ok(!Object.keys(paths).some(key => /google|chrome/i.test(key)));
        for (const path of Object.values(paths)) assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), path);
    }
});
