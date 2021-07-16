const Order = require("./order.models.js");
const Room = require("../room/room.models");
const Restaurant = require("../restaurant/restaurant.models.js");
const { PubSub } = require("apollo-server-express");

const pubsub = new PubSub();

const {
    AuthenticationError,
    ApolloError,
    UserInputError,
} = require("apollo-server-express");

//Todo Saving orderId in restaurant's collection (having an array of orderIds)
//Todo Simmilarly doing for all the users
//Todo Saving tableIds in room collection (Needed while fetching orders for each table rooms on restro side)
//Todo setting status to 1 when restaurant completes the order from their portal

const orderResolver = {
    Query: {},

    Mutation: {
        placeOrder: async (_parent, args, context) => {
            if (context.isAuth) {
                const { roomId, orderedMenu } = args.input;

                try {
                    const room = await Room.findById({
                        _id: roomId,
                    });

                    const restaurantId = room.tableOf;

                    const restaurant = await Restaurant.findById({
                        _id: restaurantId,
                    });

                    // const oldOrder = await Order.findById({
                    //     _id:orderId
                    // })

                    const menu = restaurant.menu;

                    console.log(menu);

                    //Date

                    var today = new Date();
                    var dd = today.getDate();

                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = "0" + dd;
                    }

                    if (mm < 10) {
                        mm = "0" + mm;
                    }

                    today = mm + "-" + dd + "-" + yyyy;

                    let placedMenu = [];

                    //Just taking the id of the items from the db
                    for (let i = 0; i < menu.length; i++) {
                        for (let j = 0; j < orderedMenu.length; j++) {
                            if (orderedMenu[j]._id === menu[i]._id.toString()) {
                                console.log("in");
                                placedMenu.push({
                                    _id: orderedMenu[j]._id,
                                    name: menu[i].name,
                                    quantity: orderedMenu[j].quantity,
                                    price: menu[i].price,
                                    extraDetails: orderedMenu[j].extraDetails
                                        ? orderedMenu[j].extraDetails
                                        : "",
                                });
                            }
                        }
                    }

                    console.log(placedMenu);

                    // oldOrder.placedMenu.map((item) => {
                    //     if(item._id == placed)
                    // })
                    // order.placedMenu.map((item) => {
                    //     placedMenu.push(item);
                    // })

                    // console.log(placedMenu,"placedMenu");

                    const { orderId } = room;

                    const order = await Order.findByIdAndUpdate(
                        {
                            _id: orderId,
                        },
                        {
                            $set: {
                                placedMenu,
                                status: 0,
                                date: today,
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );

                    return {
                        order,
                    };
                } catch (e) {
                    console.log(e, "error");
                    throw new ApolloError("Internal Server error", "ERR_POST");
                }
            } else {
                throw new AuthenticationError(
                    "Please login to access this resource"
                );
            }
        },
        addMenuToCart: (_parent, args) => {
            const { menu } = args;
            pubsub.publish("MENU_ADDED", menu);
            console.log(menu, "menu");
            console.log(typeof menu);
            return menu;
        },
    },
    //Pub Sub model
    Subscription: {
        subscribeToMenu: {
            resolve: (payload) => {
                console.log(payload, "payload");
                return payload;
            },
            subscribe: (_parent, args) => pubsub.asyncIterator(["MENU_ADDED"]),
        },
    },
};

module.exports = { orderResolver };
