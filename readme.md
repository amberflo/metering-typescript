
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
    const apiKey = ''; 

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
```



# Sample Usage SDK code
```typescript
import { UsageClient, UsagePayload } from "amberflo-metering-typescript";

export async function runUsage() {
    //TODO: obtain your Amberflo API Key
    const apiKey = '';

    //initialize the usage client 
    const client = new UsageClient(apiKey);
    
    //prepare your query payload
    //OPTION 1: search by meter name
    //This will filter usage data by meter name and customer
    let payloadWithName = new UsagePayload();
    payloadWithName.meterName = 'TypeScript-ApiCalls';
    payloadWithName.customerName = 'Dell';

    //get usage data with the query params
    let result = await client.getUsage(payloadWithName);
    console.log(result);

    //OPTION 1: search by meter id
    //you can filter the usage by meter id and customer
    let payloadWithId = new UsagePayload();

    //TODO: obtain your Amberflo meter id 
    payloadWithId.meterId = 'my-meter-id';
    payloadWithId.customerName = 'Dell';

    let result2 = await client.getUsage(payloadWithId);
    console.log(result2);
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
    //TODO: obtain your Amberflo API Key
    const apiKey = '';

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
    dimensions.set("tenant_type", "Tech");

    let j = 0;
    for (j = 0; j < 2; j++) {
        let delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;

        //queue meter values for ingestion. To ingest messages in the queue, call flush. See below
        //Params: meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, customerName: string, dimensions: Map<string, string>
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", "Dell", dimensions);
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
    const apiKey = Constants.apiKey;

    const metering = new Metering(apiKey, false);
    await metering.addOrUpdateCustomerDetails('123', 'dell');

    console.log('customer setup completed!');
}

runCustomerDetails();
```