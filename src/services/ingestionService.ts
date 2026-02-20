import { validateLog } from '../lib/validator';
import { push } from '../lib/buffer';
import { Log, IngestionResponse } from '../lib/types';
import { getIO } from '../lib/socket';

export function broadcastLogs(appId: string, logs: Log[]) {
    const io = getIO();
    if (io) {
        io.to(`app:${appId}`).emit('logs', logs);
    }
}

export function processBatch(appId: string, logs: any[]): IngestionResponse {
    let accepted = 0;
    let rejected = 0;

    const validLogs: any[] = [];

    for (const log of logs) {
        if (validateLog(log)) {
            push(appId, log);
            validLogs.push(log);
            accepted++;
        } else {
            rejected++;
        }
    }

    if (validLogs.length > 0) {
        broadcastLogs(appId, validLogs);
    }

    return { accepted, rejected };
}
