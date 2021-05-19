
# Download and Install
```sh
npm install amberflo-metering-typescript
```
Package homepage: https://www.npmjs.com/package/amberflo-metering-typescript

# Sample ingestion code with auto flush mode
```typescript
import { IngestOptions, Metering, FlushMode } from "amberflo-metering-typescript";

/**
 * This sample illustrates how to ingest your metering data into Amberflo in auto flush mode.
 * Auto is the default mode. 
 */
export async function runIngest() {
    //obtain your Amberflo API Key 
    const apiKey = 'my-api-key';

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
    dimensions.set("customerType", "Tech");

    let j = 0;
    for (j = 0; j < 50; j++) {
        let delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;

        //Queue meter messages for ingestion. 
        //In auto flush mode, queue will be flushed when ingestOptions.batchSize is exceeded or periodically ingestOptions.frequencyMillis 
        //Params: meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, dimensions: Map<string, string>
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", dimensions);
    }

    //wait for messages and requests to API to complete 
    await metering.flush();
    //perform graceful shutdown, flush, stop the timer
    await metering.shutdown();
}

runIngest();
```

# Sample Usage SDK code
```typescript
import { UsageClient, UsagePayload } from "amberflo-metering-typescript";

export async function runUsage() {
    //obtain your Amberflo API Key
    const apiKey = 'my-api-key';

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
```

# Sample ingestion code with manual flush mode
```typescript
import { IngestOptions, Metering, FlushMode } from "amberflo-metering-typescript";

/**
 * This sample illustrates how to ingest your metering data into Amberflo with manual flushing. 
 */
export async function runIngest() {
    //obtain your Amberflo API Key 
    const apiKey = 'my-api-key';

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
        //Params: meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, dimensions: Map<string, string>
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
```

# Setup Customer Details

```TypeScript
import { Metering } from "amberflo-metering-typescript";

/**
 * This sample illustrates how to setup customer details.
 */
export async function runCustomerDetails() {
    //obtain your Amberflo API Key 
    const apiKey = 'my-api-key';

    const traits = new Map<string, string>();
    traits.set("stripeId", "cus_AJ6bY3VqcaLAEs");
    traits.set("customerType", "Tech");

    const metering = new Metering(apiKey, false);
    await metering.addOrUpdateCustomerDetails('123', 'Dell', traits);

    console.log('customer setup completed!');
}

runCustomerDetails();
```