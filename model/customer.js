const mongoose = require("mongoose")
const Schema = mongoose.Schema

const customerSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        mobile: String,
        group: {type: Schema.Types.ObjectId, ref: 'group'},
        address: String,
        image: String,
        createdBy: {type: Schema.Types.ObjectId, ref: 'user'}
},
{
    timestamps: true
})

module.exports = mongoose.model("customer", customerSchema)