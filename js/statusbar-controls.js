/**
 * @file 状态栏图标控件
 * @description
 * 负责生成图标库界面、处理拖拽排序/点击切换/自定义图标上传，
 * 并按机型应用默认的状态栏图标预设。所有模板共用这一套控件。
 */

import { PNG_ICONS, PNG_ICON_GROUPS } from './icon-library.js';
import { STATUS_ICON_GROUPS, drawStatusIcon, getStatusIcon, getStatusIconAspect } from './status-icons.js';
import { isIconCompatible } from './statusbar-presets.js';

/**
 * 用户上传的自定义图标（键名 -> Image 对象）。
 * @type {Object<string, HTMLImageElement>}
 */
const customIcons = {};

/**
 * 获取自定义图标资源表。
 * @returns {Object<string, HTMLImageElement>}
 */
export function getCustomIconImages() {
    return customIcons;
}

/**
 * 生成 PNG 图标选项的 HTML。
 * @param {object} icon
 * @returns {string}
 */
function pngIconHTML(icon) {
    const extraClass = icon.group === 'app' && !icon.file.includes('{suffix}') ? ' app-icon' : '';
    const image = `url('${icon.file.replace('{suffix}', '')}')`;
    return `<button type="button" class="icon-option${extraClass}" data-target="${icon.key}Toggle" data-draggable="true" data-group="${icon.group}" title="${icon.name}" aria-label="${icon.name}" aria-pressed="false" style="background-image: ${image}"></button>`;
}

/**
 * 生成矢量图标选项的 HTML。
 * @param {string} key
 * @param {string} group
 * @returns {string}
 */
function vectorIconHTML(key, group) {
    const icon = getStatusIcon(key);
    const name = icon ? icon.name : '矢量图标';
    return `<button type="button" class="icon-option icon-vector" data-target="${key}Toggle" data-draggable="true" data-vector="${key}" data-group="${group}" title="${name}" aria-label="${name}" aria-pressed="false"></button>`;
}

/**
 * 生成图标分组 HTML。
 * @param {string} groupId 分组标识
 * @param {string} label 分组名称
 * @param {string} content 图标 HTML
 * @returns {string}
 */
function groupHTML(groupId, label, content) {
    return `
        <div class="icon-group">
            <div class="icon-group-title">${label}</div>
            <div class="icon-group-items" data-group="${groupId}">${content}</div>
        </div>
    `;
}

/**
 * 生成状态栏图标控件区域。
 * @returns {string}
 */
export function buildStatusBarControlsHTML() {
    const makePngGroup = group => {
        const icons = PNG_ICONS.filter(icon => icon.group === group.id).map(pngIconHTML).join('');
        return groupHTML(group.id, group.label, icons);
    };
    const pngGroups = PNG_ICON_GROUPS.filter(group => group.id !== 'app').map(makePngGroup).join('');
    const appGroup = makePngGroup(PNG_ICON_GROUPS.find(group => group.id === 'app'));

    const vectorGroups = STATUS_ICON_GROUPS.map((group, index) => {
        const icons = group.icons.map(key => vectorIconHTML(key, `vector-${index}`)).join('');
        return groupHTML(`vector-${index}`, group.label, icons);
    }).join('');

    const checkboxes = [
        ...PNG_ICONS.map(icon => icon.key),
        ...STATUS_ICON_GROUPS.reduce((list, group) => list.concat(group.icons), [])
    ].map(key => `<input type="checkbox" class="control" data-id="${key}Toggle" data-icon-toggle="true" style="display: none;">`).join('');

    return `
        <div class="input-group">
            <label>状态栏图标 <span class="field-hint-inline">拖动排序 · 点击移出</span></label>
            <div class="statusbar-icon-selector is-active-dropzone-container">
                <div id="left-icons-dropzone" class="icon-sub-dropzone" data-zone="left"></div>
                <div id="right-icons-dropzone" class="icon-sub-dropzone" data-zone="right"></div>
            </div>
        </div>
        <details class="status-icon-library">
            <summary>&#x56fe;&#x6807;&#x5e93;&#x4e0e;&#x4e0a;&#x4f20;</summary>
            <div class="input-group">
            <div class="library-header">
                <label>图标库</label>
                <label class="button-like-label">
                    + 添加图标
                    <input type="file" id="custom-icon-upload" accept="image/*" style="display: none;">
                </label>
            </div>
            <div class="icon-library" id="available-icons-dropzone">
                ${pngGroups}
                ${vectorGroups}
                ${appGroup}
            </div>
            <p class="field-hint">&#x4ec5;&#x663e;&#x793a;&#x5f53;&#x524d;&#x673a;&#x578b;&#x517c;&#x5bb9;&#x7684;&#x56fe;&#x6807;&#x3002;</p>
            </div>
        </details>
        ${checkboxes}
    `;
}

