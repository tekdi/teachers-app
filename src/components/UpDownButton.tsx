import { useEffect, useState } from 'react';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box } from '@mui/material';

const UpDownButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const trackScroll = () => {
    const scrolled = window.pageYOffset;
    const viewportHeight = document.documentElement.clientHeight;
    const totalHeight = document.documentElement.scrollHeight;

    const atBottom =
      scrolled === 0 || scrolled + viewportHeight >= totalHeight - 10;
    +setIsVisible(scrolled > 100 || atBottom);
    +setIsAtBottom(atBottom);
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
      document.documentElement.clientHeight -
      2000;
    const scrollStep = (targetPosition - window.pageYOffset) / (500 / 15);
    const animateScroll = () => {
      if (window.pageYOffset < targetPosition) {
        window.scrollBy(0, scrollStep);
        requestAnimationFrame(animateScroll);
      }
    };
    requestAnimationFrame(animateScroll);
  };

  const handleButtonClick = () => {
    if (isAtBottom) {
      scrollToBottom();
    } else {
      backToTop();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.addEventListener('scroll', trackScroll);
    }
    return () => {
      if (typeof window !== 'undefined' && window.localStorage) {
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
          <span>{isAtBottom ? '' : <ArrowUpwardIcon />}</span>
          <span className="w-98">
            {isAtBottom ? 'Learners' : 'Back to Top'}
          </span>
          <span>{isAtBottom ? <ArrowDownwardIcon /> : ''}</span>
        </Box>
      )}
    </div>
  );
};

export default UpDownButton;
