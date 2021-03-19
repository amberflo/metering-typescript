import { stringify } from "uuid";

export class MeterMessage {
    meterName: string;
    meterValue: number;
    utcTimeMillis: number;
    customerId: string;
    customerName: string;
    dimensions!: Map<string, string>;

    constructor(meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, customerName: string, dimensions?: Map<string, string>) {
        this.meterName = meterName;
        this.meterValue = meterValue;
        this.utcTimeMillis = utcTimeMillis;
        this.customerId = customerId;
        this.customerName = customerName;
        if(dimensions){
            this.dimensions = dimensions;
        }
    }
}