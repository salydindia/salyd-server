const { gql } = require("apollo-server-express");

const TableDef = gql`
    type Mutation {
        """
        Adding table details to the database
        _id is restaurantId+threedigits = tableId
        """
        addTable(_id: Int!): Table!

        """
        New table created by user by entering table details(User will be admin)
        """
        newTable(tableId: Int!): Table!
    }

    type Table {
        _id: Int!
        users: [User]
        tableOf: Restaurant
        roomId: Int
        menu: [OrderedMenu]
    }
`;

module.exports = TableDef;
