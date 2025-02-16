import { isValidObjectId } from "mongoose";
import { Books } from "../models/books.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/Cloudinary.js"

const addBook = async (req, res) => {
    try {
        const { title, description, price, category } = req.body;

        if ([title, description, price, category].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "Please fill all the required fields (title, description, price, category)");
        }

        const existingBook = await Books.findOne({ title });
        if (existingBook) {
            throw new ApiError(400, "Book with this title already exists");
        }

        const thumbnailPath = req?.file?.path;
        if (!thumbnailPath) {
            throw new ApiResponse(400, "Thumbnail path not found in request");
        }

        const uploadedThumbnail = await uploadImageToCloudinary(thumbnailPath);
        if (!uploadedThumbnail || !uploadedThumbnail.url) {
            throw new ApiError(400, "Failed to upload thumbnail to Cloudinary");
        }

        const createBook = await Books.create({
            title,
            description,
            price,
            category,
            thumbnail: uploadedThumbnail.url
        });

        if (!createBook) {
            throw new ApiError(500, "Failed to create book record in the database");
        }

        return res.status(200).json(new ApiResponse(200, createBook, "Book created successfully"));

    } catch (error) {
        console.log(`Add Book Failed: ${error}`);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
};


const getAllBooks = async (req, res) => {
    try {
        const paginatedResult = res.paginatedResult;

        if (!paginatedResult) {
            throw new ApiResponse(400, "No result found");
        }

        return res.status(200).json(
            new ApiResponse(200, paginatedResult, "Books fetched with pagination")
        );
    } catch (error) {
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message));
    }
}

const getBook = async (req, res) => {

    try {
        const { bookId } = req.params

        if (!bookId?.trim() || !isValidObjectId(bookId)) {
            throw new ApiError(400, "Invalid book id")
        }

        if (!bookId) {
            throw new ApiError(400, "bookId is Required")
        }

        const book = await Books.findById(bookId)

        if (!book) {
            throw new ApiError(400, "Book Not Found")
        }

        return res.status(200).json(
            new ApiResponse(200, book, "Book Fetched Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error Fetching Book")
    }
}


const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params

        if (!bookId) {
            throw new ApiError(400, "bookId is Required")
        }

        const book = await Books.findById(bookId)

        if (!book) {
            throw new ApiError(400, "Book Not Found")
        }
        const deletedThumbnail = await deleteImageFromCloudinary(book.thumbnail)
        console.log(deletedThumbnail)

        if (!deletedThumbnail) {
            throw new ApiError(400, "Thumbnail is not deleted ")
        }

        const deleteBook = await Books.findByIdAndDelete(bookId)

        if (!deleteBook) {
            throw new ApiError(400, "Book Not Deleted")
        }
        return res.status(200).json(
            new ApiResponse(200, deleteBook, "Book Deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error Deleting Book")
    }
}

const updateBook = async (req, res) => {
    try {
        const { title, description, category, price } = req.body;
        const { bookId } = req.params;

        if (!bookId) {
            throw new ApiError(400, "bookId is Required");
        }

        const book = await Books.findById(bookId);

        if (!book) {
            throw new ApiError(404, "Book Not Found");
        }

        const updatedBook = await Books.findByIdAndUpdate(
            bookId,
            {
                $set: {
                    title,
                    description,
                    category,
                    price
                }
            },
            {
                new: true
            }
        );

        return res.status(200).json(
            new ApiResponse(200, updatedBook, "Book Updated Successfully")
        );
    } catch (error) {
        console.error("Error updating book:", error);
        throw new ApiError(error.status || 500, error.message || "Error Updating Book Details");
    }
};

const updateBookThumbnail = async (req, res) => {
    try {
        const { bookId } = req.params;

        if (!bookId) {
            throw new ApiError(400, "bookId is Required");
        }

        const book = await Books.findById(bookId);

        if (!book) {
            throw new ApiError(404, "Book Not Found");
        }

        const deletedThumbnail = await deleteImageFromCloudinary(book.thumbnail);
        console.log("Deleted thumbnail:", deletedThumbnail);

        const thumbnailPath = req.file?.path;

        if (!thumbnailPath) {
            throw new ApiError(400, "Thumbnail Path Not Found");
        }

        const uploadedThumbnail = await uploadImageToCloudinary(thumbnailPath);

        if (!uploadedThumbnail.url) {
            throw new ApiError(400, "Cloudinary Upload Failed");
        }

        const updatedBook = await Books.findByIdAndUpdate(
            bookId,
            {
                thumbnail: uploadedThumbnail.url
            },
            {
                new: true
            }
        );

        return res.status(200).json(
            new ApiResponse(200, updatedBook, "Book Thumbnail Updated Successfully")
        );
    } catch (error) {
        console.error("Error updating book thumbnail:", error);
        throw new ApiError(error.status || 500, error.message || "Error Updating Book Thumbnail");
    }
};


export {
    addBook,
    getBook,
    getAllBooks,
    deleteBook,
    updateBook,
    updateBookThumbnail,
}