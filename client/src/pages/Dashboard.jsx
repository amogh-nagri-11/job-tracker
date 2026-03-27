import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import AddJobForm from '../components/AddJobForm';

const STATUSES = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [mailSettings, setMailSettings] = useState(null);
    const [mailMessage, setMailMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const [jobsResponse, mailResponse] = await Promise.all([
                api.get('/api/jobs/'),
                api.get('/api/mail/settings'),
            ]);

            setJobs(jobsResponse.data);
            setMailSettings(mailResponse.data);
        };

        fetchDashboardData(); 
    }, []);

    const filtered = Array.isArray(jobs)
        ? (filter === 'All' ? jobs : jobs.filter(j => j.status === filter))
        : [];

    const updateStatus = async (id, status) => {
        await api.patch(`/api/jobs/${id}`, { status });
        setJobs(prev => prev.map(j => j._id === id ? { ...j, status } : j));
    };

    const deleteJob = async (id) => {
        await api.delete(`/api/jobs/${id}`);
        setJobs(prev => prev.filter(j => j._id !== id));
    };

    const editJob = async (id, data) => {
        await api.patch(`/api/jobs/${id}`, data); 
        setJobs(prev => prev.map(j => j._id === id ? { ...j, ...data } : j)); 
    };

    const addJob = (newJob) => {
        setJobs(prev => [newJob, ...prev]);
        setShowForm(false);
    }; 

    const toggleMailTracking = async () => {
        const response = await api.patch('/api/mail/settings', {
            enabled: !mailSettings?.enabled,
        });
        setMailSettings(response.data);
        setMailMessage(response.data.enabled ? 'Email tracking is on.' : 'Email tracking is paused.');
    };

    const sendSetupEmail = async () => {
        const response = await api.post('/api/mail/send-setup-email');
        setMailMessage(response.data.message);
    };

    return (
        <div className="dashboard">
        <header>
            <h1>Job Tracker</h1>
            <span>Hi, {user?.name}</span>
            <button onClick={logout}>Logout</button>
        </header>

        <section className="mail-tracking-card coming-soon">
            <div>
                <p className="mail-tracking-eyebrow">Upcoming Feature</p>
                <h2>Email Auto-Tracking</h2>
                <p className="mail-tracking-copy">
                    Automatically track recruiter emails and update your job board.
                    This feature is currently under development and will be available soon.
                </p>
            </div>

            <div className="coming-soon-badge">
                Coming Soon
            </div>

            <div className="mail-tracking-actions">
                <button className="btn-disabled" disabled>
                    Send setup email
                </button>
                <button className="btn-disabled" disabled>
                    Enable tracking
                </button>
            </div>
        </section>

        <div className="filters">
            {STATUSES.map(s => (
            <button
                key={s}
                className={filter === s ? 'active' : ''}
                onClick={() => setFilter(s)}
            >
                {s}
            </button>
            ))}
        </div>

        <button
            className="btn-add"
            onClick={() => setShowForm(!showForm)}
        >
            {showForm ? '✕ Cancel' : '+ Add Job'}
        </button>

        {showForm && (
            <AddJobForm onAdd={addJob} />
        )}

        <div className="job-list">
            {filtered.map(job => (
            <JobCard
                key={job._id}
                job={job}
                onStatusChange={updateStatus}
                onDelete={deleteJob}
                onEdit={editJob}
            />
            ))}
        </div>
        </div>
    );
}
