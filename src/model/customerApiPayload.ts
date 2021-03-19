export class CustomerDetailsApiPayload{
    customerId:string;
    customerName:string;
    traits!:Map<string,string>;

    constructor(customerId:string, customerName:string, traits?:Map<string,string>){
        this.customerId = customerId;
        this.customerName = customerName;
        if(traits){
            this.traits = traits;
        }
    }
}