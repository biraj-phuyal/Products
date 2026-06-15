import express from "express";
import cors from "cors";
import path from "path";
import {ENV} from "./config/env";
import { clerkMiddleware } from '@clerk/express';
import userRoutes from "./routes/userRoutes"
import productRoutes from "./routes/productRoutes"
import commentRoutes from "./routes/commentRoutes"
import { closeDatabasePool, verifyDatabaseConnection } from "./db";


const app = express();

const normalizeOrigin = (origin: string) => origin.replace(/\/$/, "");

const defaultOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

const allowedOrigins = new Set(
    [...defaultOrigins, ...(ENV.FRONTEND_URL ? ENV.FRONTEND_URL.split(",") : [])]
        .map((origin) => normalizeOrigin(origin.trim()))
        .filter(Boolean)
);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.json({ 
    message : "Welcome",
    endpoint : {
        users: "/api/users",
        products: "/api/products",
        comments: "/api/comments",
    },
    });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

/* if (ENV.NODE_ENV === "production") {
    const __dirName = path.resolve();

    app.use(express.static(path.join(__dirName, "../frontend/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirName, "../frontend/dist/index.html"));
    });
}; */

let isShuttingDown = false;

const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`Received ${signal}. Closing database pool.`);

    try {
        await closeDatabasePool();
    } catch (error) {
        console.error("Error while closing database pool:", error);
    } finally {
        process.exit(0);
    }
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

const startServer = async () => {
    try {
        await verifyDatabaseConnection();
        app.listen(ENV.PORT, () => console.log("Server is running in PORT:", ENV.PORT));
    } catch (error) {
        console.error("Failed to connect to the database during startup:", error);
        process.exit(1);
    }
};

void startServer();
