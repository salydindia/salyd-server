const { gql } = require("apollo-server-express");

const TableDef = gql`
    type Mutation {
        """
        Adding table details to the database
        _id is restaurantId+threedigits = tableId
        """
        addTable(_id: Int!): AddTablePayload

        """
        New table created by user by entering table details(User will be admin)
        """
        newTable(tableId: Int!): NewTablePayload

        """
        Join table using roomId (for logged in users)
        """
        addMember(roomId: Int!): AddMemberPayload
    }

    type Table {
        _id: Int!
        users: [User]
        tableOf: Restaurant
        roomId: Int
        menu: [OrderedMenu]
    }

    type AddTablePayload {
        table: Table
    }

    type NewTablePayload {
        table: Table
    }

    type AddMemberPayload {
        table: Table
    }
`;

module.exports = TableDef;
