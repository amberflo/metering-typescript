import { UsageClient, UsagePayload } from "../src";
import * as Constants from './sampleConstants';

export async function runUsage() {
    //obtain your Amberflo API Key
    const apiKey = Constants.apiKey;

    //initialize the usage client 
    const client = new UsageClient(apiKey);
    
    //prepare your query payload
    //you can filter the usage by meter name and customer. 
    let payloadWithName = new UsagePayload();
    payloadWithName.meterName = 'TypeScript-ApiCalls';
    payloadWithName.customerName = 'Dell';

    //get usage data with the query params
    // let result = await client.getUsage(payloadWithName);
    // console.log(result);

    //you can filter the usage by meter id and customer. 
    let payloadWithId = new UsagePayload();
    payloadWithId.meterId = Constants.meterId;
    payloadWithId.customerName = 'Dell';

    let result2 = await client.getUsage(payloadWithId);
    console.log(result2);
}

runUsage();