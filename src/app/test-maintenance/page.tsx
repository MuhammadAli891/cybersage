export default function TestMaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-300/30">
          <h1 className="text-4xl font-bold text-white mb-4">Test Page</h1>
          <p className="text-cyan-100 text-lg mb-6">
            This is a test page to verify maintenance mode is working on all pages.
          </p>
          <p className="text-cyan-200 text-sm">
            If maintenance mode is enabled, you should be redirected to /maintenance
          </p>
        </div>
      </div>
    </div>
  );
} 