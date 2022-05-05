import {
    AggregationInterval,
    AggregationType,
    AllUsageGroupBy,
    IAllUsageApiPayload,
    ITimeRange,
    IUsageApiPayload,
    IUsageApiResult,
    UsageClient,
} from "../src";

// 1. Obtain your Amberflo API key
import { apiKey } from './sampleConstants';

// Let's be more verbose
const debug = true;

export async function runUsage() {
    // 2. Initialize the usage client
    const client = new UsageClient(apiKey, debug);

    // 3. Define a time range

    // Start time in seconds since the Unix Epoch (1970-01-01T00:00:00Z) and using UTC.
    // Here we get a start time for the last 24 hours
    const startTimeInSeconds = Math.ceil((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);
    const timeRange: ITimeRange = {
        startTimeInSeconds: startTimeInSeconds,
    }

    // 4. Example 1

    // 4.1. Group by customers for a specific meter and all customers
    // To understand the payload, see: https://docs.amberflo.io/reference/post_usage
    const payload: IUsageApiPayload = {
        meterApiName : 'TypeScript-ApiCalls',
        aggregation : AggregationType.sum,
        timeGroupingInterval : AggregationInterval.day,

        // Optional: group the result by customer
        groupBy : ["customerId"],
        timeRange : timeRange,
    }

    // 4.2. Call the usage API
    // To understand the result, see: https://docs.amberflo.io/reference/post_usage
    const result: IUsageApiResult = await client.getUsage(payload);
    console.log(JSON.stringify(result, null, 4));

    // 5. Example 2

    // 5.1 Filter for a meter for specific customer
    const filteredPayload: IUsageApiPayload = {
        meterApiName : 'TypeScript-ApiCalls',
        aggregation : AggregationType.sum,
        timeGroupingInterval : AggregationInterval.day,
        // Optional: group the result by customer
        groupBy : ["customerId"],
        // Filter result for a specific customer by ID
        filter : {customerId: ["123"]},
        timeRange : timeRange,
    }

    // 5.2 Call the usage API
    const filteredResult = await client.getUsage(filteredPayload);
    console.log(JSON.stringify(filteredResult, null, 4));

    // 6. Example 3

    // 6.1 Filter for a meter for specific customer
    const allUsagePayload: IAllUsageApiPayload = {
        ...timeRange,
        timeGroupingInterval : AggregationInterval.day,
        // Optional: group the result by customer
        groupBy : AllUsageGroupBy.customerId,
    }

    // 5.2 Call the usage API
    const allUsageResult: IUsageApiResult[] = await client.getAllUsage(allUsagePayload);
    console.log(JSON.stringify(allUsageResult, null, 4));
}

runUsage();
