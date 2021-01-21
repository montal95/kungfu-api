const { ApolloServer, gql } = require("apollo-server");

//Schema IS the type definition
// Everything in the backticks is GraphQL syntax and not JS
const typeDefs = gql`
  type Movie {
    title: String
    releaseDate: String
    rating: Int
  }

  type Query {
    movies: [Movie]
  }
`;

//Seed Data
const movies = [
  {
    title: "5 Deadly Venoms",
    releaseDate: "10-10-1983",
    rating: 5,
  },
  {
    title: "Enter the Dragon",
    releaseDate: "8-19-1973",
    rating: 9,
  },
];

const resolvers = {
  Query: {
    movies: () => {
      return movies;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});