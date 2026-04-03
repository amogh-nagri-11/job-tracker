import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [show, setShow] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirm)
        return setError('Passwords do not match');

        if (password.length < 6)
        return setError('Password must be at least 6 characters');

        try {
        const token = searchParams.get('token');
        const { data } = await api.post('/api/auth/reset-password', { token, password });
        setMessage(data.message);
        setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
        setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="auth-container">
        <h2>Reset Password</h2>
        {error && <p className="error">{error}</p>}
        {message && (
            <p style={{ color: '#22c55e', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
            {message}
            </p>
        )}
        <form onSubmit={handleSubmit}>
            <div className='password-wrapper'>
                <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <span
                    className="eye"
                    onClick={()=>setShow(s=>!s)}
                >
                    {show ? <FiEyeOff/> : <FiEye/>}
                </span>
            </div>
            <div className='password-wrapper'>
                <input
                type={show ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                />
                <span
                    className="eye"
                    onClick={()=>setShow(s=>!s)}
                >
                    {show ? <FiEyeOff/> : <FiEye/>}
                </span>
            </div>
            <button type="submit">Reset Password</button>
        </form>
        </div>
    );
}