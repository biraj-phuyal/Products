import express from "express";
import cors from "cors";
import {ENV} from "./config/env";
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(cors({origin: ENV.FRONTEND_URL}));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    const {} = req.body

    res.json({ 
    message : "Welcome",
    endpoint : {
        users: "/api/users",
        projucts: "/api/products",
        comments: "/api/comments",
    },
    });
});

app.listen(ENV.PORT, () => console.log("Server is running in PORT:", ENV.PORT))
