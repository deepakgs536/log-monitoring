# Log Ingestion Microservice (Next.js)

This project simulates a **backend-first** log ingestion service built inside Next.js. It is designed to handle high-throughput log ingestion using in-memory buffering and batched asynchronous writes to disk.

## 🏗 Architecture

The system mimics a real-world microservice architecture:

| Component | Path | Responsibility |
|-----------|------|----------------|
| **API** | `/app/api/logs/route.ts` | Entry point for log ingestion. Accepts JSON batches. |
| **Pipeline Core** | `/services/ingestionService.ts` | Orchestrates validation and buffering. |
| **Buffer** | `/lib/buffer.ts` | In-memory `volatileHistory` bounded queue (max 2000 logs). |
| **Validator** | `/lib/validator.ts` | Enforces schema and type safety. |
| **Writer** | `/lib/writer.ts` | Volatile mode. Disk write disabled for Serverless environments. |
| **Database** | `MongoDB` | Persistent storage for App Configurations and API Keys. |

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
First, configure your `.env` file with a valid MongoDB URI containing your app config:
```env
CONNECTION_STRING="mongodb+srv://...your-cluster..."
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 2. Generate Traffic (Load Simulation)
To see the log ingestion in action, you need to send data to the API. We have a specialized script for this:

```bash
npx tsx scripts/generateLogs.ts
```

This script will:
- Simulate multiple services (`user-service`, `payment-service`, etc.).
- Send batches of logs to `POST /api/logs`.
- Mix different log levels (`info`, `error`, `debug`).

### 3. Monitoring Logs
Once the server is running and logs are being generated, you can monitor them in real-time via the **Console**.

- **Dashboard**: Provides a high-level overview of log volume, error rates, and active alerts.
- **Live Stream**: Watches logs flow in real-time via WebSocket.
- **Log Explorer**: Search and filter historical logs by service, level, or text content.

### 4. Managing Applications (CRUD)
The system supports multiple applications, each with its own API Key for secure ingestion.

Navigate to the **Applications** page in the Console to manage them.

#### **Create (Register a New App)**
1. Click the **"New App"** button.
2. Enter a name for your application (e.g., `Payment Gateway`).
3. Click **Create**.
4. **Important**: Copy the generated **API Key** immediately. It is only shown once.

#### **Read (View Apps)**
- The Applications page lists all registered apps.
- You can see the App Name, ID, and active status.
- Click the **Eye** icon to reveal the API Key (if you have permission).

#### **Update (Rename App)**
1. Hover over an application card.
2. Click the **Edit** (pencil) icon next to the app name.
3. Enter the new name.
4. Click the **Check** icon to save.

#### **Delete (Remove App)**
1. Hover over an application card.
2. Click the **Trash** icon.
3. A confirmation modal will appear.
4. Type the **exact name** of the application to confirm deletion.
5. Click **Delete App**. This action is irreversible.

## ⚡ Performance Features

- **Non-blocking I/O**: The API responds immediately upon queuing logs.
- **Volatile Execution**: Log broadcasting avoids read-only filesystem limitations present on serverless hosting (Vercel).
- **Validation**: Ensures no malformed data corrupts the frontend stream distributions.
- **Graceful Buffering**: Memory-bounded ring-buffer retaining exactly the latest 2000 metrics logs.
