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
                console.log(input);
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
    },
};

module.exports = { menuResolver };
