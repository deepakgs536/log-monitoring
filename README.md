# Log Ingestion Microservice (Next.js)

This project simulates a **backend-first** log ingestion service built inside Next.js. It is designed to handle high-throughput log ingestion using in-memory buffering and batched asynchronous writes to disk.

## 🏗 Architecture

The system mimics a real-world microservice architecture:

| Component | Path | Responsibility |
|-----------|------|----------------|
| **API** | `/app/api/logs/route.ts` | Entry point for log ingestion. Accepts JSON batches. |
| **Pipeline Core** | `/services/ingestionService.ts` | Orchestrates validation and buffering. |
| **Buffer** | `/lib/buffer.ts` | In-memory queue. Flushes every 100 logs or 2 seconds. |
| **Validator** | `/lib/validator.ts` | Enforces schema and type safety. |
| **Writer** | `/lib/writer.ts` | Appends flushed batches to `storage/logs.ndjson`. |
| **Storage** | `/storage/` | Local persistence layer (NDJSON format). |

## 🚀 Log Schema

Logs follow a structured JSON format optimized for observability:

```json
{
  "timestamp": 1717804800000,
  "service": "user-service",
  "level": "info",
  "message": "User logged in",
  "latency": 45,
  "requestId": "abc-123-xyz"
}
```

## 🛠 Usage

### 1. Start the Server
```bash
npm run dev
```
The API will be available at `POST http://localhost:3000/api/logs`.

### 2. Generate Traffic (Load Test)
Run the specialized load generator script to simulate production traffic:

```bash
npx tsx scripts/generateLogs.ts
```
This script sends batches of valid logs to the API, testing the entire pipeline.

### 3. Verify Output
Logs are written to:
```
storage/logs.ndjson
```
(NDJSON = Newline Delimited JSON, a standard for log files).

## ⚡ Performance Features

- **Non-blocking I/O**: The API responds immediately after buffering; file writes happen in the background.
- **Batching**: Reduces disk I/O syscalls by writing in chunks.
- **Validation**: Ensures no malformed data corrupts the storage.
- **Graceful Buffering**: Auto-flushes based on size (100 logs) or time (2s).
