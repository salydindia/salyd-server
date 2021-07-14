const Restaurant = require("./restaurant.models.js");
const {
    AuthenticationError,
    ApolloError,
    UserInputError,
} = require("apollo-server-express");

const menuResolver = {
    Query: {},
    Mutation: {
        addMenu: async (_parent, args, context) => {
            if (context.isAuth) {
                const restaurantId = context._id;

                const { input } = args;

                console.log(input, "input");

                try {
                    const restaurant = await Restaurant.findByIdAndUpdate(
                        {
                            _id: restaurantId,
                        },
                        {
                            $push: {
                                menu: input,
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );

                    console.log(restaurant);

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
        updateMenu: async (_parent, args, context) => {
            if (context.isAuth) {
                const restaurantId = context._id;

                const { input } = args;

                try {
                    const restaurant = await Restaurant.findById({
                        _id: restaurantId,
                    });

                    var restroMenu = restaurant.menu;
                    restroMenu = input;

                    restaurant.menu = restroMenu;

                    let savedRestro = await restaurant.save();

                    console.log(savedRestro, "updatedMenu");

                    return savedRestro;
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
        deleteMenu: async (_parent, args, context) => {
            if (context.isAuth) {
                const restaurantId = context._id;

                const { _id } = args.input;

                try {
                    const { n, nModified, ok } = await Restaurant.updateOne(
                        {
                            _id: restaurantId,
                        },
                        {
                            $pull: {
                                menu: {
                                    _id,
                                },
                            },
                        },
                        {
                            safe: true,
                            multi: true,
                        }
                    );

                    console.log(n, " ", ok);

                    return {
                        n,
                        nModified,
                        ok,
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

module.exports = { menuResolver };
