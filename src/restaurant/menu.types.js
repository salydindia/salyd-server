const { gql } = require("apollo-server-express");

const MenuDef = gql`
    type Mutation {
        """
        Adding menu to restuarant's collection
        //? need to see whether we/restro owner will add the menu
        """
        addMenu(input: AddMenuInput): Restaurant

        """
        Updating of menu by the restaurant (Takes the whole menu as input (Changed one))
        """
        updateMenu(input: [UpdateMenuInput]): Restaurant!

        """
        Deleting menu of the restaurant
        """
        deleteMenu(input: DeleteMenuInput): DeletePayload!
    }

    type Menu {
        _id: ID!
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
        category: Category
        description: String
        image: String
        isVeg: String
        maxQuantity: Int
    }

    input UpdateMenuInput {
        _id: ID
        name: String!
        price: Int!
        category: Category
        description: String
        image: String
        isVeg: String
        maxQuantity: Int
    }

    input DeleteMenuInput {
        _id: ID!
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

    type DeletePayload {
        n: Int!
        nModified: Int!
        ok: Int!
    }
`;

module.exports = MenuDef;
