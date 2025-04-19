
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useActivityService } from '@/lib/hooks/useActivityService';
import { useToast } from '@/lib/hooks/useToast';
import { ExternalCoupons } from '@/types/enums';
import { SurveyConstant } from '@/lib/constants/survey';
import { formatters } from '@/lib/utils/formatters';
import { CardMiniSkeleton } from '../card-mini-skeleton';
import { NoData } from '../common/no-data';
import { ModalSurvey } from '../modals/modal-survey';
import { Dialog } from '@mui/material';

export function Quiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [surveys] = useState<any[]>([SurveyConstant]);
  const [surveyClaimedTimes, setSurveyClaimedTimes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

  const memberInfo = useAppSelector(state => state.member);
  const { getActivity } = useActivityService();
  const { showError } = useToast();

  const openDialog = (survey: any) => {
    setSelectedSurvey(survey);
    setIsModalOpen(true);
  };

  const handleClose = (refresh?: boolean) => {
    setIsModalOpen(false);
    if (refresh) {
      setSurveyClaimedTimes(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12.5">
        <CardMiniSkeleton />
      </div>
    );
  }

  if (!surveys.length) {
    return <NoData>No quiz available.</NoData>;
  }

  return (
    <div className="flex flex-col mt-5">
      <h3 className="mt-0">Survey ({surveys.length})</h3>
      <div className="flex gap-5">
        <div className="m-0 flex-1 flex flex-wrap gap-2.5">
          {surveys.map((survey, index) => (
            <div key={index} className="flex-[0_0_25%]">
              <div className="border border-gray-200 rounded bg-white">
                <div className="flex flex-col items-center gap-5 p-5">
                  <img className="w-[160px]" src="/assets/bclc-logo.png" alt="BCLC Logo" />
                  <h3>{survey.title}</h3>
                  <div className="text-gray-500">{survey.desc}</div>
                  <small className="text-gray-500">
                    Expires {formatters.checkExpiry(survey.expiresOn)}
                  </small>
                  <button
                    onClick={() => openDialog(survey)}
                    className="w-full border-2 border-primary text-primary rounded py-2 hover:bg-primary hover:text-white transition-colors"
                  >
                    Participate Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog 
        open={isModalOpen} 
        onClose={() => handleClose()}
        maxWidth="md"
        fullWidth
      >
        {selectedSurvey && (
          <ModalSurvey 
            data={selectedSurvey}
            onClose={handleClose}
          />
        )}
      </Dialog>
    </div>
  );
}
