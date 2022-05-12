/**
 * This sample illustrates how to set a customer's product plan
 */

import { apiKey, debug } from './configuration';
import { getCustomerId, getProductPlanId } from './utils';

import {
    CustomerProductPlanClient,
    CustomerProductPlanApiPayload,
} from "../src";

export async function run() {
    // 1. Select a customer
    const customerId = await getCustomerId();

    // 2. Select a product plan
    const productPlanId = await getProductPlanId();

    // 3. Assign product plan to customer
    const client = new CustomerProductPlanClient(apiKey, debug);

    const payload = new CustomerProductPlanApiPayload(customerId, productPlanId);

    const newCustomerProductPlan = await client.addOrUpdate(payload);
    console.log(newCustomerProductPlan);
}

run();
