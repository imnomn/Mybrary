//jshint esversion:6
require("dotenv").config();
const express = require("express")
    //ejs layout module added
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const ejs = require("ejs")
    //index router added
const indexRouter = require("./routes/index");
//author router added
const authorRouter = require("./routes/authors")
    // Books router added
const booksRouter = require("./routes/books")
const app = express()

app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", `${__dirname}/views`);
app.use(express.static(__dirname + "/public"))
app.set("layout", "layouts/layout")
    //decalaration of using expresslayouts
app.use(expressLayouts);


//connecting database
(async() => {
    try {
        await mongoose.connect(process.env.DATA_BASE_URL);

        console.log("connected successfully to mongoDB");
    } catch (err) {
        console.log("Error occured while connecting to Database :" + err)
    }
})();


app.use("/", indexRouter);
app.use("/authors", authorRouter)
app.use("/books", booksRouter)

app.listen(process.env.PORT || 3000, () => {
    console.info("server running on port 3000")
})