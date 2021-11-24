const mongoose = require("mongoose")
const Book = require("./books")
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
authorSchema.pre("deleteOne", async function(next) {
    try {
        //simple "this" keyword was not working so the querry is first first filtered and then  its id is accessed
        const query = this.getFilter();

        const book = Book.exists({ author: query._id });

        if (book) {
            next(new Error("Has some books related to the author"));
        } else {
            next();
        }
    } catch (err) {
        next(err)
    }


})
module.exports = mongoose.model("Author", authorSchema)