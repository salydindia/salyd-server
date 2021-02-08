const mongoose = require("mongoose");

const schema = mongoose.Schema;
const { ObjectId } = schema;

const menuSchema = new schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    isVeg: {
        type: Boolean,
    },
    maxQuantity: {
        type: Number,
    },
    itemOf: {
        type: ObjectId,
        ref: "Restaurants",
    },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
