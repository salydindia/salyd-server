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
    role: {
        type: String,
        enum: ["view", "admin"],
        default: "view",
    },
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
