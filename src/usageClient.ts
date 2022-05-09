import BaseClient from "./baseClient";
import { UsageApiPayload, AllUsageApiPayload, UsageReport } from "./model/usageApiPayload";

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
    async getUsage(query: UsageApiPayload): Promise<UsageReport> {
        query.validate();
        return this.doPost<UsageReport>('/usage', query);
    }

    /**
     * Get usage data, multiple reports at a time.
     * See: https://docs.amberflo.io/reference/post_usage-batch
     */
    async getUsageBatch(queries: UsageApiPayload[]): Promise<UsageReport[]> {
        queries.forEach((q) => q.validate());
        return this.doPost<UsageReport[]>('/usage/batch', queries);
    }

    /**
     * Get usage reports for all meters. Because it incudes all meters, this is more limited than `getUsage`.
     */
    async getAllUsage(query: AllUsageApiPayload): Promise<UsageReport[]> {
        query.validate();
        return this.doGet<UsageReport[]>('/usage/all', query);
    }
}
