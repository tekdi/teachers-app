import { TFunction } from 'next-i18next';
export const getSteps = (t: TFunction) => [
  {
    target: 'joyride-step-0',
    content: t('GUIDE_TOUR.STEP_0'),
  },
  {
    target: '.joyride-step-1',
    content: t('GUIDE_TOUR.STEP_1'),
  },
  {
    target: '.joyride-step-2',
    content: t('GUIDE_TOUR.STEP_2'),
  },
  {
    target: '.joyride-step-3',
    content: t('GUIDE_TOUR.STEP_3'),
  },
  {
    target: '.joyride-step-4',
    content: t('GUIDE_TOUR.STEP_4'),
  },
  {
    target: '.joyride-step-5',
    content: t('GUIDE_TOUR.STEP_5'),
  },
  {
    target: '.joyride-step-6',
    content: t('GUIDE_TOUR.STEP_6'),
  },
];
