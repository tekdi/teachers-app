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
  useStepContext,
} from '@mui/material';
import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { getDayAndMonthName, getTodayDate } from '@/utils/Helper';

import checkMark from '../assets/images/checkMark.svg';
import CloseIcon from '@mui/icons-material/Close';
import { Height } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import MonthCalender from './MonthCalender';
import WestIcon from '@mui/icons-material/West';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  // p: 4,
  '@media (min-width: 600px)': {
    width: '450px',
  },
};

const calenderModalStyle = {
  width: '85%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '12px 0 12px 0',
  borderRadius: '8px',
  // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  // height: '526px',
  // Responsive styles
  '@media (min-width: 600px)': {
    width: '450px',
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
  dateRange?: string | Date| undefined ;
}

const DateRangePopup: React.FC<CustomSelectModalProps> = ({
  menuItems,
  selectedValue,
  setSelectedValue,
  onDateRangeSelected,
  dateRange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalenderModalOpen] = useState(false);
  const [dateRangeArray, setDateRangeArray] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [displayCalendarFromDate, setDisplayCalendarFromDate] = React.useState(
    getDayAndMonthName(getTodayDate())
  );
  const [displayCalendarToDate, setDisplayCalendarToDate] = React.useState(
    getDayAndMonthName(getTodayDate())
  );
  const [cancelClicked, setCancelClicked] = React.useState(false);
  const [appliedOption, setAppliedOption] = React.useState<string>('');
  const [appliedIndex, setAppliedIndex] = React.useState<number | null>(0);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleModalClose = () =>{
    setIsModalOpen(false)
    setSelectedValue(appliedOption)
    setSelectedIndex(appliedIndex)
  }
  const toggleCalendarModal = () =>
    setIsCalenderModalOpen(!isCalendarModalOpen);
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const handleMenuItemClick = (index: number, item: string) => {
    setSelectedIndex(index);
    setSelectedValue(item);
    if (index === 4) {
      toggleCalendarModal();
    }
  };
  const handleCancelClicked = () => {
    toggleCalendarModal();
    setCancelClicked(true);
    setDisplayCalendarFromDate(getDayAndMonthName(getTodayDate()));
    setDisplayCalendarToDate(getDayAndMonthName(getTodayDate()));
  };

  const onApply = () => {
    if (cancelClicked) {
      toggleModal();
      setSelectedValue('');
      setCancelClicked(false);
    } else {
      // console.log('applied', selectedIndex, selectedValue);
      setAppliedOption(selectedValue)
      setAppliedIndex(selectedIndex)
      ReactGA.event("date-range-pop-up-clicked", { dateRangeType: selectedValue});
      const values = getDateRange(selectedIndex);
      const { toDate, fromDate } = values;
      // console.log(toDate, fromDate);
      onDateRangeSelected({ fromDate, toDate });
      toggleModal();
    }
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
        if (dateRangeArray.length === 2) {
          fromDate = dateRangeArray[0];
          toDate = formatDate(new Date(dateRangeArray[1]));
          if (fromDate && toDate) {
            setDisplayCalendarFromDate(getDayAndMonthName(new Date(fromDate)));
            setDisplayCalendarToDate(getDayAndMonthName(new Date(toDate)));
          }
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

  const handleCalendarDateChange = (date: Date | Date[] | null) => {
    if (Array.isArray(date)) {
      setDateRangeArray(date);
      setDisplayCalendarFromDate(getDayAndMonthName(date[0]));
      setDisplayCalendarToDate(getDayAndMonthName(date[1]));
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
          className="bg-white"
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
            {t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
            date_range: dateRange})}
          </MenuItem>
          <MenuItem value={selectedValue}>
            {selectedValue
              ? selectedValue
              :  t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
                date_range: dateRange})}
          </MenuItem>
        </Select>
      </FormControl>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
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
            <Grid sx={{ padding: '20px 20px 5px' }} container>
              <Grid item xs={6}>
                <Typography className="text4D" textAlign={'left'}>
                  {t('COMMON.DATE_RANGE')}
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign={'right'}>
                <CloseIcon className="text4D" onClick={handleModalClose} />
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <MenuList className="customRange" sx={{ margin: '0 9px' }} dense>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                selected={selectedIndex === index}
                onClick={() => handleMenuItemClick(index, item)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '32px',
                  backgroundColor: 'transparent',
                  color: index === 4 ? theme.palette.secondary.main : '#4D4639',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {selectedIndex === index && (
                  <ListItemIcon
                    sx={{
                      position: 'absolute',
                      left: '8px',
                      minWidth: 'auto'
                    }}
                    className="text4D"
                  >
                   <Image
                      height={10}
                      width={12}
                      src={checkMark}
                      alt="logo"
                      style={{ cursor: 'pointer' }}
                    />
                  </ListItemIcon>
                )}
                {item}
              </MenuItem>
            ))}
          </MenuList>
          <Divider />
          <Box className="w-100 p-20">
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
              onClick={onApply}
            >
              {t('COMMON.APPLY')}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Custom CalendarModal */}
      <Modal
        open={isCalendarModalOpen}
        onClose={toggleCalendarModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={calenderModalStyle}>
          <Box
            sx={{
              padding: ' 0 15px 15px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '5px',
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
                    onClick={() => handleCancelClicked()}
                    style={{ cursor: 'pointer' }}
                  />
                </Box>
                <Box className="text-4D">{t('COMMON.CUSTOM_RANGE')}</Box>
              </Box>
              <Box>
                <CloseIcon
                  onClick={() => handleCancelClicked()}
                  style={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
            <Box sx={{ paddingTop: '10px' }}>
              <Box className="fs-14 fw-500 text-4D">
                {t('COMMON.FROM_TO_DATE')}
              </Box>
              <Box className="fs-22 fw-500 pt-10 text-1F">
                {displayCalendarFromDate} – {displayCalendarToDate}
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <MonthCalender
              onChange={handleActiveStartDateChange}
              onDateChange={handleCalendarDateChange}
              selectionType="range"
            />
          </Box>
          <Box
            sx={{
              padding: '20px 18px 10px',
              display: 'flex',
              gap: '10px',
              justifyContent: 'end',
            }}
          >
            <Box
              className="text-0D fs-14 fw-500"
              onClick={() => handleCancelClicked()}
            >
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
