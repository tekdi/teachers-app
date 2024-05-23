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
}

const DateRangePopup: React.FC<CustomSelectModalProps> = ({
  menuItems,
  selectedValue,
  setSelectedValue,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleMenuItemClick = (index: number, item: string) => {
    setSelectedIndex(index);
    setSelectedValue(item);
    handleModalClose();
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
                Select an option
              </MenuItem>
              <MenuItem value={selectedValue}>
                {selectedValue ? selectedValue : 'Select an option'}
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
                <Typography textAlign={'left'}>Date Range</Typography>
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
          <Button variant="contained" onClick={handleModalClose}>
            Apply
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default DateRangePopup;
