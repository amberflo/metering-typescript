import { Metering } from "../src";
import * as Constants from './sampleConstants';

/**
 * This sample illustrates how to setup customer details.
 */
export async function runCustomerDetails() {
    //obtain your Amberflo API Key 
    const apiKey = Constants.apiKey;

    const metering = new Metering(apiKey, false);
    await metering.addOrUpdateCustomerDetails('123', 'dell');

    console.log('customer setup completed!');
}

runCustomerDetails();