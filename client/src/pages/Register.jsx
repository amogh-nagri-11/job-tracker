import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [show, setShow]=useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setMessage('');
    try {
      const { data } = await api.post('/api/auth/register', form);
      setMessage(data.message); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {message && (
        <p style={{ color: '#22c55e', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div className="password-wrapper">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <span
            className="eye"
            onClick={()=>setShow(s=>!s)}
          >
            {show ? <FiEyeOff/> : <FiEye/>}
          </span>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}