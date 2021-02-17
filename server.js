const dotenv = require("dotenv");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require("./src/schema");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const logger = require("./config/winston");
const requireLogin = require("./middleware/requireLogin");

dotenv.config({
    path: ".env",
});

const uri = process.env.MONGO_URI;

const app = express();

const options = {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose
    .connect(uri, options)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(err);
    });

const server = new ApolloServer({
    schema,
    context: requireLogin,
    logger,
    tracing: true,
    plugins: [
        {
            requestDidStart() {
                return {
                    didEncounterErrors(requestContext) {
                        requestContext.logger.error(requestContext.errors);
                    },
                };
            },
        },
    ],
    introspection: true,
    playground: true,
});

app.use(cors());
app.use(bodyparser.json());
app.use(morgan("combined", { stream: logger.stream }));

//Applying middlewares like body parser and cors
server.applyMiddleware({
    app,
    path: "/",
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(
        `Apollo server listening at http://localhost:5000${server.graphqlPath}`
    );
});
