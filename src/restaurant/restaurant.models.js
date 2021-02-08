const mongoose = require("mongoose");

const schema = mongoose.Schema;

const { ObjectId } = schema;

const restaurantSchema = new schema({
    restaurantId: {
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
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
