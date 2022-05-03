import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import * as Constants from '../model/constants';
import { MeterMessage } from '../model/meterMessage';

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

    post(payload: Array<MeterMessage>, requestId: string, done?: () => void) {
        // console.log(new Date(), this.signature, 'calling Ingest API with Request ID', requestId);
        return this.axiosInstance
            .post('/ingest-endpoint', payload)
            .then((response) => {
                console.log(new Date(), this.signature, "response from Ingest API: ", requestId, response.status, response.data);
                if (response.status >= 300) {
                    console.log(`${this.signature} call to Ingest API failed ${response.status}, ${response.data}`);
                }
                if (done) {
                    done();
                }
            })
            .catch((error) => {
                console.log(this.signature, new Date(), `call to Ingest API failed ${error}`);
                if (done) {
                    done();
                }
            });
    }

    async postSync(payload: Array<MeterMessage>, requestId: string) {
        // console.log(new Date(), this.signature, 'calling Ingest API with Request ID synchronously', requestId);
        try {
            let response = await this.axiosInstance.post('/ingest', payload);
            let data = await response.data;
            console.log(new Date(), this.signature, 'request completed:', requestId, response.status, data);
            return response;
         } catch(error) {
            console.log(new Date(), this.signature, "error", error);
        }        
    }
}