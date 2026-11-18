/**
 * @file 主应用程序逻辑
 * @description
 * 负责管理机型与状态栏设置、模板切换、资源加载、Canvas 绘制以及所有通用 UI 交互。
 */

import { DEVICE_GROUPS, DEFAULT_DEVICE_ID, getDeviceById, getDevicePreset } from './devices.js';
import { buildStatusIconAssets } from './icon-library.js';
import { getRandomStatusPreset, randomInt } from './statusbar-presets.js';
import { randomizePaymentFields } from './payment-random.js';
import { initializeBankPicker } from './bank-picker.js';
import {
    STATUS_BAR_STYLES,
    resolveStatusBarStyle,
    getStatusBarMetrics,
    drawStatusBar,
    drawStatusBarBackplate
} from './statusbar.js';
import {
    buildStatusBarControlsHTML,
    initializeStatusBarControls,
    applyStatusBarPreset,
    readStatusBarIconTargets,
    getCustomIconImages
} from './statusbar-controls.js';

// --- DOM 元素 ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const templateSelect = document.getElementById('template-select');
const deviceSelect = document.getElementById('device-select');
const statusBarStyleSelect = document.getElementById('statusbar-style-select');
const statusBarColorSelect = document.getElementById('statusbar-color-select');
const batteryChargingCheckbox = document.getElementById('battery-charging');
const batteryPercentCheckbox = document.getElementById('battery-percent');
const resetStatusBarBtn = document.getElementById('reset-statusbar-btn');
const randomStatusBarBtn = document.getElementById('random-statusbar-btn');
const randomPaymentBtn = document.getElementById('random-payment-btn');
const deviceInfo = document.getElementById('device-info');
const downloadBtn = document.getElementById('download-btn');
const statusbarControlsContainer = document.getElementById('statusbar-controls-container');
const siteRoot = new URL('../', import.meta.url);

// 切换模板时会克隆并替换该容器，以移除旧的事件监听器
let templateControlsContainer = document.getElementById('template-controls-container');

let currentTemplateModule = null;
let currentLoadedAssets = {};
let batchingControls = false;

function selectedDevice() {
    return getDeviceById(deviceSelect.value);
}

function refreshStatusControls() {
    const style = resolveStatusBarStyle(selectedDevice(), statusBarStyleSelect.value);
    randomStatusBarBtn.disabled = !currentTemplateModule || style === 'none';
}

function batchControlChanges(change) {
    batchingControls = true;
    try {
        change();
    } finally {
        batchingControls = false;
        drawCanvas();
    }
}

// --- 初始化下拉选项 ---

/**
 * 填充机型下拉框（按品牌/系列分组）。
 */
function populateDeviceSelect() {
    DEVICE_GROUPS.forEach(group => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.label;

        group.devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.id;
            option.textContent = device.name;
            optgroup.appendChild(option);
        });

        deviceSelect.appendChild(optgroup);
    });
    deviceSelect.value = DEFAULT_DEVICE_ID;
}

/**
 * 填充状态栏样式下拉框。
 */
function populateStatusBarStyleSelect() {
    STATUS_BAR_STYLES.forEach(style => {
        const option = document.createElement('option');
        option.value = style.id;
        option.textContent = style.name;
        statusBarStyleSelect.appendChild(option);
    });
    statusBarStyleSelect.value = 'auto';
}

/**
 * 更新机型信息提示。
 */
function updateDeviceInfo() {
    const device = getDeviceById(deviceSelect.value);
    const styleId = resolveStatusBarStyle(device, statusBarStyleSelect.value);
    const styleName = STATUS_BAR_STYLES.find(style => style.id === styleId);
    const metrics = getStatusBarMetrics(device, statusBarStyleSelect.value);
    const barHeight = Math.round(metrics.height / device.dpr);
    const barUnit = device.platform === 'ios' ? 'pt' : 'dp';
    deviceInfo.textContent = `${device.width} × ${device.height} px · ${device.dpr}x · ${device.brand} · ${styleName ? styleName.name : styleId} · 状态栏 ${barHeight}${barUnit}`;
}

// --- 核心功能 ---

/**
 * 异步加载一组图片资源。
 * @param {object} assetsToLoad 键值对：资源名 -> 路径
 * @returns {Promise<object>}
 */
function loadAssets(assetsToLoad) {
    if (!assetsToLoad || Object.keys(assetsToLoad).length === 0) {
        return Promise.resolve({});
    }

    const promises = Object.entries(assetsToLoad).map(([key, src]) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ key, img });
        img.onerror = () => reject(new Error(`资源加载失败: ${src}`));
        img.src = new URL(src, siteRoot).href;
    }));

    return Promise.all(promises).then(results => {
        const loaded = {};
        results.forEach(({ key, img }) => { loaded[key] = img; });
        return loaded;
    });
}

/**
 * 收集控制面板上的所有值。
 * @returns {object}
 */
