const mongoose = require("mongoose");

const schema = mongoose.Schema;

const { ObjectId } = schema;

const roomSchema = new schema({
    _id: {
        type: Number,
    },
    orderId: {
        type: Number,
    },
    users: [
        {
            type: ObjectId,
            ref: "Users",
        },
    ],
    tableOf: {
        type: Number,
        ref: "Restaurant",
    },
    admin: {
        type: ObjectId,
        ref: "Users",
    },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
