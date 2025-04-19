import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useActivityService } from '@/lib/hooks/useActivityService';
import { useToast } from '@/lib/hooks/useToast';
import { AppTimer } from '../app-timer';
import { NoData } from '../common/no-data';

interface EncoreRewardsProps {
  isLoading: boolean;
  setStreakSkeleton: (value: boolean) => void;
}

export function EncoreRewards({ isLoading, setStreakSkeleton }: EncoreRewardsProps) {
  const navigate = useNavigate();
  const [streaks, setStreaks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Active');
  
  const { getActivity } = useActivityService();
  const { showError } = useToast();
  const location = useAppSelector(state => state.location.location);
  const memberInfo = useAppSelector(state => state.member);

  const streakCategories = ['Active', 'Ended'];

  const getStreakInfo = async (isRefresh = false) => {
    try {
      const response = await getActivity({
        type: "Streak Progress",
        srcChannelType: "Web",
        srcChannelID: location,
        loyaltyID: memberInfo.loyaltyId,
        date: new Date().toISOString()
      });

      if (response.data?.streaksProgress?.length) {
        const mappedStreaks = response.data.streaksProgress.map((sp: any) => ({
          ...sp.streak,
          goalCompleted: `${sp.goals.filter((a: any) => a.status === 'Complete').length}/${sp.streak.noOfGoals}`,
          icon: getStatusIconName(sp.streak.status),
          goals: sp.goals,
          rewards: sp.streak.rewards ?? (sp.goals.length ? sp.goals.flatMap((a: any) => a.rewards) : []),
          streakId: sp.streakId
        }));

        setStreaks(mappedStreaks);
        if (!isRefresh) {
          selectStreakCategory('Active');
        }
      }
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setStreakSkeleton(false);
    }
  };

  const getStatusIconName = (status: string) => {
    switch (status) {
      case 'Complete': return 'check_circle';
      case 'Active': return 'check';
      case 'Expired': return 'warning';
      default: return 'pending';
    }
  };

  const selectStreakCategory = (category: string) => {
    setSelectedCategory(category);
    setStreaks(prev => 
      prev.filter(data => 
        category === 'Ended' 
          ? ['Complete', 'Expired'].includes(data.status)
          : data.status === 'Active'
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex-[0_0_50%] bg-white rounded-xl shadow-md p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-[0_0_50%] bg-white rounded-xl shadow-md p-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="mt-2.5 mb-5">Encore Rewards Challenges</h3>
          <button 
            onClick={() => getStreakInfo(true)}
            className="refresh-btn p-2 rounded-full hover:bg-gray-100"
          >
            <span className="material-icons">refresh</span>
          </button>
        </div>

        <div className="filter-container mb-5">
          <div className="flex gap-2">
            {streakCategories.map(category => (
              <button
                key={category}
                onClick={() => selectStreakCategory(category)}
                className={`
                  px-4 py-1 rounded-full text-sm
                  ${selectedCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}
                disabled={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!streaks.length ? (
        <div className="flex flex-col items-center justify-center p-5 text-center text-gray-500">
          {selectedCategory === 'Active' ? (
            <>
              <p>You are currently not participating in any challenges</p>
              <p>Join a challenge to start earning rewards!</p>
              <button
                onClick={() => navigate('/rewards')}
                className="mt-5 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Get Started
              </button>
            </>
          ) : (
            <p>You haven't completed any challenges yet</p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {streaks.map((streak, index) => (
            <div key={index} className="streak-card border border-gray-200 rounded-lg p-4">
              <div className="flex gap-6">
                <div className="flex-[60%] flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900 font-bold">{streak.name}</h3>
                    <span className="text-xl">🎪</span>
                  </div>

                  {streak.goals.length === 0 ? (
                    <div>{streak.streakGoalMessage}</div>
                  ) : (
                    streak.goals.map((goal: any, i: number) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2 mr-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            <b>
                              {goal.name}: {(goal.value || 0).toLocaleString()}/
                              {goal.target.toLocaleString()}
                            </b>
                          </span>
                        </div>

                        <div className="relative h-1.5 bg-gray-200 rounded">
                          <div 
                            className="absolute h-full bg-primary rounded"
                            style={{ 
                              width: `${(goal.value || 0) / goal.target * 100}%` 
                            }}
                          />
                        </div>

                        {goal?.instantBonus && (
                          <div className="flex justify-between">
                            <small>
                              <b className="pr-4">Bonus earned so far: </b>
                              {goal.instantBonus}
                            </small>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="flex-[40%] flex flex-col gap-4">
                  <p className="text-gray-600 text-sm">{streak.desc}</p>
                  
                  {streak.startedAt && streak.timeLimit && streak.status === 'Active' && (
                    <div className="bg-gray-500 text-white text-sm px-3 py-0.5 rounded-full inline-block w-fit">
                      <AppTimer 
                        startedAt={streak.startedAt} 
                        timeLimit={streak.timeLimit} 
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 status-card">
                      <div className="text-sm font-medium text-gray-500">Status</div>
                      <div className="flex items-center gap-2">
                        <span className={`
                          w-2 h-2 rounded-full
                          ${streak.status === 'Complete' ? 'bg-green-500' : 
                            streak.status === 'Active' ? 'bg-primary' : 
                            'bg-red-500'}
                        `} />
                        <span className="font-semibold text-gray-900">
                          {streak.status === 'Complete' ? 'Completed' : streak.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 bg-gray-50 rounded-lg p-2 status-card">
                      <div className="text-sm font-medium text-gray-500">Goals</div>
                      <div className="font-semibold text-gray-900">
                        {streak.goalCompleted}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}