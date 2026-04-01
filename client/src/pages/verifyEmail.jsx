import { useSearchParams, Link} from 'react-router-dom';
import api from '../api/axios'; 
import { useState, useEffect } from 'react';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams(); 
    const [status, setStatus] = useState("Verifying your email..."); 
    const [success, setSuccess] = useState(false); 

    useEffect(() => {
        const verify = async () => {
            try {
                const token = searchParams.get('token');
                console.log('token ', token);
                const data = await api.get(`/api/auth/verify/${token}`); 
                setStatus(data.message); 
                setSuccess(true); 
            } catch (err) {
                console.log(err.message);
                setStatus(err.response?.data?.message || "Verification failed" ); 
                setSuccess(false); 
            }
        };
        verify();
    }, [searchParams]);
    
    return (
    <div className="auth-container">
      <h2>Email Verification</h2>
      <p style={{ color: success ? '#22c55e' : '#ef4444', margin: '1rem 0' }}>
        {status}
      </p>
      {success && <Link to="/login">Go to Login →</Link>}
    </div>
    );
}; 