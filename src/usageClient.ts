import axios, { AxiosInstance } from "axios";
import { UsagePayload } from "./usagePayload";
import { UsageResult } from "./usageResult";

export class UsageClient {
    apiKey: string;
    axiosInstance: AxiosInstance;
    signature: string;

    constructor(apiKey: string) {
        this.signature = '[amberflo-metering UsageClient]:';
        this.apiKey = apiKey;
        this.axiosInstance = axios.create({
            baseURL: 'https://app.amberflo.io',
            headers: {
                "X-API-KEY": this.apiKey,
                "Content-Type": "application/json"
            },
            timeout: 30000
        });
    }


    async getUsage(payload: UsagePayload):Promise<UsageResult[]> {
        let body = {
            meter_id: payload.meterId,
            tenant: payload.customerName
        };

        try {
            console.log(this.signature, 'calling Usage API', body);
            let response = await this.axiosInstance.post('/usage-endpoint', body);
            console.log(this.signature, 'obtained result from Usage API', response.status);

            let result = response.data.map((u: { tenant: string; measure_name: string; date: Date; operation_value: number; }) => {
                let usageResult = new UsageResult();
                usageResult.customer = u.tenant;
                usageResult.meterName = u.measure_name;
                usageResult.date = u.date;
                usageResult.operationValue = u.operation_value;
                return usageResult;
            });

            console.log(response.data);

            return result;
        }
        catch (error) {
            console.log(this.signature, 'call to Usage API failed', error);
            throw new Error(`Calling Usage API failed: ${error}`);
        }
    }
}