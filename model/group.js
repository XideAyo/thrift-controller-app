const mongoose = require("mongoose")
const Schema = mongoose.Schema

const groupSchema = new Schema(
    {
        name: String,
        amount: Number,
        period: String,
        totalUsers: {type: Number, default: 0},
        createdBy: {type: Schema.Types.ObjectId, ref: 'user'},
        completed: {type: Boolean, default: false},
        profit: {
            percentage: Number,
            amount: Number
        }
},
{
    timestamps: true
})

module.exports = mongoose.model("group", groupSchema)