function controlElements(selector) {
    return [templateControlsContainer, statusbarControlsContainer].flatMap(container => [...container.querySelectorAll(selector)]);
}

function collectControls() {
    const controls = {};
    controlElements('.control').forEach(element => {
        const id = element.dataset.id;
        if (!id) return;

        if (element.type === 'file') {
            if (currentLoadedAssets[id]) controls[id] = currentLoadedAssets[id];
        } else if (element.type === 'radio') {
            if (element.checked) controls[id] = element.value;
        } else {
            controls[id] = (element.type === 'checkbox') ? element.checked : element.value;
        }
    });
    return controls;
}

/**
 * 核心绘制函数：背景 -> 状态栏 -> 模板内容。
 * 画布尺寸与状态栏按所选机型绘制，模板内容等比缩放到机型分辨率。
 */
function drawCanvas() {
    if (!currentTemplateModule || batchingControls) return;

    const template = currentTemplateModule.template;
    const config = template.config;
    const device = getDeviceById(deviceSelect.value);
    const controls = collectControls();
    const assets = { ...currentLoadedAssets, ...getCustomIconImages() };

    canvas.width = device.width;
    canvas.height = device.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, device.width, device.height);

    // 1. 背景铺满所选机型分辨率
    if (assets.bg) {
        ctx.drawImage(assets.bg, 0, 0, device.width, device.height);
    } else if (template.drawBackdrop) {
        template.drawBackdrop(ctx, device.width, device.height);
    } else if (config.colors?.background) {
        ctx.fillStyle = config.colors.background;
        ctx.fillRect(0, 0, device.width, device.height);
    }

    // 2. 状态栏：先抹除背景中预置的状态栏元素，再按机型样式绘制
    const metrics = getStatusBarMetrics(device, statusBarStyleSelect.value);
    drawStatusBarBackplate(ctx, assets.bg, device, metrics.height);

    const autoColor = (config.colors && config.colors.statusBar) || '#000000';
    const colorMap = { dark: '#000000', light: '#FFFFFF' };
    const color = colorMap[statusBarColorSelect.value] || autoColor;

    const targets = readStatusBarIconTargets(device);
    drawStatusBar(ctx, {
        device,
        styleId: statusBarStyleSelect.value,
        color,
        time: controls.time,
        battery: controls.battery,
        charging: batteryChargingCheckbox.checked,
        showBatteryPercent: batteryPercentCheckbox.checked,
        leftTargets: targets.left,
        rightTargets: targets.right,
        assets
    });

    // 3. 模板内容：以模板设计尺寸绘制，并缩放到机型分辨率
    const scaleX = device.width / config.canvasWidth;
    const scaleY = device.height / config.canvasHeight;
    ctx.save();
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    template.draw(ctx, config, controls, assets);
    ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * 为动态添加的控件绑定通用事件。
 */
function bindControlListeners() {
    const activeContainer = templateControlsContainer;
    controlElements('.control').forEach(element => {
        const eventType = (element.type === 'file' || element.type === 'radio') ? 'change' : 'input';
        element.addEventListener(eventType, drawCanvas);
    });

    // 模板专属的图片上传
    activeContainer.querySelectorAll('input[type="file"].control').forEach(element => {
        element.addEventListener('change', event => {
            const file = event.target.files[0];
            const id = element.dataset.id;
            const fileNameDisplay = document.querySelector(`.file-name-display[data-id="${id}FileName"]`);

            if (!file) {
                delete currentLoadedAssets[id];
                if (fileNameDisplay) fileNameDisplay.textContent = '';
                drawCanvas();
                return;
            }
            if (!file.type.startsWith('image/')) {
                if (fileNameDisplay) fileNameDisplay.textContent = '非图片文件!';
                alert('请选择一个有效的图片文件！');
                return;
            }

            if (fileNameDisplay) fileNameDisplay.textContent = file.name;

            const reader = new FileReader();
            reader.onload = loadEvent => {
                const img = new Image();
                img.onload = () => {
                    if (!activeContainer.isConnected) return;
                    currentLoadedAssets[id] = img;
                    drawCanvas();
                };
                img.src = loadEvent.target.result;
            };
            reader.readAsDataURL(file);
        });
    });

    // 快捷按钮
    activeContainer.querySelectorAll('.quick-buttons button[data-target]').forEach(button => {
        button.addEventListener('click', () => {
            const targetInput = activeContainer.querySelector(`.control[data-id="${button.dataset.target}"]`);
            if (targetInput) {
                targetInput.value = button.dataset.value;
                targetInput.dispatchEvent(new Event('input'));
            }
        });
    });

    // 滑块数值显示
    controlElements('input[type="range"].control').forEach(slider => {
        const panel = slider.closest('fieldset');
        const valueSpan = panel?.querySelector(`.control-value[data-id="${slider.dataset.id}Value"]`);
        if (!valueSpan) return;
        valueSpan.textContent = slider.value;
        slider.addEventListener('input', () => { valueSpan.textContent = slider.value; });
    });
}

