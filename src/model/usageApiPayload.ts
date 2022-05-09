import { IValidatable, INestedValidatable, validators, maybeShowDeprecationWarning } from './validation';

export class TimeRange implements INestedValidatable {
    startTimeInSeconds?: number; // marked as optional for backwards compatibility
    endTimeInSeconds?: number;

    constructor(startTimeInSeconds?: number) {
        maybeShowDeprecationWarning('TimeRange', startTimeInSeconds);
        this.startTimeInSeconds = startTimeInSeconds;
    }

    validate(prefix: string) {
        validators.positiveInteger(`${prefix}.startTimeInSeconds`, this.startTimeInSeconds, false);
        validators.positiveInteger(`${prefix}.endTimeInSeconds`, this.endTimeInSeconds);
    }
}

export class Take implements INestedValidatable {
    limit?: number; // marked as optional for backwards compatibility
    isAscending?: boolean;

    constructor(limit?: number) {
        maybeShowDeprecationWarning('Take', limit);
        this.limit = limit;
    }

    validate(prefix: string) {
        validators.positiveInteger(`${prefix}.limit`, this.limit, false);
    }
}

export enum AggregationType {
    sum = 'sum',
    min = 'min',
    max = 'max',
    count = 'count',
}

export enum AggregationInterval {
    hour = 'hour',
    day = 'day',
    week = 'week',
    month = 'month',
}

export class UsageApiPayload implements IValidatable {
    meterApiName?: string; // marked as optional for backwards compatibility
    aggregation?: AggregationType; // marked as optional for backwards compatibility
    timeGroupingInterval?: AggregationInterval; // marked as optional for backwards compatibility
    timeRange?: TimeRange; // marked as optional for backwards compatibility

    filter?: { [key: string]: string[] };
    groupBy?: string[];
    take?: Take;

    constructor(
        meterApiName?: string,
        aggregation?: AggregationType,
        timeGroupingInterval?: AggregationInterval,
        timeRange?: TimeRange
    ) {
        maybeShowDeprecationWarning('UsageApiPayload', timeRange);
        this.meterApiName = meterApiName;
        this.aggregation = aggregation;
        this.timeGroupingInterval = timeGroupingInterval;
        this.timeRange = timeRange;
    }

    validate() {
        validators.nonEmptyStr('meterApiName', this.meterApiName, false);
        validators.required('aggregation', this.aggregation);
        validators.required('timeGroupingInterval', this.timeGroupingInterval);
        validators.valid('timeRange', this.timeRange, false);

        validators.valid('take', this.take);
        validators.nonEmptyList('groupBy', this.groupBy);
        validators.nonEmptyListMap('filter', this.filter);
    }
}

export enum AllUsageGroupBy {
    customerId = 'customerId',
}

export class AllUsageApiPayload implements IValidatable {
    startTimeInSeconds?: number; // marked as optional for backwards compatibility
    endTimeInSeconds?: number;
    timeGroupingInterval?: AggregationInterval; // marked as optional for backwards compatibility
    groupBy?: AllUsageGroupBy;
    customerId?: string;

    constructor(startTimeInSeconds?: number, timeGroupingInterval?: AggregationInterval) {
        maybeShowDeprecationWarning('AllUsageApiPayload', timeGroupingInterval);
        this.startTimeInSeconds = startTimeInSeconds;
        this.timeGroupingInterval = timeGroupingInterval;
    }

    validate() {
        validators.required('startTimeInSeconds', this.startTimeInSeconds);
        validators.required('timeGroupingInterval', this.timeGroupingInterval);
        validators.nonEmptyStr('customerId', this.customerId);
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
