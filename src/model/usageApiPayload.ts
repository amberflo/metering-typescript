import { UsagePayload } from "..";

export class UsageApiPayload {
    meter_id!: string;
    meter_name!: string;
    tenant!: string;

    constructor(payload: UsagePayload) {
        if (payload.customerName) {
            this.tenant = payload.customerName;
        }
        if (payload.meterName) {
            this.meter_name = payload.meterName;
        } else if (payload.meterId) {
            this.meter_id = payload.meterId;
        }
    }
}