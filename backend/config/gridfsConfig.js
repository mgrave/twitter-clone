import { MongoClient, GridFSBucket } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client;
let db;
const gfsBuckets = {};

const connectGridFS = async () => {
  try {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db(); // Asegúrate de tener el nombre de tu base de datos en MONGO_URI
    console.log("MongoDB connection established and GridFS initialized");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Función para obtener o inicializar un bucket de GridFS
const getGridFS = (bucketName) => {
  if (!db) {
    throw new Error("MongoDB is not connected. Call connectGridFS first.");
  }
  if (!gfsBuckets[bucketName]) {
    gfsBuckets[bucketName] = new GridFSBucket(db, { bucketName });
  }
  return gfsBuckets[bucketName];
};

export { connectGridFS, getGridFS };
