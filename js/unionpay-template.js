import { drawRoundedRect } from './utils.js';
import { MERCHANT_ASSETS, merchantOptionsHTML } from './merchant-icons.js';

const txt = {
    app: '\u4e91\u95ea\u4ed8App', success: '\u652f\u4ed8\u6210\u529f', result: '\u4ea4\u6613\u6210\u529f',
    detail: '\u4e91\u95ea\u4ed8\u4ea4\u6613\u8be6\u60c5', status: '\u5f53\u524d\u72b6\u6001',
    merchant: '\u5546\u6237\u540d\u79f0', amount: '\u8ba2\u5355\u91d1\u989d', method: '\u4ed8\u6b3e\u65b9\u5f0f',
    paymentTime: '\u8ba2\u5355\u65f6\u95f4', transaction: '\u4ea4\u6613\u6d41\u6c34\u53f7', order: '\u8ba2\u5355\u7f16\u53f7',
    voucher: '\u4ed8\u6b3e\u51ed\u8bc1\u53f7', merchantOrder: '\u5546\u6237\u8ba2\u5355\u53f7',
    city: '\u57ce\u5e02', company: '\u516c\u53f8', account: '\u7528\u6237\u53f7', offer: '\u4f18\u60e0\u4fe1\u606f',
    discount: '\u4f18\u60e0\u91d1\u989d', scene: '\u4ea4\u6613\u573a\u666f', online: '\u7ebf\u4e0a\u652f\u4ed8', offline: '\u7ebf\u4e0b\u6d88\u8d39',
    electricity: '\u7535\u8d39\u7f34\u8d39', water: '\u6c34\u8d39\u7f34\u8d39', history: '\u5728\u6b64\u5546\u6237\u7684\u4ea4\u6613',
    cardAbc: '\u519c\u4e1a\u94f6\u884c\u94f6\u8054\u4fe1\u7528\u5361 [0000]',
    cardCmb: '\u62db\u5546\u94f6\u884c\u94f6\u8054\u50a8\u84c4\u5361 [0000]',
    cardIcbc: '\u5de5\u5546\u94f6\u884c\u94f6\u8054\u50a8\u84c4\u5361 [0000]',
    cafe: '\u661f\u69d0\u5496\u5561', sampleCity: '\u6f84\u6c34\u5e02',
    defaultOffer: '\u4f18\u60e0\u7acb\u51cf', done: '\u5b8c\u6210',
    logo: '\u5546\u6237\u56fe\u6807', upload: '\u4e0a\u4f20\u56fe\u6807',
    statusbar: '\u9876\u90e8\u72b6\u6001\u680f', clock: '\u65f6\u95f4', battery: '\u7535\u91cf'
};

const config = { canvasWidth: 573, canvasHeight: 1280, colors: { statusBar: '#17191d' } };
const centerX = config.canvasWidth / 2;
const selectedMerchant = 'merchantCafe';
const teal = '#29cdb1';
const red = '#d92128';
const isUtility = scene => scene === 'electricity' || scene === 'water';
const formatter = new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = amount => `\u00a5${formatter.format(amount)}`;
const cents = value => Math.min(99999999999, Math.max(0, Math.round((Number(value) || 0) * 100)));

function input(id, label, value, { type = 'text', when, step } = {}) {
    return `<div class="input-group"${when ? ` data-unionpay-when="${when}"` : ''}>
        <label for="unionpay-${id}">${label}</label>
        <input id="unionpay-${id}" type="${type}" class="control" data-id="${id}" value="${value}"${step ? ` step="${step}"` : ''}>
    </div>`;
}

