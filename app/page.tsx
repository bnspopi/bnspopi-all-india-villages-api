import VillageDashboard from '../components/VillageDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          All India Villages API Platform
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Browse, filter, and manage village records with serverless API routes and Prisma.
        </p>
        <div className="mt-8">
          <VillageDashboard />
        </div>
      </div>
    </main>
  );
}
