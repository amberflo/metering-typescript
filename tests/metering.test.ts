import { AutoIngestClient } from "../src/ingestClient/autoIngestClient";
import { Metering } from "../src/metering";
import { IngestOptions } from "../src/model/ingestOptions";
import * as Errors from '../src/model/errors';
import { ManualIngestClient } from "../src/ingestClient/manualIngestClient";
import { FlushMode } from "../src/model/flushMode";

describe('Metering tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('when no options passed should return AutoIngestClient by default', () => {
        const apiKey = 'my-key';
        const debug = false;
        const metering = new Metering(apiKey, debug);
        expect(metering.apiKey).toStrictEqual(apiKey);
        expect(metering.debug).toStrictEqual(debug);
        expect(metering.ingestClient instanceof AutoIngestClient).toBe(true);

        const client = metering.ingestClient as AutoIngestClient;
        expect(client.batchSize).toStrictEqual(100);
        expect(client.frequencyMillis).toStrictEqual(1000);
    });
    test('when options with isAsync false passed should return ManualIngestClient by default', () => {
        const apiKey = 'my-key';
        const debug = false;
        const options = new IngestOptions();
        options.flushMode = FlushMode.manual;
        const metering = new Metering(apiKey, debug, options);
        expect(metering.apiKey).toStrictEqual(apiKey);
        expect(metering.debug).toStrictEqual(debug);
        expect(metering.ingestClient instanceof ManualIngestClient).toBe(true);

        const client = metering.ingestClient as ManualIngestClient;
        expect(client.apiKey).toStrictEqual(apiKey);
    });
    test('when options passed should return AutoIngestClient with overrides', () => {
        const apiKey = 'my-key';
        const debug = false;
        const options = new IngestOptions();
        options.batchSize = 200;
        options.frequencyMillis = 3000;

        const metering = new Metering(apiKey, debug, options);
        expect(metering.apiKey).toStrictEqual(apiKey);
        expect(metering.debug).toStrictEqual(debug);
        expect(metering.ingestClient instanceof AutoIngestClient).toBe(true);

        const client = metering.ingestClient as AutoIngestClient;
        expect(client.batchSize).toStrictEqual(options.batchSize);
        expect(client.frequencyMillis).toStrictEqual(options.frequencyMillis);
    });
    test('when blank API key should return error', () => {
        const apiKey = '';
        expect(() => { new Metering(apiKey, false) }).toThrow(Errors.MISSING_API_KEY);
    });
    test('when calling any method without start() should throw an error', async () => {
        const apiKey = 'my-key';
        const debug = false;
        const metering = new Metering(apiKey, debug);
        expect(() => { metering.meter('', 0, 0, '') }).toThrowError(Errors.START_NOT_CALLED);
        await expect(async () => { await metering.flush()}).rejects.toThrowError(Errors.START_NOT_CALLED);
        await expect(async () => { await metering.shutdown()}).rejects.toThrowError(Errors.START_NOT_CALLED);
    });
    test('when ingesting meter then perform validations', () => {
        const apiKey = 'my-key';
        const debug = false;
        const errorMessage = 'Invalid meter message: customerId is a required field,meterName is a required field,utcTimeMillis is invalid, it should be milliseconds in UTC and not a timestamp in the future';
        const metering = new Metering(apiKey, debug);

        jest.spyOn(metering.ingestClient, 'start');
        const mockedStart = metering.ingestClient.start as jest.MockedFunction<() => void>;

        metering.start();
        expect(mockedStart).toBeCalledTimes(1);
        expect(() => { metering.meter('', 0, 0, '') }).toThrowError(errorMessage);
    });
    test('when ingesting meter then perform utcTimeMillis validations', () => {
        const metering = new Metering('my-key', false);

        //mock client
        jest.spyOn(metering.ingestClient, 'start');
        const mockedStart = metering.ingestClient.start as jest.MockedFunction<() => void>;
        metering.start();

        //millis less than 1
        const errorMessage = `Invalid meter message: ${Errors.INVALID_UTC_TIME_MILLIS}`;
        expect(() => { metering.meter('my-meter', 0, 0, 'customer-id') }).toThrowError(errorMessage);
        expect(mockedStart).toBeCalledTimes(1);

        //millis from a future date
        const futureDate = Date.now() + (30 * 24 * 12 * 60 * 60 * 1000);
        const errorMessage2 = `Invalid meter message: ${Errors.UTC_TIME_MILLIS_FROM_FUTURE}`;
        expect(() => { metering.meter('my-meter', 0, futureDate, 'customer-id',) }).toThrowError(errorMessage2);
    });
    test('when creating customer details then perform validations', async () => {
        const apiKey = 'my-key';
        const debug = false;
        const errorMessage = 'Invalid customer message: customerId is a required field,customerName is a required field';
        const metering = new Metering(apiKey, debug);

        jest.spyOn(metering.ingestClient, 'start');
        const mockedStart = metering.ingestClient.start as jest.MockedFunction<() => void>;

        expect(mockedStart).toBeCalledTimes(0);
        await expect(async() => { await metering.addOrUpdateCustomerDetails('', '') }).rejects.toThrowError(errorMessage);
    });
});