function detailControls() {
    return `
        <div class="input-group">
            <label for="unionpay-scene">${txt.scene}</label>
            <select id="unionpay-scene" class="control" data-id="unionPayScene">
                ${['online', 'offline', 'electricity', 'water'].map(scene => `<option value="${scene}">${txt[scene]}</option>`).join('')}
            </select>
        </div>
        ${input('deductionAmount', txt.discount, '0.18', { when: 'retail' })}
        ${input('discountText', txt.offer, txt.defaultOffer, { when: 'retail' })}
        ${input('city', txt.city, txt.sampleCity, { when: 'utility' })}
        ${input('company', txt.company, '', { when: 'utility' })}
        ${input('account', txt.account, 'DEMO-0001', { when: 'utility' })}
        ${input('paymentTime', txt.paymentTime, '2026-03-05T09:41:22', { type: 'datetime-local', step: 1 })}
        ${input('transactionId', txt.transaction, 'DEMO-TXN-0001', { when: 'offline' })}
        ${input('voucher', txt.voucher, 'DEMO-VOUCHER-0001', { when: 'offline' })}
        ${input('orderNo', txt.order, 'DEMO-ORDER-0001', { when: 'not-offline' })}
        ${input('merchantOrderNo', txt.merchantOrder, 'DEMO-MERCHANT-0001')}
        <div class="input-group" data-unionpay-when="retail">
            <label>${txt.logo}</label>
            <div class="merchant-icon-selector">${merchantOptionsHTML(selectedMerchant)}</div>
            <input type="hidden" class="control" data-id="merchantIconSelection" value="${selectedMerchant}">
            <label class="button-like-label" for="unionpay-avatar">${txt.upload}</label>
            <input type="file" id="unionpay-avatar" class="control" data-id="merchantIcon" accept="image/*" hidden>
            <span class="file-name-display" data-id="merchantIconFileName"></span>
        </div>`;
}

function controlsHTML(details) {
    const cards = [txt.cardAbc, txt.cardCmb, txt.cardIcbc].map(card =>
        `<button type="button" data-target="paymentMethod" data-value="${card}">${card.slice(0, 4)}</button>`
    ).join('');
    return `
        <fieldset data-statusbar-controls>
            <legend>${txt.statusbar}</legend>
            ${input('time', txt.clock, '21:23', { type: 'time' })}
            <div class="input-group">
                <label for="unionpay-battery">${txt.battery}: <span class="control-value" data-id="batteryValue">57</span>%</label>
                <input id="unionpay-battery" type="range" class="control" data-id="battery" min="0" max="100" value="57">
            </div>
            <!-- ICON_CONTROLS_PLACEHOLDER -->
        </fieldset>
        <fieldset>
            <legend>${details ? txt.detail : txt.success}</legend>
            ${input('merchantName', txt.merchant, details ? txt.cafe : txt.app)}
            ${input('amount', txt.amount, details ? '29.00' : '100.00')}
            ${input('paymentMethod', txt.method, txt.cardAbc)}
            <div class="quick-buttons">${cards}</div>
            ${details ? detailControls() : ''}
        </fieldset>`;
}

export function initializeUnionPay(drawCanvas) {
    const container = document.getElementById('template-controls-container');
    const scene = container.querySelector('[data-id="unionPayScene"]');
    if (!scene) return;
    const updateScene = () => {
        const conditions = { retail: !isUtility(scene.value), utility: isUtility(scene.value),
            offline: scene.value === 'offline', 'not-offline': scene.value !== 'offline' };
        container.querySelectorAll('[data-unionpay-when]').forEach(group => {
            group.hidden = !conditions[group.dataset.unionpayWhen];
        });
    };
    scene.addEventListener('input', updateScene);
    updateScene();
    const picker = container.querySelector('.merchant-icon-selector');
    picker.addEventListener('click', event => {
        const option = event.target.closest('.merchant-icon-option');
        if (!option) return;
        picker.querySelector('.selected')?.classList.remove('selected');
        option.classList.add('selected');
        container.querySelector('[data-id="merchantIconSelection"]').value = option.dataset.assetKey;
        drawCanvas();
    });
}

function text(ctx, value, x, y, { size = 21, color = '#17191d', weight = 400, align = 'center', maxWidth = 490 } = {}) {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px "PingFang", sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(String(value ?? ''), x, y, maxWidth);
}

