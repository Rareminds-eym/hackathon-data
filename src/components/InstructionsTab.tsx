import React from 'react';
import { Zap } from 'lucide-react';

const InstructionsTab: React.FC = () => (
  <div className="mt-4 backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl" id="instructions">
    <div className="flex items-center gap-3 mb-4 md:mb-6">
      <div className="p-2 bg-blue-500/20 rounded-lg">
        <Zap className="text-blue-400" size={20} />
      </div>
      <h3 className="text-lg md:text-2xl font-semibold text-blue-100">How to Use</h3>
    </div>
    <ol className="list-decimal list-inside space-y-3 md:space-y-4 text-blue-200 leading-relaxed text-sm md:text-base">
      <li className="flex items-start gap-2 md:gap-3">
        <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-xs md:text-sm font-bold mt-0.5">1</span>
        <span>Add your Supabase project credentials using the form above</span>
      </li>
      <li className="flex items-start gap-2 md:gap-3">
        <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-xs md:text-sm font-bold mt-0.5">2</span>
        <span>The system will validate the connection and check for required tables</span>
      </li>
      <li className="flex items-start gap-2 md:gap-3">
        <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-xs md:text-sm font-bold mt-0.5">3</span>
        <div className="flex flex-col gap-2">
          <span>Required tables:</span>
          <div className="flex flex-wrap gap-1 md:gap-2">
            <code className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">individual_attempts</code>
            <code className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">attempt_details</code>
            <code className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">teams</code>
          </div>
        </div>
      </li>
      <li className="flex items-start gap-2 md:gap-3">
        <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-xs md:text-sm font-bold mt-0.5">4</span>
        <span>Click "Export All Tables as ZIP" to download CSV files from all projects</span>
      </li>
      <li className="flex items-start gap-2 md:gap-3">
        <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-xs md:text-sm font-bold mt-0.5">5</span>
        <div className="flex flex-col gap-2">
          <span>Files will be named as:</span>
          <code className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">
            projectname_tablename.csv
          </code>
        </div>
      </li>
    </ol>
  </div>
);

export default InstructionsTab;