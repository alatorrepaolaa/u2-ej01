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

// Creación de arreglo de prestamos
const loans = [
  { id: "1", userId: "1", bookId: "1", dueDate: "2024-07-01", returned: false },
  { id: "2", userId: "2", bookId: "2", dueDate: "2024-06-15", returned: true }
];

// Creación de arreglo de Usuarios
const users = [
  { id: "1", name: "Paola", email: "paola@gmail.com.com" },
  { id: "2", name: "Elizabeth", email: "elizabeth@gmail.com" }
];

//Array Libros 
const books = [
  { id: "1", title: "Guía del autoestopista galáctico", authorId: "1" },
  { id: "2", title: "1984", authorId: "2" }
];

const resolvers = {
  Query: {
    allAuthors: () => authors,
    getAuthor: (parent, { id }) => authors.find(author => author.id === id),
    allBooks: () => books,
    allUsers: () => users,
    allLoans: () => loans.map(loan => ({
      ...loan,
      user: users.find(user => user.id === loan.userId),
      book: {
        ...books.find(book => book.id === loan.bookId),
        author: authors.find(author => author.id === books.find(book => book.id === loan.bookId).authorId),
      },
    })),
  },
  Book: {
    author: (parent) => authors.find(author => author.id === parent.authorId)
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
    },
    createLoan: (parent, { userId, bookId, dueDate }) => {
      const user = users.find(user => user.id === userId);
      const book = books.find(book => book.id === bookId);

      if (!user) {
        throw new Error('User not found');
      }
      if (!book) {
        throw new Error('Book not found');
      }

      const newLoan = {
        id: (loans.length + 1).toString(),
        user,
        book,
        dueDate,
        returned: false
      };

      loans.push(newLoan);
      return newLoan;
    },
    returnBook: (parent, { loanId }) => {
      const loanIndex = loans.findIndex(loan => loan.id === loanId);
      if (loanIndex === -1) {
        throw new Error('Loan not found');
      }
      loans[loanIndex].returned = true;
      const loan = loans[loanIndex];
      return {
        ...loan,
        user: users.find(user => user.id === loan.userId),
        book: {
          ...books.find(book => book.id === loan.bookId),
          author: authors.find(author => author.id === books.find(book => book.id === loan.bookId).authorId),
        },
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs: gql(schema), // Uso del esquema GraphQL leído del archivo
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Servidor corriendo en ${url}`);
});
