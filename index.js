const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

//Schema IS the type definition
// Everything in the backticks is GraphQL syntax and not JS

//gql`` parses string into an AST
const typeDefs = gql`

  # fragment cannot be created in the schema. This is an example
  # fragment Meta on Movie {
  #   releaseDate
  #   rating
  # }

  scalar Date

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
    title: String!
    releaseDate: Date
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

  input ActorInput {
    id: ID
  }

  input MovieInput {
    id: ID
    title: String
    releaseDate: Date
    rating: Int
    status: Status
    actor: [ActorInput]
  }

  type Mutation {
    addMovie(movie: MovieInput): [Movie]
  }
`;

const actors = [
  {
    id: "asdf",
    name: "Philip Kwok",
  },
  {
    id: "numberOne",
    name: "Bruce Lee",
  },
  {
    id: "donnie",
    name: "Donnie Yen",
  },
  {
    id: "siu",
    name: "Siu-Wong Fan",
  },
];

//Seed Data
const movies = [
  {
    id: "1",
    title: "5 Deadly Venoms",
    releaseDate: new Date("10-10-1983"),
    rating: 5,
    actor: [
      {
        id: "asdf",
      },
    ],
  },
  {
    id: "2",
    title: "Enter the Dragon",
    releaseDate: new Date("8-19-1973"),
    rating: 9,
    actor: [
      {
        id: "numberOne",
      },
    ],
  },
  {
    id: "3",
    title: "Ip Man",
    releaseDate: new Date("10-1-2010"),
    rating: 9,
    actor: [
      {
        id: "donnie",
      },
      {
        id: "siu",
      },
    ],
  },
];

//controller for queries
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

  Movie: {
    actor: (obj, arg, context) => {
      //DB Call
      const actorIds = obj.actor.map((actor) => actor.id);
      const filteredActors = actors.filter((actor) => {
        return actorIds.includes(actor.id);
      });
      return filteredActors;
    },
  },

  Mutation: {
    addMovie: (obj, { movie }, { userId }) => {
      if (userId) return [...movies, movie];
      return movies;
    },
  },

  Date: new GraphQLScalarType({
    name: "Date",
    description: "it's a date, deal with it",
    parseValue(val) {
      //value from the client
      return new Date(val);
    },
    serialize(val) {
      //value sent to client
      return val.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.val);
      }
      return null;
    },
  }),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    const fakeUser = {
      userId: "helloImauser",
    };
    return { ...fakeUser };
  },
});

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`Server started at ${url}`);
  });
