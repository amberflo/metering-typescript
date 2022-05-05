import { IValidatable } from './validation';

export class TimeRange implements IValidatable {
    startTimeInSeconds?: number;  // marked as optional for backwards compatibility
    endTimeInSeconds?: number;

    constructor(startTimeInSeconds?: number, endTimeInSeconds?: number) {
        // FIXME empty constructor deprecation warning
        this.startTimeInSeconds = startTimeInSeconds
        this.endTimeInSeconds = endTimeInSeconds
    }

    validate() {
        // FIXME implement
    }
}

export class Take implements IValidatable {
    limit?: number;  // marked as optional for backwards compatibility
    isAscending?: boolean;

    constructor(limit?: number, isAscending?: boolean) {
        // FIXME empty constructor deprecation warning
        this.limit = limit
        this.isAscending = isAscending
    }

    validate() {
        // FIXME implement
    }
}

export enum AggregationType {
    sum = 'sum',
    min = 'min',
    max = 'max',
    count = "count",
}

export enum AggregationInterval {
    hour = 'hour',
    day = 'day',
    week = 'week',
    month = 'month'
}

export class UsageApiPayload implements IValidatable {
    meterApiName?: string;  // marked as optional for backwards compatibility
    aggregation?: AggregationType;  // marked as optional for backwards compatibility
    timeGroupingInterval?: AggregationInterval;  // marked as optional for backwards compatibility
    timeRange?: TimeRange;  // marked as optional for backwards compatibility

    filter?: {[key: string]: string[]};
    groupBy?: string[];
    take?: Take;

    constructor(meterApiName?: string, aggregation?: AggregationType, timeGroupingInterval?: AggregationInterval, timeRange?: TimeRange) {
        // FIXME empty constructor deprecation warning
        this.meterApiName = meterApiName
        this.aggregation = aggregation
        this.timeGroupingInterval = timeGroupingInterval
        this.timeRange = timeRange
    }

    validate() {
        // FIXME implement
    }
}

export enum AllUsageGroupBy {
    customerId = "customerId"
}

export class AllUsageApiPayload implements IValidatable {
    startTimeInSeconds?: number;  // marked as optional for backwards compatibility
    endTimeInSeconds?: number;
    timeGroupingInterval?: AggregationInterval  // marked as optional for backwards compatibility
    groupBy?: AllUsageGroupBy
    customerId?: string

    constructor(startTimeInSeconds?: number, timeGroupingInterval?: AggregationInterval) {
        // FIXME empty constructor deprecation warning
        this.startTimeInSeconds = startTimeInSeconds
        this.timeGroupingInterval = timeGroupingInterval
    }

    validate() {
        // FIXME
    }
}

interface IAggregationValue {
    value: number
    secondsSinceEpochUtc: number
    percentageFromPrevious: number
}

interface IAggregationGroup {
    group?: {
        groupInfo?: { [key: string]: string }
    }
    groupValue: number
    values: IAggregationValue[]
    percentageFromPrevious: number
}

export interface IUsageReport {
    metadata: UsageApiPayload
    secondsSinceEpochIntervals: number[]
    clientMeters: IAggregationGroup[]
}
