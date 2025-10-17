export function LoadingState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  );
}