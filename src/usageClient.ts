import BaseClient from "./baseClient";
import { UsageApiPayload, AllUsageApiPayload, IUsageReport } from "./model/usageApiPayload";

export class UsageClient extends BaseClient {

    /**
     * Initialize a new `UsageClient`
     * @param {string} apiKey
     * @param {boolean} debug: Whether to issue debug level logs or not
     */
    constructor(apiKey: string, debug = false) {
        super(apiKey, debug, 'UsageClient');
    }

    /**
     * Get usage data
     * @param {UsageApiPayload} query
     * @returns {Promise<UsageApiResult>}
     */
    async getUsage(query: UsageApiPayload): Promise<IUsageReport> {
        query.validate();
        return this.doPost<IUsageReport>('/usage', query);
    }

    /**
     * Get usage data, in batch
     * @param {UsageApiPayload[]} query
     * @returns {Promise<UsageApiResult[]>}
     */
    async getUsageBatch(queries: UsageApiPayload[]): Promise<IUsageReport[]> {
        queries.forEach((q) => q.validate());
        return this.doPost<IUsageReport[]>('/usage/batch', queries);
    }

    /**
     * Get usage data for all meters
     * @param {AllUsageApiPayload} query
     * @returns {Promise<UsageApiResult[]>}
     */
    async getAllUsage(query: AllUsageApiPayload): Promise<IUsageReport[]> {
        query.validate();
        return this.doGet<IUsageReport[]>('/usage/all', query);
    }
}
