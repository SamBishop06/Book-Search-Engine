// const express = require('express');
// const path = require('path');
// const db = require('./config/connection');
// const routes = require('./routes');
// // Importing the authMiddleware function
// const { authMiddleware } = require('./utils/auth');

// // Importing the ApolloServer 
// // Importing the expressMiddleware function
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express');

// // Import the two parts of a GraphQL schema
// const { typeDefs, resolvers } = require('./schemas');


// const app = express();
// const PORT = process.env.PORT || 3001;

// // Setting up GraphQL server using Apollo server
// const apolloServer = new ApolloServer({
//   typeDefs,
//   resolvers,
//   introspection: true,
//   cache: "bounded",
//   context: authMiddleware,
// })

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Setting up middleware for GraphQL endpoint with Apollo Server
// app.use('/graphql', expressMiddleware(server, {
//   context: authMiddleware // Adding authentication middleware to the GraphQL context
// }));

// // Handling routes for production environment
// if (process.env.NODE_ENV === 'production') {
//   // Serving static files from the client build directory
//   app.use(express.static(path.join(__dirname, '../client/dist')));
  
//   // Handling all other routes by serving the index.html file
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//   });
// }

// // Listening for database connection to open before starting the server
// db.once('open', () => {
//   // Starting the server on the specified port
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//   });
// });

// // Call the async function to start the server
// startApolloServer();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
  startApolloServer();
