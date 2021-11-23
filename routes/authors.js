const express = require("express");
const Author = require("../models/authors");
const router = express.Router();
const Book = require("../models/books")

//get route of all authors names
router.get("/", async(req, res) => {
    const reqAuthors = {};
    if (req.query.name != "" || req.query.name != null) {
        reqAuthors.name = new RegExp(req.query.name, "i");
    }
    try {
        const authors = await Author.find(reqAuthors);
        res.render("authors/index", {
            Authors: authors,
            searchOption: req.query.name
        });
    } catch (err) {
        res.redirect("/")
    }


})



//get rout of new author
router.get("/new", (req, res) => {
    res.render("authors/new")
})


router.get("/:id", async(req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: req.params.id })
        res.render("authors/show", { author: author, booksByAuthor: books });
    } catch (err) {
        console.log(err);
        res.redirect("/authors");
    }

})




router.get("/:id/edit", async(req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render("authors/edit", { author: author })
    } catch (err) {
        res.redirect("/authors")
    }

})


router.put("/:id", async(req, res) => {
    let author;
    try {

        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        author.save();
        res.redirect(`/authors/${req.params.id}`);

    } catch (err) {

        res.redirect(`/authors`)
    }
})

router.delete("/:id", async(req, res) => {
    let author;
    try {

        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect(`/authors`);

    } catch (err) {
        if (author.name == null) {
            res.redirect("/");
        } else {
            res.redirect(`/authors/${author.id}`)
        }

    }
})

//create author route of new author to be  added
router.post("/", async(req, res) => {
    try {
        const author = new Author({
            name: req.body.name
        });
        await author.save();
        res.redirect("/authors")
    } catch (err) {
        res.redirect("/")
    }
})


module.exports = router;