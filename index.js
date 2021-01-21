const { ApolloServer, gql } = require("apollo-server");

//Schema IS the type definition
// Everything in the backticks is GraphQL syntax and not JS
const typeDefs = gql`
  enum Status {
    WATCHED
    INTERESTED
    NOT_INTERESTED
    UNKNOWN
  }

  type Actor {
    id: ID!
    name: String!
  }

  type Movie {
    id: ID!
    title: String
    releaseDate: String
    rating: Int
    status: Status
    actor: [Actor] # Valid null, [], [...some data], X not valid
    # fake: Float
    # fake2: Boolean
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }
`;

//Seed Data
const movies = [
  {
    id: "1",
    title: "5 Deadly Venoms",
    releaseDate: "10-10-1983",
    rating: 5,
    actor: [
      {
        id: "asdf",
        name: "Philip Kwok",
      },
    ],
  },
  {
    id: "2",
    title: "Enter the Dragon",
    releaseDate: "8-19-1973",
    rating: 9,
    actor: [
      {
        id: "numberOne",
        name: "Bruce Lee",
      },
    ],
  },
];

const resolvers = {
  Query: {
    movies: () => {
      return movies;
    },

    movie: (obj, { id }, context, info) => {
      const foundMovie = movies.find((movie) => {
        return movie.id === id;
      });
      return foundMovie;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
