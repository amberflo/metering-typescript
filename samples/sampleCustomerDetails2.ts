/**
 * This sample illustrates how to setup customer details.
 */

import { apiKey, debug } from './configuration';

import { CustomerDetailsClient, CustomerDetailsApiPayload } from "../src";

export async function run() {
    // 1. Define some properties for this customer
    const customerId = '123';
    const customerName = 'Dell';
    const traits = new Map<string, string>();
    traits.set("stripeId", "cus_AJ6bY3VqcaLAEs");
    traits.set("customerType", "Tech");

    // 2. Initialize metering client
    const client = new CustomerDetailsClient(apiKey, debug);

    // 3. Create or update the customer
    const payload = new CustomerDetailsApiPayload(customerId, customerName, traits);
    const customer = await client.addOrUpdate(payload);
    console.log(customer);
}

run();
