import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="container">
          <div className="card">
            <div className="card-img skeleton" />
            <div className="card-body">
              <h2 className="card-title skeleton" />
              <p className="card-intro skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}