export class TimeRange {
    startTimeInSeconds!: number;
    endTimeInSeconds?: number;
}

export class Take {
    limit?: number;
    isAscending?: boolean;
}

export enum AggregationType {
    sum = 'SUM',
    min = 'MIN',
    max = 'MAX',
}

export enum AggregationInterval {
    hour = 'HOUR',
    day = 'DAY',
    week = 'WEEK',
    month = 'MONTH'
}

export class UsageApiPayload {
    meterApiName!: string;
    aggregation!: AggregationType;
    timeGroupingInterval!: AggregationInterval;
    filter?: any;
    groupBy?: string[];
    take?: Take;
    timeRange?: TimeRange;
}
