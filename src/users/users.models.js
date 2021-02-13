const mongoose = require("mongoose");

const schema = mongoose.Schema;

const usersSchema = new schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
    },
    orders: [
        {
            type: Number,
            ref: "Order",
        },
    ],
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