function box(ctx, x, y, w, h, radius, color) {
    drawRoundedRect(ctx, x, y, w, h, radius);
    if (color) {
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function stroke(ctx, path, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(new Path2D(path));
}

function divider(ctx, x, y, width) {
    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(x, y, width, 1);
}

function merchantHistoryIcon(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    box(ctx, -17, -17, 34, 34, 17, '#f6f6f6');
    stroke(ctx, 'M-9 11V-9Q-9 -11 -7 -11H7Q9 -11 9 -9V11Q4.5 7 0 11Q-4.5 7 -9 11Z', '#272c32', 1.6);
    stroke(ctx, 'M-3 -5L0 -1L3 -5M-3 -1H3M-3 2H3M0 -1V5', '#272c32', 1.3);
    ctx.restore();
}

function bottom(ctx) {
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 1245, config.canvasWidth, 35);
    box(ctx, 191, 1259, 191, 6, 3, '#ababab');
}

function drawSuccess(ctx, controls) {
    box(ctx, 211, 102, 33, 33, 16.5, teal);
    stroke(ctx, 'M220 118l5 5 10-10', '#ffffff', 3);
    text(ctx, txt.success, 261, 120, { size: 27, color: teal, weight: 700, align: 'left' });
    text(ctx, controls.merchantName, centerX, 213);
    text(ctx, money(cents(controls.amount) / 100), centerX, 278, { size: 60, weight: 700 });
    divider(ctx, 47, 368, 479);
    text(ctx, txt.method, 47, 415, { size: 20, weight: 700, align: 'left' });
    text(ctx, controls.paymentMethod, 526, 415, { size: 20, color: '#444444', align: 'right', maxWidth: 376 });
    box(ctx, 159, 1132, 255, 67, 33, null);
    ctx.strokeStyle = red;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    text(ctx, txt.done, centerX, 1167, { size: 23, weight: 700, color: red });
    bottom(ctx);
}

function detailRows(controls, scene) {
    const gross = cents(controls.amount);
    const discount = isUtility(scene) ? 0 : Math.min(gross, cents(controls.deductionAmount));
    const rows = [[txt.status, txt.result], [txt.amount, money(gross / 100)], [txt.method, controls.paymentMethod]];
    if (isUtility(scene)) rows.push([txt.city, controls.city], [txt.company, controls.company || controls.merchantName], [txt.account, controls.account]);
    const parts = controls.paymentTime?.match(/^(\d+)-(\d+)-(\d+)T(\d{2}:\d{2})(?::(\d{2}))?$/);
    const time = parts ? `${parts[1]}\u5e74${Number(parts[2])}\u6708${Number(parts[3])}\u65e5 ${parts[4]}:${parts[5] ?? '00'}` : '';
    rows.push([txt.paymentTime, time]);
    if (scene === 'offline') rows.push([txt.transaction, controls.transactionId], [txt.voucher, controls.voucher]);
    else rows.push([txt.order, controls.orderNo]);
    rows.push([txt.merchantOrder, controls.merchantOrderNo]);
    return { rows, net: (gross - discount) / 100, promo: discount ? `${controls.discountText || txt.offer} -${money(discount / 100)}` : '' };
}

function wrap(ctx, value, width = 291) {
    ctx.font = '21px "PingFang", sans-serif';
    const lines = [''];
    for (const ch of Array.from(String(value ?? '').trim())) {
        const last = lines.length - 1;
        if (ch === '\n' || ctx.measureText(lines[last] + ch).width > width) {
            if (lines.length === 2) {
                while (ctx.measureText(lines[last] + '\u2026').width > width) lines[last] = lines[last].slice(0, -1);
                lines[last] += '\u2026';
                break;
            }
            lines.push(ch === '\n' ? '' : ch);
        } else lines[last] += ch;
    }
    return lines;
}

function merchantAvatar(ctx, controls, assets, scene) {
    if (isUtility(scene)) {
        const electricity = scene === 'electricity';
        box(ctx, 253, 214, 67, 67, 17, electricity ? '#fff1e1' : '#e5f3ff');
        const path = electricity ? 'M289 226l-20 27h15l-1 16 21-28h-15z'
            : 'M286 227c-8 11-16 18-16 27a16 16 0 0 0 32 0c0-9-8-16-16-27z';
        ctx.fillStyle = electricity ? '#faa020' : '#0999f6';
        ctx.fill(new Path2D(path));
        return;
    }
    const image = controls.merchantIcon || assets[controls.merchantIconSelection];
    if (!image) return;
    ctx.save();
    box(ctx, 253, 214, 67, 67, 17, '#fff1e1');
    ctx.clip();
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    ctx.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 253, 214, 67, 67);
    ctx.restore();
}

