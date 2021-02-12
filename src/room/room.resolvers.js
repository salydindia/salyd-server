const Table = require("../table/tables.models");
const Users = require("../users/users.models");
const Order = require("../orders/order.models");
const Room = require("./room.models.js");

const {
    AuthenticationError,
    ApolloError,
    UserInputError,
} = require("apollo-server-express");

const roomResolver = {
    Query: {},
    Mutation: {
        newRoom: async (_parent, args, context) => {
            if (context.isAuth) {
                const { tableId } = args;

                const roomId = Math.floor(1000 + Math.random() * 9000);
                const orderId = Math.floor(1000 + Math.random() * 9000);

                try {
                    const table = await Table.findById({
                        _id: tableId,
                    });

                    if (table) {
                        const restaurantId = tableId.toString().substring(0, 6);

                        const newRoom = new Room({
                            _id: roomId,
                            orderId,
                            tableOf: restaurantId,
                            users: [context._id],
                            admin: context._id,
                        });

                        const room = await newRoom.save();

                        console.log(room);

                        const newOrder = new Order({
                            _id: orderId,
                            orderOwner: context._id,
                            restaurant: restaurantId,
                            status: -1,
                        });

                        const order = await newOrder.save();

                        console.log(order);

                        return {
                            room,
                        };
                    } else {
                        throw new UserInputError("Invalid TableId");
                    }
                    // const user = await Users.findByIdAndUpdate(
                    //     {
                    //         _id: context._id,
                    //     },
                    //     {
                    //         $set: {
                    //             role: "admin",
                    //         },
                    //     },
                    //     {
                    //         new: true,
                    //         runValidators: true,
                    //     }
                    // );
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
        addMember: async (_parent, args, context) => {
            if (context.isAuth) {
                const { roomId } = args;

                try {
                    const room = await Room.findOneAndUpdate(
                        {
                            _id: roomId,
                        },
                        {
                            $push: {
                                users: context._id,
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    )
                        .populate("tableOf")
                        .populate("users");

                    console.log(room);

                    if (room === null) {
                        throw new UserInputError("Invalid RoomId");
                    }
                    return {
                        room,
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
        addGuestMember: async (_parent, args) => {
            const { name, roomId } = args.input;

            const newUser = new Users({
                name,
            });

            try {
                const savedUser = await newUser.save();

                console.log(savedUser);

                const room = await Room.findOneAndUpdate(
                    {
                        _id: roomId,
                    },
                    {
                        $push: {
                            users: savedUser._id,
                        },
                    },
                    {
                        runValidators: true,
                        new: true,
                    }
                )
                    .populate("tableOf")
                    .populate("users");
                console.log(room);

                if (room === null) {
                    throw new UserInputError("Invalid RoomId");
                }
                return {
                    room,
                };
            } catch (e) {
                console.log(e, "error");
                throw new ApolloError(e.message);
            }
        },
    },
};

module.exports = { roomResolver };
