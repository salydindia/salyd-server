const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const { gql } = require("apollo-server-express");

//User Type definitions
const { UsersDef } = require("../src/users/users.types.js");
const { userResolver } = require("./users/users.resolvers.js");

const SchemaDef = gql`
    schema {
        query: Query
        mutation: Mutation
    }
`;

//All type definitions
const typedefs = [UsersDef, SchemaDef];

const mergedDefs = mergeTypeDefs(typedefs);

const resolvers = [userResolver];

const mergedResolvers = mergeResolvers(resolvers);

const schema = makeExecutableSchema({
    typeDefs: mergedDefs,
    resolvers: mergedResolvers,
});

module.exports = schema;
