import { useState } from 'react';

const STATUS_COLORS = {
  Applied: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#22c55e',
  Rejected: '#ef4444',
};

export default function JobCard({ job, onStatusChange, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    company: job.company,
    role: job.role,
    notes: job.notes,
    status: job.status,
  });

  const handleSave = async () => {
    await onEdit(job._id, form);
    setEditing(false);
  };

  return (
    <>
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Job</h3>
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company"
            />
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Role"
            />
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSave}>Save</button>
              <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

        <div className="job-card">
        <div className="job-card-header">
          <div>
            <h3>{job.company}</h3>
            {job.source === 'email' && <p className="job-source">Imported from email</p>}
          </div>
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
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={() => onDelete(job._id)}>Delete</button>
        </div>
      </div>
    </>
  );
}
