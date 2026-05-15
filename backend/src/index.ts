import express from "express";
import cors from "cors";
import {ENV} from "./config/env";
import { clerkMiddleware } from '@clerk/express';
import userRoutes from "./routes/userRoutes"
import productRoutes from "./routes/productRoutes"
import commentRoutes from "./routes/commentRoutes"
import { closeDatabasePool, verifyDatabaseConnection } from "./db";


const app = express();

app.use(cors({
    origin: ENV.FRONTEND_URL || "http://localhost:5173",
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
