import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
        const { data } = await api.post('/api/auth/forgot-password', { email });
        setMessage(data.message);
        } catch (err) {
        setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="auth-container">
        <h2>Forgot Password</h2>
        {error && <p className="error">{error}</p>}
        {message && (
            <p style={{ color: '#22c55e', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
            {message}
            </p>
        )}
        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <button type="submit">Send Reset Link</button>
        </form>
        <p>Remember your password? <Link to="/login">Login</Link></p>
        </div>
    );
}