import { MeterMessage } from "./meterMessage";
import { IngestClient } from "./ingestClient";
import { IngestOptions } from "./ingestOptions";

export class Metering {
    apiKey!: string;
    debug!: boolean;    
    ingestClient: IngestClient;
    signature:string;

    /**
     * Initialize a new metering client
     * @param apiKey 
     * @param debug 
     * @param ingestOptions 
     */
    constructor(apiKey:string, debug:boolean, ingestOptions: IngestOptions) {
        this.signature = '[amberflo-metering Metering]:';
        this.apiKey = apiKey;
        this.debug = debug;
        this.ingestClient = new IngestClient(apiKey, ingestOptions);
    }

    /**
     * Ingest a meter
     * @param {string} meterName 
     * @param {number} meterValue 
     * @param {number} utcTimeMillis 
     * @param {string} customerId 
     * @param {string} customerName 
     * @param {Map<string,string>} dimensions 
     */
    meter(meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, customerName: string, dimensions: Map<string, string>) {        
        let meterMessage = new MeterMessage(meterName, meterValue, utcTimeMillis, customerId, customerName, dimensions);
        this.ingestClient.ingestMeter(meterMessage);
    }

    /**
     * Process all pending ingestion meter messages. Synchronous call.
     */
    flush() {        
        console.log(this.signature, 'flushing ...');
        this.ingestClient.flush();
    }

    /**
     * Shutdown the ingestion client. Synchronous call.
     */
    shutdown() {                
        console.log(this.signature, 'shutting down ...');  
        this.ingestClient.shutdown();      
    }
}