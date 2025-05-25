import React from 'react';

interface BattlePassPageProps {
  onBack?: () => void;
}

const BattlePassPage: React.FC<BattlePassPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Battle Pass</h1>
          <p className="text-lg opacity-80">Coming Soon - Under Development</p>
          {onBack && (
            <button 
              onClick={onBack}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlePassPage;
