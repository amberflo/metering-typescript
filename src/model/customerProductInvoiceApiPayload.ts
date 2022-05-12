import { IValidatable, validators } from './validation';
import { defaultProductId } from './constants';
import { BillingPeriodInterval, PaymentStatus } from './payments';

export class AllInvoicesQuery implements IValidatable {
    customerId: string;
    productId?: string;
    fromCache?: boolean;
    withPaymentStatus?: boolean;

    constructor(customerId: string) {
        this.customerId = customerId;
    }

    validate() {
        validators.nonEmptyStr('customerId', this.customerId, false);
        this.productId ||= defaultProductId;
    }
}

export class LatestInvoiceQuery extends AllInvoicesQuery {
    latest = true;
}

export class InvoiceQuery extends AllInvoicesQuery {
    productPlanId: string;
    year: number;
    month: number;
    day: number;

    constructor(customerId: string, productPlanId: string, year: number, month: number, day: number) {
        super(customerId);

        this.productPlanId = productPlanId;
        this.year = year;
        this.month = month;
        this.day = day;
    }

    validate() {
        super.validate();
        validators.nonEmptyStr('productItemId', this.productPlanId, false);
        validators.positiveInteger('year', this.year, false);
        validators.positiveInteger('month', this.month, false);
        validators.positiveInteger('day', this.day, false);
    }
}

// Response Type

enum PromotionType {
    planFreeTier = "plan_free_tier",
    automaticPromotion = "automatic_promotion",
    discount = "discount",
    coupon = "coupon",
}

enum InvoiceStatus {
    open = "open",
    gracePeriod = "grace_period",
    priceLocked = "price_locked",
}

class InvoiceKey {
    accountId!: string;
    customerId!: string;
    productId!: string;
    productPlanId!: string;
    year!: number;
    month!: number;
    day!: number;
}

class BillingPeriod {
    interval!: BillingPeriodInterval;
    intervalsCount!: number;
}

class ProductItemInvoiceKey extends InvoiceKey {
    productItemKey!: string;
}

class ItemVariantBill {
    priceInCredits?: number;
    priceInBaseCurrency?: number;
    startTimeInSeconds!: number;
    endTimeInSeconds!: number;
    meterUnits!: number;
    price!: number;
    meteredUnitsPerTier?: { [key: string]: number };
}

class ProductItemVariantInvoice {
    key!: string;
    itemDimensions!: { [key: string]: string };
    hourlyBillInfos?: ItemVariantBill[];
    totalBill!: ItemVariantBill;
    lateArrivalMeters!: number;
}

class ProductItemInvoice {
    key!: ProductItemInvoiceKey;
    productItemId!: string;
    productItemName!: string;
    meterApiName!: string;
    productPlanName!: string;
    productItemVariants!: ProductItemVariantInvoice[];
    totalBill!: ItemVariantBill;
}

class AppliedPromotion {
    promotionId!: string;
    promotionName!: string;
    promotionType!: PromotionType;
    discount!: number;
    promotionAppliedTimeInSeconds!: number;
    maxDiscountPossible!: number;
    canBeUsedForPayAsYouGo!: boolean;
    discountInCredits!: number;
}

class ProductPlanFee {
    id!: string;
    name!: string;
    description!: string;
    cost!: number;
    isOneTimeFee!: boolean;
}

class ProductPlanBill {
    startTimeInSeconds!: number;
    endTimeInSeconds!: number;
    itemPrice!: number;
    fixPrice!: number;
    prepaid!: number;
    totalDiscount!: number;
    totalPriceBeforeDiscount!: number;
    totalPriceBeforePrepaid!: number;
    totalPrice!: number;
}

class CreditUnit {
    id!: string;
    shortName!: string;
    name!: string;
    description!: string;
    ratioToCurrency!: number;
}

export class CustomerProductInvoice {
    invoiceUri!: string;
    invoiceKey!: InvoiceKey;
    planBillingPeriod!: BillingPeriod;
    planName!: string;
    invoiceStartTimeInSeconds!: number;
    invoiceEndTimeInSeconds!: number;
    gracePeriodInHours!: number;
    productItemInvoices!: ProductItemInvoice[];
    appliedPromotions!: AppliedPromotion[];
    productPlanFees!: ProductPlanFee[];
    totalBill!: ProductPlanBill;
    invoicePriceStatus!: InvoiceStatus;
    creditUnit?: CreditUnit;
    paymentStatus!: PaymentStatus;
    paymentCreatedInSeconds?: number;

    externalSystemStatus?: string;
    invoiceBillInCredits?: ProductPlanBill;

    availablePrepaidLeft?: number;
    availablePrepaidLeftInCredits?: number;

    availablePayAsYouGoMoney?: number;
    availablePayAsYouGoMoneyInCredits?: number;
}
