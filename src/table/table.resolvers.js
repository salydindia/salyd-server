const Table = require("./tables.models");
const Users = require("../users/users.models");

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
        newTable: async (_parent, args, context) => {
            if (context.isAuth) {
                const { tableId } = args;

                const roomId = Math.floor(1000 + Math.random() * 9000);

                try {
                    const user = await Users.findByIdAndUpdate(
                        {
                            _id: context._id,
                        },
                        {
                            $set: {
                                role: "admin",
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );

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
                    ).populate("tableOf");

                    //? Populating only tableOf property to know the details of restaurant as soon as the
                    //? admin enters the tableId

                    console.log(table, "table");

                    if (table === null) {
                        throw new UserInputError("Invalid TableId");
                    }
                    return {
                        table,
                    };
                } catch (e) {
                    console.log(e, "error");
                    throw new ApolloError(e.message);
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
