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

    const fetchJobs = useCallback(async () => {
        const { data } = await api.get('/api/jobs');
        setJobs(data);
    }, []);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const filtered = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);

    const updateStatus = async (id, status) => {
        await api.patch(`/api/jobs/${id}`, { status });
        fetchJobs();
    };

    const deleteJob = async (id) => {
        await api.delete(`/api/jobs/${id}`);
        fetchJobs();
    };

    return (
        <div className="dashboard">
        <header>
            <h1>Job Tracker</h1>
            <span>Hi, {user?.name}</span>
            <button onClick={logout}>Logout</button>
        </header>

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

        <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Job'}
        </button>

        {showForm && (
            <AddJobForm onAdd={() => { fetchJobs(); setShowForm(false); }} />
        )}

        <div className="job-list">
            {filtered.map(job => (
            <JobCard
                key={job._id}
                job={job}
                onStatusChange={updateStatus}
                onDelete={deleteJob}
            />
            ))}
        </div>
        </div>
    );
}