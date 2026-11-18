import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { DEVICES, getDeviceById, getDevicePreset } from '../js/devices.js';
import { buildStatusIconAssets, PNG_ICONS } from '../js/icon-library.js';
import { getStatusIcon, STATUS_ICON_GROUPS } from '../js/status-icons.js';
import { drawStatusBar, getStatusBarMetrics, STATUS_BAR_STYLES } from '../js/statusbar.js';
import { getRandomStatusPreset, isIconCompatible } from '../js/statusbar-presets.js';

const appIcons = new Set(PNG_ICONS.filter(icon => icon.group === 'app').map(icon => icon.key));

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
            for (const { left, right } of presets.slice(1)) {
                assert.ok(!right.includes('vWifi') || !right.some(key => /^v(?:[345]G|LTE)$/.test(key)));
                assert.ok(right.every(key => !appIcons.has(key)));
                const apps = left.filter(key => appIcons.has(key));
                if (id !== 'none' && id !== 'minimal') {
                    assert.ok(apps.length >= 1 && apps.length <= 2, `${device.id}/${id}: ${apps.length} apps`);
                }
            }
        }
    }
});

test('random apps render left of the cutout even with a wide time label', () => {
    for (const [id, expectedCount] of [['iphone-13-mini', 1], ['iphone-15-pro', 2], ['galaxy-s24', 2]]) {
        const device = getDeviceById(id);
        const { left, right } = getRandomStatusPreset(device, 'auto', () => 0.99);
        const apps = left.filter(key => appIcons.has(key));
        assert.equal(apps.length, expectedCount, id);

        const drawn = [];
        const noop = () => {};
        const context = new Proxy({
            measureText: () => ({ width: 48 * device.dpr }),
            drawImage: (image, x, _y, width) => drawn.push({ key: image.key, rightEdge: x + width })
        }, { get: (target, key) => target[key] ?? noop });
        const assets = Object.fromEntries(apps.map(key => [key, { key, width: 128, height: 100 }]));
        drawStatusBar(context, {
            device, styleId: 'auto', color: '#000', time: '23:59', battery: 80,
            leftTargets: left.map(key => `${key}Toggle`), rightTargets: right.map(key => `${key}Toggle`), assets
        });
        assert.deepEqual(drawn.map(icon => icon.key), apps, id);
        const { cutout } = getStatusBarMetrics(device, 'auto');
        const leftBoundary = cutout.type === 'circle' ? cutout.cx - cutout.radius : cutout.x;
        assert.ok(drawn.every(icon => icon.rightEdge <= leftBoundary), id);
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
