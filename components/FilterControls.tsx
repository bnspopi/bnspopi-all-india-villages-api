'use client';

interface FilterControlsProps {
  stateFilter: string;
  search: string;
  onStateChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

const states = [
  '',
  'Uttar Pradesh',
  'Maharashtra',
  'West Bengal',
  'Bihar',
  'Odisha',
  'Tamil Nadu',
  'Karnataka',
  'Rajasthan',
  'Gujarat',
  'Telangana',
  'Punjab',
  'Himachal Pradesh',
];

const FilterControls = ({ stateFilter, search, onStateChange, onSearchChange }: FilterControlsProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Filter by state</span>
          <select
            value={stateFilter}
            onChange={(event) => onStateChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          >
            {states.map((stateOption) => (
              <option key={stateOption} value={stateOption}>
                {stateOption || 'All states'}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Search by village or district</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rampur, Hardoi, etc."
            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </label>
      </div>
    </div>
  );
};

export default FilterControls;
