import { IValidatable, validators } from './validation';
import { defaultProductId } from './constants';

export class CustomerProductPlanApiPayload implements IValidatable {
    customerId: string;
    productPlanId: string;
    productId?: string;
    startTimeInSeconds?: number;
    endTimeInSeconds?: number;

    constructor(customerId: string, productPlanId: string) {
        this.customerId = customerId;
        this.productPlanId = productPlanId;
    }

    validate() {
        validators.nonEmptyStr('customerId', this.customerId, false);
        validators.nonEmptyStr('productPlanId', this.productPlanId, false);
        this.productId ||= defaultProductId;
        validators.positiveInteger('startTimeInSeconds', this.startTimeInSeconds);
        validators.positiveInteger('endTimeInSeconds', this.endTimeInSeconds);
    }
}

export class CustomerProductPlan {
    customerId!: string;
    productPlanId!: string;
    productId!: string;
    startTimeInSeconds!: number;
    endTimeInSeconds!: number;
}
