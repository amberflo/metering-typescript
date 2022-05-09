import BaseClient from "./baseClient";
import { CustomerDetailsApiPayload, CustomerDetails } from './model/customerApiPayload';

type NotFound = Record<string, never>

/**
 * See: https://docs.amberflo.io/reference/post_customers
 */
export class CustomerDetailsClient extends BaseClient {

    /**
     * Initialize a new `CustomerDetailsApiClient`
     * `debug`: Whether to issue debug level logs or not.
     */
    constructor(apiKey: string, debug = false) {
        super(apiKey, debug, 'CustomerDetailsApiClient', true);
    }

    /**
     * List all customers.
     */
    async list(): Promise<CustomerDetails[]> {
        return this.doGet<CustomerDetails[]>('/customers');
    }

    /**
     * Get customer by id.
     */
    async get(customerId: string): Promise<CustomerDetails | NotFound> {
        return this.doGet<CustomerDetails | NotFound>('/customers', { customerId });
    }

    /**
     * Add a new customer.
     * See: https://docs.amberflo.io/reference/post_customers
     * `createInStripe`: Whether or not to add create the customer in Stripe and add a `stripeId` trait to the customer.
     */
    async add(payload: CustomerDetailsApiPayload, createInStripe = false): Promise<CustomerDetails> {
        payload.validate();
        const params = createInStripe ? { autoCreateCustomerInStripe: true } : undefined;
        return this.doPost<CustomerDetails>('/customers', payload, params);
    }

    /**
     * Update an existing customer.
     * This has PUT semantics (i.e. it discards existing data).
     * See: https://docs.amberflo.io/reference/put_customers-customer-id
     */
    async update(payload: CustomerDetailsApiPayload): Promise<CustomerDetails> {
        payload.validate();
        return this.doPut<CustomerDetails>('/customers', payload);
    }

    /**
     * Convenience method. Performs a `get` followed by either `add` or `update`.
     * The update has PUT semantics (i.e. it discards existing data).
     */
    async addOrUpdate(payload: CustomerDetailsApiPayload): Promise<CustomerDetails> {
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
