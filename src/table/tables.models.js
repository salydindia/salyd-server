const mongoose = require("mongoose");

const schema = mongoose.Schema;

const { ObjectId } = schema;

const tableSchema = new schema({
    _id: {
        type: Number,
    },
    tableOf: {
        type: Number,
        ref: "Restaurant",
    },
    tableNo: {
        type: Number,
    },
});

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
