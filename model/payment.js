const mongoose = require("mongoose")
const Schema = mongoose.Schema

const paymentSchema = new Schema(
    {
        paymentType : String,
        customer: {type: Schema.Types.ObjectId, ref: 'customer'},
        group: {type: Schema.Types.ObjectId, ref: 'group'},
        amount: Number,        
        createdBy: {type: Schema.Types.ObjectId, ref: 'user'},
        paymentMeans: String,
        paymentDate: Date
},
{
    timestamps: true
})

module.exports = mongoose.model("payment", paymentSchema)