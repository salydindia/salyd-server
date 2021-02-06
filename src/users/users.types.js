const { gql } = require("apollo-server-express");

const UsersDef = gql`
    type Query {
        getUser: getUserPayload
    }
    type Mutation {
        registerUser(input: RegisterUserInput!): RegisterUserPayload!

        loginUser(input: LoginUserInput!): LoginUserPayload!
    }

    type User {
        """
        String representation of the ObjectId of mongoose
        """
        _id: ID!
        name: String!
        email: String!
        phone: Float!
        password: String!
        friends: [User]
    }

    input RegisterUserInput {
        name: String!
        email: String!
        phone: Float!
        password: String!
    }

    type RegisterUserPayload {
        message: String!
        user: User
    }

    input LoginUserInput {
        email: String!
        password: String!
    }

    type LoginUserPayload {
        message: String!
        token: String
        user: User
    }

    type getUserPayload {
        user: User
        message: String!
    }
`;

module.exports = {
    UsersDef,
};