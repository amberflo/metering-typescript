import BaseClient from "./baseClient";
import { UsageApiPayload, AllUsageApiPayload, IUsageReport } from "./model/usageApiPayload";

/**
 * See: https://docs.amberflo.io/reference/post_usage
 */
export class UsageClient extends BaseClient {

    /**
     * Initialize a new `UsageClient`
     * `debug`: Whether to issue debug level logs or not.
     */
    constructor(apiKey: string, debug = false) {
        super(apiKey, debug, 'UsageClient');
    }

    /**
     * Get usage data
     * See: https://docs.amberflo.io/reference/post_usage
     */
    async getUsage(query: UsageApiPayload): Promise<IUsageReport> {
        query.validate();
        return this.doPost<IUsageReport>('/usage', query);
    }

    /**
     * Get usage data, multiple reports at a time.
     * See: https://docs.amberflo.io/reference/post_usage-batch
     */
    async getUsageBatch(queries: UsageApiPayload[]): Promise<IUsageReport[]> {
        queries.forEach((q) => q.validate());
        return this.doPost<IUsageReport[]>('/usage/batch', queries);
    }

    /**
     * Get usage reports for all meters. Because it incudes all meters, this is more limited than `getUsage`.
     */
    async getAllUsage(query: AllUsageApiPayload): Promise<IUsageReport[]> {
        query.validate();
        return this.doGet<IUsageReport[]>('/usage/all', query);
    }
}
