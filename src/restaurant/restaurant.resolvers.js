const Restaurant = require("./restaurant.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    AuthenticationError,
    ApolloError,
    UserInputError,
} = require("apollo-server-express");

const restaurantResolver = {
    Query: {
        getRestaurant: async (_parent, args, context) => {
            if (context.isAuth) {
                const restaurantId = context._id;

                try {
                    const restaurant = await Restaurant.findById({
                        _id: restaurantId,
                    });

                    return restaurant;
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
        addRestaurant: async (_parent, args) => {
            const { ownerName, name, address, email, phone } = args.input;

            //Checking if the restauarant already exists
            const restaurant = await Restaurant.findOne({
                email,
            });

            if (restaurant) {
                throw new AuthenticationError("Restaurant already registered");
            }

            try {
                const newRestaurant = new Restaurant({
                    ownerName,
                    name,
                    email,
                    address,
                    phone,
                });
                const savedRestaurant = await newRestaurant.save();

                console.log(savedRestaurant);

                return savedRestaurant;
            } catch (e) {
                return new ApolloError("Internal Sever error", "ERR_POST");
            }
        },
        registerRestaurant: async (_parent, args) => {
            const { restaurantId, password, email } = args.input;

            const restaurant = await Restaurant.findOne({
                email: email,
            });

            if (!restaurant) {
                throw new ApolloError("Restaurant not registered");
            }

            const hashedPass = await bcrypt.hash(password, 10);

            restaurant.restaurantId = restaurantId;
            restaurant.password = hashedPass;

            try {
                const savedRestro = await restaurant.save();

                console.log(savedRestro, "restro");

                return savedRestro;
            } catch (e) {
                console.log(e);
                throw new ApolloError("Internal Server error", "ERR_POST");
            }
        },
        loginRestaurant: async (_parent, args) => {
            const { restaurantId, password } = args.input;

            const secret = process.env.JWT_SECRET;

            const restaurant = await Restaurant.findOne({
                restaurantId: restaurantId,
            });

            if (!restaurant) {
                throw new AuthenticationError(
                    "Restaurant is not registered with us"
                );
            }

            const isMatch = await bcrypt.compare(password, restaurant.password);

            try {
                if (isMatch) {
                    const token = jwt.sign(
                        {
                            _id: restaurant._id,
                        },
                        secret
                    );

                    return {
                        message: "Logged in successfully",
                        token,
                        restaurant,
                    };
                } else {
                    throw new AuthenticationError("Invalid credentials");
                }
            } catch (e) {
                console.log(e, "Error");
                throw new ApolloError("Internal Sever Error", "ERR_POST");
            }
        },
    },
};

module.exports = { restaurantResolver };