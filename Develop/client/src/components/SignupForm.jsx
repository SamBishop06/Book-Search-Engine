// Importing necessary hooks and components from React and React Bootstrap
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from "../graphql/mutations";
import Auth from "../utils/auth";

// SignupForm component for user registration
const SignupForm = () => {
  // Set initial form state
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // Set state for form validation
  const [validated] = useState(false);
  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // Declare the addUser mutation
  const [addUser, { error }] = useMutation(ADD_USER);

  // Effect to handle errors from the addUser mutation
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  // Function to handle input change in the form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check form validity
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Call the addUser mutation
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      // Log in the user after successful registration
      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }

    // Reset form data after submission
    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      {/* Signup form */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert for displaying errors */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>
        {/* Form fields */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            id='username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            autoComplete='username' // Autocomplete attribute
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email'
            id='email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            autoComplete='email' // Autocomplete attribute
            required
          />
          <Form.Control.Feedback type='invalid'>Please provide a valid email!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            id='password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            autoComplete='new-password' // Autocomplete attribute
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        {/* Submit button */}
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

// Exporting the SignupForm component
export default SignupForm;
