import { IngestHelper } from "../src/ingestClient/ingestHelper";
import { MeterMessage } from "../src/model/meterMessage";

describe('IngestHelper', () => {
    test('when meter message all properties are set, should get Ingest API payload', () => {
        const len = 5;
        let messages = Array<MeterMessage>();
        let dimensions = new Map<string, string>();
        dimensions.set('region', 'midwest');
        for (let i = 0; i < len; i++) {
            messages.push(new MeterMessage('meter' + i, i, Date.now(), '123', 'customer', dimensions));
        }

        let payload = IngestHelper.transformMessagesToPayload(messages);
        expect(payload.length).toStrictEqual(len);
        for (let i = 0; i < len; i++) {
            expect(Object.keys(payload[i]).length).toStrictEqual(6);
            expect(payload[i].tenant_id).toStrictEqual(messages[i].customerId);
            expect(payload[i].tenant).toStrictEqual(messages[i].customerName);
            expect(payload[i].meter_name).toStrictEqual(messages[i].meterName);
            expect(payload[i].meter_value).toStrictEqual(messages[i].meterValue);
            expect(payload[i].time).toStrictEqual(messages[i].utcTimeMillis);
            expect(payload[i].dimensions).toStrictEqual(messages[i].dimensions);
        }
    });
    test('when meter message dimensions are not set, should get Ingest API payload without dimensions', () => {
        const len = 5;
        let messages = Array<MeterMessage>();
        for (let i = 0; i < len; i++) {
            messages.push(new MeterMessage('meter' + i, i, Date.now(), '123', 'customer'));
        }

        let payload = IngestHelper.transformMessagesToPayload(messages);
        expect(payload.length).toStrictEqual(len);
        for (let i = 0; i < len; i++) {
            console.log(payload[i]);
            expect(Object.keys(payload[i]).length).toStrictEqual(5);
            expect(payload[i].tenant_id).toStrictEqual(messages[i].customerId);
            expect(payload[i].tenant).toStrictEqual(messages[i].customerName);
            expect(payload[i].meter_name).toStrictEqual(messages[i].meterName);
            expect(payload[i].meter_value).toStrictEqual(messages[i].meterValue);
            expect(payload[i].time).toStrictEqual(messages[i].utcTimeMillis);
            expect(payload[i].dimensions).toStrictEqual(messages[i].dimensions);
        }
    });
});