import { validateLog } from '../lib/validator';
import { push } from '../lib/buffer';
import { Log, IngestionResponse } from '../lib/types';
import { getIO } from '../lib/socket';

export function broadcastLogs(logs: Log[]) {
    const io = getIO();
    if (io) {
        io.emit('logs', logs);
    }
}


export function processBatch(logs: any[]): IngestionResponse {
    let accepted = 0;
    let rejected = 0;

    if (!Array.isArray(logs)) {
        return { accepted: 0, rejected: 0 }; // Or throw error? User said "We accept batches", assumes array.
    }

    for (const log of logs) {
        if (validateLog(log)) {
            push(log);
            broadcastLogs([log]);
            accepted++;
        } else {
            rejected++;
        }
    }

    return { accepted, rejected };
}
