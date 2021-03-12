import { UsageClient } from "../usageClient";
import { UsagePayload } from "../usagePayload";

const apiKey ='e9c6a4fc-e275-4eda-b2f8-353ef196ddb7';

export async function runUsage(){
    let payload = new UsagePayload();
    payload.meterId = 'cfe68e90-82bf-11eb-902f-f9afe0dc6e9e';
    payload.customerName = 'Dell';
    const client = new UsageClient(apiKey);    
    let result = await client.getUsage(payload);
    console.log(result);
}

runUsage();