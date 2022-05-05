export interface ITimeRange {
    startTimeInSeconds: number
    endTimeInSeconds?: number
}

// keep for backwards compatibility
export class TimeRange implements ITimeRange {
    startTimeInSeconds!: number;
    endTimeInSeconds?: number;
}

export interface ITake {
    limit: number
    isAscending?: boolean
}

// keep for backwards compatibility
export class Take implements ITake {
    limit!: number;
    isAscending?: boolean;
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

export interface IUsageApiPayload {
    meterApiName: string
    aggregation: AggregationType
    timeGroupingInterval: AggregationInterval
    filter?: {[key: string]: string[]}
    groupBy?: string[]
    take?: Take
    timeRange: ITimeRange
}

// keep for backwards compatibility
export class UsageApiPayload implements IUsageApiPayload {
    meterApiName!: string;
    aggregation!: AggregationType;
    timeGroupingInterval!: AggregationInterval;
    filter?: {[key: string]: string[]};
    groupBy?: string[];
    take?: Take;
    timeRange!: TimeRange;
}

export enum AllUsageGroupBy {
    customerId = "customerId"
}

export interface IAllUsageApiPayload extends ITimeRange {
    timeGroupingInterval: AggregationInterval
    groupBy?: AllUsageGroupBy
    customerId?: string
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

export interface IUsageApiResult {
    metadata: UsageApiPayload
    secondsSinceEpochIntervals: number[]
    clientMeters: IAggregationGroup[]
}
