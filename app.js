//jshint esversion:6
require("dotenv").config();
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const ejs = require("ejs")
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors")




const app = express()

app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", `${__dirname}/views`);
app.use(express.static(__dirname + "/public"))
app.set("layout", "layouts/layout")
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


app.listen(process.env.PORT || 3000, () => {
    console.info("server running on port 3000")
})