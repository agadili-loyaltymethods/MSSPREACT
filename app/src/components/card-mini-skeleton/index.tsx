import { cn } from '@/lib/utils';

interface CardMiniSkeletonProps {
  className?: string;
}

export function CardMiniSkeleton({ className }: CardMiniSkeletonProps) {
  const renderSkeletonRow = () => (
    <div className="box flex w-full gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton flex-1 p-4">
          <div className="skeleton-left flex-1">
            <div className="square" />
          </div>
          <div className="skeleton-right flex-2">
            <div className="line h17 w40 m10" />
            <div className="line" />
            <div className="line h8 w50" />
            <div className="line w75" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {renderSkeletonRow()}
      {renderSkeletonRow()}
    </div>
  );
}