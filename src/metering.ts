import { MeterMessage } from "./meterMessage";
import { IngestClient } from "./ingestClient";
import { IngestOptions } from "./ingestOptions";

export class Metering {
    apiKey!: string;
    debug!: boolean;    
    ingestClient: IngestClient;
    signature:string;

    constructor(apiKey:string, debug:boolean, ingestOptions: IngestOptions) {
        this.signature = '[amberflo-metering Metering]:';
        this.apiKey = apiKey;
        this.debug = debug;
        this.ingestClient = new IngestClient(apiKey, ingestOptions);
    }

    meter(meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, customerName: string, dimensions: Map<string, string>) {        
        let meterMessage = new MeterMessage(meterName, meterValue, utcTimeMillis, customerId, customerName, dimensions);
        this.ingestClient.ingestMeter(meterMessage);
    }

    flush() {        
        console.log(this.signature, 'flushing ...');
        this.ingestClient.flush();
    }

    shutdown() {                
        console.log(this.signature, 'shutting down ...');  
        this.ingestClient.shutdown();      
    }
}