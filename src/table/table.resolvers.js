const Table = require("./tables.models.js");

const {
    AuthenticationError,
    ApolloError,
    UserInputError,
} = require("apollo-server-express");

const tableResolver = {
    Query: {},
    Mutation: {
        addTable: async (_parent, args, context) => {
            const { _id } = args;

            if (context.isAuth) {
                console.log("in");
                const restaurantId = context._id;

                try {
                    const allTables = await Table.find({});

                    const count = allTables.length;
                    console.log(count);

                    const newTable = new Table({
                        _id,
                        tableOf: restaurantId,
                        tableNo: count + 1,
                    });

                    const savedTable = await newTable.save();

                    console.log(savedTable);

                    return {
                        table: savedTable,
                    };
                } catch (e) {
                    console.log(e, "error");
                    throw new ApolloError("Internal server error", "ERR_POST");
                }
            } else {
                throw new AuthenticationError(
                    "Please login to access the resource"
                );
            }
        },
    },
};

module.exports = { tableResolver };
