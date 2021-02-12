const { gql } = require("apollo-server-express");

const RoomDef = gql`
    type Mutation {
        """
        New room of the table created by admin by entering tableId or scanning qr code
        """
        newRoom(tableId: Int!): newRoomPayload

        """
        Join table using roomId (for logged in users)
        """
        addMember(roomId: Int!): AddMemberPayload

        """
        Join table using roomId(for guest users)
        """
        addGuestMember(input: AddGuestMemberInput!): AddGuestMemberPayload
    }

    type Room {
        """
        RoomId generated upon scanning the qr code
        """
        _id: Int!

        """
        Users in a particular room
        """
        users: [User]

        """
        Restaurant details to which room belongs to
        """
        tableOf: Restaurant!

        """
        Random orderId generated upon
        """
        orderId: Int!

        """
        Admin of the room
        """
        admin: User!
    }

    type newRoomPayload {
        room: Room
    }

    type AddMemberPayload {
        room: Room
    }

    input AddGuestMemberInput {
        roomId: Int!
        name: String!
    }

    type AddGuestMemberPayload {
        room: Room
    }
`;

module.exports = RoomDef;
