import { AsyncIngestClient } from "../src/ingestClient/asyncIngestClient";
import { Metering } from "../src/metering";
import { IngestOptions } from "../src/model/ingestOptions";
import * as Errors from '../src/model/errors';
import { SyncIngestClient } from "../src/ingestClient/syncIngestClient";
import { MeterMessage } from "../src/model/meterMessage";

describe('Metering tests', () => {
    test('when no options passed should return AsyncIngestClient by default', () => {
        let apiKey = 'my-key';
        let debug = false;
        const metering = new Metering(apiKey, debug);
        expect(metering.apiKey).toStrictEqual(apiKey);
        expect(metering.debug).toStrictEqual(debug);
        expect(metering.ingestClient instanceof AsyncIngestClient).toBe(true);

        let client = metering.ingestClient as AsyncIngestClient;
        expect(client.batchSize).toStrictEqual(100);
        expect(client.frequencyMillis).toStrictEqual(1000);
    });
    test('when options with isAsync false passed should return SyncIngestClient by default', () => {
        let apiKey = 'my-key';
        let debug = false;
        let options = new IngestOptions();
        options.isAsynch = false;
        const metering = new Metering(apiKey, debug, options);
        expect(metering.apiKey).toStrictEqual(apiKey);
        expect(metering.debug).toStrictEqual(debug);
        expect(metering.ingestClient instanceof SyncIngestClient).toBe(true);

        let client = metering.ingestClient as SyncIngestClient;
        expect(client.apiKey).toStrictEqual(apiKey);
    });
    test('when options passed should return AsyncIngestClient with overrides', () => {
        let apiKey = 'my-key';
        let debug = false;
        let options = new IngestOptions();
        options.batchSize = 200;
        options.frequencyMillis = 3000;

        const metering = new Metering(apiKey, debug, options);
        expect(metering.apiKey).toStrictEqual(apiKey);
        expect(metering.debug).toStrictEqual(debug);
        expect(metering.ingestClient instanceof AsyncIngestClient).toBe(true);

        let client = metering.ingestClient as AsyncIngestClient;
        expect(client.batchSize).toStrictEqual(options.batchSize);
        expect(client.frequencyMillis).toStrictEqual(options.frequencyMillis);
    });
    test('when blank API key should return error', () => {
        let apiKey = '';
        expect(() => { new Metering(apiKey, false) }).toThrow(Errors.MISSING_API_KEY);
    });
    test('when ingesting meter then perform validations', () => {
        let apiKey = 'my-key';
        let debug = false;
        let errorMessage = 'Invalid meter message: customerId is a required field,customerName is a required field,meterName is a required field,utcTimeMillis is invalid, it should be milliseconds in UTC and not a timestamp in the future';
        const metering = new Metering(apiKey, debug);
        expect(() => { metering.meter('', 0, 0, '', '') }).toThrowError(errorMessage);
    });
    test('when ingesting meter then perform utcTimeMillis validations', () => {        
        //millis less than 1
        let message = new MeterMessage('my-name', 0, 0, 'customer-id', 'customer-name');
        let validtions = Metering.validateMeterMessage(message);
        expect(validtions.length).toStrictEqual(1);
        expect(validtions[0]).toStrictEqual(Errors.INVALID_UTC_TIME_MILLIS);

        //millis from a future date       
        let futureDate = Date.now() + (30 * 24 * 12 * 60 * 60 * 1000);
        let message2 = new MeterMessage('my-name', 0,  futureDate, 'customer-id', 'customer-name');
        let validtions2 = Metering.validateMeterMessage(message2);
        expect(validtions2.length).toStrictEqual(1);
        expect(validtions2[0]).toStrictEqual(Errors.UTC_TIME_MILLIS_FROM_FUTURE);
    });
});