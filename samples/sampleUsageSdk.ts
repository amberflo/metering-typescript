/**
 * This sample illustrates how to query usage
 */

import {
    AggregationInterval,
    AggregationType,
    AllUsageApiPayload,
    AllUsageGroupBy,
    IUsageReport,
    TimeRange,
    UsageApiPayload,
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
    const timeRange = new TimeRange(startTimeInSeconds);

    // 4. Example 1

    // 4.1. Group by customers for a specific meter and all customers
    // To understand the payload, see: https://docs.amberflo.io/reference/post_usage
    const payload = new UsageApiPayload(
        'TypeScript-ApiCalls',
        AggregationType.sum,
        AggregationInterval.day,
        timeRange,
    );

    // Optional: group the result by customer
    payload.groupBy = ["customerId"];

    // 4.2. Call the usage API
    // To understand the result, see: https://docs.amberflo.io/reference/post_usage
    const result: IUsageReport = await client.getUsage(payload);
    console.log(JSON.stringify(result, null, 4));

    // 5. Example 2

    // 5.1 Filter for a meter for specific customer
    const payloadWithFilter = new UsageApiPayload(
        'TypeScript-ApiCalls',
        AggregationType.sum,
        AggregationInterval.day,
        timeRange,
    );

    // Optional: group the result by customer
    payloadWithFilter.groupBy = ["customerId"];
    // Optional: Filter result for a specific customer by ID
    payloadWithFilter.filter = {customerId: ["123"]};

    // 5.2 Call the usage API
    const filteredResult = await client.getUsage(payloadWithFilter);
    console.log(JSON.stringify(filteredResult, null, 4));

    // 6. Example 3

    // 6.1 Filter for a meter for specific customer
    const allUsagePayload = new AllUsageApiPayload(
        timeRange.startTimeInSeconds,
        AggregationInterval.day,
    );

    // Optional: group the result by customer
    allUsagePayload.groupBy = AllUsageGroupBy.customerId;

    // 5.2 Call the usage API
    const allUsageResult: IUsageReport[] = await client.getAllUsage(allUsagePayload);
    console.log(JSON.stringify(allUsageResult, null, 4));
}

runUsage();
