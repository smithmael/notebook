import React, { useState } from 'react';
import AuthLayout from '../layout/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Checkbox, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState(''); // Changed from phoneNumber to phone
  const [name, setName] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!terms) return setError("Please accept terms.");

    try {
      // Call API
      await signup({ email, password, confirmPassword, location, phone, name });
      alert("Signup Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  const formFields = [
    { id: 'name', label: 'Name', type: 'text', value: name, onChange: e => setName(e.target.value) },
    { id: 'email', label: 'Email', type: 'email', value: email, onChange: e => setEmail(e.target.value) },
    { id: 'password', label: 'Password', type: 'password', value: password, onChange: e => setPassword(e.target.value) },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', value: confirmPassword, onChange: e => setConfirmPassword(e.target.value) },
    { id: 'location', label: 'Location', type: 'text', value: location, onChange: e => setLocation(e.target.value) },
    { id: 'phone', label: 'Phone', type: 'tel', value: phone, onChange: e => setPhone(e.target.value) },
  ];

  return (
    <AuthLayout title="Signup as Owner" onSubmit={handleSubmit} formFields={formFields}>
      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
      <FormControlLabel control={<Checkbox checked={terms} onChange={e => setTerms(e.target.checked)} />} label="I accept Terms" />
    </AuthLayout>
  );
}
export default SignupForm;