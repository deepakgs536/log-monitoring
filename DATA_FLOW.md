# System Data Flow

This document describes how data moves through the Log Monitoring Application, from ingestion to visualization and storage.

## Architecture Overview

The system follows a uni-directional data flow for ingestion, with separate read paths for real-time streaming and historical analysis.

```mermaid
graph TD
    Client[Client App / Log Agent] -->|POST /api/logs| API[Ingestion API]
    
    subgraph Ingestion Pipeline
        API -->|Validate Batch| Ingest[Ingestion Service]
        Ingest -->|Process| Buffer[Memory Buffer]
        Ingest -->|Emit 'logs'| Socket[Socket.IO Server]
    end
    
    subgraph Storage Layer
        Buffer -->|Flush (Time/Size)| Writer[Log Writer]
        Writer -->|Append| Storage[(storage/logs.ndjson)]
        StatsService -->|Save Alert| AlertStore[(storage/alerts.ndjson)]
    end
    
    subgraph Read & Analysis
        StatsService[Stats Service] -->|Read & Aggregate| Storage
        StatsService -->|Read History| AlertStore
        LogReader[Log Reader Service] -->|Query & Filter| Storage
    end
    
    subgraph Dashboard UI
        Browser[User Browser]
        Socket -->|Real-time Events| Browser
        Browser -->|GET /api/stats| StatsService
        Browser -->|POST /api/logs/search| LogReader
        Browser -->|GET /api/reports/*| Exports[Export API]
    end
    
    Exports -->|Generate CSV/JSON| LogReader
    Exports -->|Generate Snapshot| StatsService
```

## Detailed Flow Components

### 1. Log Ingestion
- **EntryPoint**: `POST /api/logs`
- **Processing**: `src/services/ingestionService.ts` receives batches of logs.
- **Validation**: Each log is validated against the `Log` schema.
- **Buffering**: Valid logs are pushed to an in-memory `buffer` (`src/lib/buffer.ts`).
- **Persistence**: The buffer potentially flushes to disk (`src/lib/writer.ts`) when it reaches a size threshold (100 logs) or time interval (2s).
- **Target**: Logs are appended to `storage/logs.ndjson` in NDJSON format.

### 2. Real-time Streaming
- **Mechanism**: Socket.IO
- **Trigger**: Immediately upon successful ingestion of a log batch.
- **Pathway**: `ingestionService` -> `socket.ts` -> Emit `logs` event -> Connected Clients.
- **Latency**: Near real-time (<50ms processing time usually).

### 3. Data Retrieval & Analysis
- **Stats API**: `GET /api/stats`
    - **Service**: `src/services/statsService.ts`
    - **Operation**: Reads the raw `logs.ndjson` file.
    - **Processing**:
        - Filters logs by requested time range.
        - Aggregates metrics (Logs/sec, Error Rate, Latency).
        - Generates histograms (Timeline) and distributions (Service/Level).
        - **Anomaly Detection**: Runs heuristics on recent logs to detect spikes or error bursts.
        - **Alerts**: New alerts are computed and persisted to `storage/alerts.ndjson`.
- **Log Explorer**: `POST /api/logs/search`
    - **Service**: `src/lib/logReader.ts`
    - **Operation**: Efficiently reads `logs.ndjson` (reverse chronological).
    - **Filtering**: Applies stream-based filtering for Service, Level, Search Text, and Time Range.

### 4. Exports
- **Logs (CSV)**: `POST /api/reports/logs` -> Uses `logReader` to fetch filtered logs -> Converts to CSV stream.
- **Incidents (JSON)**: `GET /api/reports/incidents` -> Uses `statsService` to fetch active alerts from `alerts.ndjson`.
- **Summary**: `GET /api/reports/summary` -> Snapshots the current `stats` object.

## Storage Schema
- **Logs**: NDJSON (Newline Delimited JSON). Each line is a valid JSON object matching the `Log` interface.
- **Alerts**: NDJSON. Stores generated alerts with metadata.