function drawDetails(ctx, controls, assets) {
    const scene = controls.unionPayScene || 'online';
    const { rows, net, promo } = detailRows(controls, scene);
    const values = rows.map(([label, value]) => [label, wrap(ctx, value)]);
    const offer = promo ? wrap(ctx, promo) : [];
    const startY = offer.length ? 550 + Math.max(0, offer.length - 1) * 25 : 494;
    const endY = startY + values.reduce((sum, [, lines]) => sum + 45 + (lines.length - 1) * 25, 0) + 50;

    text(ctx, txt.detail, centerX, 104, { size: 28, weight: 700 });
    stroke(ctx, 'M52 90L40 102l12 13', '#272c32', 3.2);
    stroke(ctx, 'M512 103v-5a13 13 0 0 1 26 0v5m-26-5h-2a3 3 0 0 0 0 7h2m26-7h2a3 3 0 0 1 0 7h-2c0 8-6 12-13 12', '#272c32', 2.5);
    box(ctx, 24, 166, 525, endY - 166, 15, '#ffffff');
    merchantAvatar(ctx, controls, assets, scene);
    const name = isUtility(scene) ? controls.company || controls.merchantName : controls.merchantName;
    text(ctx, name, centerX, 313, { size: 24, maxWidth: 459 });
    text(ctx, `\u2212${money(net)}`, centerX, 369, { size: 38, weight: 700 });
    divider(ctx, 53, 439, 467);

    const cell = (value, x, y, color) => text(ctx, value, x, y, { align: 'left', color, maxWidth: 291 });
    if (offer.length) {
        cell(txt.offer, 53, 477, '#707070');
        offer.forEach((line, index) => cell(line, 227, 477 + 31 * index, red));
        divider(ctx, 53, startY - 55, 467);
    }
    let y = startY;
    for (const [label, lines] of values) {
        cell(label, 53, y, '#707070');
        lines.forEach((line, index) => cell(line, 227, y + 25 * index));
        y += 45 + (lines.length - 1) * 25;
    }
    if (!isUtility(scene)) {
        const panelY = endY + 22;
        box(ctx, 24, panelY, 525, 71, 14, '#ffffff');
        merchantHistoryIcon(ctx, 68, panelY + 36);
        text(ctx, txt.history, 101, panelY + 36, { size: 21, align: 'left' });
        stroke(ctx, `M513 ${panelY + 29}l7 7-7 7`, '#ababab', 2);
    }
    bottom(ctx);
}

export function createUnionPayTemplate(details) {
    return {
        theme: 'night',
        config,
        assets: details ? MERCHANT_ASSETS : {},
        getControlsHTML: () => controlsHTML(details),
        drawBackdrop(ctx, width, height) {
            if (details) {
                const gradient = ctx.createLinearGradient(0, 0, 0, height * 0.35);
                gradient.addColorStop(0, '#e0eefb');
                gradient.addColorStop(1, '#f3f3f3');
                ctx.fillStyle = gradient;
            } else ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
        },
        draw: (ctx, _config, controls, assets) => details ? drawDetails(ctx, controls, assets) : drawSuccess(ctx, controls)
    };
}
