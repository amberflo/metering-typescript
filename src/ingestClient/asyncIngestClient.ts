import { MeterMessage } from "../model/meterMessage";
import { IngestOptions } from "../model/ingestOptions";
import { IngestClient } from "./ingestClient";
import { IngestHelper } from "./ingestHelper";
import { IngestApiClient } from "./ingestApiClient";

import { v4 as uuidv4 } from 'uuid';

export class AsyncIngestClient implements IngestClient {
    apiKey: string;
    queue: Array<MeterMessage>;
    batchSize: number;
    frequencyMillis: number;
    timer!: ReturnType<typeof setTimeout>;
    signature: string;
    promises: Map<string, Promise<void>>;
    apiClient!: IngestApiClient;

    constructor(apiKey: string, ingestOptions?: IngestOptions) {
        this.apiKey = apiKey;
        this.queue = [];
        this.promises = new Map<string, Promise<void>>();
       
        //options
        let options = ingestOptions || new IngestOptions();
        this.batchSize = (options.batchSize) ? Math.max(options.batchSize, 1) : 100;
        this.frequencyMillis = (options.frequencyMillis) ? Math.max(options.frequencyMillis, 1) : 1000;        
        this.signature = '[amberflo-metering AsyncIngestClient]:';        
    }

    public start(): void {
        console.log(this.signature, 'calling start ...');
        this.apiClient = new IngestApiClient(this.apiKey);

        console.log(`${this.signature} batch size: ${this.batchSize}`);

        console.log(this.signature, 'starting the timer to run at ms: ', this.frequencyMillis);
        this.timer = setTimeout(this.dequeueTimer.bind(this), this.frequencyMillis);        
    }

    ingestMeter(meter: MeterMessage) {
        console.log(this.signature, 'adding meter message to queue: ', meter);
        this.queue.push(meter);

        if (this.queue.length >= this.batchSize) {
            console.log(this.signature, 'queue exceeded batch size, so flushing before timer');
            this.dequeue();
        }
    }

    done(requestId: string) {
        console.log(this.signature, 'request completed:', requestId);
        this.promises.delete(requestId);
    }

    dequeue() {
        console.log(this.signature, 'dequeuing ...');
        if (this.queue.length < 1) {
            console.log(this.signature, 'no records in the queue to flush');
            return;
        }

        let snapshot = this.queue.splice(0, this.queue.length);
        let iteration = 0;
        while (snapshot.length > 0) {
            console.log(this.signature, 'call ingest API, iteration: ', iteration++);
            const items = snapshot.splice(0, this.batchSize);
            console.log(this.signature, 'spliced items:', items);

            let body = IngestHelper.transformMessagesToPayload(items);
            console.log(this.signature, 'body', body);

            //make asynchronous call        
            let requestId = uuidv4();
            console.log(this.signature, 'starting request', requestId);
            let promise = this.apiClient.post(body, requestId, this.done);
            this.promises.set(requestId, promise);
        }
    }

    dequeueTimer() {
        //re-schedule         
        clearTimeout(this.timer);
        this.timer = setTimeout(this.dequeueTimer.bind(this), this.frequencyMillis);
        this.dequeue();
    }

    async flush() {
        this.dequeue();
        console.log(this.signature, 'waiting for all requests to complete');
        let promiseAll = Promise
            .all(this.promises.values())
            .then(values => {
                console.log('all promises completed');
            })
            .catch(error => {
                console.log('waiting for all promises errored', error)
            });
        await promiseAll;        
    }

    shutdown() {
        console.log(this.signature, 'shutting down the client');
        clearTimeout(this.timer);
        this.flush();
    }
}