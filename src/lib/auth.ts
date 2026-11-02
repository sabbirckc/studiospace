import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUri =
  process.env.MONGODB_URL ||
  "mongodb://studiospace:mTHG9rcIjGSKZwjl@ac-84aybhg-shard-00-00.d78dlkm.mongodb.net:27017,ac-84aybhg-shard-00-01.d78dlkm.mongodb.net:27017,ac-84aybhg-shard-00-02.d78dlkm.mongodb.net:27017/?ssl=true&replicaSet=atlas-kekyt7-shard-0&authSource=admin";

const client = new MongoClient(mongoUri);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(client.db("studiospaceDB")),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

