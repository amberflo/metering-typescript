import { IngestOptions } from "./ingestOptions";
import { Metering } from "./metering";
import { UsageClient } from "./usageClient";
import { UsagePayload } from "./usagePayload";

//TODO:
// package 
export async function runIngest(){
    let ingestOptions = new IngestOptions();
    ingestOptions.batchSize = 20;
    ingestOptions.frequencyMillis = 3000;

    const metering = new Metering("e9c6a4fc-e275-4eda-b2f8-353ef196ddb7", false, ingestOptions);    

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

    //metering.flush();
    console.log('calling shutdown');
    metering.flush();
    metering.shutdown();    
}

export async function runUsage(){
    let payload = new UsagePayload();
    payload.meterId = 'cfe68e90-82bf-11eb-902f-f9afe0dc6e9e';
    const client = new UsageClient('e9c6a4fc-e275-4eda-b2f8-353ef196ddb7');    
    let result = await client.getUsage(payload);
    console.log(result);
}


runIngest();
// runUsage();