const {
    AuthenticationError,
    ApolloError,
    UserInputError,
} = require("apollo-server-express");

const orderResolver = {
    Query: {},
    Mutation: {},
};

module.exports = { orderResolver };
