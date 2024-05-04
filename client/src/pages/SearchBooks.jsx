// Importing useState hook from React
import { useState } from 'react';
// Importing necessary components from React Bootstrap
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
// Importing API functions for searching and saving books
import { searchGoogleBooks, saveBook } from '../utils/API';

// SearchBooks component to handle book search functionality and display search results
const SearchBooks = () => {
  // State variables for search term and search results
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle book search
  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      // Search for books using the search term
      const response = await searchGoogleBooks(searchTerm);
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  // Function to handle saving a book
  const handleSaveBook = async (bookData) => {
    try {
      // Save the book using the saveBook function
      await saveBook(bookData);
      // Optionally, update UI to indicate successful save
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <>
      {/* Form for searching books */}
      <Form onSubmit={handleSearch}>
        <Row>
          <Col xs={12} md={8}>
            <Form.Control
              type='text'
              size='lg'
              placeholder='Search for a book'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={12} md={4}>
            {/* Button to submit the search */}
            <Button type='submit' variant='success' size='lg'>
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Displaying search results */}
      <Container>
        <h2 className='pt-5'>
          {searchResults.length ? `Viewing ${searchResults.length} results:` : 'No results found'}
        </h2>
        {/* Displaying each search result as a card */}
        <Row>
          {searchResults.map((book) => (
            <Col md='4' key={book.id}>
              {/* Card to display book information */}
              <Card>
                {/* Displaying book cover image if available */}
                {book.volumeInfo.imageLinks && (
                  <Card.Img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={`The cover for ${book.volumeInfo.title}`}
                    variant='top'
                  />
                )}
                <Card.Body>
                  {/* Displaying book title */}
                  <Card.Title>{book.volumeInfo.title}</Card.Title>
                  {/* Displaying book authors */}
                  <p className='small'>Authors: {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>                  
                  {/* Displaying book description */}
                  <Card.Text>{book.volumeInfo.description}</Card.Text>
                  {/* Button to save the book */}
                  <Button
                    className='btn-block btn-info'
                    onClick={() => handleSaveBook(book)}>
                    Save this Book
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

// Exporting the SearchBooks component
export default SearchBooks;
