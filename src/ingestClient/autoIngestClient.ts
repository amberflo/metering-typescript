import { MeterMessage } from "../model/meterMessage";
import { IngestOptions } from "../model/ingestOptions";
import { IngestClient } from "./ingestClient";
import { IngestApiClient } from "./ingestApiClient";

import { v1 } from 'uuid';

export class AutoIngestClient implements IngestClient {
    apiKey: string;
    queue: Array<MeterMessage>;
    batchSize: number;
    frequencyMillis: number;
    timer!: ReturnType<typeof setTimeout>;
    signature: string;
    promises: Map<string, Promise<void>>;
    apiClient!: IngestApiClient;
    debug: boolean = false;

    constructor(apiKey: string, ingestOptions?: IngestOptions, debug:boolean=false) {
        this.apiKey = apiKey;
        this.queue = [];
        this.promises = new Map<string, Promise<void>>();

        //options
        let options = ingestOptions || new IngestOptions();
        this.batchSize = (options.batchSize) ? Math.max(options.batchSize, 1) : 100;
        this.frequencyMillis = (options.frequencyMillis) ? Math.max(options.frequencyMillis, 1) : 1000;
        this.signature = '[amberflo-metering AsyncIngestClient]:';
        this.debug = debug;
    }

    public start(): void {
        this.apiClient = new IngestApiClient(this.apiKey);
        console.log(`${this.signature} start client with batch size: ${this.batchSize} frequency in ms ${this.frequencyMillis} debug ${this.debug}`);
        this.timer = setTimeout(this.dequeueTimer.bind(this), this.frequencyMillis);
    }

    ingestMeter(meter: MeterMessage) {
        if (this.debug) {
            console.log(this.signature, 'adding meter message to queue: ', meter);
        }
        this.queue.push(meter);

        if (this.queue.length >= this.batchSize) {
            if (this.debug) {
                console.log(this.signature, 'queue exceeded batch size, so flushing before timer');
            }
            this.dequeue();
        }
    }

    done(requestId: string) {
        if (this.debug) {
            console.log(new Date(), this.signature, 'request completed:', requestId);
        }
        this.promises.delete(requestId);
    }

    dequeue() {
        if (this.debug) {
            console.log(new Date(), this.signature, 'dequeuing ...');
        }
        if (this.queue.length < 1) {
            if (this.debug) {
                console.log(new Date(), this.signature, 'no records in the queue to flush');
            }
            return;
        }

        let snapshot = this.queue.splice(0, this.queue.length);
        let iteration = 0;
        while (snapshot.length > 0) {
            if (this.debug) {
                console.log(this.signature, 'call ingest API, iteration: ', iteration++);
            }
            const items = snapshot.splice(0, this.batchSize);
            if (this.debug) {
                console.log(new Date(), this.signature, 'spliced items and payload:', items);
            }

            //make asynchronous call        
            let requestId = v1();
            if (this.debug) {
                console.log(new Date(), this.signature, 'starting request', requestId);
            }
            let promise = this.apiClient.post(items, requestId, () => { this.done(requestId) });
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
        if (this.debug) {
            console.log(new Date(), this.signature, 'waiting for all requests to complete');
        }
        return Promise
            .all(this.promises.values())
            .then(values => {
                if(this.debug){
                    console.log(new Date(), this.signature, 'all pending requests completed');
                }
            })
            .catch(error => {
                console.log(new Date(), this.signature, 'waiting for all promises errored', error)
            });
    }

    shutdown() {
        if(this.debug){
            console.log(new Date(), this.signature, 'shutting down the client');
        }
        clearTimeout(this.timer);
        return this.flush();
    }
}