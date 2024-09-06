import React, { useEffect, useState } from 'react';
import Joyride from 'react-joyride';
import { getSteps } from '../utils/tourGuideSteps';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { logEvent } from '@/utils/googleAnalytics';

interface JoyrideCallbackData {
  action: string;
  index: number;
  type: string;
  status: string;
}

interface GuideTourProps {
  toggleDrawer: (newOpen: boolean) => () => void;
}

const GuideTour: React.FC<GuideTourProps> = ({ toggleDrawer }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const steps = getSteps(t);
  const totalSteps = steps.length;
  const [runTour, setRunTour] = useState(true);
  const [stepIndex, setStepIndex] = useState(1);

  useEffect(() => {
    setRunTour(true);
    setStepIndex(stepIndex);
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');

    setRunTour(!hasSeenTutorial);
  }, []);

  const handleTourEnd = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  };

  const handleJoyrideCallback = async (data: JoyrideCallbackData) => {
    const { action, index, type, status } = data;

    if (status === 'finished' || status === 'skipped') {
      setRunTour(false);
      handleTourEnd();
      toggleDrawer(false)();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      logEvent({
        action: 'skip-guide-tour/finished-guide-tour',
        category: 'Dashboard Page',
        label: 'Skip/ Finish Button Click',
      });
    } else if (type === 'step:after' || type === 'tour:start') {
      if (action === 'next') {
        if (stepIndex === 4) {
          await new Promise<void>((resolve) => {
            toggleDrawer(true)();
            setTimeout(resolve, 645); // Adjust the delay time as needed
          });
          setStepIndex((prevIndex) => prevIndex + 1);
        } else {
          setStepIndex((prevIndex) => prevIndex + 1);
        }
        logEvent({
          action: 'next-button-clicked',
          category: 'Dashboard Page',
          label: 'Next Button Click',
        });
      } else if (action === 'prev') {
        if (stepIndex === 5) {
          toggleDrawer(false)();
          setTimeout(() => {
            setStepIndex((prevIndex) => prevIndex - 1);
          }, 0);
        } else {
          setStepIndex((prevIndex) => prevIndex - 1);
        }
        logEvent({
          action: 'previous-button-clicked',
          category: 'Dashboard Page',
          label: 'Previous Button Click',
        });
      } else if (action === 'close') {
        setRunTour(false);
        toggleDrawer(false)();
      }
    }
  };

  return (
    <>
      {runTour && (
        <Joyride
          steps={getSteps(t)}
          run={runTour}
          stepIndex={stepIndex}
          showSkipButton={true}
          continuous={true}
          styles={{
            options: {
              arrowColor: theme?.palette?.warning['A400'],
              backgroundColor: theme?.palette?.warning['A400'],
              overlayColor: 'rgba(0, 0, 0, 0.5)',
              primaryColor: theme?.palette?.primary?.main,
              textColor: theme?.palette?.warning['400'],
              width: 350,
              zIndex: 9999,
            },
            tooltipContent: {
              fontWeight: 500,
            },
            buttonNext: {
              padding: '0.5rem 1rem',
              backgroundColor: theme?.palette?.primary?.main,
              borderRadius: '5rem',
              color: theme?.palette?.warning['100'],
              border: '1px solid #FDBE16',
            },
            buttonBack: {
              padding: '0.5rem 1rem',
              borderRadius: '5rem',
              color:
                stepIndex === 1
                  ? 'transparent'
                  : theme?.palette?.warning['100'],
              border: stepIndex === 1 ? 'none' : '1px solid black',
            },
            buttonSkip: {
              padding: '0.5rem 1rem',
              color: theme?.palette?.info?.main,
            },
          }}
          callback={handleJoyrideCallback}
          locale={{
            back: stepIndex === 1 ? '' : t('GUIDE_TOUR.PREVIOUS'),
            last: t('GUIDE_TOUR.FINISH'),
            next: `${t('GUIDE_TOUR.NEXT')} (${stepIndex}/${totalSteps - 1})`,
            skip: t('GUIDE_TOUR.SKIP'),
          }}
        />
      )}
    </>
  );
};

export default GuideTour;
