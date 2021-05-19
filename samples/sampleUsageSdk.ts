import { UsageClient, UsageApiPayload, AggregationType, AggregationInterval, TimeRange } from "../src";
import * as Constants from './sampleConstants';

export async function runUsage() {
    //obtain your Amberflo API Key
    const apiKey = Constants.apiKey;

    //initialize the usage client 
    const client = new UsageClient(apiKey);

    // start date time represented as seconds since the Unix Epoch (1970-01-01T00:00:00Z) and using UTC.
    // following is Start time for last 24 hours
    const startTimeInSeconds = Math.ceil(((new Date().getTime()) - (24 * 60 * 60 * 1000)) / 1000);

    let timeRange = new TimeRange();
    timeRange.startTimeInSeconds = startTimeInSeconds;

    // Example 1: group by customers for a specific meter and all customers
    // setup usage query params
    // visit following link for description of payload: 
    // https://amberflo.readme.io/docs/getting-started-sample-data#query-the-usage-data
    let payload = new UsageApiPayload();
    payload.meterApiName = 'TypeScript-ApiCalls';
    payload.aggregation = AggregationType.sum;
    payload.timeGroupingInterval = AggregationInterval.day;
    //optional: group the result by customer
    payload.groupBy = ["customerId"];
    payload.timeRange = timeRange;

    //Call the usage API
    let jsonResult = await client.getUsage(payload);
    // To understand the API response, visit following link: 
    // https://amberflo.readme.io/docs/getting-started-sample-data#query-the-usage-data
    console.log(JSON.stringify(jsonResult, null, 2));


    //Example 2: filter for a meter for specific customer
    //setup usage query params
    let payloadForFilteredCustomer = new UsageApiPayload();
    payload.meterApiName = 'TypeScript-ApiCalls';
    payload.aggregation = AggregationType.sum;
    payload.timeGroupingInterval = AggregationInterval.day;
    //optional: group the result by customer
    payload.groupBy = ["customerId"];
    //Filter result for a specific customer by ID
    payload.filter = {customerId: ["123"]};
    payload.timeRange = timeRange;

    //Call the usage API
    let jsonResultForFilteredCustomer = await client.getUsage(payloadForFilteredCustomer);
    console.log(JSON.stringify(jsonResultForFilteredCustomer, null, 4));
}

runUsage();