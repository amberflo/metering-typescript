import { IValidatable, validators } from './validation';

export class CustomerPortalSessionApiPayload implements IValidatable {
    customerId: string;
    expirationEpochMilliSeconds?: number;
    returnUrl?: string;

    constructor(customerId: string) {
        this.customerId = customerId;
    }

    validate() {
        validators.nonEmptyStr('customerId', this.customerId, false);
        validators.nonEmptyStr('returnUrl', this.returnUrl);
        validators.positiveInteger('expirationEpochMilliSeconds', this.expirationEpochMilliSeconds);
    }
}

export class CustomerPortalSession {
    url!: string;
    sessionToken!: string;
}
