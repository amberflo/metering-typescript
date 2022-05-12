/**
 * This sample illustrates how to get an invoice of a customer
 */

import { apiKey, debug } from './configuration';
import { getCustomerId, log } from './utils';

import {
    LatestInvoiceQuery,
    InvoiceQuery,
    CustomerProductInvoiceClient,
} from "../src";

export async function run() {
    // 1. Select a customer
    const customerId = await getCustomerId();

    // 2. Initialize Customer Product Invocie client
    const client = new CustomerProductInvoiceClient(apiKey, debug);

    // 3. Get the latest invoice of the customer
    const latestQuery = new LatestInvoiceQuery(customerId);
    const latestInvoice = await client.get(latestQuery);
    log(latestInvoice);

    if (!latestInvoice) throw Error('No invoice found!');

    // 4. Get a specific previous invoice of the customer
    // note: this example assumes a daily billing cycle
    const { productPlanId, year, month, day } = latestInvoice.invoiceKey;

    const specificQuery = new InvoiceQuery(customerId, productPlanId, year, month, day - 2);
    const specificInvoice = await client.get(specificQuery);
    log(specificInvoice);
}

run();
