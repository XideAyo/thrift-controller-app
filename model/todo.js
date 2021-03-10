const mongoose = require("mongoose")
const Schema = mongoose.Schema

const toDoSchema = new Schema({
    title: {type: String},
    description: {type: String},
    todo_date: {type: Date},
    completed: {type: Boolean, default: false},
})

module.exports = mongoose.model("todo", toDoSchema)