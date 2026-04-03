import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from '../api/axios';

export default function Profile({ onClose }) {
  const { user, login } = useAuth();
  const [tab, setTab] = useState('info');
  const [nameForm, setNameForm] = useState({ name: user?.name || '' });
  const [emailForm, setEmailForm] = useState({ email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  const reset = () => { setMessage(''); setError(''); };

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    reset();
    try {
      const { data } = await api.patch('/api/auth/profile', { name: nameForm.name });
      setMessage(data.message);
      login({ ...user, name: data.user.name });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    reset();
    try {
      const { data } = await api.patch('/api/auth/profile', { email: emailForm.email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    reset();
    if (passwordForm.newPassword !== passwordForm.confirm)
      return setError('Passwords do not match');
    try {
      const { data } = await api.patch('/api/auth/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage(data.message);
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-header">
        <h2>Profile</h2>
        <button className="profile-close" onClick={onClose}>✕</button>
      </div>

      <div className="profile-info">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <p className="profile-name">{user?.name}</p>
          <p className="profile-email">{user?.email}</p>
          <span className={`profile-badge ${user?.isVerified ? 'verified' : 'unverified'}`}>
            {user?.isVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      <div className="profile-tabs">
        {['info', 'email', 'password'].map(t => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => { setTab(t); reset(); }}
          >
            {t === 'info' ? 'Name' : t === 'email' ? 'Email' : 'Password'}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="profile-success">{message}</p>}

      {tab === 'info' && (
        <form onSubmit={handleNameUpdate} className="profile-form">
          <input
            type="text"
            placeholder="Name"
            value={nameForm.name}
            onChange={(e) => setNameForm({ name: e.target.value })}
            required
          />
          <button type="submit" className="btn-save">Update Name</button>
        </form>
      )}

      {tab === 'email' && (
        <form onSubmit={handleEmailUpdate} className="profile-form">
          <input
            type="email"
            placeholder="New email"
            value={emailForm.email}
            onChange={(e) => setEmailForm({ email: e.target.value })}
            required
          />
          <button type="submit" className="btn-save">Update Email</button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePasswordUpdate} className="profile-form">
          <div className='password-wrapper'>
            <input
              type={show1 ? 'text' : 'password'}
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          <span
            className="eye"
            onClick={()=>setShow1(s=>!s)}
          >
            {show1 ? <FiEyeOff/> : <FiEye/>}
          </span>
          </div>
          <div className='password-wrapper'>
            <input
              type={show2 ? 'text' : 'password'}
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <span
              className="eye"
              onClick={()=>setShow2(s=>!s)}
            >
              {show2 ? <FiEyeOff/> : <FiEye/>}
            </span>
          </div>
          <div className='password-wrapper'>
            <input
              type={show3 ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              required
            />
            <span
              className="eye"
              onClick={()=>setShow3(s=>!s)}
            >
              {show3 ? <FiEyeOff/> : <FiEye/>}
            </span>
          </div>
          <button type="submit" className="btn-save">Update Password</button>
        </form>
      )}
    </div>
  );
}