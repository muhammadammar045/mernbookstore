import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({
    origin: 'https://mernbookstorefrontend.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));

// Route
app.get('/api/v1/books/get-all-books', (req, res) => {
    const books = [{ title: 'Book 1' }, { title: 'Book 2' }];
    res.json({ books });
});

// Example: Using a route handler file
// app.use("/api/v1/books", booksRoutes);

// Error handling (example)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

export default app;
