import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://shamshiddinkarshiev_db_user:7s3gxg9RqKdNXFmg@ac-bu6a5fe-shard-00-00.u4yvkpc.mongodb.net:27017,ac-bu6a5fe-shard-00-01.u4yvkpc.mongodb.net:27017,ac-bu6a5fe-shard-00-02.u4yvkpc.mongodb.net:27017/borderlanders?ssl=true&replicaSet=atlas-9einh4-shard-0&authSource=admin&appName=Cluster0';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;