/**
 * This sample illustrates how to ingest your metering data into Amberflo in manual flush mode.
 * Note that the default mode is auto.
 */

import { apiKey, debug } from './configuration';

import { IngestOptions, Metering, FlushMode } from "../src";

export async function run() {
    // 1. Instantiate metering client

    // Select ingest options
    const ingestOptions = new IngestOptions();

    // Set flush mode to manual.
    ingestOptions.flushMode = FlushMode.manual;

    const metering = new Metering(apiKey, debug, ingestOptions);

    // 2. Initialize and start the ingestion client
    metering.start();

    // Optional: Define dimesions for your meters
    const dimensions = new Map<string, string>();
    dimensions.set("region", "Midwest");
    dimensions.set("customerType", "Tech");

    for (let j = 0; j < 2; j++) {
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;

        // 3. Queue meter messages for ingestion.
        //
        // To ingest messages in the queue, call flush. See below.
        //
        // Params: meterApiName: string, meterValue: number, meterTimeInMillis: number, customerId: string, dimensions: Map<string, string>
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", dimensions);

        // 4. Manual flush, ingest all queued meter messages and send to API
        console.log(new Date(), 'manually flushing the queue ... ');
        await metering.flush();
    }

    // 5. Perform graceful shutdown
    await metering.shutdown();
}

run();
