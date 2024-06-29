import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"

import booksRoutes from "./routes/books.routes.js"

const app = express()

app.use(cookieParser())
app.use(express.static("public"))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}))
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}))


app.use("/api/v1/books", booksRoutes)


export default app