// Simple singleton to share IO instance across App Router and Services
// This works in stateful Node environments (like `npm run dev`) but not Serverless.
// User said "backend service", implying stateful server.

let io: any = null;

export const getIO = () => io;
export const setIO = (instance: any) => {
    io = instance;
};
