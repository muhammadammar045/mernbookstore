import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"

import booksRoutes from "./routes/books.routes.js"

const app = express()

app.use(cookieParser())
app.use(express.static("public"))
app.use(cors({
    origin: 'https://mernbookstorefrontend.vercel.app', // Allow your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}))

app.get('/api/v1/books/get-all-books', (req, res) => {
    // Logic to fetch and return books data
    const books = [{ title: 'Book 1' }, { title: 'Book 2' }];
    res.json({ books });
});
app.get('/', (req, res) => {
    // Logic to fetch and return books data
    const books = [{ title: 'Book 1' }, { title: 'Book 2' }];
    res.json({ books });
});
// app.use("/api/v1/books", booksRoutes)


export default app