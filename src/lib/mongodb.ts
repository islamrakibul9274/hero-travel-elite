import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isFallback: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null, isFallback: false };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not defined, using offline in-memory fallback");
    cached.isFallback = true;
    return mongoose;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      cached.isFallback = false;
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e: any) {
    console.warn("MongoDB connection warning (falling back gracefully):", e?.message);
    cached.promise = null;
    cached.isFallback = true;
    return mongoose;
  }
}

export default connectToDatabase;
