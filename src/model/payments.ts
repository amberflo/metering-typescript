export enum BillingPeriodInterval {
    day = 'day',
    month = 'month',
    year = 'year',
}

export enum PaymentStatus {
    prePayment = 'pre_payment',
    requiresAction = 'requires_action',
    pending = 'pending',
    failed = 'failed',
    settled = 'settled',
    notNeeded = 'not_needed',
    unknown = 'unknown',
}
