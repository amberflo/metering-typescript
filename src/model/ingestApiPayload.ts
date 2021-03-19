import { MeterMessage } from "./meterMessage";

export class IngestApiPayload{
    tenant: string;
    tenant_id:string;
    meter_name: string;
    meter_value: number;
    time: number;
    dimensions!: Map<string, string>;

    constructor(m:MeterMessage){
        this.tenant = m.customerName;
        this.tenant_id = m.customerId;
        this.meter_name= m.meterName;
        this.meter_value= m.meterValue;
        this.time= m.utcTimeMillis;
        if(m.dimensions){
            this.dimensions = m.dimensions;
        }
    }
}