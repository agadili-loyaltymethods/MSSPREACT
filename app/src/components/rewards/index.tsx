
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RewardsWallet } from '../rewards-wallet';
import { EarnedBenefits } from '../earned-benefits';
import { Offers } from '../offers';
import { ClippableCoupons } from '../clippable-coupons';
import { Quiz } from '../quiz';
import { Reward } from '@/types/enums';

export function Rewards() {
  const [selectedTab, setSelectedTab] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Handle fragment changes
    const fragment = location.hash.slice(1);
    if (fragment) {
      const tabIndex = Object.values(Reward).findIndex(tab => tab === fragment);
      setSelectedTab(tabIndex > -1 ? tabIndex : 0);
    }
  }, [location.hash]);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    const tabValue = Object.values(Reward)[index];
    window.location.hash = tabValue;
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="flex flex-col items-center w-[1300px]">
          <div className="w-full mt-5 flex justify-center">
            <div className="flex gap-4">
              {Object.values(Reward).map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(index)}
                  className={`
                    px-6 py-2 rounded-lg transition-colors
                    ${selectedTab === index 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full mt-5">
            {selectedTab === 0 && <RewardsWallet />}
            {selectedTab === 1 && <EarnedBenefits />}
            {selectedTab === 2 && <Offers />}
            {selectedTab === 3 && <ClippableCoupons />}
            {selectedTab === 4 && <Quiz />}
          </div>
        </div>
      </div>
    </div>
  );
}
