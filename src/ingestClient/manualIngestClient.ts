import { IngestClient } from "./ingestClient";
import { IngestOptions } from "../model/ingestOptions";
import { MeterMessage } from "../model/meterMessage";
import { IngestApiClient } from "./ingestApiClient";

import { v1 as uuidv4 } from 'uuid';

export class ManualIngestClient implements IngestClient {
    apiKey: string;
    signature: string;
    queue: Array<MeterMessage>;
    apiClient!: IngestApiClient;
    debug = false;

    constructor(apiKey: string, ingestOptions: IngestOptions, debug=false) {
        this.queue = [];
        this.apiKey = apiKey;
        this.signature = '[amberflo-metering SynchIngestClient]:';
        this.debug = debug;
    }

    start(): void {
        console.log(new Date(), this.signature, `start the client with debug ${this.debug} `);
        this.apiClient = new IngestApiClient(this.apiKey);
    }

    ingestMeter(meter: MeterMessage): void {
        if (this.debug) {
            console.log(new Date(), this.signature, 'queuing meter message: ', meter);
        }
        this.queue.push(meter);
    }

    async flush() {
        if (this.queue.length < 1) {
            console.log(new Date(), this.signature, 'no records in the queue to flush');
            return;
        }

        const snapshot = this.queue.splice(0, this.queue.length);
        if (this.debug) {
            console.log(new Date(), this.signature, 'body', snapshot);
        }

        const requestId = uuidv4();
        if (this.debug) {
            console.log(new Date(), this.signature, 'starting request', requestId);
        }
        return this.apiClient.postSync(snapshot, requestId);
    }

    shutdown() {
        if(this.debug){
            console.log(new Date(), this.signature, 'shutting down the client');
        }
        return this.flush();
    }
}
