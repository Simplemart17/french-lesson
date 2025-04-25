require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// Define GraphQL typeDefs and resolvers
const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from French Tutor AI!',
  },
};

// Create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

async function startServer() {
  // Create Apollo Server
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      // Add authentication and context logic here
      return { req };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});