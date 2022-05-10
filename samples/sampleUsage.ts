/**
 * This sample illustrates how to query usage
 */

import { apiKey, debug } from './configuration';
import { log } from './utils';

import {
    AggregationInterval,
    AggregationType,
    AllUsageApiPayload,
    AllUsageGroupBy,
    TimeRange,
    UsageApiPayload,
    UsageClient,
} from "../src";

export async function run() {
    // 1. Initialize the usage client
    const client = new UsageClient(apiKey, debug);

    // 2. Define a time range

    // Start time in seconds since the Unix Epoch (1970-01-01T00:00:00Z) and using UTC.
    // Here we get a start time for the last 24 hours
    const startTimeInSeconds = Math.ceil((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);
    const timeRange = new TimeRange(startTimeInSeconds);

    // 3. Example 1

    // 3.1. Get overall usage report of a meter
    // To understand the payload, see: https://docs.amberflo.io/reference/post_usage
    const payload = new UsageApiPayload(
        'TypeScript-ApiCalls',
        AggregationType.sum,
        AggregationInterval.day,
        timeRange,
    );

    // 3.2. Call the usage API
    // To understand the result, see: https://docs.amberflo.io/reference/post_usage
    const result = await client.getUsage(payload);
    log(result);

    // 4. Example 2

    // 4.1 Filter for a meter for a specific list of customers
    const payloadWithFilter = new UsageApiPayload(
        'TypeScript-ApiCalls',
        AggregationType.sum,
        AggregationInterval.day,
        timeRange,
    );

    // Optional: group the result by customer
    payloadWithFilter.groupBy = ["customerId"];
    // Optional: filter result for a specific customer by ID
    payloadWithFilter.filter = {customerId: ["123"]};

    // 4.2 Call the usage API
    const filteredResult = await client.getUsage(payloadWithFilter);
    log(filteredResult);

    // 5. Example 3

    // 5.1 Filter for a meter for specific customer
    const allUsagePayload = new AllUsageApiPayload(
        timeRange.startTimeInSeconds,
        AggregationInterval.day,
    );

    // Optional: group the result by customer
    allUsagePayload.groupBy = AllUsageGroupBy.customerId;

    // 5.2 Call the usage API
    const allUsageResult = await client.getAllUsage(allUsagePayload);
    log(allUsageResult);
}

run();
