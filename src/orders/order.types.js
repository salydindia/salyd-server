const { gql } = require("apollo-server-express");

const orderDef = gql`
    type Mutation {
        placeOrder(input: PlaceOrderInput): PlaceOrderPayload!
        addMenuToCart(menu: String!): String!
    }

    type Subscription {
        subscribeToMenu: String!
    }

    type Order {
        _id: Int!
        placedMenu: [placedMenu]
        orderOwner: User!
        status: Int!
        restaurant: Restaurant!
        date: String
    }

    type placedMenu {
        _id: ID!
        name: String!
        price: Int!
        quantity: Int!
        extraDetails: String
    }

    input OrderMenuInput {
        _id: ID!
        quantity: Int!
        extraDetails: String
    }

    input PlaceOrderInput {
        roomId: Int!
        orderedMenu: [OrderMenuInput!]!
    }

    type PlaceOrderPayload {
        order: Order!
    }
`;
module.exports = orderDef;
