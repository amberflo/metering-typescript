import { AutoIngestClient} from "./autoIngestClient";
import { IngestClient } from "./ingestClient";
import { IngestOptions } from "../model/ingestOptions";
import { ManualIngestClient } from "./manualIngestClient";
import { FlushMode } from "../model/flushMode";

export class IngestClientFactory{
    static getNewInstance(apiKey: string, options?:IngestOptions):IngestClient{                
        let signature = '[amberflo-metering IngestClientFactory]:';
        if(options && options.flushMode === FlushMode.manual){
            console.log(new Date(), signature, 'create instance of SyncIngestClient');
            return new ManualIngestClient(apiKey, options);
        }
        
        console.log(new Date(), signature, 'create instance of AsyncIngestClient');
        return new AutoIngestClient(apiKey, options);
    }
}