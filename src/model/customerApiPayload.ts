import {
    IValidatable,
    validators,
} from './validation'

export class CustomerDetailsApiPayload implements IValidatable {
    customerId: string
    customerName: string
    customerEmail?: string
    enabled?: boolean
    traits?: { [key: string]: string }

    constructor(customerId: string, customerName: string, traits?: Map<string, string>) {
        this.customerId = customerId
        this.customerName = customerName
        if (traits) {
            this.traits = Object.fromEntries(traits.entries())
        }
    }

    validate() {
        validators.nonEmptyStr('customerId', this.customerId, false)
        validators.nonEmptyStr('customerName', this.customerName, false)
        validators.nonEmptyStr('customerEmail', this.customerEmail)
        validators.nonEmptyStrMap('traits', this.traits)
    }
}

export interface ICustomerDetails {
    customerId: string
    customerName: string
    customerEmail?: string
    enabled?: boolean
    traits?: { [key: string]: string }

    id: string
    createTime: number
    updateTime: number
}
