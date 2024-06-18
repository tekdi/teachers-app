import ReactGA from 'react-ga4';

export const initGA = (measurementId: string) => {
  ReactGA.initialize(measurementId);
};

export const logPageView = (url: string) => {
  ReactGA.send({ hitType: 'pageview', page: url });
};

export const logEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  ReactGA.event({
    action,
    category,
    label,
    value,
  });
};
