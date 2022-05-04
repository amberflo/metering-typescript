import { FlushMode } from "./flushMode";

export class IngestOptions{
    batchSize!: number;
    frequencyMillis!: number;
    flushMode: FlushMode = FlushMode.auto;
}