/**
 * 读取当前状态栏左右两侧的图标目标 ID。
 * @returns {{left: string[], right: string[]}}
 */
export function readStatusBarIconTargets(device) {
    const read = selector => Array.from(document.querySelectorAll(`${selector} .icon-option`))
        .filter(icon => isCompatibleOption(icon, device)).map(icon => icon.dataset.target);
    return {
        left: read('#left-icons-dropzone'),
        right: read('#right-icons-dropzone')
    };
}

/**
 * 同步图标状态与隐藏复选框。
 * @param {HTMLElement} container
 * @param {HTMLElement} icon
 * @param {boolean} active
 */
function syncIconState(container, icon, active) {
    const checkbox = container.querySelector(`.control[data-id="${icon.dataset.target}"]`);
    icon.classList.toggle('active', active);
    icon.setAttribute('aria-pressed', String(active));
    if (checkbox) checkbox.checked = active;
}

function isCompatibleOption(icon, device) {
    return isIconCompatible(icon.dataset.target.replace(/Toggle$/, ''), device);
}

export function updateStatusIconCompatibility(device) {
    const container = document.getElementById('statusbar-controls-container');
    container.querySelectorAll('.icon-option').forEach(icon => {
        const compatible = isCompatibleOption(icon, device);
        if (!compatible && icon.closest('.icon-sub-dropzone')) returnToLibrary(container, icon);
        icon.hidden = !compatible;
        icon.draggable = compatible;
    });
    container.querySelectorAll('.icon-group').forEach(group => {
        group.hidden = !group.querySelector('.icon-option:not([hidden])');
    });
}

/**
 * 把图标放回它所属的图标库分组。
 * @param {HTMLElement} container
 * @param {HTMLElement} icon
 */
function returnToLibrary(container, icon) {
    const group = icon.dataset.group || 'system';
    const groupElement = container.querySelector(`.icon-group-items[data-group="${group}"]`)
        || container.querySelector('.icon-group-items');
    if (groupElement) groupElement.appendChild(icon);
    syncIconState(container, icon, false);
}

/**
 * 为矢量图标生成白色预览图。
 * @param {HTMLElement} container
 */
function renderVectorPreviews(container) {
    const size = 96;
    const padding = 18;
    const maxSize = size - padding * 2;
    container.querySelectorAll('.icon-option[data-vector]').forEach(option => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const previewCtx = canvas.getContext('2d');
        const key = option.dataset.vector;
        const aspect = getStatusIconAspect(key);
        const height = maxSize / Math.max(1, aspect);
        const width = height * aspect;
        drawStatusIcon(previewCtx, key, (size - width) / 2, (size - height) / 2, width, height, '#ffffff');
        option.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
    });
}

/**
 * 应用指定图标的排列预设。
 * @param {{left: string[], right: string[]}} preset
 * @param {Function} [drawCanvas] 重绘回调
 */
export function applyStatusBarPreset(preset, device) {
    const container = document.getElementById('statusbar-controls-container');
    if (!container) return;

    container.querySelectorAll('.icon-sub-dropzone .icon-option').forEach(icon => {
        returnToLibrary(container, icon);
    });

    const place = (keys, zoneSelector) => {
        const zone = container.querySelector(zoneSelector);
        if (!zone) return;
        keys.forEach(key => {
            if (!isIconCompatible(key, device)) return;
            const target = `${key}Toggle`;
            const icon = container.querySelector(`.icon-option[data-target="${target}"]`);
            if (!icon) return;
            zone.appendChild(icon);
            syncIconState(container, icon, true);
        });
    };

    place(preset.left || [], '#left-icons-dropzone');
    place(preset.right || [], '#right-icons-dropzone');

    updateStatusIconCompatibility(device);
}

/**
 * 初始化状态栏图标控件。
 * @param {Function} drawCanvas 重绘回调
 */
