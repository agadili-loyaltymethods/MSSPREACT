```tsx
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useToast } from '@/lib/hooks/useToast';
import { useMemberService } from '@/lib/hooks/useMemberService';
import { CardMiniSkeleton } from '../card-mini-skeleton';
import { NoData } from '../common/no-data';
import { formatters } from '@/lib/utils/formatters';

export function EarnedBenefits() {
  const [isLoading, setIsLoading] = useState(true);
  const [memberBenefits, setMemberBenefits] = useState<any[]>([]);
  const staticDate = new Date('10/11/2024');

  const memberInfo = useAppSelector(state => state.member);
  const location = useAppSelector(state => state.location.location);
  const { getMemberOffers } = useMemberService();
  const { showError } = useToast();

  useEffect(() => {
    if (memberInfo._id) {
      getOffers();
    }
  }, [memberInfo, location]);

  const getOffers = async () => {
    try {
      const [promo, globalOffers] = await Promise.all([
        getMemberOffers(memberInfo._id, location.number ?? location),
        getMemberOffers(memberInfo._id, location.number ?? location)
      ]);

      setMemberBenefits([
        ...promo, 
        ...globalOffers.filter((offer: any) => !offer.ext?.isPerk && !offer.ext?.isBenefit)
      ]);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12.5">
        <CardMiniSkeleton />
      </div>
    );
  }

  if (!memberBenefits.length) {
    return <NoData>No Benefits available.</NoData>;
  }

  return (
    <div className="flex flex-col mt-5">
      <h3 className="mt-0">Available Member Benefits ({memberBenefits.length})</h3>
      <div className="flex gap-5">
        <div className="m-0 flex-1 flex flex-wrap gap-2.5">
          {memberBenefits.map((benefit, index) => (
            <div key={index} className="flex-[0_0_50%]">
              <div className="border border-gray-200 rounded bg-white">
                <div className="flex items-center gap-2.5 p-5 h-[140px]">
                  <div className="w-[100px] border-r border-dashed border-gray-300 pr-5">
                    <img src="/assets/bclc-logo.png" alt="BCLC Logo" />
                  </div>
                  <div className="flex justify-between items-start flex-1 w-[500px]">
                    <div className="flex flex-col gap-2.5 flex-[77%]">
                      <h3 className="mt-2.5 line-clamp-2">{benefit.name}</h3>
                      <p className="m-0 line-clamp-2">{benefit.desc}</p>
                      {benefit.expirationDate && (
                        <small className="text-gray-500 leading-snug line-clamp-2">
                          Expires {formatters.checkExpiry(benefit.expirationDate)}
                        </small>
                      )}
                    </div>
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
```