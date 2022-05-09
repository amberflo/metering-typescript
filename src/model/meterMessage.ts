import { v1 } from 'uuid';

export class MeterMessage {
    uniqueId?: string;
    meterApiName: string;
    customerId: string;
    meterValue: number;
    meterTimeInMillis: number;
    dimensions!: any;

    constructor(meterApiName: string, meterValue: number, meterTimeInMillis: number, customerId: string, dimensions?: Map<string, string>) {
        this.uniqueId = v1();
        this.meterApiName = meterApiName;
        this.meterValue = meterValue;
        this.meterTimeInMillis = meterTimeInMillis;
        this.customerId = customerId;
        if(dimensions){
            this.dimensions = {};
            dimensions.forEach((value, key) => {
                this.dimensions[key] = value;
            });
        }
    }
}
