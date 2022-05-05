import BaseClient from "./baseClient";
import { IUsageApiPayload, IAllUsageApiPayload, IUsageApiResult } from "./model/usageApiPayload";

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
    async getUsage(query: IUsageApiPayload): Promise<IUsageApiResult> {
        return await this.post<IUsageApiResult, IUsageApiPayload>('/usage', query);
    }

    /**
     * Get usage data, in batch
     * @param {UsageApiPayload[]} query
     * @returns {Promise<UsageApiResult[]>}
     */
    async getUsageBatch(query: IUsageApiPayload[]): Promise<IUsageApiResult[]> {
        return await this.post<IUsageApiResult[], IUsageApiPayload[]>('/usage/batch', query);
    }

    /**
     * Get usage data for all meters
     * @param {AllUsageApiPayload} query
     * @returns {Promise<UsageApiResult[]>}
     */
    async getAllUsage(query: IAllUsageApiPayload): Promise<IUsageApiResult[]> {
        return await this.get<IUsageApiResult[], IAllUsageApiPayload>('/usage/all', query);
    }
}
