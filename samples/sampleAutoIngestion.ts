import { IngestOptions, Metering } from "../src";
import { FlushMode } from "../src/model/flushMode";
import * as Constants from './sampleConstants';

/**
 * This sample illustrates how to ingest your metering data into Amberflo in auto flush mode.
 * Auto is the default mode. 
 */
export async function runIngest() {
    //obtain your Amberflo API Key 
    const apiKey = Constants.apiKey;

    //optional ingest options
    let ingestOptions = new IngestOptions();
    //set flush mode to auto. This is also the default, so this step is optional.
    ingestOptions.flushMode = FlushMode.auto;
    //Number of messages posted to the API. Default is 100. 
    ingestOptions.batchSize = 20;
    //Frequency at which queued data will be sent to API. Default is 1000 milliseconds.
    ingestOptions.frequencyMillis = 3000;

    const metering = new Metering(apiKey, false, ingestOptions);

    //initialize and start the ingestion client
    metering.start();

    //define dimesions for your meters
    const dimensions = new Map<string, string>();
    dimensions.set("region", "Midwest");
    dimensions.set("tenant_type", "Tech");

    let j = 0;
    for (j = 0; j < 50; j++) {
        let delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;

        //Queue meter messages for ingestion. 
        //In auto flush mode, queue will be flushed when ingestOptions.batchSize is exceeded or periodically ingestOptions.frequencyMillis 
        //Params: meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, customerName: string, dimensions: Map<string, string>
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", "Dell", dimensions);
    }

    //wait for messages and requests to API to complete 
    await metering.flush();
    //perform graceful shutdown, flush, stop the timer
    await metering.shutdown();
}

runIngest();