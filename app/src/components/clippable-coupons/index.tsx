```tsx
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useSegmentService } from '@/lib/hooks/useSegmentService';
import { useToast } from '@/lib/hooks/useToast';
import { Segment } from '@/types/segment';
import { CardMiniSkeleton } from '../card-mini-skeleton';
import { NoData } from '../common/no-data';

export function ClippableCoupons() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [memberSegments, setMemberSegments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const memberInfo = useAppSelector(state => state.member);
  const { getAllSegments, getMemberSegments, deleteMemberSegment, addMemberSegment } = useSegmentService();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (memberInfo._id) {
      getSegments();
    }
  }, [memberInfo]);

  const getSegments = async () => {
    setIsLoading(true);
    try {
      const segmentsResponse = await getAllSegments(JSON.stringify({ "ext.marketing": true }));
      setSegments(segmentsResponse);

      const query = JSON.stringify({
        member: memberInfo._id,
        segment: { $in: segmentsResponse.map(segment => segment._id) }
      });

      const memberSegmentsResponse = await getMemberSegments(5, query);
      setMemberSegments(memberSegmentsResponse);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isClaimed = (segmentId: string) => 
    !!memberSegments.find(x => x.segment === segmentId);

  const updateSegment = async (segmentId: string) => {
    const existingSegmentIndex = memberSegments.findIndex(x => x.segment === segmentId);

    if (existingSegmentIndex > -1) {
      try {
        await deleteMemberSegment(memberSegments[existingSegmentIndex]._id);
        setMemberSegments(prev => {
          const newSegments = [...prev];
          newSegments.splice(existingSegmentIndex, 1);
          return newSegments;
        });
        showSuccess('Coupon has been successfully deactivated.');
      } catch (error: any) {
        showError(error?.error?.error || error?.message);
      }
    } else {
      try {
        const response = await addMemberSegment(memberInfo._id, segmentId);
        setMemberSegments(prev => [...prev, response]);
        showSuccess('Coupon has been successfully activated.');
      } catch (error: any) {
        showError(error?.error?.error || error?.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12.5">
        <CardMiniSkeleton />
      </div>
    );
  }

  if (!segments.length) {
    return <NoData>No coupons available.</NoData>;
  }

  return (
    <div className="flex flex-col gap-2.5 mt-5">
      <div className="flex gap-5">
        <div className="m-0 flex-1 flex flex-wrap gap-2.5">
          {segments.map((segment) => (
            <div key={segment._id} className="flex-[0_0_25%]">
              <div className="border border-gray-200 rounded bg-white h-[300px]">
                <div className="h-full">
                  <div className="flex flex-col items-center justify-between gap-2.5 h-full p-5">
                    <img src="/assets/bclc-logo.png" alt="BCLC Logo" className="w-[100px] mt-2.5" />
                    <h2 className="m-0 text-accent text-center leading-snug">{segment.name}</h2>
                    <p className="text-gray-500 mt-2.5">{segment.description}</p>
                    <button
                      className={`w-full ${
                        isClaimed(segment._id)
                          ? 'bg-accent text-white'
                          : 'bg-primary text-white'
                      }`}
                      onClick={() => updateSegment(segment._id)}
                    >
                      {isClaimed(segment._id) ? 'Deactivate' : 'Activate'}
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
```