import axios, { AxiosInstance } from "axios";
import axiosRetry from 'axios-retry';
import { amberfloBaseUrl, userAgent } from './model/constants';

export default class BaseClient {
    /**
     * Base Amberflo API client. Abstracts away the actual API calls and
     * logging.
     */

    // These should be `readonly`, maybe even `private`, but are not for
    // backwards compatibility.
    apiKey: string;
    axiosInstance: AxiosInstance;
    signature: string;
    debug: boolean;

    /**
     * Initialize a new `BaseClient`
     * `name`: Name of the client for logging purposes.
     * `debug`: Whether to issue debug level logs or not.
     * `retry`: Wheter to retry idempotent requests on 5xx or network errors (see https://github.com/softonic/axios-retry)
     */
    constructor(apiKey: string, debug: boolean, name: string, retry = true) {
        this.signature = `[amberflo-metering ${name}]:`;
        this.apiKey = apiKey;
        this.debug = debug;
        this.axiosInstance = axios.create({
            baseURL: amberfloBaseUrl,
            responseType: 'json',
            headers: {
                "X-API-KEY": this.apiKey,
                "Content-Type": "application/json",
                "User-Agent": userAgent,
            },
            timeout: 30000
        });

        if (retry) {
            axiosRetry(this.axiosInstance, {
                retries: 3,
                retryDelay: axiosRetry.exponentialDelay
            });
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private log(level: string, message: string, ...args: any[]) {
        console.log(new Date(), this.signature, level, message, ...args);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    logInfo(message: string, ...args: any[]) {
        this.log('INFO', message, ...args);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    logDebug(message: string, ...args: any[]) {
        if (this.debug) {
            this.log('DEBUG', message, ...args);
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    logError(message: string, ...args: any[]) {
        this.log('ERROR', message, ...args);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async doGet<TResponse>(path: string, params?: any): Promise<TResponse> {
        const action = `GET ${path}`;
        try {
            this.logDebug(action, params);
            const response = await this.axiosInstance.get<TResponse>(path, params ? { params } : undefined);
            this.logDebug(action, response.status);
            return response.data;
        }
        catch (error) {
            this.logError(action, error);
            throw new Error(`${action} failed: ${error}`);
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async doPost<TResponse>(path: string, payload: any, params?: any): Promise<TResponse> {
        const action = `POST ${path}`;
        try {
            this.logDebug(action, payload, params);
            const response = await this.axiosInstance.post<TResponse>(path, payload, params ? { params } : undefined);
            this.logDebug(action, response.status);
            return response.data;
        }
        catch (error) {
            this.logError(action, error);
            throw new Error(`${action} failed: ${error}`);
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async doPut<TResponse>(path: string, payload: any): Promise<TResponse> {
        const action = `PUT ${path}`;
        try {
            this.logDebug(action, payload);
            const response = await this.axiosInstance.put<TResponse>(path, payload);
            this.logDebug(action, response.status);
            return response.data;
        }
        catch (error) {
            this.logError(action, error);
            throw new Error(`${action} failed: ${error}`);
        }
    }
}
