const { gql } = require("apollo-server-express");

const orderDef = gql`
    type Mutation {
        placeOrder(input: PlaceOrderInput): PlaceOrderPayload!
    }

    type Order {
        _id: ID!
        placedMenu: [placedMenu]
        orderOwner: User!
        status: Int!
        restauarant: Restaurant!
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
