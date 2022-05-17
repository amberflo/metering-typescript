import BaseClient from "./baseClient";
import {
    AllInvoicesQuery,
    InvoiceQuery,
    LatestInvoiceQuery,
    CustomerProductInvoice
} from "./model/customerProductInvoiceApiPayload";

/**
 * See https://docs.amberflo.io/reference/get_payments-billing-customer-product-invoice
 */
export class CustomerProductInvoiceClient extends BaseClient {

    private readonly path = "/payments/billing/customer-product-invoice";
    private readonly pathAll = this.path + "/all";

    /**
     * Initialize a new `CustomerProductInvoiceClient`
     * `debug`: Whether to issue debug level logs or not.
     * `retry`: Wheter to retry idempotent requests on 5xx or network errors.
     */
    constructor(apiKey: string, debug = false, retry = true) {
        super(apiKey, debug, 'CustomerProductInvoiceClient', retry);
    }

    /**
     * Get all invoices of the specified customer.
     * See https://docs.amberflo.io/reference/get_payments-billing-customer-product-invoice-all
     */
    async getAll(query: AllInvoicesQuery): Promise<CustomerProductInvoice[]> {
        query.validate();
        return this.doGet<CustomerProductInvoice[]>(this.pathAll, query);
    }

    /**
     * Get a existing invoice of the specified customer: either the latest (currently open) or a previous one.
     * See https://docs.amberflo.io/reference/get_payments-billing-customer-product-invoice
     */
    async get(query: InvoiceQuery | LatestInvoiceQuery): Promise<CustomerProductInvoice | null> {
        query.validate();
        return this.doGet<CustomerProductInvoice>(this.path, query);
    }
}
