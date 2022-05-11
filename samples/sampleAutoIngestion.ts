/**
 * This sample illustrates how to ingest your metering data into Amberflo in auto flush mode.
 * Auto is the default mode.
 */

import { apiKey, debug } from './configuration';

import { IngestOptions, Metering, FlushMode } from "../src";

export async function run() {
    // 1. Instantiate metering client

    // Optional: Select ingest options
    const ingestOptions = new IngestOptions();

    // Set flush mode to auto. This is also the default, so this is optional.
    ingestOptions.flushMode = FlushMode.auto;

    // Number of messages posted to the API at a time. Default is 100.
    ingestOptions.batchSize = 20;

    // Frequency at which queued data will be sent to API. Default is 1000 milliseconds.
    ingestOptions.frequencyMillis = 3000;

    const metering = new Metering(apiKey, debug, ingestOptions);

    // 2. Initialize and start the ingestion client
    metering.start();

    // Optional: Define dimesions for your meters
    const dimensions = new Map<string, string>();
    dimensions.set("region", "Midwest");
    dimensions.set("customerType", "Tech");

    for (let j = 0; j < 50; j++) {
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;

        // 3. Queue meter messages for ingestion.
        //
        // In auto flush mode, queue will be flushed when
        // `ingestOptions.batchSize` is exceeded or periodically every
        // `ingestOptions.frequencyMillis`
        //
        // Params: meterApiName: string, meterValue: number, meterTimeInMillis: number, customerId: string, dimensions: Map<string, string>
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", dimensions);
    }

    // 4. Wait for messages and requests to API to complete
    await metering.flush();

    // 5. Perform graceful shutdown, flush, stop the timer
    await metering.shutdown();
}

run();
