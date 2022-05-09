import BaseClient from "../baseClient";
import { CustomerDetailsApiPayload, ICustomerDetails } from '../model/customerApiPayload';

type NotFound = Record<string, never>

export class CustomerDetailsApiClient extends BaseClient {

    constructor(apiKey: string, debug = false) {
        super(apiKey, debug, 'CustomerDetailsApiClient', true);
    }

    async list(): Promise<ICustomerDetails[]> {
        return this.doGet<ICustomerDetails[]>('/customers');
    }

    async get(customerId: string): Promise<ICustomerDetails | NotFound> {
        return this.doGet<ICustomerDetails | NotFound>('/customers', { customerId });
    }

    async add(payload: CustomerDetailsApiPayload, createInStripe = false): Promise<ICustomerDetails> {
        payload.validate();
        const params = createInStripe ? { autoCreateCustomerInStripe: true } : undefined;
        return this.doPost<ICustomerDetails>('/customers', payload, params);
    }

    async update(payload: CustomerDetailsApiPayload): Promise<ICustomerDetails> {
        payload.validate();
        return this.doPut<ICustomerDetails>('/customers', payload);
    }

    async addOrUpdate(payload: CustomerDetailsApiPayload): Promise<ICustomerDetails> {
        payload.validate();
        const customer = await this.get(payload.customerId);
        if (customer.id) {
            return this.update(payload);
        } else {
            return this.add(payload);
        }
    }

    // for backwards compatibility
    post = this.addOrUpdate;
}
