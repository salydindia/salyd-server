const Restaurant = require("./restaurant.models.js");
const Order = require("../orders/order.models");
const Room = require("../room/room.models.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    AuthenticationError,
    ApolloError,
    UserInputError,
} = require("apollo-server-express");

const restaurantResolver = {
    Query: {
        orderHistoryRestaurant: async (_parent, args, context) => {
            if (context.isAuth) {
                const restaurantId = context._id;

                try {
                    const restaurant = await Restaurant.findById({
                        _id: restaurantId,
                    }).populate({
                        path: "orders",
                        populate: { path: "orderOwner" },
                    });

                    const orders = restaurant.orders;
                    console.log(restaurant.orders);

                    let ordersHistory = [];

                    for (var i = 0; i < orders.length; i++) {
                        if (orders[i].status === 1) {
                            console.log("in");
                            ordersHistory.push(orders[i]);
                        }
                    }

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
        ongoingOrders: async (_parent, args, context) => {
            if (context.isAuth) {
                const restaurantId = context._id;

                try {
                    const rooms = await Room.find({
                        tableOf: restaurantId,
                    })
                        .populate("table")
                        .populate({
                            path: "orderId",
                            populate: { path: "orderOwner" },
                        });

                    console.log("rooms", rooms);

                    let roomsData = [];

                    //Every room has one order
                    //looping over rooms to push their each order in orderHistory
                    for (var i = 0; i < rooms.length; i++) {
                        if (rooms[i].orderId.status !== -1) {
                            roomsData.push(rooms[i]);
                        }
                    }

                    return {
                        rooms: roomsData,
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

            console.log(ownerName, name);

            const allRestaurants = await Restaurant.find({});
            const count = allRestaurants.length;

            console.log(count);

            //Checking if the restauarant already exists
            const restaurant = await Restaurant.findOne({
                email,
            });

            if (restaurant) {
                throw new AuthenticationError("Restaurant already registered");
            }

            try {
                const newRestaurant = new Restaurant({
                    _id: count + 1,
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
            const { _id, password, email } = args.input;

            const restaurant = await Restaurant.findOne({
                email: email,
            });
            console.log(restaurant);
            if (!restaurant) {
                throw new ApolloError("Restaurant not registered");
            }

            const hashedPass = await bcrypt.hash(password, 10);

            const newRestaurant = new Restaurant({
                _id,
                ownerName: restaurant.ownerName,
                name: restaurant.name,
                email: restaurant.email,
                address: restaurant.address,
                phone: restaurant.phone,
                password: hashedPass,
            });

            try {
                const deletedRestro = await Restaurant.findOneAndRemove({
                    email,
                });

                const savedRestro = await newRestaurant.save();

                console.log(savedRestro);
                return savedRestro;
            } catch (e) {
                console.log(e);
                throw new ApolloError("Internal Server error", "ERR_POST");
            }
        },
        loginRestaurant: async (_parent, args) => {
            const { _id, password } = args.input;

            const secret = process.env.JWT_SECRET;

            const restaurant = await Restaurant.findOne({
                _id,
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
                throw new ApolloError(e.message);
            }
        },
        completeOrder: async (_parent, args, context) => {
            const { orderId } = args;

            if (context.isAuth) {
                try {
                    const order = await Order.findByIdAndUpdate(
                        {
                            _id: orderId,
                        },
                        {
                            $set: {
                                status: 1,
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    ).populate("orderOwner");

                    return {
                        order,
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
};

module.exports = { restaurantResolver };
