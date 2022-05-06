import { MeterMessage } from "./model/meterMessage";
import { IngestClient } from "./ingestClient/ingestClient";
import { IngestClientFactory } from "./ingestClient/ingestClientFactory";
import { IngestOptions } from "./model/ingestOptions";
import * as Errors from './model/errors';
import { CustomerDetailsApiPayload } from "./model/customerApiPayload";
import { CustomerDetailsApiClient } from "./ingestClient/customerDetailsApiClient";

/**
 * Metering is the main class to ingest meters into Amberflo
 */
export class Metering {
    readonly customerDetailsApiClient: CustomerDetailsApiClient;
    readonly apiKey!: string;
    readonly debug!: boolean;
    readonly ingestClient: IngestClient;
    private signature: string;
    private isStarted = false;

    /**
     * Initialize a new metering client without any side effects. Call start() to start up the ingestion client.
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
        this.ingestClient = IngestClientFactory.getNewInstance(apiKey, debug, ingestOptions);
        this.customerDetailsApiClient = new CustomerDetailsApiClient(apiKey, debug);
    }

    /**
     * Start and initialize the ingestion client. If this is not called, all ingestion calls will fail.
     */
    start() {
        if (this.isStarted) {
            return;
        }
        this.ingestClient.start();
        this.isStarted = true;
    }

    /**
     * Queue a meter for ingestion.
     * In auto flush mode, queue will be flushed automatically when ingestOptions.batchSize is exceeded or periodically ingestOptions.frequencyMillis
     * In manual flush mode, call flush() To ingest messages in the queue
     * @param {string} meterApiName
     * @param {number} meterValue
     * @param {number} meterTimeInMillis
     * @param {string} customerId
     * @param {Map<string,string>} dimensions
     */
    meter(meterApiName: string, meterValue: number, meterTimeInMillis: number, customerId: string, dimensions?: Map<string, string>) {
        if (!this.isStarted) {
            throw new Error(Errors.START_NOT_CALLED);
        }
        const meterMessage = new MeterMessage(meterApiName, meterValue, meterTimeInMillis, customerId, dimensions);
        const validations = Metering.validateMeterMessage(meterMessage);
        if (validations.length > 0) {
            throw new Error(`Invalid meter message: ${validations}`);
        }
        this.ingestClient.ingestMeter(meterMessage);
    }

    static validateMeterMessage(meterMessage: MeterMessage) {
        const validations = [];
        //threshold of 5 mins in the future
        const currentMillis = Date.now() + (5 * 60 * 1000);

        if (!meterMessage.customerId.trim()) {
            validations.push(Errors.MISSING_CUSTOMER_ID);
        }
        if (!meterMessage.meterApiName.trim()) {
            validations.push(Errors.MISSING_METER_NAME);
        }
        if (meterMessage.meterTimeInMillis < 1) {
            validations.push(Errors.INVALID_UTC_TIME_MILLIS);
        }
        if (meterMessage.meterTimeInMillis > currentMillis) {
            validations.push(Errors.UTC_TIME_MILLIS_FROM_FUTURE);
        }

        return validations;
    }

    /**
     * Add or update customer details.
     * @param customerId
     * @param customerName
     * @param traits
     */
    async addOrUpdateCustomerDetails(customerId: string, customerName: string, traits?: Map<string, string>) {
        const validations = [];
        if (!customerId.trim()) {
            validations.push(Errors.MISSING_CUSTOMER_ID);
        }
        if (!customerName.trim()) {
            validations.push(Errors.MISSING_CUSTOMER_NAME);
        }
        if (validations.length > 0) {
            throw new Error(`Invalid customer message: ${validations}`);
        }
        const payload = new CustomerDetailsApiPayload(customerId, customerName, traits);
        return this.customerDetailsApiClient.post(payload);
    }

    /**
     * Process all pending ingestion meter messages and wait for all requests to API to complete.
     */
    async flush() {
        if (!this.isStarted) {
            throw new Error(Errors.START_NOT_CALLED);
        }
        console.log(new Date(), this.signature, 'flushing ...');
        return this.ingestClient.flush();
    }

    /**
     * Shutdown the ingestion client.
     */
    async shutdown() {
        if (!this.isStarted) {
            throw new Error(Errors.START_NOT_CALLED);
        }
        console.log(new Date(), this.signature, 'shutting down ...');
        return this.ingestClient.shutdown();
    }
}
