import BaseClient from './baseClient';
import { defaultProductId } from './model/constants';
import {
    CustomerPrepaidOrderApiPayload,
    CustomerPrepaidOrder,
    BillingPeriod,
} from './model/customerPrepaidOrderApiPayload';

/**
 * See: https://docs.amberflo.io/reference/post_payments-pricing-amberflo-customer-prepaid
 */
export class CustomerPrepaidOrderClient extends BaseClient {

    private readonly path = '/payments/pricing/amberflo/customer-prepaid';
    private readonly pathList = this.path + '/list';

    /**
     * Initialize a new `CustomerPrepaidOrderClient`
     * `debug`: Whether to issue debug level logs or not.
     */
    constructor(apiKey: string, debug = false) {
        super(apiKey, debug, 'CustomerPrepaidOrderClient');
    }

    /**
     * List active prepaid orders of the given customer.
     * See https://docs.amberflo.io/reference/get_payments-pricing-amberflo-customer-prepaid-list
     */
    async listActive(customerId: string, productId?: string): Promise<CustomerPrepaidOrder[]> {
        const query = { CustomerId: customerId, ProductId: productId || defaultProductId };
        const values = await this.doGet<CustomerPrepaidOrder[]>(this.pathList, query);
        return values.map(this.deserialize);
    }

    /**
     * Add a new prepaid order to a customer.
     * See https://docs.amberflo.io/reference/post_payments-pricing-amberflo-customer-prepaid
     */
    async add(payload: CustomerPrepaidOrderApiPayload): Promise<CustomerPrepaidOrder> {
        payload.validate();
        const value = await this.doPost<CustomerPrepaidOrder>(this.path, payload);
        return this.deserialize(value);
    }

    /**
     * Make sure `BillingPeriod` is correctly instantiated.
     * See https://aflo.atlassian.net/browse/MET-1600
     */
    private deserialize(plain: CustomerPrepaidOrder): CustomerPrepaidOrder {
        if (plain.recurrenceFrequency)
            plain.recurrenceFrequency = new BillingPeriod(
                plain.recurrenceFrequency.intervalsCount,
                plain.recurrenceFrequency.interval
            );
        return plain;
    }
}
