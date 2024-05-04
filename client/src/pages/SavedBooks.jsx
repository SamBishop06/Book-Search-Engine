import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// SavedBooks component to display saved books and handle book deletion
const SavedBooks = () => {
  // Querying current user's saved books
  const { loading, data } = useQuery(GET_ME);
  // Mutation for removing a book
  const [deleteBook] = useMutation(REMOVE_BOOK);
  // Extracting user data from query result
  const userData = data?.me || {};

  // Redirect if user not logged in
  if(!userData?.username) {
    return (
      <h4>
        You need to be logged in to see this page.
      </h4>
    );
  }

  // Function to handle book deletion
  const handleDeleteBook = async (bookId) => {
    // Get token from Auth
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Call deleteBook mutation
      await deleteBook({
        variables: {bookId: bookId},
        // Update cache after deletion
        update: cache => {
          const data = cache.readQuery({ query: GET_ME });
          const userDataCache = data.me;
          const savedBooksCache = userDataCache.savedBooks;
          const updatedBookCache = savedBooksCache.filter((book) => book.bookId !== bookId);
          data.me.savedBooks = updatedBookCache;
          cache.writeQuery({ query: GET_ME , data: {data: {...data.me.savedBooks}}})
        }
      });
      // Remove book's id from localStorage upon successful deletion
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Display loading if data isn't available yet
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/* Header */}
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        {/* Displaying saved books */}
        <h2 className='pt-5'>
          {userData.savedBooks && userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {/* Mapping through saved books and displaying each as a card */}
          {userData.savedBooks && userData.savedBooks.length > 0
            ? userData.savedBooks.map((book) => (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {/* Button to delete the book */}
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
            : <Col><p>No saved books found.</p></Col>}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
