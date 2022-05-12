/**
 * This sample illustrates how to setup customer details.
 */

import { apiKey, debug } from './configuration';

import { Metering } from "../src";

export async function run() {
    // 1. Define some properties for this customer
    const customerId = '123';
    const customerName = 'Dell';
    const traits = new Map<string, string>();
    traits.set("stripeId", "cus_AJ6bY3VqcaLAEs");
    traits.set("customerType", "Tech");

    // 2. Initialize metering client
    const metering = new Metering(apiKey, debug);

    // 3. Create or update the customer
    const customer = await metering.addOrUpdateCustomerDetails(customerId, customerName, traits);
    console.log(customer);
}

run();
