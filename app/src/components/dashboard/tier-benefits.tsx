
import { NoData } from '../common/no-data';

interface TierBenefitsProps {
  benefits?: any[];
  isLoading: boolean;
}

export function TierBenefits({ benefits, isLoading }: TierBenefitsProps) {
  if (isLoading) {
    return (
      <div className="flex-[0_0_50%] bg-white rounded-xl shadow-md p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!benefits?.length) {
    return (
      <div className="flex-[0_0_50%] bg-white rounded-xl shadow-md p-5">
        <NoData>No benefits available.</NoData>
      </div>
    );
  }

  return (
    <div className="flex-[0_0_50%] bg-white rounded-xl shadow-md p-5">
      <h3 className="mt-2.5 mb-5">Tier Benefits</h3>
      <div className="grid grid-cols-2 gap-5">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-list">
            <div className="bg-gray-100 rounded-lg p-2.5 h-full">
              <div className="flex items-start gap-2.5 perk-header">
                <div className="benefit-thumbnail flex items-center justify-center">
                  <span className="material-icons text-primary">
                    {benefit.thumbnail}
                  </span>
                </div>
                <div className="flex flex-col items-start perk-card">
                  <h3 className="text-accent title">{benefit.title}</h3>
                </div>
              </div>
              <div className="flex-1 desc-container">
                {benefit.desc.length === 1 ? (
                  <div className="mb-0.5 mt-4">{benefit.desc[0]}</div>
                ) : (
                  <ul className="pl-5 mb-0.5 mt-4">
                    {benefit.desc.map((desc: string, i: number) => (
                      <li key={i}><span>{desc}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
