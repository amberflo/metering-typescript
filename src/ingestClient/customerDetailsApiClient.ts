import BaseClient from "../baseClient";
import { CustomerDetailsApiPayload, ICustomerDetails } from '../model/customerApiPayload';

type NotFound = Record<string, never>

export class CustomerDetailsApiClient extends BaseClient {

    constructor(apiKey: string, debug = false) {
        super(apiKey, debug, 'CustomerDetailsApiClient', true);
    }

    async list(): Promise<ICustomerDetails[]> {
        return this.do_get<ICustomerDetails[]>('/customers');
    }

    async get(customerId: string): Promise<ICustomerDetails | NotFound> {
        return this.do_get<ICustomerDetails | NotFound>('/customers', { customerId });
    }

    async add(payload: CustomerDetailsApiPayload, createInStripe = false): Promise<ICustomerDetails> {
        payload.validate();
        const params = createInStripe ? { autoCreateCustomerInStripe: true } : undefined;
        return this.do_post<ICustomerDetails>('/customers', payload, params);
    }

    async update(payload: CustomerDetailsApiPayload): Promise<ICustomerDetails> {
        payload.validate();
        return this.do_put<ICustomerDetails>('/customers', payload);
    }

    async add_or_update(payload: CustomerDetailsApiPayload): Promise<ICustomerDetails> {
        payload.validate();
        const customer = await this.get(payload.customerId);
        if (customer.id) {
            return this.update(payload);
        } else {
            return this.add(payload);
        }
    }

    // for backwards compatibility
    post = this.add_or_update;
}
