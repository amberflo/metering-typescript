
import { AsyncIngestClient } from "../src/ingestClient/asyncIngestClient";
import { IngestClientFactory } from "../src/ingestClient/ingestClientFactory";
import { SyncIngestClient } from "../src/ingestClient/syncIngestClient";
import { IngestOptions } from "../src/model/ingestOptions";

describe('IngestClientFactory', ()=>{
    test('should return AsyncIngestClient by default', () =>{
        let instance = IngestClientFactory.getNewInstance('api-key');
        expect(instance instanceof AsyncIngestClient).toBe(true);
    });
    test('should return SyncIngestClient when isAsynch is false', () =>{
        let options = new IngestOptions();
        options.isAsynch = false;
        let instance = IngestClientFactory.getNewInstance('api-key', options);
        expect(instance instanceof SyncIngestClient).toBe(true);
    });
});