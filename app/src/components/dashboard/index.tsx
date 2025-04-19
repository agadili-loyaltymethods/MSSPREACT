```tsx
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useActivityService } from '@/lib/hooks/useActivityService';
import { useToast } from '@/lib/hooks/useToast';
import { MemberWidget } from './member-widget';
import { TierStatusWidget } from './tier-status-widget';
import { PointsBalanceWidget } from './points-balance-widget';
import { TierBenefits } from './tier-benefits';
import { EncoreRewards } from './encore-rewards';
import { CardSkeleton } from '../card-skeleton';

export function Dashboard() {
  const [widgetData, setWidgetData] = useState<any[]>([]);
  const [widgetSkeleton, setWidgetSkeleton] = useState(true);
  const [streakSkeleton, setStreakSkeleton] = useState(true);
  const [providerPoints, setProviderPoints] = useState<any[]>([]);

  const memberInfo = useAppSelector(state => state.member);
  const { getActivity } = useActivityService();
  const { showError } = useToast();

  useEffect(() => {
    if (Object.keys(memberInfo).length) {
      setWidgetSkeleton(true);
      setStreakSkeleton(true);
      getWidgetData();
      getPurseValues();
    }
  }, [memberInfo]);

  const getPurseValues = () => {
    if (memberInfo) {
      setProviderPoints(
        memberInfo.purses
          .filter(purse => !purse.name.includes('Status'))
          .map(purse => ({
            provider: purse.name,
            balance: purse.availBalance
          }))
      );
    }
  };

  const getWidgetData = async () => {
    try {
      const response = await getActivity();
      setWidgetData(response.data);
      setWidgetSkeleton(false);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
      setWidgetData([]);
      setWidgetSkeleton(false);
    }
  };

  if (widgetSkeleton) {
    return (
      <div className="flex flex-row gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-[0_0_50%]">
            <CardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-[1300px] p-5">
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <MemberWidget memberInfo={memberInfo} />
            
            {widgetData.map((widget, index) => (
              index < 2 && (
                <TierStatusWidget 
                  key={index}
                  widget={widget}
                  isEncore={index === 0}
                />
              )
            ))}
            
            <PointsBalanceWidget providerPoints={providerPoints} />
          </div>

          <div className="flex gap-5">
            <TierBenefits 
              benefits={widgetData[2]?.tierBenefits}
              isLoading={widgetSkeleton}
            />
            
            <EncoreRewards 
              isLoading={streakSkeleton}
              setStreakSkeleton={setStreakSkeleton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```