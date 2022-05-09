import BaseClient from "./baseClient";
import { CustomerProductPlanApiPayload, ICustomerProductPlan } from "./model/customerProductPlanApiPayload";

/**
 * See: https://docs.amberflo.io/reference/post_payments-pricing-amberflo-customer-pricing
 */
export class CustomerProductPlanClient extends BaseClient {

    private path = "/payments/pricing/amberflo/customer-pricing";
    private pathAll = this.path + "/list";

    /**
     * Initialize a new `CustomerProductPlanClient`
     * `debug`: Whether to issue debug level logs or not.
     */
    constructor(apiKey: string, debug = false) {
        super(apiKey, debug, 'CustomerProductPlanClient');
    }

    /**
     * List the entire history of product plans of the given customer.
     */
    async list(customerId: string): Promise<ICustomerProductPlan[]> {
        return this.doGet<ICustomerProductPlan[]>(this.pathAll, { CustomerId: customerId });
    }

    /**
     * Get the latest product plan of the given customer.
     */
    async get(customerId: string): Promise<ICustomerProductPlan> {
        return this.doGet<ICustomerProductPlan>(this.path, { CustomerId: customerId });
    }

    /**
     * Relates the customer to a product plan.
     * See https://docs.amberflo.io/reference/post_payments-pricing-amberflo-customer-pricing
     */
    async addOrUpdate(payload: CustomerProductPlanApiPayload): Promise<ICustomerProductPlan> {
        payload.validate();
        return this.doPost<ICustomerProductPlan>(this.path, payload);
    }
}
