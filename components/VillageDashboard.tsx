'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AddVillageForm from './AddVillageForm';
import FilterControls from './FilterControls';
import VillageTable from './VillageTable';

interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  population: number;
  createdAt: string;
}

const DEFAULT_LIMIT = 10;

const VillageDashboard = () => {
  const [villages, setVillages] = useState<Village[]>([]);
  const [stateFilter, setStateFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (stateFilter) params.append('state', stateFilter);
    if (search) params.append('search', search);
    params.append('page', String(page));
    params.append('limit', String(DEFAULT_LIMIT));
    return params.toString();
  }, [stateFilter, search, page]);

  const fetchVillages = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/villages?${query}`);
      const villages = await response.json();

      if (!response.ok) {
        const body = villages as { error?: string };
        throw new Error(body?.error || 'Unable to load villages.');
      }

      setVillages(villages);
      setTotal(Array.isArray(villages) ? villages.length : 0);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unknown error';
      setError(message);
      setVillages([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchVillages();
  }, [fetchVillages]);

  const handleRefresh = () => {
    fetchVillages();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this village record?');
    if (!confirmed) return;

    try {
      const response = await fetch('/api/villages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Failed to delete village.');
      }

      handleRefresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unknown error';
      setError(message);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / DEFAULT_LIMIT));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <FilterControls
            stateFilter={stateFilter}
            search={search}
            onStateChange={(value) => {
              setStateFilter(value);
              setPage(1);
            }}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Village records</h2>
                <p className="mt-1 text-sm text-slate-500">Showing filtered village data with pagination.</p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="h-11 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Refresh
              </button>
            </div>

            <div className="mt-6">
              {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
              <VillageTable villages={villages} onDelete={handleDelete} />
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                {loading ? 'Loading villages...' : `Page ${page} of ${pageCount} — ${total.toLocaleString()} total records`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <AddVillageForm onAdded={() => {
          setPage(1);
          handleRefresh();
        }} />
      </div>
    </div>
  );
};

export default VillageDashboard;
