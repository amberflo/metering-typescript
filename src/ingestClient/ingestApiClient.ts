import BaseClient from "../baseClient";
import { MeterMessage } from '../model/meterMessage';

export class IngestApiClient extends BaseClient {

    constructor(apiKey: string, debug = false, retry = true) {
        super(apiKey, debug, 'IngestApiClient', retry);
    }

    post(payload: Array<MeterMessage>, requestId: string, done?: () => void) {
        this.logDebug('about to post meters:', requestId);
        return this.axiosInstance
            .post('/ingest', payload)
            .then((response) => {
                this.logDebug('request completed:', requestId, response.status, response.data);
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
            const data = await response.data;
            this.logDebug('request completed:', requestId, response.status, data);
            return response;
        } catch(error) {
            this.logError('request failed:', requestId, error);
        }
    }
}
