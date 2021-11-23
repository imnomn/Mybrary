const express = require("express");
const Book = require("../models/books");
const { ObjectId } = require('mongoose').Types;
const Authors = require("../models/authors");
const router = express.Router();
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

//get route of all authors names
router.get("/", async(req, res) => {

    let query = Book.find();
    if (req.query.name != null && req.query.name != "") {
        query = query.regex("title", new RegExp(req.query.name, "i"));
    }
    if (req.query.publishBefore != null && req.query.publishBefore != "") {
        query = query.lte("publishDate", req.query.publishBefore);
    }
    if (req.query.publishAfter != null && req.query.publishAfter != "") {
        query = query.gte("publishDate", req.query.publishAfter);
    }


    try {
        const books = await query.exec();
        const authors = await Authors.find({});
        res.render("books/index", { books: books, authors: authors, searchedValue: req.query.name })

    } catch (err) {
        console.log(err);
    }
})


//get rout of new author
router.get("/new", async(req, res) => {
    try {
        const book = new Book();
        const authors = await Authors.find({});
        res.render("books/new", { book: book, authors: authors })
    } catch (err) {
        res.render("books/new");
    }


})

// router.get("/:id", (req, res) => {
//     res.send("author with id: " + req.params.id)
// })


// router.get("/:id/edit", (req, res) => {
//     res.send("Edit author with id: " + req.params.id)
// })


// router.put("/:id", (req, res) => {
//     res.send(" update author with id: " + req.params.id)
// })

// router.delete("/:id", (req, res) => {
//     res.send("delete author with id: " + req.params.id)
// })

//create author route of new author to be  added
router.post("/", async(req, res) => {

    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(newBook, req.body.cover)

    try {
        await newBook.save();

        res.redirect("/books");
    } catch (err) {
        console.log(err);
    }

})


function saveCover(Book, coverEncoded) {

    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.Type));
    Book.coverImage = new Buffer.from(cover.data, "base64");
    Book.coverImageType = cover.type


}

module.exports = router;