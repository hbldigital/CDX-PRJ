/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Unit test for Client API Fallback Engine (GitHub Pages static environment)
 */

import test from 'node:test';
import assert from 'node:assert';
import { handleClientApiRequest } from './clientApiFallback.ts';

test('clientApiFallback returns default services on static hosting', async () => {
  const resp = await handleClientApiRequest('https://username.github.io/my-repo/api/services');
  const data = await resp.json();
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.services));
  assert.ok(data.services.length > 0);
  assert.ok(data.services.some((s: any) => s.slug === 'php-development'));
});

test('clientApiFallback returns Pakistani banks and crypto wallets with USD/PKR rate', async () => {
  const resp = await handleClientApiRequest('https://username.github.io/my-repo/api/payment-methods');
  const data = await resp.json();
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.banks));
  assert.ok(data.banks.some((b: any) => b.bankName.includes('Meezan')));
  assert.strictEqual(data.usdToPkrRate, 271);
});

test('clientApiFallback validates coupon code WELCOME10 for newly joined subscribers', async () => {
  const resp = await handleClientApiRequest('https://username.github.io/my-repo/api/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({
      code: 'WELCOME10',
      orderTotal: 50000,
      customerId: 'usr_guest',
      email: 'test@gmail.com',
    }),
  });
  const data = await resp.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.discountAmount, 5000); // 10% of 50,000 = 5,000
});
