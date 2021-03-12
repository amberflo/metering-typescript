import { IngestOptions } from "./ingestOptions";
import { Metering } from "./metering";
import { UsageClient } from "./usageClient";
import { UsagePayload } from "./usagePayload";

const apiKey ='e9c6a4fc-e275-4eda-b2f8-353ef196ddb7';

export async function runIngest(){
    let ingestOptions = new IngestOptions();
    ingestOptions.batchSize = 20;
    ingestOptions.frequencyMillis = 3000;

    const metering = new Metering(apiKey, false, ingestOptions);    

    const dimensions = new Map<string, string>();
    dimensions.set("region", "Midwest");
    dimensions.set("tenant_type", "Tech");

    let j = 0;
    for(j=0; j<50; j++){
        let delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", "Dell", dimensions);
    }

    //blocking calls
    metering.flush();
    metering.shutdown();    
}

export async function runUsage(){
    let payload = new UsagePayload();
    payload.meterId = 'cfe68e90-82bf-11eb-902f-f9afe0dc6e9e';
    payload.customerName = 'Dell';
    const client = new UsageClient(apiKey);    
    let result = await client.getUsage(payload);
    console.log(result);
}

runIngest();
// runUsage();