import { MeterMessage } from "./model/meterMessage";
import { IngestClient } from "./ingestClient/ingestClient";
import { IngestClientFactory } from "./ingestClient/ingestClientFactory";
import { IngestOptions } from "./model/ingestOptions";
import * as Errors from './model/errors';
import { CustomerDetailsApiPayload } from "./ingestClient/customerApiPayload";
import { CustomerDetailsApiClient } from "./ingestClient/CustomerDetailsApiClient";

export class Metering {
    readonly customerDetailsApiClient: CustomerDetailsApiClient;
    readonly apiKey!: string;
    readonly debug!: boolean;
    readonly ingestClient: IngestClient;
    private signature: string;
    private isStarted: boolean = false;

    /**
     * Initialize a new metering client without any side effects. Call start() to start up ingestion client. 
     * @param apiKey 
     * @param debug 
     * @param ingestOptions 
     */
    constructor(apiKey: string, debug: boolean, ingestOptions?: IngestOptions) {
        if (!apiKey.trim()) {
            throw new Error(Errors.MISSING_API_KEY);
        }
        this.signature = '[amberflo-metering Metering]:';
        this.apiKey = apiKey;
        this.debug = debug;
        this.ingestClient = IngestClientFactory.getNewInstance(apiKey, ingestOptions);
        this.customerDetailsApiClient = new CustomerDetailsApiClient(apiKey);
    }

    /**
     * Start and initialize the ingestion client. If this is not called, all other calls will fail.
     */
    start() {
        if (this.isStarted) {
            return;
        }
        this.ingestClient.start();
        this.isStarted = true;
    }

    /**
     * Ingest a meter
     * @param {string} meterName 
     * @param {number} meterValue 
     * @param {number} utcTimeMillis 
     * @param {string} customerId 
     * @param {string} customerName 
     * @param {Map<string,string>} dimensions 
     */
    meter(meterName: string, meterValue: number, utcTimeMillis: number, customerId: string, customerName: string, dimensions?: Map<string, string>) {
        if (!this.isStarted) {
            throw new Error(Errors.START_NOT_CALLED);
        }
        let meterMessage = new MeterMessage(meterName, meterValue, utcTimeMillis, customerId, customerName, dimensions);
        let validations = Metering.validateMeterMessage(meterMessage);
        if (validations.length > 0) {
            throw new Error(`Invalid meter message: ${validations}`);
        }
        this.ingestClient.ingestMeter(meterMessage);
    }

    static validateMeterMessage(meterMessage: MeterMessage) {
        let validations = [];
        //threshold of 5 mins in the future
        let currentMillis = Date.now() + (5 * 60 * 1000);

        if (!meterMessage.customerId.trim()) {
            validations.push(Errors.MISSING_CUSTOMER_ID);
        }
        if (!meterMessage.customerName.trim()) {
            validations.push(Errors.MISSING_CUSTOMER_NAME);
        }
        if (!meterMessage.meterName.trim()) {
            validations.push(Errors.MISSING_METER_NAME);
        }
        if (meterMessage.utcTimeMillis < 1) {
            validations.push(Errors.INVALID_UTC_TIME_MILLIS);
        }
        if (meterMessage.utcTimeMillis > currentMillis) {
            validations.push(Errors.UTC_TIME_MILLIS_FROM_FUTURE);
        }

        return validations;
    }

    /**
     * Add or update if exists customer. This is a blocking syncronous call. 
     * @param customerId 
     * @param customerName 
     * @param traits 
     */
    addOrUpdateCustomerDetails(customerId: string, customerName: string, traits?: Map<string, string>) {
        if (!this.isStarted) {
            throw new Error(Errors.START_NOT_CALLED);
        }
        let validations = [];
        if (!customerId.trim()) {
            validations.push(Errors.MISSING_CUSTOMER_ID);
        }
        if (!customerName.trim()) {
            validations.push(Errors.MISSING_CUSTOMER_NAME);
        }
        if (validations.length > 0) {
            throw new Error(`Invalid customer message: ${validations}`);
        }
        let payload = new CustomerDetailsApiPayload(customerId, customerName, traits);
        //syncrhonous call
        this.customerDetailsApiClient.post(payload);
    }

    /**
     * Process all pending ingestion meter messages. Synchronous call.
     */
    flush() {
        if (!this.isStarted) {
            throw new Error(Errors.START_NOT_CALLED);
        }
        console.log(this.signature, 'flushing ...');
        this.ingestClient.flush();
    }

    /**
     * Shutdown the ingestion client. Synchronous call.
     */
    shutdown() {
        if (!this.isStarted) {
            throw new Error(Errors.START_NOT_CALLED);
        }
        console.log(this.signature, 'shutting down ...');
        this.ingestClient.shutdown();
    }
}