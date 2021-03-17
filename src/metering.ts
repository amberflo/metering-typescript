import { MeterMessage } from "./model/meterMessage";
import { IngestClient } from "./ingestClient/ingestClient";
import { IngestClientFactory } from "./ingestClient/ingestClientFactory";
import { IngestOptions } from "./model/ingestOptions";
import * as Errors from './model/errors';

export class Metering {
    apiKey!: string;
    debug!: boolean;
    ingestClient: IngestClient;
    signature: string;

    /**
     * Initialize a new metering client
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
     * Process all pending ingestion meter messages. Synchronous call.
     */
    flush() {
        console.log(this.signature, 'flushing ...');
        this.ingestClient.flush();
    }

    /**
     * Shutdown the ingestion client. Synchronous call.
     */
    shutdown() {
        console.log(this.signature, 'shutting down ...');
        this.ingestClient.shutdown();
    }
}