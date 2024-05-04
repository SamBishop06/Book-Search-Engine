// Importing necessary hooks and components from React and React Bootstrap
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from "../graphql/mutations";
import Auth from "../utils/auth";

// LoginForm component for user login
const LoginForm = () => {
  // Set initial form state
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  // Set state for form validation
  const [validated] = useState(false);
  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // Declare the loginUser mutation
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  // Effect to handle errors from the loginUser mutation
  useEffect(() => {
    if (error) setShowAlert(true);
    else setShowAlert(false);
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

    // Use loginUser function
    try {
      const { data } = await loginUser({
        variables: { ...userFormData },
      });

      // Log in the user after successful login
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // Reset form data after submission
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* Login form */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert for displaying errors */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        {/* Form fields */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
            autoComplete='email' // Autocomplete attribute
          />
          <Form.Control.Feedback type='invalid'>Please provide a valid email!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
            autoComplete='current-password' // Autocomplete attribute
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        {/* Submit button */}
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

// Exporting the LoginForm component
export default LoginForm;
