const { gql } = require("apollo-server-express");

const RestaurantDef = gql`
    type Query {
        getRestaurant: Restaurant
        """
        Order History of the restaurant
        """
        orderHistoryRestaurant: OrderHistoryRestaurantPayload

        """
        Ongoing orders on all tables(Fetching all rooms)
        """
        ongoingOrders: OngoingOrdersPayload
    }
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

        """
        Complete order from restaurant side
        """
        completeOrder(orderId: ID!): CompleteOrderPayload
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

    type OrderHistoryRestaurantPayload {
        orders: [Order]!
    }

    type OngoingOrdersPayload {
        rooms: [Room]!
    }

    type CompleteOrderPayload {
        order: Order!
    }
`;

module.exports = RestaurantDef;
