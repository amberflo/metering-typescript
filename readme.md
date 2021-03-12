
Download and Install
--------------------
```sh
npm install amberflo-metering-typescript
```

Sample ingestion code
---------------------

```sh
import { IngestOptions, Metering } from "amberflo-metering-typescript";

export async function runIngest(){
    //obtain your Amberflo API Key 
    let apiKey = ''; 

    //optional ingest options
    let ingestOptions = new IngestOptions();
    //Number of messages posted to the API. Default is 100.
    ingestOptions.batchSize = 20;  
    //Frequency at which queued data will be sent to API. Default is 1000 milliseconds.
    ingestOptions.frequencyMillis = 3000; 

    const metering = new Metering(apiKey, false, ingestOptions);    

    //define dimesions for your meters
    const dimensions = new Map<string, string>();
    dimensions.set("region", "Midwest");
    dimensions.set("tenant_type", "Tech");

    let j = 0;
    for(j=0; j<50; j++){
        let delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        //Asynchronous calls
        //ingest meter values
        //Params: meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, customerName: string, dimensions: Map<string, string>
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", "Dell", dimensions);
    }

    //Synchronous calls
    metering.flush();
    metering.shutdown();    
}

runIngest()
```

Sample usage code
-----------------

```sh
import { UsageClient, UsagePayload } from "amberflo-metering-typescript";

export async function runUsage(){
    //TODO: obtain your Amberflo API Key 
    let apiKey = ''; 

    //prepare your query payload
    //you can filter the usage by meter and customer. 
    let payload = new UsagePayload();

    //TODO: obtain your Amberflo meter id 
    payload.meterId = 'my-meter-id';
    payload.customerName = 'Dell';

    //initialize the usage client 
    const client = new UsageClient(apiKey);    

    //get usage metering data with the query params
    let result = await client.getUsage(payload);
    console.log(result);
}

runUsage()
```