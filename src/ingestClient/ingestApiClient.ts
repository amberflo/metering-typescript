import { AxiosResponse } from "axios";
import BaseClient from "../baseClient";
import { MeterMessage } from '../model/meterMessage';

export class IngestApiClient extends BaseClient {

    constructor(apiKey: string, debug = false, retry = true) {
        super(apiKey, debug, 'IngestApiClient', retry);
    }

    private logResponse<T>(response: AxiosResponse<T>, requestId: string) {
        if (response.status < 200 || response.status >= 300) {
            this.logError('request failed:', requestId, response.status, response.data);
        } else {
            this.logDebug('request completed:', requestId, response.status, response.data);
        }
    }

    post(payload: Array<MeterMessage>, requestId: string, done?: () => void) {
        this.logDebug('about to post meters:', requestId);
        return this.axiosInstance
            .post('/ingest', payload)
            .then((response) => {
                this.logResponse(response, requestId);
                if (done) {
                    done();
                }
            })
            .catch((error) => {
                this.logError('request failed:', requestId, error);
                if (done) {
                    done();
                }
            });
    }

    async postSync(payload: Array<MeterMessage>, requestId: string) {
        this.logDebug('about to post meters:', requestId);
        try {
            const response = await this.axiosInstance.post<string>('/ingest', payload);
            this.logResponse(response, requestId);
            return response;
        } catch(error) {
            this.logError('request failed:', requestId, error);
        }
    }
}
