import * as React from 'react';

import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import WestIcon from '@mui/icons-material/West';
import { useTranslation } from 'next-i18next';

const style = {
  width: '300px', // Adjust width as needed
  maxWidth: 300, // Maximum width for responsiveness
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '12px 15px 12px 15px',
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',

  // Responsive styles
  '@media (min-width: 768px)': {
    width: '70%', // Adjust width for smaller screens
  },
};

const CustomRangeModal: React.FC = () => {
  const [isCalendarModalOpen, setIsCalenderModalOpen] = React.useState(false);
  const toggleCalendarModal = () =>
    setIsCalenderModalOpen(!isCalendarModalOpen);

  const { t } = useTranslation();
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={isCalendarModalOpen}
        onClose={toggleCalendarModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '20px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
              }}
            >
              <Box>
                <WestIcon
                  onClick={toggleCalendarModal}
                  style={{ cursor: 'pointer' }}
                />
              </Box>
              <Box className="text-4D">{t('COMMON.CUSTOM_RANGE')}</Box>
            </Box>
            <Box>
              <CloseIcon
                onClick={toggleCalendarModal}
                style={{ cursor: 'pointer' }}
              />
            </Box>
          </Box>
          <Box sx={{ paddingTop: '20px' }}>
            <Box className="fs-14 fw-500 text-4D">
              {t('COMMON.FROM_TO_DATE')}
            </Box>
            <Box className="fs-22 fw-500 pt-10 text-1F">17 May – 23 May</Box>
          </Box>

          <Box>{/* your calender will come here  */}</Box>

          <Box
            sx={{
              paddingTop: '20px',
              display: 'flex',
              gap: '10px',
              justifyContent: 'end',
            }}
          >
            <Box className="text-0D fs-14 fw-500">{t('COMMON.CANCEL')}</Box>
            <Box className="text-0D fs-14 fw-500">{t('COMMON.OK')}</Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CustomRangeModal;
