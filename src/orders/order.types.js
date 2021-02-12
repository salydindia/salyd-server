const { gql } = require("apollo-server-express");

const orderDef = gql`
    type Order {
        _id: ID!
        orderMenu: [orderMenu]
        orderOwner: User!
        status: Int!
        restauarant: Restaurant!
        date: String!
    }

    type orderMenu {
        name: String!
        price: Int!
        quantity: Int!
        extraDetails: String
    }
`;
module.exports = orderDef;
