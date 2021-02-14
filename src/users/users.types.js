const { gql } = require("apollo-server-express");

const UsersDef = gql`
    type Query {
        getUser: User

        """
        fetch order history of a particular user
        """
        orderHistoryUser: OrderHistoryUserPayload
    }
    type Mutation {
        registerUser(input: RegisterUserInput!): User!

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
        orders: [Order]
    }

    input RegisterUserInput {
        name: String!
        email: String!
        phone: Float!
        password: String!
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

    type OrderHistoryUserPayload {
        orders: [Order]
    }
`;

module.exports = {
    UsersDef,
};
