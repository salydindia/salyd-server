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
});

const restaurantSchema = new schema({
    _id: {
        type: Number,
    },
    ownerName: {
        type: String,
    },
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    menu: [menuSchema],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
