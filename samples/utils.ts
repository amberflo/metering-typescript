/**
 * Some helper methods for the sample code.
 */

import { apiKey, debug } from './configuration';

import BaseClient from "../src/baseClient";
import { CustomerDetailsClient } from "../src";

/**
 * Get a valid customer id.
 */
export async function getCustomerId() {
    const client = new CustomerDetailsClient(apiKey, debug);
    const customers = await client.list();
    return customers[0].customerId;
}

export async function getProductPlanId() {
    const client = new BaseClient(apiKey, debug, 'BaseClient');
    const url = '/payments/pricing/amberflo/account-pricing/product-plans/list';
    const productPlans = await client.doGet<{ id: string }[]>(url);
    return productPlans[0].id;
}

/**
 * Pretty-print some data to the console.
 */
export function log<T>(data: T) {
    console.log(JSON.stringify(data, undefined, 4));
}
