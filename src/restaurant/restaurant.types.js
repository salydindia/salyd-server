const { gql } = require("apollo-server-express");

const RestaurantDef = gql`
    type Mutation {
        """
        Restaurant signing up with their details
        """
        addRestaurant(input: AddRestaurantInput): Restaurant

        """
        Registering restaurant by adding restaurantId and password
        """
        registerRestaurant(input: RegisterRestaurantInput): Restaurant

        """
        Restaurant Login using restaurantId and password
        """
        loginRestaurant(input: LoginRestaurantInput): LoginRestaurantPayload
    }

    type Query {
        getRestaurant: Restaurant
    }

    type Restaurant {
        """
        String representation of mongoose id
        """
        _id: Int!
        ownerName: String!
        name: String!
        address: String!
        phone: Float!
        email: String!
        password: String
        menu: [Menu]
        orders: [Order]
    }

    """
    Input type for signing up with restaurant details
    """
    input AddRestaurantInput {
        ownerName: String!
        name: String!
        address: String!
        phone: Float!
        email: String!
    }

    """
    Input type for registering restaurant (Adding id and password)
    """
    input RegisterRestaurantInput {
        email: String!
        _id: Int!
        password: String!
    }

    """
    Input type for login
    """
    input LoginRestaurantInput {
        _id: Int!
        password: String!
    }

    type LoginRestaurantPayload {
        message: String!
        token: String
        restaurant: Restaurant
    }
`;

module.exports = RestaurantDef;
