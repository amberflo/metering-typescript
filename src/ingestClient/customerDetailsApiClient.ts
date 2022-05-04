import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import * as Constants from '../model/constants';
import { CustomerDetailsApiPayload } from '../model/customerApiPayload';
import * as Errors from '../model/errors';

export class CustomerDetailsApiClient {
    axiosInstance: AxiosInstance;
    signature: string;
    apiKey: string;
    debug: boolean;

    constructor(apiKey: string, debug = false) {
        this.apiKey = apiKey;
        this.signature = '[amberflo-metering CustomerDetailsApiClient]:';
        this.axiosInstance = axios.create();
        this.debug = debug;
        axiosRetry(this.axiosInstance, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay
        });
    }

    async post(payload: CustomerDetailsApiPayload) {
        if(this.debug){
            console.log(new Date(), this.signature, 'calling CustomerDetails API', payload);
        }

        const configGet: AxiosRequestConfig = {
            url: '/customer-details-endpoint/?customerId=' + payload.customerId,
            method: 'get',
            baseURL: Constants.amberfloBaseUrl,
            headers: {
                "X-API-KEY": this.apiKey,
                "Content-Type": "application/json"
            },
            timeout: 30000
        };

        const resultGet = await this.axiosInstance.request(configGet);
        const httpMethod = (Object.keys(resultGet.data).length > 0) ? 'put' : 'post';
        if(this.debug){
            console.log(new Date(), this.signature, 'http method is:', httpMethod);
        }

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

        return this.axiosInstance.request(config)
            .then((response) => {
                if(this.debug){
                    console.log(new Date(), this.signature, "response from CustomerDetails API: ", response.status, response.data);
                }
                if (response.status >= 300) {
                    console.log(`call to CustomerDetails API failed ${response.status}, ${response.data}`);
                    throw new Error(`${Errors.CUSTOMER_DETAILS_API_ERROR} ${response.status}, ${response.data}`);
                }
            })
            .catch((error) => {
                console.log(`${new Date()} ${this.signature} call to CustomerDetails API failed ${error}`);
                throw new Error(`${new Date()}  ${this.signature} ${Errors.CUSTOMER_DETAILS_API_ERROR} ${error}`);
            });
    }
}
