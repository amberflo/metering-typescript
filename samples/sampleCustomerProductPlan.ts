/**
 * This sample illustrates how to set a customer's product plan
 */

import BaseClient from "../src/baseClient";
import { CustomerProductPlanClient, CustomerDetailsClient, CustomerProductPlanApiPayload } from "../src";

// 1. Obtain your Amberflo API key
import { apiKey } from './sampleConstants';

// Let's be more verbose
const debug = true;

export async function run() {

    // 2. Select a customer
    const customerClient = new CustomerDetailsClient(apiKey, debug);
    const customer = (await customerClient.list())[0];

    // 3. Select a product plan
    const baseClient = new BaseClient(apiKey, debug, 'BaseClient');
    const productPlan = (await baseClient.doGet<{ id: string }[]>('/payments/pricing/amberflo/account-pricing/product-plans/list'))[0];

    // 4. Assign product plan to customer
    const customerProductPlanClient = new CustomerProductPlanClient(apiKey, debug);

    const payload = new CustomerProductPlanApiPayload(customer.customerId, productPlan.id);

    const newCustomerProductPlan = await customerProductPlanClient.addOrUpdate(payload);
    console.log(newCustomerProductPlan);
}

run();
