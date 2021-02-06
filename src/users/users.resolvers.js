const mongoose = require("mongoose");
const Users = require("./users.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userResolver = {
    Query: {
        getUser: async (_parent, args, context) => {
            if (context.isAuth) {
                const userId = context.userData._id;

                const user = await Users.findById({
                    _id: userId,
                }).populate("friends", ["_id", "name", "email", "phone"]);

                return {
                    user,
                    message: "Resource accessible",
                };
            } else {
                return {
                    message: "You need to login to access this resource",
                };
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
                return {
                    message: "User is already registered",
                };
            }

            const hashedPass = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name,
                email,
                phone,
                password: hashedPass,
            });

            const savedUser = await newUser.save();

            console.log(savedUser);

            return {
                message: "User registered successfully",
                user: savedUser,
            };
        },
        loginUser: async (_parent, args) => {
            const { email, password } = args.input;

            const secret = "ye app machayega";

            const user = await Users.findOne({
                email,
            });

            if (!user) {
                return {
                    message: "User is not registered",
                };
            }

            const isMatch = await bcrypt.compare(password, user.password);

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
                return {
                    message: "Sorry,Incorrect Password",
                };
            }
        },
    },
};

module.exports = { userResolver };
