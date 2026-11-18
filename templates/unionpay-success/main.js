import { createUnionPayTemplate, initializeUnionPay } from '../../js/unionpay-template.js';

export const template = createUnionPayTemplate(false);
export const initialize = initializeUnionPay;
