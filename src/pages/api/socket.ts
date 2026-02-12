import { Server as SocketIOServer } from "socket.io";

export const config = {
    api: {
        bodyParser: false,
    },
};

let io: SocketIOServer | undefined;

export default function handler(req: any, res: any) {
    if (!res.socket.server.io) {
        console.log("Initializing Socket.io server...");
        const httpServer = res.socket.server;
        io = new SocketIOServer(httpServer, {
            path: "/api/socket",
            addTrailingSlash: false,
        });
        res.socket.server.io = io;

        // Set global singleton
        const { setIO } = require("../../lib/socket");
        setIO(io);
    }
    res.end();
}
