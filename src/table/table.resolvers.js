const Table = require("./tables.models");

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
                const restaurantId = context._id;

                try {
                    const newTable = new Table({
                        _id,
                        tableOf: restaurantId,
                    });

                    const savedTable = await newTable.save();

                    console.log(savedTable);

                    return savedTable;
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
        newTable: async (_parent, args, context) => {
            if (context.isAuth) {
                const { tableId } = args;

                const roomId = Math.floor(Math.random() * 10000);

                try {
                    const table = await Table.findByIdAndUpdate(
                        {
                            _id: tableId,
                        },
                        {
                            $push: {
                                users: context._id,
                            },
                            $set: {
                                roomId,
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                    console.log(table, "table");
                    return table;
                } catch (e) {
                    console.log(e, "error");
                }
            } else {
                throw new AuthenticationError(
                    "Please login to access this resource"
                );
            }
        },
    },
};

module.exports = { tableResolver };
