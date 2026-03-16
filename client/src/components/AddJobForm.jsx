import { useState } from 'react';
import api from '../api/axios';

export default function AddJobForm({ onAdd }) {
  const [form, setForm] = useState({
    company: '', role: '', status: 'Applied', notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/api/jobs', form);
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="add-job-form">
      <input
        placeholder="Company"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        required
      />
      <input
        placeholder="Role"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        required
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
      <input
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      <button type="submit">Add Job</button>
    </form>
  );
}