import axios, { AxiosInstance } from "axios";
import { UsageApiPayload } from "./model/usageApiPayload";

export class UsageClient {
    apiKey: string;
    axiosInstance: AxiosInstance;
    signature: string;

    /**
     * Initialize a new `UsageClient` with API key
     * @param {string} apiKey 
     */
    constructor(apiKey: string) {
        this.signature = '[amberflo-metering UsageClient]:';
        this.apiKey = apiKey;
        this.axiosInstance = axios.create({
            baseURL: 'https://app.amberflo.io',
            responseType: 'json',
            headers: {
                "X-API-KEY": this.apiKey,
                "Content-Type": "application/json"
            },
            timeout: 30000
        });
    }

    /**
     * Get usage data.
     * @param {UsageApiPayload} payload 
     * @returns {Promise<UsageResult[]>}
     */
    async getUsage(payload: UsageApiPayload): Promise<any[]> {
        try {
            let response = await this.axiosInstance.post('/usage', payload);
            return response.data;
        }
        catch (error) {
            console.log(new Date(), this.signature, 'call to Usage API failed', error);
            throw new Error(`Calling Usage API failed: ${error}`);
        }
    }
}