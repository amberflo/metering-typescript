import { IngestApiPayload } from "../model/ingestApiPayload";
import { MeterMessage } from "../model/meterMessage";

export class IngestHelper {
    static transformMessagesToPayload(items: Array<MeterMessage>) {
        let body = items.map((m) => {            
            return new IngestApiPayload(m);
        });
        return body;
    }
}