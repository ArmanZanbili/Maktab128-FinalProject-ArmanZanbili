import mongoose from 'mongoose';

declare global {
    namespace globalThis {
        var _mongoose: {
            promise: Promise<typeof mongoose> | null;
            conn: typeof mongoose | null;
        };
    }
}