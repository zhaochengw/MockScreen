import { MERCHANT_PRESETS } from './merchant-icons.js';
import { pick, randomInt } from './statusbar-presets.js';
import { BANKS, formatBankPayment } from './bank-picker.js';

export function randomizePaymentFields(container, rng = Math.random) {
    const field = id => container.querySelector(`.control[data-id="${id}"]`);
    const set = (id, value) => {
        const input = field(id);
        if (!input) return;
        if (input.type === 'checkbox') input.checked = value;
        else input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const radio = name => pick([...container.querySelectorAll(`input[type=radio][name="${name}"]`)], rng)?.click();
    const merchant = pick(MERCHANT_PRESETS, rng);
    for (const id of ['merchantName', 'shopName', 'payee', 'merchantFullName', 'payeeFullName']) set(id, merchant.name);
    for (const id of ['product', 'productDesc']) set(id, merchant.product);
    const amount = randomInt(merchant.min * 100, merchant.max * 100, rng);
    set('amount', (amount / 100).toFixed(2));

    // Leave a user-uploaded image intact.
    if (!field('merchantIcon')?.files.length) {
        container.querySelector(`.merchant-icon-option[data-asset-key="${merchant.key}"]`)?.click();
    }

    for (const id of ['methodInput', 'paymentMethod', 'helpLinkText']) {
        const input = field(id);
        if (!input) continue;
        const quickOptions = [...container.querySelectorAll(`.quick-buttons button[data-target="${id}"]`)];
        if (id === 'helpLinkText' || (quickOptions.length && rng() < 0.25)) pick(quickOptions, rng)?.click();
        else set(id, formatBankPayment(pick(BANKS, rng), rng() < 0.4 ? 'credit' : 'debit', '0000', input.id === 'unionpay-paymentMethod'));
    }

    set('notificationToggle', rng() < 0.35);
    set('deductionToggle', rng() < 0.35);
    set('deductionAmount', (randomInt(1, Math.min(88, amount - 1), rng) / 100).toFixed(2));
    for (const name of ['shake-banner', 'bill-service-choice', 'paymentRewardChoiceRadios', 'billManagementChoiceRadios']) radio(name);
    const rewards = [...container.querySelectorAll('.reward-checkbox')];
    const first = pick(rewards, rng);
    const second = rng() < 0.55 ? pick(rewards.filter(item => item !== first), rng) : undefined;
    rewards.forEach(item => {
        if (item.checked !== (item === first || item === second)) item.click();
    });
}
