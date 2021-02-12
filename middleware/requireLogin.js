const jwt = require("jsonwebtoken");
const Users = require("../src/users/users.models.js");
require("dotenv").config();

module.exports = async (request) => {
    const { authorization } = request.req.headers;

    const secret = process.env.JWT_SECRET;

    if (!authorization) {
        return {
            message: "Authorization header not present",
            isAuth: false,
        };
    }

    //Getting token from the authorization bearer
    const token = authorization.replace("Bearer ", "");

    try {
        //Verifying token for accessing protected pages
        const user = jwt.verify(token, secret);

        const { _id } = user;

        console.log(_id, "id");

        return {
            isAuth: true,
            _id,
            message: "Authenticated",
        };
    } catch (e) {
        return {
            isAuth: false,
            message: "Not authenticated to access this resouce",
        };
    }
};
