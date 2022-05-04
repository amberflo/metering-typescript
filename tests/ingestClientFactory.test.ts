
import { AutoIngestClient } from "../src/ingestClient/autoIngestClient";
import { IngestClientFactory } from "../src/ingestClient/ingestClientFactory";
import { ManualIngestClient } from "../src/ingestClient/manualIngestClient";
import { FlushMode } from "../src/model/flushMode";
import { IngestOptions } from "../src/model/ingestOptions";

describe('IngestClientFactory', ()=>{
    test('should return AsyncIngestClient by default', () =>{
        let instance = IngestClientFactory.getNewInstance('api-key', false);
        expect(instance instanceof AutoIngestClient).toBe(true);
    });
    test('should return SyncIngestClient when isAsynch is false', () =>{
        let options = new IngestOptions();
        options.flushMode = FlushMode.manual;
        let instance = IngestClientFactory.getNewInstance('api-key', false, options);
        expect(instance instanceof ManualIngestClient).toBe(true);
    });
});