
import { useEffect, useState } from 'react';
import { useActivityService } from '@/lib/hooks/useActivityService';
import { useToast } from '@/lib/hooks/useToast';
import { formatters } from '@/lib/utils/formatters';
import { Loader } from '../loader';
import { NoData } from '../common/no-data';

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const staticDate = new Date('10/11/2024');
  const { getActivity } = useActivityService();
  const { showError } = useToast();

  useEffect(() => {
    getCoupons();
  }, []);

  const getCoupons = async () => {
    try {
      const response = await getActivity();
      setCampaigns(response.data);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!campaigns.length) {
    return <NoData>No Campaigns available.</NoData>;
  }

  return (
    <div className="flex flex-col mt-5">
      <h3 className="mt-0">Available Campaigns ({campaigns.length})</h3>
      <div className="flex gap-5">
        <div className="flex-1 flex flex-wrap gap-2.5">
          {campaigns.map((campaign, index) => (
            <div key={index} className="flex-[0_0_30%]">
              <div className="border border-gray-200 rounded bg-white">
                <div className="flex flex-col gap-7.5 p-5">
                  <div className="flex items-center justify-center gap-2.5">
                    <img src="/assets/icons/nordy-cash.png" alt="Campaign" />
                    <div className="flex flex-col items-start gap-2.5">
                      <h2 className="text-primary">{campaign.name}</h2>
                      <div className="line-height-adjust">{campaign.desc}</div>
                      {campaign.expirationDate && (
                        <small className="text-gray-500 line-height-adjust">
                          Expires {formatters.checkExpiry(staticDate)}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <button 
                      className="w-full border-2 border-primary text-primary rounded py-2 hover:bg-primary hover:text-white transition-colors"
                    >
                      Redeem Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