export function initializeStatusBarControls(drawCanvas, getDevice) {
    const container = document.getElementById('statusbar-controls-container');
    if (!container) return;

    const leftZone = container.querySelector('#left-icons-dropzone');
    const rightZone = container.querySelector('#right-icons-dropzone');
    if (!leftZone || !rightZone) return;

    renderVectorPreviews(container);

    let draggedItem = null;

    container.addEventListener('dragstart', event => {
        if (!event.target.matches('.icon-option[data-draggable="true"]')) return;
        if (!isCompatibleOption(event.target, getDevice())) {
            event.preventDefault();
            return;
        }
        draggedItem = event.target;
        event.dataTransfer?.setData('text/plain', draggedItem.dataset.target);
        setTimeout(() => { if (draggedItem) draggedItem.style.opacity = '0.5'; }, 0);
    });

    container.addEventListener('dragend', () => {
        if (!draggedItem) return;
        draggedItem.style.opacity = '1';
        draggedItem = null;
        container.querySelectorAll('.drag-over').forEach(zone => zone.classList.remove('drag-over'));
        drawCanvas();
    });

    const dropZones = [
        leftZone,
        rightZone,
        ...Array.from(container.querySelectorAll('.icon-group-items'))
    ];

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', event => {
            if (!draggedItem || !isCompatibleOption(draggedItem, getDevice())) return;
            event.preventDefault();
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', event => {
            event.preventDefault();
            zone.classList.remove('drag-over');
            if (!draggedItem || !isCompatibleOption(draggedItem, getDevice())) return;

            const isStatusBarZone = zone === leftZone || zone === rightZone;
            if (!isStatusBarZone) {
                returnToLibrary(container, draggedItem);
                updateStatusIconCompatibility(getDevice());
                drawCanvas();
                return;
            }

            const afterElement = getDragAfterElement(zone, event.clientX);
            if (afterElement) {
                zone.insertBefore(draggedItem, afterElement);
            } else {
                zone.appendChild(draggedItem);
            }

            syncIconState(container, draggedItem, true);
            updateStatusIconCompatibility(getDevice());
            drawCanvas();
        });
    });

    /**
     * 计算拖放插入位置。
     */
    function getDragAfterElement(zone, x) {
        const elements = [...zone.querySelectorAll('.icon-option:not([style*="opacity: 0.5"])')];
        return elements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // 点击切换：库中的图标点击后加入左侧，状态栏中的图标点击后移回图标库
    container.addEventListener('click', event => {
        const icon = event.target.closest('.icon-option[data-draggable="true"]');
        if (!icon || !isCompatibleOption(icon, getDevice())) return;

        if (leftZone.contains(icon) || rightZone.contains(icon)) {
            returnToLibrary(container, icon);
        } else {
            leftZone.appendChild(icon);
            syncIconState(container, icon, true);
        }
        updateStatusIconCompatibility(getDevice());
        drawCanvas();
    });

    // 自定义图标上传
    const uploader = container.querySelector('#custom-icon-upload');
    if (uploader) {
        uploader.addEventListener('change', event => {
            const file = event.target.files[0];
            if (!file || !file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = loadEvent => {
                const image = new Image();
                image.onload = () => {
                    if (!container.isConnected) return;
                    const key = `customIcon${Date.now()}`;
                    customIcons[key] = image;

                    const option = document.createElement('button');
                    option.type = 'button';
                    option.className = 'icon-option app-icon';
                    option.dataset.target = `${key}Toggle`;
                    option.dataset.draggable = 'true';
                    option.dataset.group = 'app';
                    option.title = file.name;
                    option.setAttribute('aria-label', file.name);
                    option.setAttribute('aria-pressed', 'false');
                    option.draggable = true;
                    option.style.backgroundImage = `url(${loadEvent.target.result})`;

                    const group = container.querySelector('.icon-group-items[data-group="app"]')
                        || container.querySelector('.icon-group-items');
                    if (group) group.appendChild(option);

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'control';
                    checkbox.dataset.id = `${key}Toggle`;
                    checkbox.dataset.iconToggle = 'true';
                    checkbox.style.display = 'none';
                    container.appendChild(checkbox);
                    updateStatusIconCompatibility(getDevice());

                    event.target.value = null;
                };
                image.src = loadEvent.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
}
