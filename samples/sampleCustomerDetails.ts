/**
 * This sample illustrates how to setup customer details.
 */

import { Metering } from "../src";

// 1. Obtain your Amberflo API key
import { apiKey } from './sampleConstants';

// Let's be more verbose
const debug = true;

export async function runCustomerDetails() {

    // 2. Define some properties for this customer
    const customerId = '123';
    const customerName = 'Dell';
    const traits = new Map<string, string>();
    traits.set("stripeId", "cus_AJ6bY3VqcaLAEs");
    traits.set("customerType", "Tech");

    // 3. Initialize metering client
    const metering = new Metering(apiKey, debug);

    // 4. Create or update the customer
    const customer = await metering.addOrUpdateCustomerDetails(customerId, customerName, traits);
    console.log(customer);
}

runCustomerDetails();
