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

    constructor(apiKey: string, ingestOptions: IngestOptions) {
        this.queue = [];
        this.apiKey = apiKey;
        this.signature = '[amberflo-metering SynchIngestClient]:';
    }

    start(): void {
        console.log(new Date(), this.signature, 'calling start... ');
        this.apiClient = new IngestApiClient(this.apiKey);
    }

    ingestMeter(meter: MeterMessage): void {
        console.log(new Date(), this.signature, 'queuing meter message: ', meter);
        this.queue.push(meter);
    }

    async flush() {
        if (this.queue.length < 1) {
            console.log(new Date(), this.signature, 'no records in the queue to flush');
            return;
        }

        let snapshot = this.queue.splice(0, this.queue.length);
        console.log(new Date(), this.signature, 'body', snapshot);

        let requestId = uuidv4();
        console.log(new Date(), this.signature, 'starting request', requestId);
        return this.apiClient.postSync(snapshot, requestId);
    }

    shutdown(){
        console.log(new Date(), this.signature, 'shutting down the client');
        return this.flush();
    }
}