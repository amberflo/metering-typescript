import { Metering } from "../src";
import * as Constants from './sampleConstants';

/**
 * This sample illustrates how to setup customer details.
 */
export async function runCustomerDetails() {
    //obtain your Amberflo API Key 
    const apiKey = Constants.apiKey;

    const traits = new Map<string, string>();
    traits.set("region", "Midwest");
    traits.set("tenant_type", "Tech");

    const metering = new Metering(apiKey, false);
    await metering.addOrUpdateCustomerDetails('123', 'dell', traits);

    console.log('customer setup completed!');
}

runCustomerDetails();