const mongoose = require("mongoose");
const Users = require("./users.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    AuthenticationError,
    ApolloError,
    UserInputError,
} = require("apollo-server-express");

const userResolver = {
    Query: {
        getUser: async (_parent, args, context) => {
            if (context.userData) {
                const userId = context.userData_id;

                try {
                    const user = await Users.findById({
                        _id: userId,
                    });

                    return user;
                } catch (e) {
                    throw new ApolloError(
                        "Internal Server Error",
                        "Error fetching"
                    );
                }
            } else {
                throw new AuthenticationError(
                    "You need to login to access this resource"
                );
            }
        },
        orderHistoryUser: async (_parent, args, context) => {
            if (context.isAuth) {
                try {
                    const user = await Users.findById({
                        _id: context._id,
                    }).populate({
                        path: "orders",
                        populate: { path: "restaurant" },
                    });

                    const orders = user.orders;
                    console.log(user.orders);

                    let ordersHistory = [];

                    for (var i = 0; i < orders.length; i++) {
                        if (orders[i].status === 1) {
                            console.log("in");
                            ordersHistory.push(orders[i]);
                        }
                    }

                    console.log(ordersHistory[0]._id, "hisory");
                    return {
                        orders: ordersHistory,
                    };
                } catch (e) {
                    console.log(e, "error");
                    throw new ApolloError(
                        "Internal Server Error",
                        "Error fetching"
                    );
                }
            } else {
                throw new AuthenticationError(
                    "You need to login to access this resource"
                );
            }
        },
    },
    Mutation: {
        registerUser: async (_parent, args) => {
            const { name, email, password, phone } = args.input;

            //Checking if the user already exists
            const user = await Users.findOne({
                email,
            });

            if (user) {
                throw new AuthenticationError("User already exists");
            }

            const hashedPass = await bcrypt.hash(password, 10);

            try {
                const newUser = new Users({
                    name,
                    email,
                    phone,
                    password: hashedPass,
                });

                const savedUser = await newUser.save();

                console.log(savedUser);

                console.log(savedUser._id);
                return savedUser;
            } catch (e) {
                return new ApolloError("Internal Sever error", "ERR_POST");
            }
        },
        loginUser: async (_parent, args) => {
            const { email, password } = args.input;

            const secret = process.env.JWT_SECRET;

            const user = await Users.findOne({
                email,
            });

            if (!user) {
                throw new AuthenticationError("User is not registered");
            }

            const isMatch = await bcrypt.compare(password, user.password);

            try {
                if (isMatch) {
                    const token = jwt.sign(
                        {
                            _id: user._id,
                        },
                        secret
                    );

                    return {
                        message: "Logged in successfully",
                        token,
                        user,
                    };
                } else {
                    throw new AuthenticationError("Invalid credentials");
                }
            } catch (e) {
                throw new ApolloError("Internal Sever Error", "ERR_POST");
            }
        },
    },
};

module.exports = { userResolver };
