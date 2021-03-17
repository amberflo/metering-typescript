import { AsyncIngestClient} from "./asyncIngestClient";
import { IngestClient } from "./ingestClient";
import { IngestOptions } from "../model/ingestOptions";
import { SyncIngestClient } from "./syncIngestClient";

export class IngestClientFactory{
    static getNewInstance(apiKey: string, options?:IngestOptions):IngestClient{                
        let signature = '[amberflo-metering IngestClientFactory]:';
        if(options && options.isAsynch === false){
            console.log(signature, 'create instance of SyncIngestClient');
            return new SyncIngestClient(apiKey, options);
        }
        
        console.log(signature, 'create instance of AsyncIngestClient');
        return new AsyncIngestClient(apiKey, options);
    }
}