import {drizzle} from  "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import {ENV} from "../config/env";

if (!ENV.DB_URL) {
    throw new Error ("DATABASE URL is not set in env");
}

const pool = new Pool({
    connectionString: ENV.DB_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
    maxLifetimeSeconds: 300,
});

pool.on("error", (err) => {
    const errorCode = "code" in err ? err.code : undefined;

    if (errorCode === "ETIMEDOUT") {
        console.warn("Database idle connection timed out. The pool will create a fresh connection for the next query.");
        return;
    }

    console.error("Database connection error", err);
});

export const verifyDatabaseConnection = async () => {
    await pool.query("select 1");
    console.log("DB connected");
};

export const closeDatabasePool = async () => {
    await pool.end();
};

export const db = drizzle({ client: pool, schema});
