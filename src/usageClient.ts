import axios, { AxiosInstance } from "axios";
import { UsagePayload } from "./model/usagePayload";
import { UsageResult } from "./model/usageResult";

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
     * Get usage data
     * @param {UsagePayload} payload 
     * @returns {Promise<UsageResult[]>}
     */
    async getUsage(payload: UsagePayload): Promise<UsageResult[]> {
        let body = {
            meter_id: payload.meterId,
            tenant: payload.customerName
        };

        try {
            console.log(this.signature, 'calling Usage API', body);
            let response = await this.axiosInstance.post('/usage-endpoint', body);
            console.log(this.signature, 'obtained result from Usage API', response.status);
            let result = new Array<UsageResult>();
            for (let item of response.data[0]) {
                let usageResult = new UsageResult();
                usageResult.customerName = item.tenant;
                usageResult.meterName = item.measure_name;
                usageResult.date = item.date;
                usageResult.operationValue = item.operation_value;
                result.push(usageResult);
            }

            return result;
        }
        catch (error) {
            console.log(this.signature, 'call to Usage API failed', error);
            throw new Error(`Calling Usage API failed: ${error}`);
        }
    }
}