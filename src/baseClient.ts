import axios, { AxiosInstance } from "axios";
import { amberfloBaseUrl, userAgent } from './model/constants';

export default class BaseClient {
    /**
     * Base Amberflo API client. Abstracts away the actual API calls and
     * logging.
     */

    apiKey: string;
    axiosInstance: AxiosInstance;
    signature: string;
    debug: boolean;

    /**
     * Initialize a new `BaseClient`
     * @param {string} apiKey
     * @param {boolean} debug: Whether to issue debug level logs or not
     * @param {string} name: Name of the client
     */
    constructor(apiKey: string, debug: boolean, name: string) {
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
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private log(level: string, message: string, ...args: any[]) {
        console.log(new Date(), this.signature, level, message, ...args);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    log_info(message: string, ...args: any[]) {
        this.log('INFO', message, ...args)
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    log_debug(message: string, ...args: any[]) {
        if (this.debug) {
            this.log('DEBUG', message, ...args)
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    log_error(message: string, ...args: any[]) {
        this.log('ERROR', message, ...args)
    }

    async get<TResponse, TParams>(path: string, params: TParams): Promise<TResponse> {
        const action = `GET ${path}`
        try {
            this.log_debug(action, params);
            const response = await this.axiosInstance.get<TResponse>(path, { params });
            this.log_info(action, response.status);
            return response.data
        }
        catch (error) {
            this.log_error(action, error);
            throw new Error(`${action} failed: ${error}`);
        }
    }

    async post<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
        const action = `POST ${path}`
        try {
            this.log_debug(action, payload);
            const response = await this.axiosInstance.post<TResponse>(path, payload);
            this.log_info(action, response.status);
            return response.data
        }
        catch (error) {
            this.log_error(action, error);
            throw new Error(`${action} failed: ${error}`);
        }
    }
}
