/**
 * This sample illustrates how to create a new session for the customer portal
 */

import { apiKey, debug } from './configuration';
import { getCustomerId } from './utils';

import {
    CustomerPortalSessionClient,
    CustomerPortalSessionApiPayload
} from "../src";

export async function run() {
    // 1. Select a customer
    const customerId = await getCustomerId();

    // 2. Set up a customer portal session client
    const client = new CustomerPortalSessionClient(apiKey, debug);

    // 3. Request the session for that customer
    const payload = new CustomerPortalSessionApiPayload(customerId);

    // Optional: specify the return URL and the expiration time
    payload.returnUrl = "https://starkindustries.com";
    payload.expirationEpochMilliSeconds = (Date.now() + 60 * 15) * 1000;  // 15 minutes from now

    // 4. Make request
    const session = await client.get(payload);
    console.log(session);
}

run();
