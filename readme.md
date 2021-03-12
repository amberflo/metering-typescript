
Instructions to run locally
---------------------------

1. Install dependencies
```sh
npm install
```

2. Build TypeScript package
```sh
npx tsc 
```

3. Run project
```sh
node ./dist/index.js 
```

Sample ingestion code
---------------------

```sh
import { IngestOptions } from "./ingestOptions";
import { Metering } from "./metering";

export async function runIngest(){
    let apiKey = ''; //obtain your Amberflo API Key 

    //optional ingest options
    let ingestOptions = new IngestOptions();
    ingestOptions.batchSize = 20; //Number of messages posted to the API. Default is 100. 
    ingestOptions.frequencyMillis = 3000; //Frequency at which queued data will be sent to API. Default is 1000 milliseconds.

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
    console.log('calling shutdown');
    metering.flush();
    metering.shutdown();    
}

runIngest()
```

Sample usage code
-----------------

```sh
import { UsageClient } from "./usageClient";
import { UsagePayload } from "./usagePayload";

export async function runUsage(){
    let apiKey = ''; //obtain your Amberflo API Key 
    let payload = new UsagePayload();
    payload.meterId = 'cfe68e90-82bf-11eb-902f-f9afe0dc6e9e';
    payload.customerName = 'Dell';
    const client = new UsageClient(apiKey);    
    //get usage metering data
    let result = await client.getUsage(payload);
    console.log(result);
}

runUsage()
```