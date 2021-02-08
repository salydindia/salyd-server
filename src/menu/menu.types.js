const { gql } = require("apollo-server-express");

const MenuDef = gql`
    type Menu {
        name: String!
        price: Number!
        category: Category!
        description: String!
        image: String
        isVeg: String
        maxQuantity: Number!
        itemOf: Restaurant
    }

    enum Category {
        Snacks
        Breakfast
        Lunch
        Dinner
        SweetDish
    }
`;

module.exports = MenuDef;
