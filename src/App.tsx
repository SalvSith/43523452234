import React from 'react';
import PricingDeposit from './components/PricingDeposit';

function App() {
  return (
    <div className="w-full">
      {/* Single container that works for both mobile and desktop */}
      <div className="w-full max-w-[402px] md:max-w-2xl mx-auto">
        <PricingDeposit />
      </div>
    </div>
  );
}

export default App; 