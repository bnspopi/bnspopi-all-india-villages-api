'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

interface AddVillageFormProps {
  onAdded: () => void;
}

const initialForm = {
  name: '',
  district: '',
  state: '',
  population: '',
};

const AddVillageForm = ({ onAdded }: AddVillageFormProps) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const payload = {
      name: form.name.trim(),
      district: form.district.trim(),
      state: form.state.trim(),
      population: Number(form.population),
    };

    if (!payload.name || !payload.district || !payload.state || !payload.population) {
      setError('Please complete all fields before adding a village.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/villages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Could not add village.');
      }

      setForm(initialForm);
      onAdded();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unknown error';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Add Village</h2>
      <p className="mt-1 text-sm text-slate-500">Create a new village record in the database.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Village Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="Rampur"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">District</span>
          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="Hardoi"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">State</span>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          >
            <option value="">Select state</option>
            <option>Uttar Pradesh</option>
            <option>Maharashtra</option>
            <option>West Bengal</option>
            <option>Bihar</option>
            <option>Odisha</option>
            <option>Tamil Nadu</option>
            <option>Karnataka</option>
            <option>Rajasthan</option>
            <option>Gujarat</option>
            <option>Telangana</option>
            <option>Punjab</option>
            <option>Himachal Pradesh</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Population</span>
          <input
            name="population"
            value={form.population}
            onChange={handleChange}
            type="number"
            min="0"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="13200"
          />
        </label>

        <div className="sm:col-span-2">
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? 'Adding village...' : 'Add Village'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddVillageForm;
