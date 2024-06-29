import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import booksRoutes from "./routes/books.routes.js";

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.static("public"));

// CORS Configuration
app.use(cors({
    origin: ['https://mernbookstorefrontend.vercel.app'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));

// Routes

app.use("/api/v1/books", booksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

export default app;