/**
 * 切换模板。
 * @param {string} templateName 模板目录名
 */
async function switchTemplate(templateName) {
    currentTemplateModule = null;
    randomPaymentBtn.disabled = true;
    downloadBtn.disabled = true;
    refreshStatusControls();
    const newContainer = templateControlsContainer.cloneNode(false);
    statusbarControlsContainer.replaceChildren();
    try {
        templateControlsContainer.replaceWith(newContainer);
        templateControlsContainer = newContainer;
        newContainer.setAttribute('aria-busy', 'true');

        templateControlsContainer.innerHTML = `<p>正在加载模板: ${templateName}...</p>`;

        const modulePath = `../templates/${templateName}/main.js`;
        const module = await import(modulePath);
        if (!newContainer.isConnected) return;
        const template = module.template;

        // 注入模板控件 + 通用状态栏图标控件
        const templateSpecificHTML = template.getControlsHTML();
        newContainer.innerHTML = templateSpecificHTML.replace(
            '<!-- ICON_CONTROLS_PLACEHOLDER -->',
            buildStatusBarControlsHTML()
        );
        const statusFields = newContainer.querySelector(':scope > [data-statusbar-controls]');
        if (statusFields) statusbarControlsContainer.append(statusFields);

        // 按模板主题加载通用图标（白天/夜间）
        const themeSuffix = template.theme === 'night' ? 'nighi' : '';
        const assetsToLoad = { ...buildStatusIconAssets(themeSuffix), ...template.assets };
        const assets = await loadAssets(assetsToLoad);
        if (!newContainer.isConnected) return;
        currentLoadedAssets = assets;
        currentTemplateModule = module;

        bindControlListeners();
        initializeBankPicker(newContainer);
        initializeStatusBarControls(drawCanvas, selectedDevice);

        // 应用当前机型对应的图标预设
        const device = selectedDevice();
        applyStatusBarPreset(getDevicePreset(device, statusBarStyleSelect.value), device);

        if (typeof module.initialize === 'function') {
            module.initialize(drawCanvas);
        }

        updateDeviceInfo();

        // 等待字体加载后再绘制，避免文字使用后备字体
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        if (!newContainer.isConnected) return;
        drawCanvas();
        refreshStatusControls();
        randomPaymentBtn.disabled = false;
        downloadBtn.disabled = false;

    } catch (error) {
        if (!newContainer.isConnected) return;
        currentTemplateModule = null;
        refreshStatusControls();
        statusbarControlsContainer.replaceChildren();
        console.error(`加载模板 "${templateName}" 失败:`, error);
        templateControlsContainer.innerHTML = '<p style="color: red;">加载模板失败，请检查浏览器控制台获取详细错误信息。</p>';
    } finally {
        newContainer.setAttribute('aria-busy', 'false');
    }
}

// --- 事件绑定 ---

templateSelect.addEventListener('change', event => {
    switchTemplate(event.target.value);
});

function resetStatusIcons() {
    updateDeviceInfo();
    refreshStatusControls();
    if (!currentTemplateModule) return;
    const device = selectedDevice();
    applyStatusBarPreset(getDevicePreset(device, statusBarStyleSelect.value), device);
    drawCanvas();
}

deviceSelect.addEventListener('change', resetStatusIcons);
statusBarStyleSelect.addEventListener('change', resetStatusIcons);

statusBarColorSelect.addEventListener('input', drawCanvas);
batteryChargingCheckbox.addEventListener('input', drawCanvas);
batteryPercentCheckbox.addEventListener('input', drawCanvas);

resetStatusBarBtn.addEventListener('click', resetStatusIcons);

randomStatusBarBtn.addEventListener('click', () => {
    const device = selectedDevice();
    batchControlChanges(() => {
        applyStatusBarPreset(getRandomStatusPreset(device, statusBarStyleSelect.value), device);
        const time = statusbarControlsContainer.querySelector('.control[data-id="time"]');
        if (time) time.value = `${String(randomInt(7, 23)).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}`;
        const battery = statusbarControlsContainer.querySelector('.control[data-id="battery"]');
        if (battery) {
            battery.value = randomInt(18, 98);
            battery.dispatchEvent(new Event('input'));
        }
        batteryChargingCheckbox.checked = Math.random() < 0.18;
    });
});

randomPaymentBtn.addEventListener('click', () => {
    batchControlChanges(() => randomizePaymentFields(templateControlsContainer));
});

downloadBtn.addEventListener('click', () => {
    if (!currentTemplateModule) {
        alert('请先选择一个模板！');
        return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const fileName = `${templateSelect.value}-${deviceSelect.value}-${year}-${month}-${day}.png`;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// --- 启动 ---

populateDeviceSelect();
populateStatusBarStyleSelect();
updateDeviceInfo();
switchTemplate(templateSelect.value);
