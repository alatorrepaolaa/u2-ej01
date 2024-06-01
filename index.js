const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');

// Lectura del archivo de esquema GraphQL
const schema = fs.readFileSync("./schema.graphql", "utf8");

// Creación de arreglo de Autores
const authors = [
  { id: "1", name: "Douglas Adams", nationality: "British" },
  { id: "2", name: "George Orwell", nationality: "British" },
  { id: "3", name: "Harper Lee", nationality: "American" },
  { id: "4", name: "J.D. Salinger", nationality: "American" },
  { id: "5", name: "F. Scott Fitzgerald", nationality: "American" },
  { id: "6", name: "Herman Melville", nationality: "American" },
  { id: "7", name: "Jane Austen", nationality: "British" },
  { id: "8", name: "J.R.R. Tolkien", nationality: "British" },
  { id: "9", name: "J.K. Rowling", nationality: "British" },
  { id: "10", name: "Fyodor Dostoevsky", nationality: "Russian" }
];

const resolvers = {
  Query: {
    allAuthors: () => authors, // array devuelve los datos que tiene 
    getAuthor:(parent,{id})=> authors.find(author=> author.id===id) 
  },
  Mutation: {
    createAuthor: (parent, { name, nationality }) => {
      const newAuthor = {
        id: (authors.length + 1).toString(),
        name: name,
        nationality: nationality
      };
      authors.push(newAuthor);
      return newAuthor;
    },
    updateAuthor: (parent, { id, name, nationality }) => {
      const newAuthor = {
        id: (authors.length + 1).toString(),
        name,
        nationality
      };
      authors.push(newAuthor);
      return newAuthor;
    },
    updateAuthor: (parent, { id, name, nationality }) => {
      const authorIndex = authors.findIndex(author => author.id === id);
      if (authorIndex === -1) {
        throw new Error('Author not found');
      }
      if (name !== undefined) {
        authors[authorIndex].name = name;
      }
      if (nationality !== undefined) {
        authors[authorIndex].nationality = nationality;
      }
      return authors[authorIndex];
    },
    deleteAuthor: (parent, { id }) => {
      const authorIndex = authors.findIndex(author => author.id === id);
      if (authorIndex === -1) {
        throw new Error('Author not found');
      }
      const deletedAuthor = authors[authorIndex];
      authors.splice(authorIndex, 1);
      return deletedAuthor;
    }
  }
};

const server = new ApolloServer({
  typeDefs: gql(schema), // Uso del esquema GraphQL leído del archivo
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Servidor corriendo en ${url}`);
});
