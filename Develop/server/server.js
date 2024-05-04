const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// Importing the authMiddleware function
const { authMiddleware } = require('./utils/auth');

// Importing the ApolloServer 
// Importing the expressMiddleware function
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express');

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Setting up GraphQL server using Apollo server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  cache: "bounded",
  context: authMiddleware,
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting up middleware for GraphQL endpoint with Apollo Server
app.use('/graphql', expressMiddleware(server, {
  context: authMiddleware // Adding authentication middleware to the GraphQL context
}));

// Handling routes for production environment
if (process.env.NODE_ENV === 'production') {
  // Serving static files from the client build directory
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handling all other routes by serving the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Listening for database connection to open before starting the server
db.once('open', () => {
  // Starting the server on the specified port
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});

// Call the async function to start the server
startApolloServer();
