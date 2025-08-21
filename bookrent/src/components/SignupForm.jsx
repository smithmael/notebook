import React, { useState } from 'react';
import AuthLayout from '../layout/AuthLayout';
import { FormControlLabel, Checkbox } from '@mui/material';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [terms, setTerms] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add Signup logic here
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!terms) {
      alert("Accept terms and conditions!");
      return;
    }
    alert("Signup Successful!"); // Replace with API call in real app
  };

  const formFields = [
    {
      id: 'email',
      label: 'Email Address',
      name: 'email',
      type: 'email',
      autoComplete: 'email',
      autoFocus: true,
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      id: 'password',
      label: 'Password',
      name: 'password',
      type: 'password',
      autoComplete: 'current-password',
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
    {
      id: 'confirmPassword',
      label: 'Confirm Password',
      name: 'confirmPassword',
      type: 'password',
      autoComplete: 'current-password',
      value: confirmPassword,
      onChange: (e) => setConfirmPassword(e.target.value),
    },
    {
      id: 'location',
      label: 'Location',
      name: 'location',
      type: 'text',
      value: location,
      onChange: (e) => setLocation(e.target.value),
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      name: 'phoneNumber',
      type: 'tel',
      value: phoneNumber,
      onChange: (e) => setPhoneNumber(e.target.value),
    },
    {
      id: 'name',
      label: 'name',
      name: 'name',
      type: 'text',
      value: name,
      onChange: (e) => setName(e.target.value),
    },
  ];

  return (
    <AuthLayout title="Signup as Owner" onSubmit={handleSubmit} formFields={formFields}>
      <FormControlLabel
        control={<Checkbox value="acceptTerms" color="primary" checked={terms} onChange={(e) => setTerms(e.target.checked)} />}
        label="I accept the Terms and Conditions"
      />
    </AuthLayout>
  );
}

export default SignupForm;