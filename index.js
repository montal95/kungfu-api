const { ApolloServer, gql} = require('apollo-server');

//Schema IS the type definition
const typeDefs = gql`
    type Movie {
        title: String
        releaseDate: String
        rating: Int
    }
`;

//Seed Data
const movies = [
    {
        title: "5 Deadly Venoms",
        releaseDate: "10-10-1983", 
        rating: 5
    },
    {
        title: "Enter the Dragon",
        releaseDate: "8-19-1973", 
        rating: 9
    }
]