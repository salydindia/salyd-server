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

//Todo add subscription

const SchemaDef = gql`
    schema {
        query: Query
        mutation: Mutation
    }
`;

//All type definitions
const typedefs = [UsersDef, SchemaDef, RestaurantDef, MenuDef];

const mergedDefs = mergeTypeDefs(typedefs);

const resolvers = [userResolver, restaurantResolver, menuResolver];

const mergedResolvers = mergeResolvers(resolvers);

const schema = makeExecutableSchema({
    typeDefs: mergedDefs,
    resolvers: mergedResolvers,
});

module.exports = schema;
