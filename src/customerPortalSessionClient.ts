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
     */
    constructor(apiKey: string, debug = false) {
        super(apiKey, debug, 'CustomerPortalSessionClient');
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
