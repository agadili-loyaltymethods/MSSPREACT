```tsx
interface PointsBalanceWidgetProps {
  providerPoints: Array<{
    provider: string;
    balance: number;
  }>;
}

export function PointsBalanceWidget({ providerPoints }: PointsBalanceWidgetProps) {
  return (
    <div className="flex-[0_0_25%] bg-white rounded-xl shadow-md p-5">
      <div className="points-balance-section h-full flex flex-col">
        <h3 className="text-gray-800 text-base font-semibold m-0 mb-4">
          Points Balance
        </h3>

        <div className="balance-cards flex-1 flex flex-col">
          <div className="provider-points mt-2 flex-1 flex flex-col">
            {providerPoints.map(provider => (
              <div 
                key={provider.provider}
                className="provider-item p-3 bg-white rounded-lg mb-2 last:mb-0"
              >
                <div className="provider-name text-gray-500 text-xs mb-0.5">
                  {provider.provider}
                </div>
                <div className="provider-value text-gray-800 text-base font-semibold leading-tight">
                  {provider.balance.toLocaleString()} Points
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```