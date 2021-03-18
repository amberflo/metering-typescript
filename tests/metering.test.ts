import { AsyncIngestClient } from "../src/ingestClient/asyncIngestClient";
import { Metering } from "../src/metering";
import { IngestOptions } from "../src/model/ingestOptions";
import * as Errors from '../src/model/errors';
import { SyncIngestClient } from "../src/ingestClient/syncIngestClient";
import { MeterMessage } from "../src/model/meterMessage";

describe('Metering tests', () => {
    afterEach(()=>{
        jest.clearAllMocks();
    });
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
    test('when ingesting meter without start should get an error', () => {   
        let apiKey = 'my-key';
        let debug = false;
        const metering = new Metering(apiKey, debug);     
        expect(() => { metering.meter('', 0, 0, '', '') }).toThrowError(Errors.START_NOT_CALLED);
    });
    test('when ingesting meter then perform validations', () => {
        let apiKey = 'my-key';
        let debug = false;
        let errorMessage = 'Invalid meter message: customerId is a required field,customerName is a required field,meterName is a required field,utcTimeMillis is invalid, it should be milliseconds in UTC and not a timestamp in the future';
        const metering = new Metering(apiKey, debug);
        
        jest.spyOn(metering.ingestClient, 'start');
        const mockedStart = metering.ingestClient.start as jest.MockedFunction<()=>void>;

        metering.start();
        expect(mockedStart).toBeCalledTimes(1);
        expect(() => { metering.meter('', 0, 0, '', '') }).toThrowError(errorMessage);
    });
    test('when ingesting meter then perform utcTimeMillis validations', () => {                
        const metering = new Metering('my-key', false);      
        
        //mock client
        jest.spyOn(metering.ingestClient, 'start');
        const mockedStart = metering.ingestClient.start as jest.MockedFunction<()=>void>;
        metering.start();

        //millis less than 1
        let errorMessage = `Invalid meter message: ${Errors.INVALID_UTC_TIME_MILLIS}` ;
        expect(() => { metering.meter('my-meter', 0, 0, 'customer-id', 'customer') }).toThrowError(errorMessage);
        expect(mockedStart).toBeCalledTimes(1);

        //millis from a future date  
        let futureDate = Date.now() + (30 * 24 * 12 * 60 * 60 * 1000);
        let errorMessage2 = `Invalid meter message: ${Errors.UTC_TIME_MILLIS_FROM_FUTURE}` ;
        expect(() => { metering.meter('my-meter', 0, futureDate, 'customer-id', 'customer') }).toThrowError(errorMessage2);
    });
});