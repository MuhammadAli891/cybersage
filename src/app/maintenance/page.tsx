export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-300/30">
          <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-tools text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Under Maintenance</h1>
          <p className="text-cyan-100 text-lg mb-6">
            We are currently performing maintenance. Please check back soon!
          </p>
          <div className="flex items-center justify-center space-x-4 text-cyan-200 mb-6">
            <i className="fas fa-clock"></i>
            <span>We'll be back shortly</span>
          </div>
          
          {/* Admin Access Link */}
          <div className="mt-8 pt-6 border-t border-cyan-300/30">
            <a 
              href="/admin" 
              className="text-cyan-300 hover:text-cyan-200 text-sm underline"
            >
              Admin Access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 