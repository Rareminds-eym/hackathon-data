import React from 'react';
import { Zap } from 'lucide-react';

const InstructionsTab: React.FC = () => (
  <div className="mt-4 backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 rounded-3xl p-8 shadow-2xl" id="instructions">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-500/20 rounded-lg">
        <Zap className="text-blue-400" size={24} />
      </div>
      <h3 className="text-2xl font-semibold text-blue-100">How to Use</h3>
    </div>
    <ol className="list-decimal list-inside space-y-4 text-blue-200 leading-relaxed">
      <li className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">1</span>
        <span>Add your Supabase project credentials using the form above</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">2</span>
        <span>The system will validate the connection and check for required tables</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">3</span>
        <span>
          Required tables: 
          <code className="ml-2 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">individual_attempts</code>
          <code className="ml-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">attempt_details</code>
          <code className="ml-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">teams</code>
        </span>
      </li>
      <li className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">4</span>
        <span>Click "Export All Tables as ZIP" to download CSV files from all projects</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">5</span>
        <span>
          Files will be named as: 
          <code className="ml-2 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">
            projectname_tablename.csv
          </code>
        </span>
      </li>
    </ol>
  </div>
);

export default InstructionsTab;
