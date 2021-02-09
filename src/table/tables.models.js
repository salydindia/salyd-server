const mongoose = require("mongoose");

const schema = mongoose.Schema;

const { ObjectId } = schema;

const tableSchema = new schema({
    _id: {
        type: Number,
    },
    users: [
        {
            type: ObjectId,
            ref: "Users",
        },
    ],
    tableOf: {
        type: ObjectId,
        ref: "Restaurant",
    },
    roomId: {
        type: Number,
    },
    menu: [
        {
            name: {
                type: String,
            },
            price: {
                type: Number,
            },
            count: {
                type: Number,
            },
        },
    ],
});

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
