import React from 'react';
import PricingDeposit from './components/PricingDeposit';

function App() {
  return (
    <div className="w-full">
      {/* Mobile container - unchanged */}
      <div className="md:hidden w-full max-w-[402px] mx-auto">
        <PricingDeposit />
      </div>
      
      {/* Desktop container */}
      <div className="hidden md:block">
        <PricingDeposit isDesktop={true} />
      </div>
    </div>
  );
}

export default App; 