const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const { gql } = require("apollo-server-express");

//User Type definitions
const { UsersDef } = require("../src/users/users.types.js");
const { userResolver } = require("./users/users.resolvers.js");

//Restaurant Type definition
const RestaurantDef = require("./restaurant/restaurant.types.js");
const { restaurantResolver } = require("./restaurant/restaurant.resolvers.js");

//Menu Type Definition
const MenuDef = require("./restaurant/menu.types.js");
const { menuResolver } = require("./restaurant/menu.resolvers.js");

//Room type Definition
const RoomDef = require("./room/room.types.js");
const { roomResolver } = require("./room/room.resolvers");

//Order type definition
const OrderDef = require("./orders/order.types.js");
const { orderResolver } = require("./orders/order.resolvers.js");

//Todo add subscription

//Table Type Definition
const TableDef = require("./table/table.types.js");
const { tableResolver } = require("./table/table.resolvers.js");

const SchemaDef = gql`
    schema {
        query: Query
        mutation: Mutation
    }
`;

//All type definitions
const typedefs = [
    UsersDef,
    SchemaDef,
    RestaurantDef,
    MenuDef,
    TableDef,
    RoomDef,
    OrderDef,
];

const mergedDefs = mergeTypeDefs(typedefs);

const resolvers = [
    userResolver,
    restaurantResolver,
    menuResolver,
    tableResolver,
    roomResolver,
    orderResolver,
];

const mergedResolvers = mergeResolvers(resolvers);

const schema = makeExecutableSchema({
    typeDefs: mergedDefs,
    resolvers: mergedResolvers,
});

module.exports = schema;
