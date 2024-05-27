import { useEffect, useState } from 'react';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';

const UpDownButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const trackScroll = () => {
    const scrolled = window.pageYOffset;
    const viewportHeight = document.documentElement.clientHeight;
    const totalHeight = document.documentElement.scrollHeight;

    const atBottom =
      pathname == '/attendance-overview'
        ? window.pageYOffset >= 300
        : window.pageYOffset >= 780;

    // pathname == '/attendance-overview' ? 320 : 780
    const atTop =
      pathname == '/attendance-overview' ? scrolled <= 320 : scrolled <= 780;
    setIsVisible(atTop || atBottom);
    setIsAtBottom(
      pathname == '/attendance-overview'
        ? window.pageYOffset >= 300
        : window.pageYOffset >= 780
    );
  };

  const backToTop = () => {
    const scrollStep = -window.pageYOffset / (500 / 15);
    const animateScroll = () => {
      if (window.pageYOffset > 0) {
        window.scrollBy(0, scrollStep);
        requestAnimationFrame(animateScroll);
      }
    };
    requestAnimationFrame(animateScroll);
  };

  const scrollToBottom = () => {
    const targetPosition =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollStep = (targetPosition - window.pageYOffset) / (500 / 15);
    const animateScroll = () => {
      if (window.pageYOffset < targetPosition - 1) {
        window.scrollBy(0, scrollStep);
        requestAnimationFrame(animateScroll);
      }
    };
    requestAnimationFrame(animateScroll);
  };

  const scrollToHeight = (height: any) => {
    const scrollStep = (height - window.pageYOffset) / (500 / 15);
    const animateScroll = () => {
      if (
        (scrollStep > 0 && window.pageYOffset < height - 1) ||
        (scrollStep < 0 && window.pageYOffset > height + 1)
      ) {
        window.scrollBy(0, scrollStep);
        requestAnimationFrame(animateScroll);
      }
    };
    requestAnimationFrame(animateScroll);
  };

  const handleButtonClick = () => {
    if (isAtBottom) {
      backToTop();
    } else {
      // Scroll to a particular screen height, for example, 500 pixels from the top
      scrollToHeight(pathname == '/attendance-overview' ? 320 : 780);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', trackScroll);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', trackScroll);
      }
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <Box
          className={`up_down_btn ${isVisible ? 'up_down_btn-show' : ''}`}
          onClick={handleButtonClick}
        >
          <Box className="w-98">
            {isAtBottom ? (
              <Box
                sx={{ height: '88px', width: '64px' }}
                className="flex-column-center"
              >
                <ArrowUpwardIcon />
                <span className="w-78"> {t('DASHBOARD.BACK_TO_TOP')}</span>
              </Box>
            ) : (
              <Box
                sx={{ height: '80px', width: '64px' }}
                className="flex-column-center"
              >
                {t('DASHBOARD.LEARNER')}
                <ArrowDownwardIcon />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default UpDownButton;
