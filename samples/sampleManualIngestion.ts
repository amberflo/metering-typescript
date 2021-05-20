import { IngestOptions } from "../src/model/ingestOptions";
import { Metering } from "../src/metering";
import { FlushMode } from "../src/model/flushMode";
import * as Constants from './sampleConstants';

/**
 * This sample illustrates how to ingest your metering data into Amberflo with manual flushing. 
 */
export async function runIngest() {
    //obtain your Amberflo API Key 
    const apiKey = Constants.apiKey;

    //optional ingest options
    let ingestOptions = new IngestOptions();
    //set flush mode manual to control when to ingest meter messages in the queue 
    ingestOptions.flushMode = FlushMode.manual;

    const metering = new Metering(apiKey, false, ingestOptions);

    //initialize and start the ingestion client
    metering.start();

    //define dimesions for your meters
    //dimensions are optional
    const dimensions = new Map<string, string>();
    dimensions.set("region", "Midwest");
    dimensions.set("customerType", "Tech");

    let j = 0;
    for (j = 0; j < 2; j++) {
        let delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;

        //queue meter values for ingestion. To ingest messages in the queue, call flush. See below
        //Params: meterApiName: string, meterValue: number, meterTimeInMillis: number, customerId: string, dimensions: Map<string, string>
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", dimensions);
        console.log(new Date(), 'manually flushing the queue ... ');

        //manual flush, ingest all queued meter messages and send to API
        await metering.flush();
    }

    await metering.shutdown();
}

runIngest();