import BaseClient from "./baseClient";
import { CustomerProductPlanApiPayload, CustomerProductPlan } from "./model/customerProductPlanApiPayload";

/**
 * See: https://docs.amberflo.io/reference/post_payments-pricing-amberflo-customer-pricing
 */
export class CustomerProductPlanClient extends BaseClient {

    private readonly path = "/payments/pricing/amberflo/customer-pricing";
    private readonly pathAll = this.path + "/list";

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
    async list(customerId: string): Promise<CustomerProductPlan[]> {
        return this.doGet<CustomerProductPlan[]>(this.pathAll, { CustomerId: customerId });
    }

    /**
     * Get the latest product plan of the given customer.
     */
    async get(customerId: string): Promise<CustomerProductPlan> {
        return this.doGet<CustomerProductPlan>(this.path, { CustomerId: customerId });
    }

    /**
     * Relates the customer to a product plan.
     * See https://docs.amberflo.io/reference/post_payments-pricing-amberflo-customer-pricing
     */
    async addOrUpdate(payload: CustomerProductPlanApiPayload): Promise<CustomerProductPlan> {
        payload.validate();
        return this.doPost<CustomerProductPlan>(this.path, payload);
    }
}
