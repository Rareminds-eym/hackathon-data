import React from 'react';

const InstructionsScreen: React.FC = () => (
  <div className="max-w-2xl mx-auto mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
    <h3 className="font-semibold text-blue-900 mb-3">How to Use</h3>
    <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
      <li>Add your Supabase project credentials using the form above</li>
      <li>The system will validate the connection and check for required tables</li>
      <li>Required tables: <code>individual_attempts</code>, <code>attempt_details</code>, <code>teams</code></li>
      <li>Click "Export All Tables as ZIP" to download CSV files from all projects</li>
      <li>Files will be named as: <code>projectname_tablename.csv</code></li>
    </ol>
  </div>
);

export default InstructionsScreen;
