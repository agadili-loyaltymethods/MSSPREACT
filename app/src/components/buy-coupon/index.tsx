import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { formatters } from '@/lib/utils/formatters';
import { useActivityService } from '@/lib/hooks/useActivityService';
import { useToast } from '@/lib/hooks/useToast';
// import { Member } from '@/types';
import { Coupon } from '@/models/coupon';
import { Member } from '@/models/member';

interface BuyCouponProps {
  memberInfo: Member;
  onClose: (refresh?: boolean) => void;
  refresh?: boolean;
}

export function BuyCoupon({ memberInfo, onClose, refresh }: BuyCouponProps) {
  const [couponList, setCouponList] = useState<Coupon[]>([]);
  const { getActivity } = useActivityService();
  const { showError } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    getCoupons();
  }, [memberInfo]);

  useEffect(() => {
    if (refresh) {
      clearCoupons();
    }
  }, [refresh]);

  const clearCoupons = () => {
    setCouponList(prev => prev.map(coupon => ({ ...coupon, count: 0 })));
  };

  const getCoupons = async () => {
    try {
      const response: any = await getActivity();
      setCouponList(response.data);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    }
  };

  const hasCoupons = () => couponList.some(coupon => coupon.count);
  
  const totalPoints = () => 
    couponList.reduce((acc, c) => (c.count ?? 0) * c.ext.rewardCost + acc, 0);

  const reduceCount = (coupon: Coupon) => {
    setCouponList(prev => 
      prev.map(c => c.name === coupon.name 
        ? { ...c, count: c.count ? c.count - 1 : 0 }
        : c
      )
    );
  };

  const increaseCount = (coupon: Coupon) => {
    setCouponList(prev => 
      prev.map(c => c.name === coupon.name 
        ? { ...c, count: c.count ? c.count + 1 : 1 }
        : c
      )
    );
  };

  const createPayload = (couponCode: string) => ({
    type: 'Redemption',
    date: new Date(),
    srcChannelType: 'Web',
    loyaltyID: +memberInfo.loyaltyId,
    couponCode: couponCode,
  });

  const buyCoupon = async () => {
    if (totalPoints() > memberInfo.purses[0].availBalance) {
      showError('Not enough points to buy the selected coupons');
      return;
    }

    const requests = couponList
      .filter(coupon => coupon.count)
      .flatMap(coupon => 
        Array(coupon.count).fill(null).map(() => 
          getActivity(createPayload(coupon.name))
        )
      );

    try {
      await Promise.all(requests);
      onClose(true);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center p-5 pb-0 mb-2.5">
        <h3 className="m-0">Buy Coupons</h3>
        <div className="flex-1" />
        <button onClick={() => onClose()} className="p-2 rounded-full hover:bg-gray-100">
          <span className="text-2xl">×</span>
        </button>
      </div>
      <hr />
      <div className="flex justify-end items-center gap-5 mr-4 mt-2.5">
        <div className="flex flex-col">
          <div className="text-gray-600">Points Available</div>
          <h1 className="text-primary text-left mt-0 mb-0">
            {formatters.formatNumber(memberInfo.purses[0].availBalance)}
          </h1>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 p-10">
        {couponList.map((coupon) => (
          <div key={coupon.name} className="flex-[0_0_45%]">
            <div className="border-2 border-primary rounded-lg p-5">
              <div className="flex justify-end pr-5 pt-5" />
              <div className="pt-2.5 mb-5">
                <h2 className="text-primary mb-5">{coupon.desc}</h2>
              </div>
              <div className="mb-5">
                <div className="flex items-center">
                  <h2 className="text-primary mr-1.5">{coupon.ext.rewardCost}</h2>
                  <p className="text-gray-600">RR Points</p>
                </div>
              </div>
              <div className="flex justify-center items-center relative border-t-2 border-dashed border-primary">
                <div className="absolute -left-4 -top-4 w-8 h-8 bg-white rounded-full" />
                <div className="absolute -right-4 -top-4 w-8 h-8 bg-white rounded-full" />
                <div className="flex justify-between items-center w-[150px] border border-gray-200 rounded">
                  <button 
                    className="p-2" 
                    disabled={!coupon.count}
                    onClick={() => reduceCount(coupon)}
                  >
                    −
                  </button>
                  <h3>{coupon.count ?? 0}</h3>
                  <button 
                    className="p-2"
                    onClick={() => increaseCount(coupon)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasCoupons() && (
        <>
          <div className="flex justify-center mt-12.5">
            <div className="flex flex-col gap-5 bg-primary-bg p-5 rounded-lg w-[500px]">
              <h3 className="text-center text-primary">Coupon Purchase Summary</h3>
              {couponList.map(coupon => coupon.count && (
                <div key={coupon.name} className="flex justify-between items-center">
                  <h4>{coupon.desc} X {coupon.count}</h4>
                  <h3>{formatters.formatNumber(coupon.ext.rewardCost * coupon.count)}</h3>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <h3>RR Points to Spend</h3>
                <h2>{formatters.formatNumber(totalPoints())}</h2>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center mr-5 mt-7.5">
            <button 
              onClick={() => onClose()}
              className="mr-5 px-4 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={buyCoupon}
              className="px-4 py-2 h-12.5 w-[150px] bg-primary text-white rounded hover:bg-primary-dark"
            >
              Purchase
            </button>
          </div>
        </>
      )}
    </div>
  );
}