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

    if (scrolled > 100) {
      // Show button quickly after scrolling starts
      setIsVisible(true);
      setIsAtBottom(false);
    } else if (scrolled === 0) {
      setIsAtBottom(true);
      setIsVisible(true);
    } else if (scrolled + viewportHeight >= totalHeight - 10) {
      // Adjust for small discrepancies with a 10px buffer
      setIsAtBottom(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const backToTop = () => {
    const scrollStep = -window.pageYOffset / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (window.pageYOffset !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }
    }, 15);
  };

  const scrollToBottom = () => {
    const targetPosition =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight -
      2000;
    const scrollStep = (targetPosition - window.pageYOffset) / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (window.pageYOffset < targetPosition) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }
    }, 15);
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
