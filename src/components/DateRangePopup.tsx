import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  MenuList,
  Modal,
  Select,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import Check from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ListItemIcon from '@mui/material/ListItemIcon';
import MonthCalender from './MonthCalender';
import WestIcon from '@mui/icons-material/West';
import { useTranslation } from 'next-i18next';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const calenderModalStyle = {
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

const dividerStyle = {
  my: 2,
};

interface CustomSelectModalProps {
  menuItems: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  onDateRangeSelected: any;
}

const DateRangePopup: React.FC<CustomSelectModalProps> = ({
  menuItems,
  selectedValue,
  setSelectedValue,
  onDateRangeSelected,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalenderModalOpen] = useState(false);
  const [dateRangeArray, setDateRangeArray] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleCalendarModal = () =>
    setIsCalenderModalOpen(!isCalendarModalOpen);
  const { t } = useTranslation();

  const handleMenuItemClick = (index: number, item: string) => {
    setSelectedIndex(index);
    setSelectedValue(item);
    if (index === 4) {
      toggleCalendarModal();
    }
    if (index === 4) {
      toggleCalendarModal();
    }
  };

  const onApply = () => {
    console.log('applied', selectedIndex, selectedValue);
    const values = getDateRange(selectedIndex);
    const { toDate, fromDate } = values;
    console.log(toDate, fromDate);
    onDateRangeSelected({ fromDate, toDate });
    toggleModal();
    toggleModal();
  };

  const getDateRange = (index: number | null) => {
    const today = new Date();
    const formatDate = (date: Date) => {
      console.log('date', date);
      if (typeof date === 'object') {
        // return date?.toISOString()?.split('T')[0];}
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        const year = localDate.getUTCFullYear();
        const month = String(localDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = String(localDate.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    };
    let fromDate: any;
    let toDate = formatDate(today);

    switch (index) {
      case 0:
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 6);
        break;
      case 1:
        fromDate = new Date(today);
        break;
      case 2:
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 1);
        fromDate.setDate(1); // Start of last month
        toDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // End of last month
        break;
      case 3:
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 6);
        fromDate.setDate(1); // Start of the period
        toDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // End of last month
        break;
      case 4:
        //write here logic to open modal and return fromDate and toDate
        if (dateRangeArray) {
          fromDate = dateRangeArray[0];
          toDate = formatDate(new Date(dateRangeArray[1]));
        }
        break;
      default:
        fromDate = new Date(today);
    }

    return {
      fromDate: formatDate(new Date(fromDate)),
      toDate,
    };
  };

  const handleCalendarDateChange = (date: Date | [Date, Date] | null) => {
    if (Array.isArray(date)) {
      setDateRangeArray(date);
      // toggleCalendarModal();
    }
  };

  const handleActiveStartDateChange = (date: Date) => {
    // setActiveStartDate(date);
  };

  return (
    <Box sx={{ mt: 1.5, px: '2px' }}>
      <FormControl sx={{ width: '100%' }}>
        <Select
          sx={{
            height: '32px',
            width: '100%',
            borderRadius: '8px',
            fontSize: '14px',
          }}
          value={selectedValue}
          displayEmpty
          onClick={toggleModal}
          inputProps={{ readOnly: true }}
        >
          <MenuItem value="" disabled>
            {t('COMMON.SELECT_AN_OPTION')}
          </MenuItem>
          <MenuItem value={selectedValue}>
            {selectedValue ? selectedValue : t('COMMON.SELECT_AN_OPTION')}
          </MenuItem>
        </Select>
      </FormControl>

      <Modal
        open={isModalOpen}
        onClose={toggleModal}
        aria-labelledby="edit-profile-modal"
        aria-describedby="edit-profile-description"
      >
        <Box
          sx={modalStyle}
          gap="10px"
          display="flex"
          flexDirection="column"
          borderRadius={'1rem'}
        >
          <Box>
            <Grid container>
              <Grid item xs={6}>
                <Typography textAlign={'left'}>
                  {t('COMMON.DATE_RANGE')}
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign={'right'}>
                <CloseIcon onClick={toggleModal} />
              </Grid>
            </Grid>
          </Box>
          <Divider sx={dividerStyle} />
          <MenuList dense>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                selected={selectedIndex === index}
                onClick={() => handleMenuItemClick(index, item)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '32px',
                }}
              >
                {selectedIndex === index && (
                  <ListItemIcon
                    sx={{
                      position: 'absolute',
                      left: '8px',
                      minWidth: 'auto',
                    }}
                  >
                    <Check fontSize="small" />
                  </ListItemIcon>
                )}
                {item}
              </MenuItem>
            ))}
          </MenuList>
          <Divider sx={dividerStyle} />
          <Button variant="contained" onClick={onApply}>
            {t('COMMON.APPLY')}
          </Button>
        </Box>
      </Modal>

      {/* CustomeCalendarModal */}
      <Modal
        open={isCalendarModalOpen}
        onClose={toggleCalendarModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={calenderModalStyle}>
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

          <Box>
            <MonthCalender
              onChange={handleActiveStartDateChange}
              onDateChange={handleCalendarDateChange}
              selectionType="range"
            />
          </Box>
          <Box
            sx={{
              paddingTop: '20px',
              display: 'flex',
              gap: '10px',
              justifyContent: 'end',
            }}
          >
            <Box className="text-0D fs-14 fw-500" onClick={toggleCalendarModal}>
              {t('COMMON.CANCEL')}
            </Box>
            <Box className="text-0D fs-14 fw-500" onClick={toggleCalendarModal}>
              {t('COMMON.OK')}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DateRangePopup;
