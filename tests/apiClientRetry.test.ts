import MockAdapter from "axios-mock-adapter";
import BaseClient from "../src/baseClient";
import { IngestApiClient } from "../src/ingestClient/ingestApiClient";

describe('API client tests', () => {
    test('custom retry configuration is used on base api client', async () => {
        const retry = {
            retryDelay: jest.fn(() => 0.1),
        };

        const client = new BaseClient('api-key', false, 'test-client', retry);

        const mock = new MockAdapter(client.axiosInstance);

        mock.onGet("/endpoint").reply(500, { error: "Internal Server Error" });

        try {
            await client.doGet("/endpoint");
        } catch {
            // no op
        }

        expect(retry.retryDelay).toBeCalledTimes(3);
    });

    test('custom retry configuration is used on ingest api client', async () => {
        const retry = {
            retryDelay: jest.fn(() => 0.1),
        };

        const client = new IngestApiClient('api-key', false, retry);

        const mock = new MockAdapter(client.axiosInstance);

        mock.onPost("/ingest").reply(429, { error: "Internal Server Error" });

        try {
            await client.postSync([], "request-id");
        } catch {
            // no op
        }

        expect(retry.retryDelay).toBeCalledTimes(6);
    });
});
