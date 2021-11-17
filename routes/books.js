const express = require("express");
const Book = require("../models/books");
const { ObjectId } = require('mongoose').Types;
const Authors = require("../models/authors");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const uploadPath = path.join("public", Book.coverImageBasePath)

const upload = multer({

    dest: uploadPath,
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))
    }
})


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

//create author route of new author to be  added
router.post("/", upload.single("cover"), async(req, res) => {
    const fileName = req.file != null ? req.file.filename : "";

    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        await newBook.save();
        console.log(req.file.path);
        res.redirect("/books");
    } catch (err) {
        //checking if file is uploaded
        if (newBook.coverImageName != null) {
            // remove the uploaded file thorugh custom function as there is error in saving the whole book info
            removebookCover(newBook.coverImageName)
        }
        console.log(err);
    }

})

function removebookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

module.exports = router;