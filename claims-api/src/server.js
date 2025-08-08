const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

// Import unified schema, resolver factory, and data source
const { createDataSource } = require('./data');
const typeDefs = require('./schema');
const createResolvers = require('./resolvers');

// Create a single data source instance
const dataSource = createDataSource();

// Create resolvers by injecting the data source
const resolvers = createResolvers(dataSource);

async function startServer() {
    const app = express();
    app.use(cors()); // Enable CORS
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();
