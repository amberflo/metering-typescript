import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import * as Constants from '../model/constants';
import { CustomerDetailsApiPayload } from './customerApiPayload';
import * as Errors from '../model/errors';

export class CustomerDetailsApiClient {
    axiosInstance: AxiosInstance;
    signature: string;
    apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.signature = '[amberflo-metering CustomerDetailsApiClient]:';
        this.axiosInstance = axios.create();
        axiosRetry(this.axiosInstance, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay
        });
    }

    async post(payload: CustomerDetailsApiPayload) {
        console.log(this.signature, 'calling CustomerDetails API');

        const configGet: AxiosRequestConfig = {
            url: '/customer-details-endpoint'+ payload.customerId,
            method: 'get',
            baseURL: Constants.amberfloBaseUrl,
            headers: {
                "X-API-KEY": this.apiKey,
                "Content-Type": "application/json"
            },
            timeout: 30000
        };

        let resultGet = await this.axiosInstance.request(configGet);
        const httpMethod = (Object.keys(resultGet.data).length > 0) ? 'put': 'post';
        console.log(this.signature, 'http method is:', httpMethod);

        const config: AxiosRequestConfig = {
            url: '/customer-details-endpoint',
            method: httpMethod,
            baseURL: Constants.amberfloBaseUrl,
            headers: {
                "X-API-KEY": this.apiKey,
                "Content-Type": "application/json"
            },
            timeout: 30000,
            data: payload
        };

        let promise = this.axiosInstance.request(config)
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