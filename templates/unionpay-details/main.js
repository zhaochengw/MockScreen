import { createUnionPayTemplate, initializeUnionPay } from '../../js/unionpay-template.js';

export const template = createUnionPayTemplate(true);
export const initialize = initializeUnionPay;
