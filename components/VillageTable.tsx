'use client';

interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  population: number;
  createdAt: string;
}

interface VillageTableProps {
  villages: Village[];
  onDelete: (id: string) => void;
}

const VillageTable = ({ villages, onDelete }: VillageTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-separate border-spacing-0">
        <thead className="bg-slate-100 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
          <tr>
            <th className="px-4 py-3">Village</th>
            <th className="px-4 py-3">District</th>
            <th className="px-4 py-3">State</th>
            <th className="px-4 py-3">Population</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {villages.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                No villages found for the current filter.
              </td>
            </tr>
          ) : (
            villages.map((village) => (
              <tr key={village.id} className="border-t border-slate-200">
                <td className="px-4 py-4 text-sm font-medium text-slate-900">{village.name}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{village.district}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{village.state}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{village.population.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{new Date(village.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(village.id)}
                    className="rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VillageTable;
