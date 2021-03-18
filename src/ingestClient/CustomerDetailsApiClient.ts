import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import * as Constants from '../model/constants';
import { CustomerDetailsApiPayload } from './customerApiPayload';
import * as Errors from '../model/errors';

export class CustomerDetailsApiClient {
    axiosInstance: AxiosInstance;
    signature: string;

    constructor(apiKey: string) {
        this.signature = '[amberflo-metering CustomerDetailsApiClient]:';
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

    async post(payload: CustomerDetailsApiPayload) {
        console.log(this.signature, 'calling CustomerDetails API');
        let promise = this.axiosInstance
            .post('/customerDetails-endpoint', payload)
            .then((response) => {
                console.log("response from CustomerDetails API: ", response.status, response.data);
                if (response.status >= 300) {
                    console.log(`call to CustomerDetails API failed ${response.status}, ${response.data}`);
                    throw new Error(`${Errors.CUSTOMER_DETAILS_API_ERROR} ${response.status}, ${response.data}`);
                }
            })
            .catch((error) => {
                console.log(`call to CustomerDetails API failed ${error}`);
                throw new Error(`${Errors.CUSTOMER_DETAILS_API_ERROR} ${error}`);
            });

        await promise;
    }
}