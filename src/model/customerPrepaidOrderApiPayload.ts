import { IValidatable, INestedValidatable, validators } from './validation';
import { defaultProductId, defaultOfferVersion } from './constants';
import { BillingPeriodInterval, PaymentStatus } from './payments';

export class BillingPeriod implements INestedValidatable {
    interval!: BillingPeriodInterval;
    intervalsCount!: number;

    constructor(intervalsCount: number, interval: BillingPeriodInterval) {
        this.intervalsCount = intervalsCount;
        this.interval = interval;
    }

    validate(prefix: string) {
        validators.positiveInteger(`${prefix}.intervalsCount`, this.intervalsCount, false);
    }
}

export class CustomerPrepaidOrderApiPayload implements IValidatable {
    id: string;
    customerId: string;
    startTimeInSeconds: number;
    prepaidPrice: number;
    prepaidOfferVersion?: number;
    originalWorth?: number;
    recurrenceFrequency?: BillingPeriod;
    externalPayment?: boolean;
    productId?: string;

    constructor(id: string, customerId: string, startTimeInSeconds: number, prepaidPrice: number) {
        this.id = id;
        this.customerId = customerId;
        this.startTimeInSeconds = startTimeInSeconds;
        this.prepaidPrice = prepaidPrice;
    }

    validate() {
        validators.nonEmptyStr('id', this.id, false);
        validators.nonEmptyStr('customerId', this.customerId, false);
        validators.positiveInteger('startTimeInSeconds', this.startTimeInSeconds, false);
        validators.positiveInteger('prepaidOfferVersion', this.prepaidOfferVersion);
        validators.positiveNumber('prepaidPrice', this.prepaidPrice, false);
        validators.positiveNumber('originalWorth', this.originalWorth);
        validators.valid('recurrenceFrequency', this.recurrenceFrequency);

        this.prepaidOfferVersion ||= defaultOfferVersion;
        this.productId ||= defaultProductId;
    }
}

export class CustomerPrepaidOrder {
    internalStatus!: string;
    prepaidPaymentTimeInSeconds?: number;
    paymentId?: string;
    paymentStatus!: PaymentStatus;
    firstInvoiceUri?: string;
    id!: string;
    customerId!: string;
    startTimeInSeconds!: number;
    endTimeInSeconds!: number;
    firstCardEndTimeSeconds!: number;
    productId!: string;
    prepaidOfferVersion!: number;
    prepaidPrice!: number;
    originalWorth!: number;
    originalCurrency!: string;
    recurrenceFrequency?: BillingPeriod;
    externalPayment!: boolean;
}
