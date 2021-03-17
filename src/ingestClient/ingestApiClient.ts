import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import * as Constants from '../model/constants';
import { IngestApiPayload } from '../model/ingestApiPayload';

export class IngestApiClient {
    axiosInstance: AxiosInstance;
    signature: string;

    constructor(apiKey: string) {
        this.signature = '[amberflo-metering IngestApiClient]:';
        this.axiosInstance = axios.create({
            baseURL: Constants.amberfloBaseUrl,
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
            },
            timeout: 30000
        });
        axiosRetry(this.axiosInstance, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay
        });
    }

    post(payload: Array<IngestApiPayload>, requestId: string, done?: (requestId: string) => void) {
        console.log(this.signature, 'calling Ingest API with Request ID', requestId);
        let promise = this.axiosInstance
            .post('/ingest-endpoint', payload)
            .then((response) => {
                console.log("response from Ingest API: ", response.status, response.data);
                if (response.status >= 300) {
                    console.log(`call to Ingest API failed ${response.status}, ${response.data}`);
                }
                if (done) {
                    done(requestId);
                }
            })
            .catch((error) => {
                console.log(`call to Ingest API failed ${error}`);
                if (done) {
                    done(requestId);
                }
            });

        return promise;
    }
}