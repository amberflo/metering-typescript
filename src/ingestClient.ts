import { MeterMessage } from "./meterMessage";
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { IngestOptions } from "./ingestOptions";
import { v4 as uuidv4 } from 'uuid';

export class IngestClient {
    apiKey: string;
    queue: Array<MeterMessage>;
    axiosInstance: AxiosInstance;
    batchSize: number;
    frequencyMillis: number;
    timer!: number;
    signature: string;
    promises: Map<string, Promise<void>>;

    constructor(apiKey: string, ingestOptions: IngestOptions) {
        this.apiKey = apiKey;
        this.queue = [];
        this.promises = new Map<string, Promise<void>>();
        this.axiosInstance = axios.create({
            baseURL: 'https://app.amberflo.io',
            headers: {
                "X-API-KEY": this.apiKey,
                "Content-Type": "application/json"
            },
            timeout: 30000
        });

        //options
        let options = ingestOptions || {};
        this.batchSize = (options.batchSize) ? Math.max(options.batchSize, 1) : 100;
        this.frequencyMillis = (options.frequencyMillis) ? Math.max(options.frequencyMillis, 1) : 1000;

        this.signature = '[amberflo-metering IngestClient]:';
        axiosRetry(this.axiosInstance, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay
        });

        console.log(this.signature, 'starting the timer to run at ms: ', this.frequencyMillis);
        this.timer = setTimeout(this.flushTimer.bind(this), this.frequencyMillis);
    }

    ingestMeter(meter: MeterMessage) {
        console.log(this.signature, 'adding meter message to queue: ', meter);
        this.queue.push(meter);

        if (this.queue.length >= this.batchSize) {
            console.log(this.signature, 'queue exceeded batch size, so flushing before timer');
            this.dequeue();
        }
    }

    transformMessagesToPayload(items: Array<MeterMessage>) {
        let body = items.map((m) => {
            return {
                tenant: m.customerName,
                tenant_id: m.customerId,
                meter_name: m.meterName,
                meter_value: m.meterValue,
                time: m.utcTimeMillis,
                dimensions: m.dimensions
            }
        });
        return body;
    }

    done(requestId: string) {
        console.log(this.signature, 'request completed:', requestId);
        this.promises.delete(requestId);
    }

    dequeue() {
        console.log(this.signature, 'flushing the queue');
        if (this.queue.length < 1) {
            console.log(this.signature, 'no records in the queue to flush');
            return;
        }

        let snapshot = this.queue.splice(0, this.queue.length);
        let iteration = 0;
        let localPromises = [];
        while (snapshot.length > 0) {
            console.log(this.signature, 'call ingest API, iteration: ', iteration++);
            const items = snapshot.splice(0, this.batchSize);
            console.log(this.signature, 'spliced items:', items);

            let body = this.transformMessagesToPayload(items);
            console.log(this.signature, 'body', body);

            //make asynchronous call        
            let requestId = uuidv4();
            console.log(this.signature, 'starting request', requestId);
            let promise = this.axiosInstance
                .post('/ingest-endpoint', body)
                .then((response) => {
                    console.log(this.signature, "response from Ingest API: ", response.status, response.data);
                    if (response.status >= 300) {
                        console.log(`${this.signature} call to Ingest API failed ${response.status}, ${response.data}`);
                    }
                    this.done(requestId);
                })
                .catch((error) => {
                    console.log(`${this.signature},call to Ingest API failed ${error}`);
                });
            this.promises.set(requestId, promise);
            localPromises.push(promise);
        }
        return localPromises;
    }

    flushTimer() {
        //re-schedule         
        clearTimeout(this.timer);
        this.timer = setTimeout(this.flushTimer.bind(this), this.frequencyMillis);
        this.dequeue();
    }

    flush() {
        this.dequeue();
        console.log(this.signature, 'waiting for all requests to complete');
        Promise
            .all(this.promises.values())
            .then(values => {
                console.log('all promises completed');
            })
            .catch(error => {
                console.log('waiting for all promises errored', error)
            });        
    }

    shutdown() {
        console.log(this.signature, 'shutting down client');
        clearTimeout(this.timer);
        this.flush();
    }
}