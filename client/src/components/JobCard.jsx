const STATUS_COLORS = {
  Applied: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#22c55e',
  Rejected: '#ef4444',
};

export default function JobCard({ job, onStatusChange, onDelete }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.company}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: STATUS_COLORS[job.status] }}
        >
          {job.status}
        </span>
      </div>
      <p>{job.role}</p>
      {job.notes && <p className="notes">{job.notes}</p>}
      <p className="date">{new Date(job.appliedDate).toLocaleDateString()}</p>
      <div className="job-card-actions">
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job._id, e.target.value)}
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <button onClick={() => onDelete(job._id)}>Delete</button>
      </div>
    </div>
  );
}