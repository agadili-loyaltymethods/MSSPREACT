```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { useActivityService } from '@/lib/hooks/useActivityService';
import { useToast } from '@/lib/hooks/useToast';
import { formatters } from '@/lib/utils/formatters';
import { Dialog } from '@mui/material';
import { RevertReward } from '../modals/revert-reward';
import { NoData } from '../common/no-data';

export function RewardsWallet() {
  const [isLoading, setIsLoading] = useState(true);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [availableVouchersWithPurse, setAvailableVouchersWithPurse] = useState<any[]>([]);
  const [allVouchers, setAllVouchers] = useState<any[]>([]);
  const [memberVouchers, setMemberVouchers] = useState<any[]>([]);
  const [selectedPointPurse, setSelectedPointPurse] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  const memberInfo = useAppSelector(state => state.member);
  const location = useAppSelector(state => state.location.location);
  const memberPoints = useAppSelector(state => 
    state.member.purses?.map(purse => ({
      key: purse.name,
      value: purse.availBalance
    })) || []
  );

  const { getActivity } = useActivityService();
  const { showError } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (memberInfo._id) {
      getRewardWallet();
    }
  }, [memberInfo, location]);

  const getRewardWallet = async () => {
    setIsLoading(true);
    setSelectedPointPurse({});

    try {
      const response = await getActivity({
        type: 'Personalization',
        date: new Date().toISOString(),
        srcChannelType: 'Web',
        couponCode: 'Balance',
        srcChannelID: location,
        loyaltyID: memberInfo.loyaltyId
      });

      const pointsData = response.data.rdBalances;
      const points = Object.keys(pointsData).map(key => ({
        key,
        value: pointsData[key]
      }));

      setSelectedPointPurse(points[0]);
      getVouchers();
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
      setIsLoading(false);
    }
  };

  const getVouchers = async () => {
    try {
      const [memberVouchersResponse, allVouchersResponse] = await Promise.all([
        getActivity({ type: 'member-vouchers' }),
        getActivity({ type: 'vouchers' })
      ]);

      setMemberVouchers(memberVouchersResponse.data.flatMap((voucher: any) => voucher.rewards));
      setAllVouchers(allVouchersResponse.data);
      setAvailableVouchers();
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setAvailableVouchers = () => {
    const vouchers = allVouchers.filter(voucher => 
      voucher.cost > 0 && 
      memberPoints.find(point => 
        point.key === voucher?.ext?.purseName && 
        point.value >= voucher.cost
      )
    );
    setAvailableVouchers(vouchers);
    setAvailableVouchersWithPurse();
  };

  const setAvailableVouchersWithPurse = () => {
    const vouchers = allVouchers.filter(voucher => 
      voucher.cost > 0 && 
      voucher.ext.purseName === selectedPointPurse.key
    );
    setAvailableVouchersWithPurse(vouchers);
  };

  const isPointSourceValid = (voucherName: string, cost: number) => {
    const selectedPurse = memberPoints.find(point => point.key === selectedPointPurse.key);
    return selectedPurse && selectedPurse.value >= cost;
  };

  const buyVoucher = async (rewardName: string) => {
    setIsLoading(true);
    try {
      await getActivity({
        type: 'Redemption',
        srcChannelType: 'Web',
        srcChannelID: location,
        date: new Date(),
        loyaltyID: memberInfo.loyaltyId,
        couponCode: rewardName,
        ext: {
          purse: selectedPointPurse.key
        }
      }, true);

      getRewardWallet();
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
      setIsLoading(false);
    }
  };

  const openRevertDialog = (voucher: any) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleRevertClose = (refresh?: boolean) => {
    setIsModalOpen(false);
    if (refresh) {
      getRewardWallet();
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        {/* Add skeleton loading UI */}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h3>Rewards Wallet</h3>
        <div className="flex items-center gap-2.5">
          {memberPoints.map(point => (
            <span 
              key={point.key}
              className="border border-gray-300 rounded-lg px-2.5 py-1.5"
            >
              {point.key}: <strong>{formatters.formatNumber(point.value)}</strong>
            </span>
          ))}
          <button
            disabled={!availableVouchers.length}
            onClick={() => navigate('/rewards/buy')}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Buy with Points
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {memberVouchers.map((voucher, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h4>{voucher.name}</h4>
              <button
                onClick={() => openRevertDialog(voucher)}
                className="text-red-500 hover:text-red-700"
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
            <p className="text-gray-600 mb-4">{voucher.desc}</p>
            {voucher.expirationDate && (
              <small className="text-gray-500">
                Expires {formatters.checkExpiry(voucher.expirationDate)}
              </small>
            )}
          </div>
        ))}

        {!memberVouchers.length && (
          <NoData>No rewards available in the wallet.</NoData>
        )}
      </div>

      <Dialog 
        open={isModalOpen} 
        onClose={() => handleRevertClose()}
        maxWidth="md"
        fullWidth
      >
        {selectedVoucher && (
          <RevertReward 
            data={selectedVoucher}
            onClose={handleRevertClose}
          />
        )}
      </Dialog>
    </div>
  );
}
```