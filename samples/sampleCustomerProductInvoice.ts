/**
 * This sample illustrates how to get an invoice of a customer
 */

import {
    LatestInvoiceQuery,
    InvoiceQuery,
    CustomerProductInvoiceClient,
    CustomerDetailsClient,
} from "../src";

// 1. Obtain your Amberflo API key
import { apiKey } from './sampleConstants';

// Let's be more verbose
const debug = true;

// Helper function
function log<T>(data: T) {
    console.log(JSON.stringify(data, undefined, 4));
}

export async function run() {
    // 2. Select a customer
    const customerClient = new CustomerDetailsClient(apiKey, debug);
    const { customerId } = (await customerClient.list())[0];

    // 3. Initialize Customer Product Invocie client
    const client = new CustomerProductInvoiceClient(apiKey, debug);

    // 4. Get the latest invoice of the customer
    const latestQuery = new LatestInvoiceQuery(customerId);
    const latestInvoice = await client.get(latestQuery);
    log(latestInvoice);

    if (!latestInvoice) throw Error('No invoice found!');

    // 5. Get a specific previous invoice of the customer
    // note: this example assumes a daily billing cycle
    const { productPlanId, year, month, day } = latestInvoice.invoiceKey;

    const specificQuery = new InvoiceQuery(customerId, productPlanId, year, month, day - 2);
    const specificInvoice = await client.get(specificQuery);
    log(specificInvoice);
}

run();
