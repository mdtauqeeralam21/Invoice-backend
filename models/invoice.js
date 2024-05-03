import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    raisingFromCompany: {
        type: String,
        required: true
    },
    raisingToCompany: {
        type: String,
        required: true
    },
    services: [{
        description: String,
        hsnCode: String,
        amount: Number,
        currencyExchange:Number,
        rate:Number,
    }],
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the User"],
      },
},
{ timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
