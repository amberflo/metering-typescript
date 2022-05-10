/**
 * This sample illustrates how to create a new session for the customer portal
 */

import {
    CustomerDetailsClient,
    CustomerPortalSessionClient,
    CustomerPortalSessionApiPayload
} from "../src";

// 1. Obtain your Amberflo API key
import { apiKey } from './sampleConstants';

// Let's be more verbose
const debug = true;

export async function run() {
    // 2. Select a customer
    const customerClient = new CustomerDetailsClient(apiKey, debug);
    const { customerId } = (await customerClient.list())[0];

    // 3. Set up a customer portal session client
    const client = new CustomerPortalSessionClient(apiKey, debug);

    // 4. Request the session for that customer
    const payload = new CustomerPortalSessionApiPayload(customerId);

    // Optional: specify the return URL and the expiration time
    payload.returnUrl = "https://starkindustries.com";
    payload.expirationEpochMilliSeconds = (Date.now() + 60 * 15) * 1000;  // 15 minutes from now

    const session = await client.get(payload);
    console.log(session);
}

run();
