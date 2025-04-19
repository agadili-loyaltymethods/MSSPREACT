```tsx
interface TierStatusWidgetProps {
  widget: any;
  isEncore: boolean;
}

export function TierStatusWidget({ widget, isEncore }: TierStatusWidgetProps) {
  return (
    <div className="flex-[0_0_25%] bg-white rounded-xl shadow-md p-5">
      <div className="tier-status-section h-full flex flex-col">
        <h3 className="text-gray-800 text-base font-semibold m-0 mb-4">
          {isEncore ? 'Encore Tier Status' : 'GCGC Tier Status'}
        </h3>

        <div className="tier-card flex-1 flex flex-col justify-between">
          <div className={`tier-badge ${isEncore ? 'encore' : 'ruby'} text-center p-6 rounded-xl text-white mb-3 relative overflow-hidden`}>
            <div className="tier-icon-wrapper relative z-10 mb-3">
              <span className="material-icons text-2xl">diamond</span>
            </div>
            <h2 className="relative z-10 m-0 text-lg font-semibold">
              {widget.currentTier}
            </h2>
          </div>

          {widget.nextTier !== widget.currentTier ? (
            <div className="tier-progress p-3 bg-primary-bg rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 text-xs font-medium">
                  Progress to {widget.nextTier}
                </span>
                <span className="text-tier-green font-semibold text-xs">
                  {((widget.totalSpends / widget.nextMilestone) * 100).toFixed(0)}%
                </span>
              </div>

              <div className="relative h-1 bg-gray-200 rounded mt-2 mb-2">
                <div 
                  className="absolute h-full bg-tier-green rounded"
                  style={{ 
                    width: `${(widget.totalSpends / widget.nextMilestone) * 100}%` 
                  }}
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-tier-green font-semibold">
                  {widget.totalSpends.toLocaleString()} points
                </span>
                <span className="text-gray-500">
                  {(widget.nextMilestone - widget.totalSpends).toLocaleString()} to next tier
                </span>
              </div>
            </div>
          ) : (
            <span className="text-green-600 text-center font-semibold">
              Congratulations! You have achieved the Top Tier
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```