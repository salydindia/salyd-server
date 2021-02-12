const { gql } = require("apollo-server-express");

const TableDef = gql`
    type Mutation {
        """
        Adding table details to the database
        _id is restaurantId+threedigits = tableId
        """
        addTable(_id: Int!): AddTablePayload
    }

    type Table {
        _id: Int!
        tableOf: Restaurant!
        tableNo: Int!
    }

    type AddTablePayload {
        table: Table
    }
`;

module.exports = TableDef;
