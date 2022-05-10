import { AxiosResponse } from "axios";
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
    flush(): Promise<AxiosResponse<string> | void>;
    shutdown(): Promise<AxiosResponse<string> | void>;
}
