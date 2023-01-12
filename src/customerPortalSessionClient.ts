import { IAxiosRetryConfig } from "axios-retry";
import BaseClient from "./baseClient";
import {
    CustomerPortalSessionApiPayload,
    CustomerPortalSession
} from "./model/customerPortalSessionApiPayload";

/**
 * See: https://docs.amberflo.io/reference/post_session
 */
export class CustomerPortalSessionClient extends BaseClient {

    /**
     * Initialize a new `CustomerPortalSessionClient`
     * `debug`: Whether to issue debug level logs or not.
     * `retry`: Whether to retry idempotent requests on 5xx or network errors, or retry configuration (see https://github.com/softonic/axios-retry).
     */
    constructor(apiKey: string, debug = false, retry: boolean | IAxiosRetryConfig = true) {
        super(apiKey, debug, 'CustomerPortalSessionClient', retry);
    }

    /**
     * Get a new url and session token for the customer portal
     * See: https://docs.amberflo.io/reference/post_session
     */
    async get(payload: CustomerPortalSessionApiPayload): Promise<CustomerPortalSession> {
        payload.validate();
        return this.doPost<CustomerPortalSession>('/session', payload);
    }
}
