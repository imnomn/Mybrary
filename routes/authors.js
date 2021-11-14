const express = require("express");
const Author = require("../models/authors");
const router = express.Router();


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