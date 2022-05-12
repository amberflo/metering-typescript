/**
 * This sample illustrates how to order a prepaid card to a customer.
 */

import { apiKey, debug } from './configuration';
import { getCustomerId } from './utils';
import { v4 as uuid4 } from 'uuid';

import {
    CustomerPrepaidOrderClient,
    CustomerPrepaidOrderApiPayload,
    BillingPeriod,
    BillingPeriodInterval,
} from "../src";

export async function run() {
    // 1. Select a customer
    const customerId = await getCustomerId();

    // 2. Define a prepaid order
    const payload = new CustomerPrepaidOrderApiPayload(
        uuid4(),
        customerId,
        Date.now(),
        100,
    );

    // Optional: make it recurrent
    payload.recurrenceFrequency = new BillingPeriod(7, BillingPeriodInterval.day);
    // Optional: make it external payment; Amberflo will wait for manual payment confirmation.
    payload.externalPayment = true;

    // 3. Make the order
    const client = new CustomerPrepaidOrderClient(apiKey, debug);

    const result = await client.add(payload);
    console.log(result);

    // 4. List prepaid orders of this customer that have not expired
    const prepaidOrders = await client.listActive(customerId);
    console.log(prepaidOrders);
}

run();
