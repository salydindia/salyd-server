const { gql } = require("apollo-server-express");

const MenuDef = gql`
    type Mutation {
        """
        Adding menu to restuarant's collection
        //? need to see whether we/restro owner will add the menu
        """
        addMenu(input: AddMenuInput): Restaurant
    }

    type Menu {
        name: String!
        price: Int!
        category: Category!
        description: String!
        image: String
        isVeg: String
        maxQuantity: Int
    }

    input AddMenuInput {
        name: String!
        price: Int!
        category: Category!
        description: String
        image: String
        isVeg: String
        maxQuantity: Int
    }

    enum Category {
        Snacks
        Breakfast
        Lunch
        Dinner
        SweetDish
    }

    type OrderedMenu {
        _id: ID!
        name: String!
        price: Int!
        count: Int!
        extraDetails: String
    }
`;

module.exports = MenuDef;
