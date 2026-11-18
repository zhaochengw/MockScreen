export const BANKS = [
    '\u5de5\u5546\u94f6\u884c', '\u519c\u4e1a\u94f6\u884c', '\u4e2d\u56fd\u94f6\u884c', '\u5efa\u8bbe\u94f6\u884c',
    '\u4ea4\u901a\u94f6\u884c', '\u90ae\u50a8\u94f6\u884c', '\u62db\u5546\u94f6\u884c', '\u4e2d\u4fe1\u94f6\u884c',
    '\u5149\u5927\u94f6\u884c', '\u534e\u590f\u94f6\u884c', '\u6c11\u751f\u94f6\u884c', '\u5e73\u5b89\u94f6\u884c',
    '\u5174\u4e1a\u94f6\u884c', '\u6d66\u53d1\u94f6\u884c', '\u5e7f\u53d1\u94f6\u884c', '\u5317\u4eac\u94f6\u884c',
    '\u4e0a\u6d77\u94f6\u884c', '\u4e2d\u539f\u94f6\u884c'
];
export const CARD_TYPES = { debit: '\u50a8\u84c4\u5361', credit: '\u4fe1\u7528\u5361' };

export function formatBankPayment(bank, type, tail = '0000', unionPay = false) {
    const digits = /^\d{4}$/.test(tail) ? tail : '0000';
    const card = CARD_TYPES[type] ?? CARD_TYPES.debit;
    return unionPay ? `${bank}\u94f6\u8054${card} [${digits}]` : `${bank}${card}(${digits})`;
}

export function initializeBankPicker(container) {
    const input = container.querySelector('input[data-id="paymentMethod"], input[data-id="methodInput"]');
    if (!input) return;
    const unionPay = input.id === 'unionpay-paymentMethod';
    const group = document.createElement('details');
    group.className = 'bank-picker';
    group.innerHTML = `
        <summary>&#x66f4;&#x591a;&#x94f6;&#x884c;&#x5361;</summary>
        <div class="quick-buttons bank-buttons">${Object.entries(CARD_TYPES).map(([type, text]) =>
            `<button type="button" data-card-type="${type}" aria-pressed="false">${text}</button>`).join('')}</div>
        <div class="quick-buttons bank-buttons">${BANKS.map((bank, index) =>
            `<button type="button" data-bank="${index}" aria-pressed="false">${bank}</button>`).join('')}</div>
    `;
    input.parentElement.append(group);

    const getType = () => input.value.includes(CARD_TYPES.credit) ? 'credit' : 'debit';
    const getBank = () => BANKS.find(bank => input.value.startsWith(bank));
    const sync = () => {
        group.querySelectorAll('[data-card-type]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.cardType === getType()));
        });
        group.querySelectorAll('[data-bank]').forEach(button => {
            button.setAttribute('aria-pressed', String(BANKS[button.dataset.bank] === getBank()));
        });
    };
    input.addEventListener('input', sync);
    group.addEventListener('click', event => {
        const button = event.target.closest('button[data-bank], button[data-card-type]');
        if (!button) return;
        const selectedBank = getBank();
        const bank = BANKS[button.dataset.bank] || selectedBank || BANKS[0];
        const type = button.dataset.cardType || getType();
        const tail = bank === selectedBank ? input.value.match(/[（(\[]\s*(\d{4})\s*[）)\]]\s*$/u)?.[1] : undefined;
        input.value = formatBankPayment(bank, type, tail, unionPay);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    sync();
}
