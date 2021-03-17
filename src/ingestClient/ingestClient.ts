import { MeterMessage } from "../model/meterMessage";

/**
 * 
 */
export interface IngestClient {
    /**
     * 
     */
    start(): void;
    ingestMeter(meter: MeterMessage): void;
    flush(): void;
    shutdown(): void;
}