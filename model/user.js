const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        name: String,
        email: String,
        password: String,
        mobile: String,
        secret: String,
        profileImage: String
},
{
    timestamps: true
})

module.exports = mongoose.model("user", userSchema)