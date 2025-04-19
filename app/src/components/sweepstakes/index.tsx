
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useActivityService } from '@/lib/hooks/useActivityService';
import { useToast } from '@/lib/hooks/useToast';
import { ExternalCoupons } from '@/types/enums';
import { SweepstakesConstant } from '@/lib/constants/sweepstakes';
import { formatters } from '@/lib/utils/formatters';
import { CardMiniSkeleton } from '../card-mini-skeleton';
import { NoData } from '../common/no-data';
import { ModalSweepstake } from '../modals/modal-sweepstake';
import { Dialog } from '@mui/material';

export function Sweepstakes() {
  const [isLoading, setIsLoading] = useState(false);
  const [sweepstakes] = useState<any>(SweepstakesConstant);
  const [claimedTimes, setClaimedTimes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const memberPoints = useAppSelector(state => state.member.purses[0].availBalance);
  const { showError } = useToast();

  const showSweepstake = () => {
    setIsModalOpen(true);
  };

  const handleClose = (refresh?: boolean) => {
    setIsModalOpen(false);
    if (refresh) {
      setClaimedTimes(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12.5">
        <CardMiniSkeleton />
      </div>
    );
  }

  if (!sweepstakes) {
    return <NoData>No sweepstakes available.</NoData>;
  }

  return (
    <div className="flex flex-col mt-5">
      <h3 className="mt-0">Sweepstakes</h3>
      <div className="flex gap-5">
        <div className="m-0 flex-1 flex flex-wrap gap-2.5">
          <div className="flex-[0_0_25%]">
            <div className="border border-gray-200 rounded bg-white">
              <div className="flex flex-col items-center gap-5 p-5">
                <img className="w-[160px]" src="/assets/logo-login.svg" alt="Logo" />
                <h3>{sweepstakes.title}</h3>
                <div className="text-gray-500">{sweepstakes.desc}</div>
                <small className="text-gray-500">
                  Expires {formatters.checkExpiry(sweepstakes.expiresOn)}
                </small>
                <button
                  onClick={showSweepstake}
                  className="w-full border-2 border-primary text-primary rounded py-2 hover:bg-primary hover:text-white transition-colors"
                >
                  Participate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog 
        open={isModalOpen} 
        onClose={() => handleClose()}
        maxWidth="md"
        fullWidth
      >
        <ModalSweepstake 
          data={sweepstakes}
          onClose={handleClose}
        />
      </Dialog>
    </div>
  );
}
