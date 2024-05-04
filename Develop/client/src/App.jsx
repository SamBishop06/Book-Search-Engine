// Importing necessary styles and libraries

import './App.css';
import React from 'react';

// Importing ApolloProvider, ApolloClient, and InMemoryCache from Apollo Client
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Importing BrowserRouter, Route, and Routes from react-router-dom
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importing components and pages
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

// Create a new Apollo client and pass it to the ApolloProvider
const client = new ApolloClient({
  uri: '/graphql', // URI for GraphQL endpoint
  cache: new InMemoryCache(), // Creating a new cache instance
});

function App() {
  return (
    // Wrapping the entire application with ApolloProvider to make ApolloClient available to all components
    <ApolloProvider client={client}>
      <div>
        {/* Navbar component */}
        <Navbar />
        <Routes>
          {/* Route for the SearchBooks page */}
          <Route exact path="/" element={<SearchBooks />} />
          {/* Route for the SavedBooks page */}
          <Route exact path="/saved" element={<SavedBooks />} />
          {/* Route for the LoginForm component */}
          <Route exact path="/login" element={<LoginForm />} />
          {/* Route for the SignupForm component */}
          <Route exact path="/signup" element={<SignupForm />} />
        </Routes>
      </div>
    </ApolloProvider>
  );
}

// Exporting the App component
export default App;
