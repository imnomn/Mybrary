const express = require("express");
const Book = require("../models/books")
const Authors = require("../models/authors");
const router = express.Router();
router.get("/", async(req, res) => {
    let books
    try {
        books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec();
        const authors = await Authors.find({});
        res.render("index", { books: books, authors: authors });
    } catch (err) {
        books = [];
    }


})



module.exports = router;