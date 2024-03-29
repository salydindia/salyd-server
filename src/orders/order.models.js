const mongoose = require("mongoose");
const schema = mongoose.Schema;

const { ObjectId } = schema;

const orderSchema = new schema({
    _id: {
        type: Number,
    },
    placedMenu: [
        {
            _id: {
                type: ObjectId,
            },
            name: {
                type: String,
            },
            price: {
                type: Number,
            },
            quantity: {
                type: Number,
            },
            extraDetails: {
                type: String,
            },
        },
    ],
    orderOwner: {
        type: ObjectId,
        ref: "Users",
    },
    status: {
        type: Number,
        default: -1,
    },
    restaurant: {
        type: Number,
        ref: "Restaurant",
    },
    date: {
        type: String,
    },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
