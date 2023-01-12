import { AxiosError, AxiosResponse } from "axios";
import { IAxiosRetryConfig, isNetworkError } from "axios-retry";
import BaseClient from "../baseClient";
import { ingestBaseUrl } from "../model/constants";
import { MeterMessage } from '../model/meterMessage';

export class IngestApiClient extends BaseClient {

    private readonly path = '/ingest';

    /**
     * Initialize a new `IngestApiClient`
     * `debug`: Whether to issue debug level logs or not.
     * `retry`: Whether to retry on 429, 5xx, or network errors, or retry configuration (see https://github.com/softonic/axios-retry).
     */
    constructor(apiKey: string, debug = false, retry: boolean | IAxiosRetryConfig = {}) {
        super(apiKey, debug, 'IngestApiClient', toRetryOptions(retry));
        this.axiosInstance.defaults.baseURL = ingestBaseUrl;
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
            .post(this.path, payload)
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
            const response = await this.axiosInstance.post<string>(this.path, payload);
            this.logResponse(response, requestId);
            return response;
        } catch(error) {
            this.logError('request failed:', requestId, error);
        }
    }
}

const defaultRetryOptions = {
    retryDelay,
    retryCondition,
};

function toRetryOptions(retry: boolean | IAxiosRetryConfig): boolean | IAxiosRetryConfig {
    if (!retry) return false;

    if (retry === true) {
        return defaultRetryOptions;
    }

    return {
        ...defaultRetryOptions,
        ...retry,
    };
}

const retryDelays = [2, 6, 12, 20, 40, 80];

function retryDelay(retryNumber = 0) {
    const delay = retryNumber >= retryDelays.length
        ? 80
        : retryDelays[retryNumber];

    return delay * Math.random();  // full jitter
}

function retryCondition(error: AxiosError) {
    const status = error.response?.status;
    return status
        ? (status === 429 || status >= 500)
        : isNetworkError(error);
}
