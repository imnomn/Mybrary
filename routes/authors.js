const express = require("express");

const router = express.Router();


//get route of all authors names
router.get("/", (req, res) => {
        res.render("authors/index");
    })
    //get rout of new author
router.get("/new", (req, res) => {
    res.render("authors/new")
})

//create author route of new author to be  added
router.post("/new", (req, res) => {
    res.send("t0 be added")
})


module.exports = router;