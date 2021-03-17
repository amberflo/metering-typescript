import { IngestClient } from "./ingestClient";
import { IngestOptions } from "../model/ingestOptions";
import { MeterMessage } from "../model/meterMessage";
import { IngestApiClient } from "./ingestApiClient";

import { IngestHelper } from "./ingestHelper";
import { v4 as uuidv4 } from 'uuid';

export class SyncIngestClient implements IngestClient {
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
        console.log(this.signature, 'calling start... ');
        this.apiClient = new IngestApiClient(this.apiKey);
    }

    ingestMeter(meter: MeterMessage): void {
        console.log(this.signature, 'adding meter message to queue: ', meter);
        this.queue.push(meter);
    }

    async flush(): Promise<void> {
        if (this.queue.length < 1) {
            console.log(this.signature, 'no records in the queue to flush');
            return;
        }

        let snapshot = this.queue.splice(0, this.queue.length);
        let body = IngestHelper.transformMessagesToPayload(snapshot);
        console.log(this.signature, 'body', body);

        //make asynchronous call        
        let requestId = uuidv4();
        console.log(this.signature, 'starting request', requestId);
        let promise = this.apiClient.post(body, requestId);
        await promise;
        console.log(this.signature, 'request completed:', requestId);
    }

    shutdown(): void {
        console.log(this.signature, 'shutting down the client');
        this.flush();
        console.log(this.signature, 'client successfully shutdown');
    }
}