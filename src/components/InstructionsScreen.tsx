import React from 'react';
import { BookOpen, Database, CheckCircle, Download, FileText } from 'lucide-react';

const InstructionsScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    
    <div className="relative z-10 max-w-4xl mx-auto py-12">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/25">
            <BookOpen className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">How to Use</h1>
            <p className="text-slate-600">Complete guide to using the Supabase CSV Exporter</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white/60 rounded-2xl border border-white/20">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">1</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                  <Database size={20} />
                  Add Projects
                </h3>
                <p className="text-slate-600 leading-relaxed">Add your Supabase project credentials using the form. The system will validate your connection automatically.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/60 rounded-2xl border border-white/20">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">2</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Validation
                </h3>
                <p className="text-slate-600 leading-relaxed">The system will check your connection and verify that all required tables exist in your database.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/60 rounded-2xl border border-white/20">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">3</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Required Tables</h3>
                <p className="text-slate-600 mb-3">Your database must contain these tables:</p>
                <div className="space-y-2">
                  <code className="block px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono text-sm">individual_attempts</code>
                  <code className="block px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono text-sm">attempt_details</code>
                  <code className="block px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono text-sm">teams</code>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white/60 rounded-2xl border border-white/20">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">4</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                  <Download size={20} />
                  Export Data
                </h3>
                <p className="text-slate-600 leading-relaxed">Click "Export All Tables as ZIP" to download CSV files from all your connected projects at once.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/60 rounded-2xl border border-white/20">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">5</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                  <FileText size={20} />
                  File Organization
                </h3>
                <p className="text-slate-600 mb-3 leading-relaxed">Files are automatically organized and named using this pattern:</p>
                <code className="block px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono text-sm">
                  projectname_tablename.csv
                </code>
              </div>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
              <h3 className="font-bold text-blue-800 text-lg mb-2">💡 Pro Tips</h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• Make sure your database credentials have read access to all required tables</li>
                <li>• The export process may take a few moments for large datasets</li>
                <li>• You can add multiple projects and export them all at once</li>
                <li>• All data is exported in CSV format for easy analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default InstructionsScreen;