import React, { useState } from 'react';
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
import CloseIcon from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useTranslation } from 'next-i18next';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const dividerStyle = {
  my: 2,
};

interface CustomSelectModalProps {
  menuItems: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  onDateRangeSelected;
}

const DateRangePopup: React.FC<CustomSelectModalProps> = ({
  menuItems,
  selectedValue,
  setSelectedValue,
  onDateRangeSelected,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const { t } = useTranslation();

  const handleMenuItemClick = (index: number, item: string) => {
    setSelectedIndex(index);
    setSelectedValue(item);
    // handleModalClose();
  };

  const onApply = () => {
    console.log('applied', selectedIndex, selectedValue);
    const values = getDateRange(selectedIndex);
    const { toDate, fromDate } = values;
    console.log(toDate, fromDate);
    onDateRangeSelected({ fromDate, toDate });
    handleModalClose();
  };

  const getDateRange = (index) => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];
    let fromDate;
    let toDate = formatDate(today);

    switch (index) {
      case 0:
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        break;
      case 1:
        fromDate = new Date(today);
        break;
      case 2:
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - today.getDay() - 7); // Start of last week
        toDate = formatDate(new Date(fromDate)); // End of last week
        fromDate.setDate(fromDate.getDate() - 6);
        break;
      case 3:
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 1);
        fromDate.setDate(1); // Start of last month
        toDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // End of last month
        break;
      case 4:
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 6);
        fromDate.setDate(1); // Start of the period
        toDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // End of last month
        break;
      default:
        fromDate = new Date(today);
    }

    return {
      fromDate: formatDate(fromDate),
      toDate,
    };
  };

  return (
    <Box sx={{ mt: 0.6 }}>
      <Grid container spacing={1}>
        <Grid item sx={{ flex: 1 }}>
          <FormControl fullWidth sx={{ m: 1 }}>
            <Select
              sx={{ height: '32px' }}
              value={selectedValue}
              displayEmpty
              onClick={handleModalOpen}
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
        </Grid>
      </Grid>

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
            <Grid container>
              <Grid item xs={6}>
                <Typography textAlign={'left'}>
                  {t('COMMON.DATE_RANGE')}
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign={'right'}>
                <CloseIcon onClick={handleModalClose} />
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
    </Box>
  );
};

export default DateRangePopup;
