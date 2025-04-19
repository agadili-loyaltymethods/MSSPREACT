```tsx
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { useMemberService } from '@/lib/hooks/useMemberService';
import { useToast } from '@/lib/hooks/useToast';
import { addMember, clearMember } from '@/lib/store/slices/memberSlice';
import { clearCart } from '@/lib/store/slices/cartSlice';

export function Profile() {
  const [isFetching, setIsFetching] = useState(false);
  const [loyaltyId, setLoyaltyId] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const memberInfo = useAppSelector(state => state.member);
  const dispatch = useAppDispatch();
  const { getMember, refreshMember$ } = useMemberService();
  const { showError } = useToast();

  useEffect(() => {
    const subscription = refreshMember$.subscribe(() => {
      switchMember();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (Object.keys(memberInfo).length) {
      const storedLoyaltyId = localStorage.getItem('loyaltyId');
      setLoyaltyId(storedLoyaltyId || memberInfo.loyaltyId);
    }
  }, [memberInfo]);

  const switchMember = async () => {
    const oldVal = localStorage.getItem('loyaltyId');
    if (!loyaltyId) return;

    localStorage.setItem('loyaltyId', loyaltyId);
    setIsFetching(true);

    try {
      const member = await getMember(loyaltyId);
      dispatch(addMember(member));
    } catch (error: any) {
      localStorage.setItem('loyaltyId', oldVal || '');
      setLoyaltyId(oldVal || '');
      showError(error?.error?.error || error?.message);
    } finally {
      setIsFetching(false);
      setIsMenuOpen(false);
    }
  };

  const clearStore = () => {
    dispatch(clearMember());
    dispatch(clearCart());
  };

  const totalPoints = memberInfo.purses?.find(x => x.name === 'Anywhere Points')?.availBalance ?? 0;

  return (
    <div className="flex items-center gap-1.5">
      <span className="material-symbols-outlined text-3xl">account_circle</span>
      <div className="flex flex-col items-start">
        <p className="m-0">
          {memberInfo?.firstName} {memberInfo?.lastName}
        </p>
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center text-sm"
          >
            {memberInfo?.tiers?.[0]?.level?.name} | {totalPoints.toLocaleString()}
            <span className="material-icons w-7.5 h-6 p-0 text-primary">
              expand_more
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg">
          <div className="p-2.5">
            <div className="flex flex-col items-center gap-2.5 pb-5">
              <div className="relative w-full">
                <input
                  type="number"
                  value={loyaltyId}
                  onChange={(e) => setLoyaltyId(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded"
                  placeholder="Switch Member"
                />
                <button
                  onClick={switchMember}
                  disabled={isFetching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                  title="Click to Switch Member"
                >
                  <span className="material-icons">person_search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```